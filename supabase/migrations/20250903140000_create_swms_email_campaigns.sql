-- Create SWMS Email Campaigns Table
-- Stores campaign metadata for automated email sequences

CREATE TABLE swms_email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swms_job_id UUID NOT NULL REFERENCES swms_jobs(id) ON DELETE CASCADE,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('initial', 'reminder_7', 'reminder_14', 'final_21')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'failed')),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_swms_email_campaigns_job_id ON swms_email_campaigns(swms_job_id);
CREATE INDEX idx_swms_email_campaigns_status ON swms_email_campaigns(status);
CREATE INDEX idx_swms_email_campaigns_scheduled_date ON swms_email_campaigns(scheduled_date);
CREATE INDEX idx_swms_email_campaigns_type ON swms_email_campaigns(campaign_type);

-- Enable RLS
ALTER TABLE swms_email_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies following existing patterns
-- Admin users can manage all campaigns
CREATE POLICY "Admin users can manage swms email campaigns"
    ON swms_email_campaigns
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- Service role can access all campaigns (for Edge Functions)
CREATE POLICY "Service role can manage swms email campaigns"
    ON swms_email_campaigns
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_swms_email_campaigns_updated_at
    BEFORE UPDATE ON swms_email_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE swms_email_campaigns IS 'Tracks automated email campaigns for SWMS submissions';
COMMENT ON COLUMN swms_email_campaigns.swms_job_id IS 'Reference to the SWMS job requiring submissions';
COMMENT ON COLUMN swms_email_campaigns.campaign_type IS 'Type of email campaign: initial, reminder_7, reminder_14, final_21';
COMMENT ON COLUMN swms_email_campaigns.status IS 'Campaign execution status';
COMMENT ON COLUMN swms_email_campaigns.scheduled_date IS 'When the campaign was/will be executed';