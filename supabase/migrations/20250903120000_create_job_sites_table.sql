-- Create job_sites table for SWMS Story 1.3
-- Database structure for managing construction job sites

-- Create job_sites table
create table if not exists job_sites (
  id uuid default gen_random_uuid() primary key,
  name text not null check (length(trim(name)) > 0),
  address text not null check (length(trim(address)) > 0),
  lat double precision,
  lng double precision,
  status text not null default 'active' check (status in ('active', 'inactive', 'completed')),
  check_in_radius_meters integer default 100 check (check_in_radius_meters > 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create indexes for performance
create index if not exists idx_job_sites_name on job_sites(name);
create index if not exists idx_job_sites_status on job_sites(status);
create index if not exists idx_job_sites_created_at on job_sites(created_at);
create index if not exists idx_job_sites_location on job_sites(lat, lng);

-- Enable RLS
alter table job_sites enable row level security;

-- Create RLS policies following existing patterns
-- Authenticated admin users have full access
create policy if not exists "Auth full access: job_sites" on job_sites 
  for all to authenticated 
  using (auth.role() = 'authenticated');

-- Public read access for active job sites (for check-in functionality)
create policy if not exists "Public read active: job_sites" on job_sites 
  for select to anon 
  using (status = 'active');

-- Create updated_at trigger function
create or replace function update_job_sites_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger job_sites_updated_at_trigger
  before update on job_sites
  for each row
  execute function update_job_sites_updated_at();