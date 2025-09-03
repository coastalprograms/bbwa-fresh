-- Function to count SWMS submissions for a job
CREATE OR REPLACE FUNCTION count_swms_submissions_for_job(job_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total', COUNT(DISTINCT jc.contractor_id),
        'submitted', COUNT(DISTINCT s.contractor_id),
        'pending', COUNT(DISTINCT jc.contractor_id) - COUNT(DISTINCT s.contractor_id)
    ) INTO result
    FROM swms_jobs_contractors jc
    LEFT JOIN swms_submissions s ON (
        s.swms_job_id = jc.swms_job_id 
        AND s.contractor_id = jc.contractor_id 
        AND s.status IN ('approved', 'pending_approval')
    )
    WHERE jc.swms_job_id = job_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to service role
GRANT EXECUTE ON FUNCTION count_swms_submissions_for_job(UUID) TO service_role;

-- Add missing junction table for jobs-contractors relationship (if it doesn't exist)
-- This table tracks which contractors are assigned to which SWMS jobs
DO $$
BEGIN
    -- Check if table exists, if not create it
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'swms_jobs_contractors') THEN
        CREATE TABLE swms_jobs_contractors (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            swms_job_id UUID NOT NULL REFERENCES swms_jobs(id) ON DELETE CASCADE,
            contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
            assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create unique index to prevent duplicate assignments
        CREATE UNIQUE INDEX idx_swms_jobs_contractors_unique 
        ON swms_jobs_contractors(swms_job_id, contractor_id);

        -- Create indexes for performance
        CREATE INDEX idx_swms_jobs_contractors_job_id ON swms_jobs_contractors(swms_job_id);
        CREATE INDEX idx_swms_jobs_contractors_contractor_id ON swms_jobs_contractors(contractor_id);

        -- Enable RLS
        ALTER TABLE swms_jobs_contractors ENABLE ROW LEVEL SECURITY;

        -- RLS Policies
        CREATE POLICY "Admin users can manage swms jobs contractors"
            ON swms_jobs_contractors
            FOR ALL
            USING (auth.jwt() ->> 'role' = 'admin');

        CREATE POLICY "Service role can manage swms jobs contractors"
            ON swms_jobs_contractors
            FOR ALL
            USING (auth.jwt() ->> 'role' = 'service_role');

        -- Add comments
        COMMENT ON TABLE swms_jobs_contractors IS 'Junction table linking SWMS jobs to assigned contractors';
    END IF;
END
$$;