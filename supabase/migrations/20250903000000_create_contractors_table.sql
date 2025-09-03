-- Create contractors table for Story 1.1: Contractor-Employee Hierarchy Foundation
-- Timestamp: 2025-09-03 00:00:00
-- Notes: Establishes contractor company entities to organize workers by employer

-- Create contractors table
create table if not exists contractors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  abn text,
  contact_email text,
  contact_phone text,
  address text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add indexes for performance
create index if not exists idx_contractors_name on contractors(name);
create index if not exists idx_contractors_abn on contractors(abn);
create index if not exists idx_contractors_active on contractors(active);

-- Enable Row Level Security
alter table contractors enable row level security;

-- Create RLS policies following workers table pattern
-- Public read for contractor names (needed for induction form)
create policy if not exists "Public read: contractors" on contractors 
  for select using (active = true);

-- Authenticated users can manage contractors
create policy if not exists "Auth write: contractors insert" on contractors 
  for insert with check (auth.role() = 'authenticated');
  
create policy if not exists "Auth write: contractors update" on contractors 
  for update using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');
  
create policy if not exists "Auth write: contractors delete" on contractors 
  for delete using (auth.role() = 'authenticated');

-- Create updated_at trigger function
create or replace function update_contractors_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger contractors_updated_at_trigger
  before update on contractors
  for each row
  execute function update_contractors_updated_at();