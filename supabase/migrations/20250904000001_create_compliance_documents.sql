-- Create compliance documents table for secure document storage
CREATE TABLE IF NOT EXISTS public.compliance_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('swms', 'certification', 'audit_report', 'inspection', 'compliance_evidence', 'other')),
  storage_path text NOT NULL UNIQUE,
  upload_date timestamptz NOT NULL DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id),
  job_site_id uuid REFERENCES public.job_sites(id) ON DELETE SET NULL,
  contractor_id uuid REFERENCES public.contractors(id) ON DELETE SET NULL,
  swms_job_id uuid REFERENCES public.swms_jobs(id) ON DELETE SET NULL,
  description text,
  tags text[],
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  retention_date timestamptz NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create document access log table for audit purposes
CREATE TABLE IF NOT EXISTS public.document_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.compliance_documents(id) ON DELETE CASCADE,
  accessed_by uuid REFERENCES auth.users(id),
  access_type text NOT NULL CHECK (access_type IN ('view', 'download', 'delete', 'update')),
  accessed_at timestamptz NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text,
  metadata jsonb DEFAULT '{}'
);

-- Add RLS policies for compliance documents (admin and contractor access)
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access_log ENABLE ROW LEVEL SECURITY;

-- Admin users can view all documents
CREATE POLICY "compliance_documents_admin_select" ON public.compliance_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin users can insert documents
CREATE POLICY "compliance_documents_admin_insert" ON public.compliance_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin users can update documents
CREATE POLICY "compliance_documents_admin_update" ON public.compliance_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin users can delete documents
CREATE POLICY "compliance_documents_admin_delete" ON public.compliance_documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Contractors can view their own documents
CREATE POLICY "compliance_documents_contractor_select" ON public.compliance_documents
  FOR SELECT USING (
    contractor_id IN (
      SELECT id FROM public.contractors 
      WHERE user_id = auth.uid()
    )
  );

-- Contractors can upload their own documents
CREATE POLICY "compliance_documents_contractor_insert" ON public.compliance_documents
  FOR INSERT WITH CHECK (
    contractor_id IN (
      SELECT id FROM public.contractors 
      WHERE user_id = auth.uid()
    )
  );

-- Admin users can view all document access logs
CREATE POLICY "document_access_log_admin_select" ON public.document_access_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Anyone can insert access logs (for audit purposes)
CREATE POLICY "document_access_log_insert" ON public.document_access_log
  FOR INSERT WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS compliance_documents_job_site_id_idx ON public.compliance_documents (job_site_id);
CREATE INDEX IF NOT EXISTS compliance_documents_contractor_id_idx ON public.compliance_documents (contractor_id);
CREATE INDEX IF NOT EXISTS compliance_documents_swms_job_id_idx ON public.compliance_documents (swms_job_id);
CREATE INDEX IF NOT EXISTS compliance_documents_document_type_idx ON public.compliance_documents (document_type);
CREATE INDEX IF NOT EXISTS compliance_documents_status_idx ON public.compliance_documents (status);
CREATE INDEX IF NOT EXISTS compliance_documents_upload_date_idx ON public.compliance_documents (upload_date);
CREATE INDEX IF NOT EXISTS compliance_documents_retention_date_idx ON public.compliance_documents (retention_date);
CREATE INDEX IF NOT EXISTS document_access_log_document_id_idx ON public.document_access_log (document_id);
CREATE INDEX IF NOT EXISTS document_access_log_accessed_at_idx ON public.document_access_log (accessed_at);

-- Add updated_at trigger for compliance_documents
CREATE OR REPLACE FUNCTION update_compliance_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER compliance_documents_updated_at
  BEFORE UPDATE ON public.compliance_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_documents_updated_at();

-- Create storage bucket for compliance documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compliance-documents',
  'compliance-documents',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for compliance documents storage bucket
CREATE POLICY "compliance_documents_admin_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'compliance-documents' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "compliance_documents_admin_storage_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'compliance-documents' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "compliance_documents_admin_storage_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'compliance-documents' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "compliance_documents_contractor_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'compliance-documents' AND
    EXISTS (
      SELECT 1 FROM public.contractors 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "compliance_documents_contractor_storage_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'compliance-documents' AND
    (
      -- Admin access
      EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
      ) OR
      -- Contractor access to their own documents
      EXISTS (
        SELECT 1 FROM public.contractors 
        WHERE user_id = auth.uid()
      )
    )
  );