-- Enhance notification_audits table for comprehensive SWMS email tracking

-- Add indexes for SWMS-specific audit queries
CREATE INDEX IF NOT EXISTS idx_notification_audits_kind_swms 
ON notification_audits(kind) 
WHERE kind LIKE 'swms_%';

CREATE INDEX IF NOT EXISTS idx_notification_audits_created_at_desc 
ON notification_audits(created_at DESC);

-- Create view for SWMS email campaign audit summary
CREATE OR REPLACE VIEW swms_email_audit_summary AS
SELECT 
    DATE(na.created_at) as audit_date,
    na.kind,
    na.result,
    COUNT(*) as event_count,
    COALESCE(
        SUM((na.payload->>'campaigns_processed')::INTEGER), 
        SUM((na.payload->>'emails_sent')::INTEGER),
        0
    ) as total_processed,
    COALESCE(
        SUM((na.payload->>'campaigns_executed')::INTEGER),
        SUM(CASE WHEN na.result = 'success' THEN (na.payload->>'emails_sent')::INTEGER ELSE 0 END),
        0
    ) as total_successful,
    COALESCE(
        SUM((na.payload->>'campaigns_failed')::INTEGER),
        SUM(CASE WHEN na.result = 'failure' THEN 1 ELSE 0 END),
        0
    ) as total_failed,
    MIN(na.created_at) as first_event,
    MAX(na.created_at) as last_event
FROM notification_audits na
WHERE na.kind IN ('swms_email_automation', 'swms_reminder_scheduler')
GROUP BY DATE(na.created_at), na.kind, na.result
ORDER BY audit_date DESC, na.kind;

-- Create function to get email delivery metrics
CREATE OR REPLACE FUNCTION get_swms_email_delivery_metrics(
    days_back INTEGER DEFAULT 30
)
RETURNS JSON AS $$
DECLARE
    metrics JSON;
    start_date TIMESTAMP WITH TIME ZONE;
BEGIN
    start_date := NOW() - (days_back || ' days')::INTERVAL;
    
    SELECT json_build_object(
        'period_days', days_back,
        'start_date', start_date,
        'end_date', NOW(),
        'total_campaigns', COUNT(DISTINCT c.id),
        'active_campaigns', COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active'),
        'completed_campaigns', COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'completed'),
        'cancelled_campaigns', COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'cancelled'),
        'failed_campaigns', COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'failed'),
        'total_emails_sent', COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered')),
        'emails_pending', COUNT(es.id) FILTER (WHERE es.delivery_status = 'pending'),
        'emails_failed', COUNT(es.id) FILTER (WHERE es.delivery_status IN ('failed', 'bounced')),
        'emails_opened', COUNT(es.id) FILTER (WHERE es.opened_at IS NOT NULL),
        'portal_clicks', COUNT(es.id) FILTER (WHERE es.clicked_at IS NOT NULL),
        'tokens_expired', COUNT(es.id) FILTER (WHERE es.token_expires_at < NOW()),
        'avg_open_rate', ROUND(
            AVG(
                CASE 
                    WHEN COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered')) OVER (PARTITION BY c.id) > 0
                    THEN (COUNT(es.id) FILTER (WHERE es.opened_at IS NOT NULL) OVER (PARTITION BY c.id)::DECIMAL / 
                          COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered')) OVER (PARTITION BY c.id)::DECIMAL) * 100
                    ELSE 0
                END
            ), 2
        ),
        'avg_click_rate', ROUND(
            AVG(
                CASE 
                    WHEN COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered')) OVER (PARTITION BY c.id) > 0
                    THEN (COUNT(es.id) FILTER (WHERE es.clicked_at IS NOT NULL) OVER (PARTITION BY c.id)::DECIMAL / 
                          COUNT(es.id) FILTER (WHERE es.delivery_status IN ('sent', 'delivered')) OVER (PARTITION BY c.id)::DECIMAL) * 100
                    ELSE 0
                END
            ), 2
        ),
        'campaigns_by_type', json_object_agg(
            c.campaign_type, 
            COUNT(DISTINCT c.id) FILTER (WHERE c.campaign_type IS NOT NULL)
        ),
        'delivery_by_status', json_object_agg(
            COALESCE(es.delivery_status, 'no_emails'), 
            COUNT(es.id)
        )
    ) INTO metrics
    FROM swms_email_campaigns c
    LEFT JOIN swms_email_sends es ON c.id = es.campaign_id
    WHERE c.created_at >= start_date;
    
    RETURN metrics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get recent email activity
CREATE OR REPLACE FUNCTION get_recent_swms_email_activity(
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    activity_type TEXT,
    activity_time TIMESTAMP WITH TIME ZONE,
    campaign_id UUID,
    campaign_type TEXT,
    contractor_name TEXT,
    email_address TEXT,
    delivery_status TEXT,
    job_name TEXT,
    details JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'email_send'::TEXT as activity_type,
        es.created_at as activity_time,
        es.campaign_id,
        c.campaign_type,
        COALESCE(con.contact_name, con.company_name) as contractor_name,
        es.email_address,
        es.delivery_status,
        sj.job_name,
        json_build_object(
            'sent_at', es.sent_at,
            'opened_at', es.opened_at,
            'clicked_at', es.clicked_at,
            'retry_count', es.retry_count,
            'token_expires_at', es.token_expires_at
        ) as details
    FROM swms_email_sends es
    JOIN swms_email_campaigns c ON es.campaign_id = c.id
    JOIN swms_jobs sj ON c.swms_job_id = sj.id
    LEFT JOIN contractors con ON es.contractor_id = con.id
    
    UNION ALL
    
    SELECT 
        'campaign_created'::TEXT as activity_type,
        c.created_at as activity_time,
        c.id as campaign_id,
        c.campaign_type,
        NULL as contractor_name,
        NULL as email_address,
        c.status as delivery_status,
        sj.job_name,
        json_build_object(
            'scheduled_date', c.scheduled_date,
            'status', c.status
        ) as details
    FROM swms_email_campaigns c
    JOIN swms_jobs sj ON c.swms_job_id = sj.id
    
    ORDER BY activity_time DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to track email opens/clicks (webhook endpoints will call this)
CREATE OR REPLACE FUNCTION track_email_engagement(
    portal_token_param UUID,
    engagement_type TEXT -- 'open' or 'click'
)
RETURNS BOOLEAN AS $$
DECLARE
    email_send_record RECORD;
    update_field TEXT;
BEGIN
    -- Validate engagement type
    IF engagement_type NOT IN ('open', 'click') THEN
        RAISE EXCEPTION 'Invalid engagement type: %. Must be ''open'' or ''click''', engagement_type;
    END IF;
    
    -- Find the email send record
    SELECT * INTO email_send_record
    FROM swms_email_sends
    WHERE portal_token = portal_token_param
    AND token_expires_at > NOW();
    
    IF NOT FOUND THEN
        -- Token not found or expired
        RETURN FALSE;
    END IF;
    
    -- Update the appropriate timestamp
    IF engagement_type = 'open' THEN
        UPDATE swms_email_sends
        SET opened_at = COALESCE(opened_at, NOW())
        WHERE id = email_send_record.id;
    ELSIF engagement_type = 'click' THEN
        UPDATE swms_email_sends
        SET clicked_at = COALESCE(clicked_at, NOW()),
            opened_at = COALESCE(opened_at, NOW()) -- Opening is implied by clicking
        WHERE id = email_send_record.id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to retry failed email deliveries
CREATE OR REPLACE FUNCTION retry_failed_email_delivery(
    email_send_id UUID,
    max_retries INTEGER DEFAULT 3
)
RETURNS BOOLEAN AS $$
DECLARE
    email_record RECORD;
BEGIN
    -- Get the email send record
    SELECT * INTO email_record
    FROM swms_email_sends es
    JOIN swms_email_campaigns c ON es.campaign_id = c.id
    WHERE es.id = email_send_id
    AND es.delivery_status IN ('failed', 'bounced')
    AND es.retry_count < max_retries;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Update retry information
    UPDATE swms_email_sends
    SET 
        retry_count = retry_count + 1,
        last_retry_at = NOW(),
        delivery_status = 'pending'
    WHERE id = email_send_id;
    
    -- TODO: Trigger actual email resend via automation platform
    -- This would typically involve calling the email automation function again
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to service role and admin role
GRANT SELECT ON swms_email_audit_summary TO service_role, admin;
GRANT EXECUTE ON FUNCTION get_swms_email_delivery_metrics(INTEGER) TO service_role, admin;
GRANT EXECUTE ON FUNCTION get_recent_swms_email_activity(INTEGER) TO service_role, admin;
GRANT EXECUTE ON FUNCTION track_email_engagement(UUID, TEXT) TO service_role, anon;
GRANT EXECUTE ON FUNCTION retry_failed_email_delivery(UUID, INTEGER) TO service_role, admin;

-- Add comments
COMMENT ON FUNCTION get_swms_email_delivery_metrics(INTEGER) IS 'Gets comprehensive email delivery metrics for SWMS campaigns over specified days';
COMMENT ON FUNCTION get_recent_swms_email_activity(INTEGER) IS 'Gets recent email activity including sends, opens, clicks for monitoring dashboard';
COMMENT ON FUNCTION track_email_engagement(UUID, TEXT) IS 'Tracks email opens and clicks via webhook calls from email provider';
COMMENT ON FUNCTION retry_failed_email_delivery(UUID, INTEGER) IS 'Attempts to retry failed email deliveries with exponential backoff';