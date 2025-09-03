-- Create swms_submissions table for SWMS Story 1.3
-- Database structure for managing contractor document submissions

-- Create swms_submissions table
create table if not exists swms_submissions (
  id uuid default gen_random_uuid() primary key,
  swms_job_id uuid not null references swms_jobs(id) on delete cascade,
  contractor_id uuid not null references contractors(id) on delete cascade,
  document_name text not null check (length(trim(document_name)) > 0),
  file_url text not null check (length(trim(file_url)) > 0),
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'approved', 'rejected', 'requires_changes')),
  submitted_at timestamptz default now() not null,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Constraint to ensure reviewed_at is after submitted_at
  constraint reviewed_after_submitted check (reviewed_at is null or reviewed_at >= submitted_at),
  
  -- Constraint to ensure reviewed_by is set when status is approved/rejected
  constraint reviewer_required_for_final_status check (
    (status in ('approved', 'rejected') and reviewed_by is not null and reviewed_at is not null)
    or status not in ('approved', 'rejected')
  ),
  
  -- Unique constraint to prevent duplicate submissions for the same job by same contractor
  unique (swms_job_id, contractor_id, document_name)
);

-- Create compound indexes for performance
create index if not exists idx_swms_submissions_job_contractor on swms_submissions(swms_job_id, contractor_id);
create index if not exists idx_swms_submissions_status on swms_submissions(status);
create index if not exists idx_swms_submissions_submitted_at on swms_submissions(submitted_at);
create index if not exists idx_swms_submissions_reviewed_at on swms_submissions(reviewed_at);
create index if not exists idx_swms_submissions_contractor_id on swms_submissions(contractor_id);

-- Enable RLS
alter table swms_submissions enable row level security;

-- Create RLS policies
-- Authenticated admin users have full access
create policy if not exists "Auth full access: swms_submissions" on swms_submissions 
  for all to authenticated 
  using (auth.role() = 'authenticated');

-- Token-based contractor access for reading their own submissions
-- This will be used for contractor portal access with magic link tokens
create policy if not exists "Contractor token read access: swms_submissions" on swms_submissions 
  for select to anon 
  using (
    contractor_id::text = current_setting('request.jwt.claims.contractor_id', true)
    or contractor_id in (
      select id from contractors 
      where magic_link_token = current_setting('request.jwt.claims.token', true)
    )
  );

-- Create updated_at trigger function
create or replace function update_swms_submissions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  
  -- Auto-set reviewed_at when status changes to approved/rejected
  if new.status in ('approved', 'rejected') and old.status not in ('approved', 'rejected') then
    new.reviewed_at = now();
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger swms_submissions_updated_at_trigger
  before update on swms_submissions
  for each row
  execute function update_swms_submissions_updated_at();