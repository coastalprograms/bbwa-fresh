-- Create contact_leads table for Story 2.10
-- Timestamp: 2025-08-25 12:00:00

CREATE TABLE contact_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  service_interest TEXT,
  source_page TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anonymous inserts for public contact form
CREATE POLICY "Anyone can insert leads"
  ON contact_leads FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Only authenticated users can read/update/delete leads
CREATE POLICY "Auth only: contact_leads select"
  ON contact_leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth only: contact_leads update"
  ON contact_leads FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth only: contact_leads delete"
  ON contact_leads FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_leads_created_at ON contact_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_leads_email ON contact_leads(email);