-- Create swms_jobs table for SWMS Story 1.3
-- Database structure for managing SWMS assignments per job site

-- Create swms_jobs table
create table if not exists swms_jobs (
  id uuid default gen_random_uuid() primary key,
  job_site_id uuid not null references job_sites(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  description text,
  start_date date not null,
  end_date date,
  status text not null default 'planned' check (status in ('planned', 'active', 'completed', 'cancelled')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Constraint to ensure end_date is after start_date
  constraint end_date_after_start_date check (end_date is null or end_date >= start_date)
);

-- Create indexes for performance
create index if not exists idx_swms_jobs_job_site_id on swms_jobs(job_site_id);
create index if not exists idx_swms_jobs_status on swms_jobs(status);
create index if not exists idx_swms_jobs_start_date on swms_jobs(start_date);
create index if not exists idx_swms_jobs_end_date on swms_jobs(end_date);
create index if not exists idx_swms_jobs_dates_range on swms_jobs(start_date, end_date);

-- Enable RLS
alter table swms_jobs enable row level security;

-- Create RLS policies following existing authenticated patterns
-- Authenticated admin users have full access
create policy if not exists "Auth full access: swms_jobs" on swms_jobs 
  for all to authenticated 
  using (auth.role() = 'authenticated');

-- Public read access for active SWMS jobs (for contractor portal access)
create policy if not exists "Public read active: swms_jobs" on swms_jobs 
  for select to anon 
  using (status = 'active');

-- Create updated_at trigger function
create or replace function update_swms_jobs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger swms_jobs_updated_at_trigger
  before update on swms_jobs
  for each row
  execute function update_swms_jobs_updated_at();