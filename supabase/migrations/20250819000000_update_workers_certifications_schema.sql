-- Update workers and certifications schema for Story 3.2
-- Timestamp: 2025-08-19 00:00:00
-- Notes: Add unique email constraint, white_card_path, status fields for worker induction

-- Add unique constraint on workers email
alter table workers add constraint workers_email_unique unique (email);

-- Add status field to certifications table for tracking review status
alter table certifications add column if not exists status text default 'Awaiting Review' check (status in ('Awaiting Review', 'Approved', 'Rejected', 'Expired'));

-- Add white_card_path field to certifications table
alter table certifications add column if not exists white_card_path text;

-- Add index on status for efficient querying
create index if not exists idx_certifications_status on certifications(status);