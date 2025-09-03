-- Migration: Add OCR fields to certifications and create audit table
-- Story 3.3: Automated White Card Data Extraction
-- Created: 2025-08-19

-- Add OCR-specific fields to certifications table
alter table certifications add column if not exists card_number text;
alter table certifications add column if not exists name_on_card text;
alter table certifications add column if not exists processed_at timestamptz;
alter table certifications add column if not exists processing_error text;

-- Update status field to include OCR workflow statuses
alter table certifications drop constraint if exists certifications_status_check;
alter table certifications add constraint certifications_status_check 
  check (status in ('Awaiting Review', 'queued', 'processing', 'processed', 'failed', 'Approved', 'Rejected', 'Expired'));

-- Add index on processed_at for efficient querying
create index if not exists idx_certifications_processed_at on certifications(processed_at);
create index if not exists idx_certifications_card_number on certifications(card_number);

-- Create certification_audits table for comprehensive audit logging
create table if not exists certification_audits (
  id bigserial primary key,
  certification_id uuid not null references certifications(id) on delete cascade,
  event text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- Add indexes for audit table
create index if not exists idx_certification_audits_certification_id on certification_audits(certification_id);
create index if not exists idx_certification_audits_event on certification_audits(event);
create index if not exists idx_certification_audits_created_at on certification_audits(created_at);

-- RLS policies for certification_audits
alter table certification_audits enable row level security;

-- Allow service role to insert audit records
create policy "Service role can insert audit records" on certification_audits
  for insert with check (true);

-- Allow authenticated users to read audit records for their own certifications
create policy "Users can read audit records" on certification_audits
  for select using (
    exists (
      select 1 from certifications c
      join workers w on c.worker_id = w.id
      where c.id = certification_audits.certification_id
      and w.email = auth.jwt() ->> 'email'
    )
  );

-- Allow admins/builders to read all audit records
create policy "Admins can read all audit records" on certification_audits
  for select using (
    exists (
      select 1 from users u
      where u.email = auth.jwt() ->> 'email'
      and u.role in ('admin', 'builder')
    )
  );

-- Add comment for documentation
comment on table certification_audits is 'Audit trail for certification processing events, including OCR workflow tracking';
comment on column certification_audits.event is 'Event type: queued_for_processing, processing_started, ocr_completed, processing_completed, processing_failed, notification_sent, etc.';
comment on column certification_audits.detail is 'Additional context data for the event in JSON format';