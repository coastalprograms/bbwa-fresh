-- Create SWMS Email Templates Table
-- Stores HTML and text templates for different campaign types

CREATE TABLE swms_email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_type TEXT NOT NULL CHECK (template_type IN ('initial', 'reminder_7', 'reminder_14', 'final_21')),
    subject_template TEXT NOT NULL,
    html_template TEXT NOT NULL,
    text_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure only one active template per type
CREATE UNIQUE INDEX idx_swms_email_templates_unique_active_type 
ON swms_email_templates(template_type) 
WHERE is_active = true;

-- Create indexes for performance
CREATE INDEX idx_swms_email_templates_type ON swms_email_templates(template_type);
CREATE INDEX idx_swms_email_templates_active ON swms_email_templates(is_active);

-- Enable RLS
ALTER TABLE swms_email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies following existing patterns
-- Admin users can manage all templates
CREATE POLICY "Admin users can manage swms email templates"
    ON swms_email_templates
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- Service role can read templates (for Edge Functions)
CREATE POLICY "Service role can read swms email templates"
    ON swms_email_templates
    FOR SELECT
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Update timestamp trigger
CREATE TRIGGER update_swms_email_templates_updated_at
    BEFORE UPDATE ON swms_email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE swms_email_templates IS 'Email templates for SWMS campaign automation';
COMMENT ON COLUMN swms_email_templates.template_type IS 'Campaign type this template is for';
COMMENT ON COLUMN swms_email_templates.subject_template IS 'Email subject with template variables: {{contractor_name}}, {{job_name}}, etc.';
COMMENT ON COLUMN swms_email_templates.html_template IS 'HTML email content with template variables';
COMMENT ON COLUMN swms_email_templates.text_template IS 'Plain text fallback with template variables';
COMMENT ON COLUMN swms_email_templates.is_active IS 'Only one template per type can be active';