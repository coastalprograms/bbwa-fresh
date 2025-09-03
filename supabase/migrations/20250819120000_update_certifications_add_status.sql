-- Update certifications table to add status field for Story 5.4
-- Timestamp: 2025-08-19 12:00:00
-- Notes: Adds status field to certifications table and updates RLS

-- Add status column with default value
alter table certifications add column if not exists status text default 'Awaiting Review';

-- Add constraint for status values
alter table certifications add constraint certifications_status_check 
  check (status in ('Valid', 'Expired', 'Awaiting Review'));

-- Update existing records to have a valid status
update certifications set status = 'Awaiting Review' where status is null;

-- Make status not null
alter table certifications alter column status set not null;

-- Add updated_at column to track changes
alter table certifications add column if not exists updated_at timestamptz not null default now();

-- Create or replace function to update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Create trigger for updated_at
drop trigger if exists update_certifications_updated_at on certifications;
create trigger update_certifications_updated_at
  before update on certifications
  for each row
  execute function update_updated_at_column();