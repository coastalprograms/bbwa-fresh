-- Create compliance export logs table for tracking Work Safe exports
CREATE TABLE IF NOT EXISTS public.compliance_export_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  export_id text NOT NULL UNIQUE,
  job_site_ids text[] NOT NULL,
  format text NOT NULL CHECK (format IN ('pdf', 'csv')),
  filename text NOT NULL,
  include_audit_trail boolean NOT NULL DEFAULT false,
  file_size bigint,
  download_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add RLS policies for compliance export logs (admin access only)
ALTER TABLE public.compliance_export_logs ENABLE ROW LEVEL SECURITY;

-- Admin users can view all export logs
CREATE POLICY "compliance_export_logs_admin_select" ON public.compliance_export_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.user_metadata->>'role' = 'admin'
    )
  );

-- Admin users can insert export logs
CREATE POLICY "compliance_export_logs_admin_insert" ON public.compliance_export_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.user_metadata->>'role' = 'admin'
    )
  );

-- Create index on export_id for fast lookups
CREATE INDEX IF NOT EXISTS compliance_export_logs_export_id_idx ON public.compliance_export_logs (export_id);

-- Create index on created_at for cleanup operations
CREATE INDEX IF NOT EXISTS compliance_export_logs_created_at_idx ON public.compliance_export_logs (created_at);

-- Create index on expires_at for cleanup operations
CREATE INDEX IF NOT EXISTS compliance_export_logs_expires_at_idx ON public.compliance_export_logs (expires_at);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_compliance_export_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER compliance_export_logs_updated_at
  BEFORE UPDATE ON public.compliance_export_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_export_logs_updated_at();

-- Create storage bucket for compliance exports if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compliance-exports',
  'compliance-exports',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'text/csv']
) ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for compliance exports storage bucket (admin access only)
CREATE POLICY "compliance_exports_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'compliance-exports' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.user_metadata->>'role' = 'admin'
    )
  );

CREATE POLICY "compliance_exports_admin_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'compliance-exports' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.user_metadata->>'role' = 'admin'
    )
  );

CREATE POLICY "compliance_exports_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'compliance-exports' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.user_metadata->>'role' = 'admin'
    )
  );