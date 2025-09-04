-- Create comprehensive audit triggers for SWMS tables
-- This ensures all database changes are automatically logged

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_record jsonb := NULL;
    new_record jsonb := NULL;
    action_type text;
    user_id uuid := auth.uid();
BEGIN
    -- Determine action type
    IF TG_OP = 'INSERT' THEN
        new_record := row_to_json(NEW)::jsonb;
        action_type := 'insert';
    ELSIF TG_OP = 'UPDATE' THEN
        old_record := row_to_json(OLD)::jsonb;
        new_record := row_to_json(NEW)::jsonb;
        action_type := 'update';
        
        -- Special handling for status updates
        IF old_record->>'status' IS DISTINCT FROM new_record->>'status' THEN
            action_type := 'status_update';
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        old_record := row_to_json(OLD)::jsonb;
        action_type := 'delete';
    END IF;

    -- Insert audit record
    INSERT INTO swms_audit_log (
        table_name,
        record_id,
        action_type,
        old_values,
        new_values,
        changed_by,
        changed_at
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        action_type,
        old_record,
        new_record,
        user_id,
        now()
    );

    -- Return appropriate record based on operation
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for SWMS tables
CREATE TRIGGER swms_jobs_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON swms_jobs
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER swms_submissions_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON swms_submissions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER swms_email_campaigns_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON swms_email_campaigns
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER swms_email_sends_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON swms_email_sends
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER job_sites_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON job_sites
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER contractors_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON contractors
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER compliance_documents_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON compliance_documents
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create function to log document access
CREATE OR REPLACE FUNCTION log_document_access(
    doc_id uuid,
    access_type text,
    user_agent_param text DEFAULT NULL,
    ip_address_param inet DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
    user_id uuid := auth.uid();
BEGIN
    -- Validate access type
    IF access_type NOT IN ('view', 'download', 'delete', 'update') THEN
        RAISE EXCEPTION 'Invalid access type: %. Must be view, download, delete, or update', access_type;
    END IF;

    -- Insert document access log
    INSERT INTO document_access_log (
        document_id,
        accessed_by,
        access_type,
        accessed_at,
        ip_address,
        user_agent,
        metadata
    ) VALUES (
        doc_id,
        user_id,
        access_type,
        now(),
        ip_address_param,
        user_agent_param,
        jsonb_build_object(
            'logged_at', now(),
            'session_id', current_setting('request.jwt.claims', true)::jsonb->>'session_id'
        )
    );

    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the main operation
        RAISE WARNING 'Failed to log document access: %', SQLERRM;
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get compliance timeline for a job site
CREATE OR REPLACE FUNCTION get_compliance_timeline(
    job_site_id_param uuid,
    days_back integer DEFAULT 30
)
RETURNS TABLE (
    event_time timestamptz,
    event_type text,
    event_description text,
    user_email text,
    metadata jsonb
) AS $$
DECLARE
    start_date timestamptz := now() - (days_back || ' days')::interval;
BEGIN
    RETURN QUERY
    -- SWMS audit events
    SELECT 
        sal.changed_at as event_time,
        concat(sal.table_name, '_', sal.action_type) as event_type,
        CASE 
            WHEN sal.table_name = 'swms_jobs' AND sal.action_type = 'insert' THEN
                'SWMS job created: ' || coalesce(sal.new_values->>'job_name', 'Unnamed job')
            WHEN sal.table_name = 'swms_jobs' AND sal.action_type = 'status_update' THEN
                'SWMS job status changed from ' || coalesce(sal.old_values->>'status', 'unknown') || 
                ' to ' || coalesce(sal.new_values->>'status', 'unknown')
            WHEN sal.table_name = 'swms_submissions' AND sal.action_type = 'insert' THEN
                'SWMS submission received from contractor'
            WHEN sal.table_name = 'swms_submissions' AND sal.action_type = 'status_update' THEN
                'SWMS submission status changed to ' || coalesce(sal.new_values->>'status', 'unknown')
            WHEN sal.table_name = 'contractors' AND sal.action_type = 'update' THEN
                'Contractor information updated: ' || coalesce(sal.new_values->>'company_name', 'Unknown contractor')
            ELSE
                initcap(sal.action_type) || ' on ' || sal.table_name
        END as event_description,
        coalesce(u.email, 'System') as user_email,
        jsonb_build_object(
            'table_name', sal.table_name,
            'action_type', sal.action_type,
            'record_id', sal.record_id,
            'changes', case when sal.old_values is not null then sal.new_values - sal.old_values else sal.new_values end
        ) as metadata
    FROM swms_audit_log sal
    LEFT JOIN auth.users u ON sal.changed_by = u.id
    WHERE sal.changed_at >= start_date
    AND (
        sal.new_values->>'job_site_id' = job_site_id_param::text
        OR sal.old_values->>'job_site_id' = job_site_id_param::text
        OR (sal.table_name = 'job_sites' AND sal.record_id = job_site_id_param)
    )
    
    UNION ALL
    
    -- Document access events
    SELECT 
        dal.accessed_at as event_time,
        'document_' || dal.access_type as event_type,
        dal.access_type || ' of document: ' || coalesce(cd.filename, 'Unknown document') ||
        ' (Type: ' || coalesce(cd.document_type, 'unknown') || ')' as event_description,
        coalesce(u.email, 'Anonymous') as user_email,
        jsonb_build_object(
            'document_id', dal.document_id,
            'access_type', dal.access_type,
            'document_type', cd.document_type,
            'filename', cd.filename
        ) as metadata
    FROM document_access_log dal
    LEFT JOIN compliance_documents cd ON dal.document_id = cd.id
    LEFT JOIN auth.users u ON dal.accessed_by = u.id
    WHERE dal.accessed_at >= start_date
    AND cd.job_site_id = job_site_id_param
    
    UNION ALL
    
    -- Email campaign events
    SELECT 
        c.created_at as event_time,
        'email_campaign_created' as event_type,
        'Email campaign created: ' || c.campaign_type || ' for job ' || coalesce(sj.job_name, 'Unknown job') as event_description,
        'System' as user_email,
        jsonb_build_object(
            'campaign_id', c.id,
            'campaign_type', c.campaign_type,
            'job_name', sj.job_name,
            'scheduled_date', c.scheduled_date
        ) as metadata
    FROM swms_email_campaigns c
    JOIN swms_jobs sj ON c.swms_job_id = sj.id
    WHERE c.created_at >= start_date
    AND sj.job_site_id = job_site_id_param
    
    UNION ALL
    
    -- Email send events (successful deliveries only to avoid spam)
    SELECT 
        es.sent_at as event_time,
        'email_sent' as event_type,
        'Email sent to ' || es.email_address || ' (' || coalesce(con.company_name, 'Unknown contractor') || ')' as event_description,
        'System' as user_email,
        jsonb_build_object(
            'email_address', es.email_address,
            'campaign_type', c.campaign_type,
            'contractor_name', con.company_name,
            'delivery_status', es.delivery_status
        ) as metadata
    FROM swms_email_sends es
    JOIN swms_email_campaigns c ON es.campaign_id = c.id
    JOIN swms_jobs sj ON c.swms_job_id = sj.id
    LEFT JOIN contractors con ON es.contractor_id = con.id
    WHERE es.sent_at >= start_date
    AND es.delivery_status IN ('sent', 'delivered')
    AND sj.job_site_id = job_site_id_param
    
    ORDER BY event_time DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION log_document_access(uuid, text, text, inet) TO authenticated;
GRANT EXECUTE ON FUNCTION get_compliance_timeline(uuid, integer) TO authenticated;

-- Create indexes to optimize audit queries
CREATE INDEX IF NOT EXISTS idx_swms_audit_log_composite ON swms_audit_log(table_name, record_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_swms_audit_log_job_site_data ON swms_audit_log 
USING gin ((new_values->>'job_site_id'), (old_values->>'job_site_id'));

-- Add comments for documentation
COMMENT ON FUNCTION audit_trigger_function() IS 'Generic trigger function that logs all database changes to audit table';
COMMENT ON FUNCTION log_document_access(uuid, text, text, inet) IS 'Logs document access for audit trail purposes';
COMMENT ON FUNCTION get_compliance_timeline(uuid, integer) IS 'Generates comprehensive compliance timeline for a job site including all related activities';