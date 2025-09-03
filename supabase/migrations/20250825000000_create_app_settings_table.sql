-- Create app_settings table for Story 7.2
-- Migration: create_app_settings_table
-- Date: 2025-08-25

-- Create the app_settings table
create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Enable Row Level Security
alter table public.app_settings enable row level security;

-- Create policy for admin access only
-- Note: Assumes admin role is stored in auth.users metadata
create policy "Admins can manage settings" on public.app_settings
  for all using (
    auth.jwt() ->> 'role' = 'admin' or 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Create index for performance on key lookups
create index if not exists app_settings_key_idx on public.app_settings(key);

-- Create updated_at trigger for automatic timestamp updates
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_app_settings_updated_at
  before update on public.app_settings
  for each row execute function public.handle_updated_at();

-- Insert default settings
insert into public.app_settings (key, value, updated_by) values 
  ('terms_and_conditions', '""', null),
  ('privacy_policy', '""', null)
on conflict (key) do nothing;