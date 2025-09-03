-- Database functions for SWMS Email Campaign Management

-- Function to get campaign metrics for a specific SWMS job
CREATE OR REPLACE FUNCTION get_swms_campaign_metrics(job_id UUID)
RETURNS JSON AS $$
DECLARE
    metrics JSON;
BEGIN
    SELECT json_build_object(
        'total_campaigns', COUNT(DISTINCT c.id),
        'active_campaigns', COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active'),
        'completed_campaigns', COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'completed'),
        'total_emails_sent', COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered')),
        'total_emails_failed', COUNT(es.id) FILTER (WHERE es.delivery_status IN ('failed', 'bounced')),
        'emails_opened', COUNT(es.id) FILTER (WHERE es.opened_at IS NOT NULL),
        'portal_clicks', COUNT(es.id) FILTER (WHERE es.clicked_at IS NOT NULL),
        'open_rate', CASE 
            WHEN COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered')) > 0 
            THEN ROUND(
                COUNT(es.id) FILTER (WHERE es.opened_at IS NOT NULL)::DECIMAL / 
                COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered'))::DECIMAL * 100, 2
            )
            ELSE 0
        END,
        'click_rate', CASE 
            WHEN COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered')) > 0 
            THEN ROUND(
                COUNT(es.id) FILTER (WHERE es.clicked_at IS NOT NULL)::DECIMAL / 
                COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered'))::DECIMAL * 100, 2
            )
            ELSE 0
        END
    ) INTO metrics
    FROM swms_email_campaigns c
    LEFT JOIN swms_email_sends es ON c.id = es.campaign_id
    WHERE c.swms_job_id = job_id;
    
    RETURN metrics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically create initial campaign when SWMS job is created
CREATE OR REPLACE FUNCTION create_initial_swms_campaign()
RETURNS TRIGGER AS $$
BEGIN
    -- Create initial email campaign scheduled for 1 hour after job creation
    INSERT INTO swms_email_campaigns (swms_job_id, campaign_type, scheduled_date, status)
    VALUES (NEW.id, 'initial', NOW() + INTERVAL '1 hour', 'pending');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create initial campaign
DROP TRIGGER IF EXISTS trigger_create_initial_swms_campaign ON swms_jobs;
CREATE TRIGGER trigger_create_initial_swms_campaign
    AFTER INSERT ON swms_jobs
    FOR EACH ROW
    EXECUTE FUNCTION create_initial_swms_campaign();

-- Function to schedule follow-up campaigns
CREATE OR REPLACE FUNCTION schedule_swms_follow_ups(job_id UUID)
RETURNS VOID AS $$
DECLARE
    job_due_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get job due date
    SELECT due_date INTO job_due_date 
    FROM swms_jobs 
    WHERE id = job_id;
    
    IF job_due_date IS NULL THEN
        RAISE EXCEPTION 'SWMS job not found or has no due date: %', job_id;
    END IF;
    
    -- Schedule reminder campaigns based on due date
    -- Day 7 reminder (7 days after initial or 7 days before due date, whichever is earlier)
    INSERT INTO swms_email_campaigns (swms_job_id, campaign_type, scheduled_date, status)
    VALUES (
        job_id, 
        'reminder_7', 
        LEAST(NOW() + INTERVAL '7 days', job_due_date - INTERVAL '7 days'), 
        'pending'
    )
    ON CONFLICT DO NOTHING;
    
    -- Day 14 reminder (14 days after initial or 3 days before due date, whichever is earlier)
    INSERT INTO swms_email_campaigns (swms_job_id, campaign_type, scheduled_date, status)
    VALUES (
        job_id, 
        'reminder_14', 
        LEAST(NOW() + INTERVAL '14 days', job_due_date - INTERVAL '3 days'), 
        'pending'
    )
    ON CONFLICT DO NOTHING;
    
    -- Final notice (21 days after initial or 1 day before due date, whichever is earlier)
    INSERT INTO swms_email_campaigns (swms_job_id, campaign_type, scheduled_date, status)
    VALUES (
        job_id, 
        'final_21', 
        LEAST(NOW() + INTERVAL '21 days', job_due_date - INTERVAL '1 day'), 
        'pending'
    )
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark campaigns as completed when all contractors submit
CREATE OR REPLACE FUNCTION check_swms_completion()
RETURNS TRIGGER AS $$
DECLARE
    job_id UUID;
    total_contractors INTEGER;
    submitted_contractors INTEGER;
BEGIN
    -- Get the job ID from the submission
    SELECT swms_job_id INTO job_id FROM swms_jobs WHERE id = NEW.swms_job_id;
    
    -- Count total contractors for this job
    SELECT COUNT(DISTINCT contractor_id) INTO total_contractors
    FROM swms_jobs_contractors 
    WHERE swms_job_id = job_id;
    
    -- Count submitted contractors
    SELECT COUNT(DISTINCT contractor_id) INTO submitted_contractors
    FROM swms_submissions 
    WHERE swms_job_id = job_id 
    AND status = 'approved';
    
    -- If all contractors have submitted, cancel pending campaigns
    IF total_contractors > 0 AND submitted_contractors >= total_contractors THEN
        UPDATE swms_email_campaigns 
        SET status = 'cancelled', updated_at = NOW()
        WHERE swms_job_id = job_id 
        AND status IN ('pending', 'active');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check completion on new submissions
DROP TRIGGER IF EXISTS trigger_check_swms_completion ON swms_submissions;
CREATE TRIGGER trigger_check_swms_completion
    AFTER INSERT OR UPDATE ON swms_submissions
    FOR EACH ROW
    EXECUTE FUNCTION check_swms_completion();

-- Function to get campaigns ready for execution
CREATE OR REPLACE FUNCTION get_pending_campaigns()
RETURNS TABLE(
    campaign_id UUID,
    swms_job_id UUID,
    campaign_type TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.swms_job_id,
        c.campaign_type,
        c.scheduled_date
    FROM swms_email_campaigns c
    WHERE c.status = 'pending'
    AND c.scheduled_date <= NOW()
    ORDER BY c.scheduled_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired portal tokens
CREATE OR REPLACE FUNCTION cleanup_expired_portal_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM swms_email_sends 
    WHERE token_expires_at < NOW()
    AND delivery_status NOT IN ('delivered', 'clicked');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to service role
GRANT EXECUTE ON FUNCTION get_swms_campaign_metrics(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION schedule_swms_follow_ups(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION get_pending_campaigns() TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_portal_tokens() TO service_role;