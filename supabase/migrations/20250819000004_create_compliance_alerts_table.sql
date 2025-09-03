-- Create compliance_alerts table for tracking non-compliance events
CREATE TABLE IF NOT EXISTS compliance_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  job_site_id UUID REFERENCES job_sites(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  worker_name TEXT,
  worker_email TEXT,
  site_name TEXT,
  sent_email BOOLEAN NOT NULL DEFAULT FALSE,
  sent_sms BOOLEAN NOT NULL DEFAULT FALSE,
  email_error TEXT,
  sms_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_worker_id ON compliance_alerts(worker_id);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_job_site_id ON compliance_alerts(job_site_id);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_created_at ON compliance_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_worker_site_created ON compliance_alerts(worker_id, job_site_id, created_at);

-- Enable RLS
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for compliance_alerts
DROP POLICY IF EXISTS "Authenticated users can view compliance alerts" ON compliance_alerts;
CREATE POLICY "Authenticated users can view compliance alerts"
ON compliance_alerts FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "System can insert compliance alerts" ON compliance_alerts;
CREATE POLICY "System can insert compliance alerts"
ON compliance_alerts FOR INSERT
WITH CHECK (true);

-- Service role should be able to insert from functions
DROP POLICY IF EXISTS "Service role can manage compliance alerts" ON compliance_alerts;
CREATE POLICY "Service role can manage compliance alerts"
ON compliance_alerts FOR ALL
USING (auth.role() = 'service_role');