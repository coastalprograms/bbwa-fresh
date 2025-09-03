-- Create SWMS Email Sends Table  
-- Tracks individual email deliveries for each campaign

CREATE TABLE swms_email_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES swms_email_campaigns(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    email_address TEXT NOT NULL,
    portal_token UUID NOT NULL DEFAULT gen_random_uuid(),
    token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_status TEXT DEFAULT 'pending' CHECK (
        delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced', 'test')
    ),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_swms_email_sends_campaign_id ON swms_email_sends(campaign_id);
CREATE INDEX idx_swms_email_sends_contractor_id ON swms_email_sends(contractor_id);
CREATE INDEX idx_swms_email_sends_portal_token ON swms_email_sends(portal_token);
CREATE INDEX idx_swms_email_sends_delivery_status ON swms_email_sends(delivery_status);
CREATE INDEX idx_swms_email_sends_token_expires ON swms_email_sends(token_expires_at);
CREATE INDEX idx_swms_email_sends_sent_at ON swms_email_sends(sent_at);

-- Unique constraint to prevent duplicate emails per campaign
CREATE UNIQUE INDEX idx_swms_email_sends_unique_campaign_contractor 
ON swms_email_sends(campaign_id, contractor_id);

-- Enable RLS
ALTER TABLE swms_email_sends ENABLE ROW LEVEL SECURITY;

-- RLS Policies following existing patterns
-- Admin users can manage all email sends
CREATE POLICY "Admin users can manage swms email sends"
    ON swms_email_sends
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- Service role can access all email sends (for Edge Functions)
CREATE POLICY "Service role can manage swms email sends"
    ON swms_email_sends
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Contractors can view their own email sends via portal token
CREATE POLICY "Contractors can view own email sends via token"
    ON swms_email_sends
    FOR SELECT
    USING (
        portal_token::text = current_setting('request.jwt.claims', true)::json ->> 'portal_token'
        AND token_expires_at > NOW()
    );

-- Add comments
COMMENT ON TABLE swms_email_sends IS 'Tracks individual email deliveries for SWMS campaign automation';
COMMENT ON COLUMN swms_email_sends.campaign_id IS 'Reference to the email campaign';
COMMENT ON COLUMN swms_email_sends.contractor_id IS 'Reference to the contractor receiving the email';
COMMENT ON COLUMN swms_email_sends.portal_token IS 'Secure UUID token for contractor portal access';
COMMENT ON COLUMN swms_email_sends.token_expires_at IS 'Expiry date for portal token (30 days)';
COMMENT ON COLUMN swms_email_sends.delivery_status IS 'Email delivery and engagement status';
COMMENT ON COLUMN swms_email_sends.opened_at IS 'Timestamp when email was opened (tracking)';
COMMENT ON COLUMN swms_email_sends.clicked_at IS 'Timestamp when portal link was clicked';
COMMENT ON COLUMN swms_email_sends.retry_count IS 'Number of retry attempts for failed deliveries';