create extension if not exists pgcrypto with schema public;

create table if not exists public.service_areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz not null default now()
);

create index if not exists service_areas_slug_idx on public.service_areas (slug);

alter table public.service_areas enable row level security;

-- Read-only access to anon and authenticated for listing service areas
create policy if not exists "Allow read to anon" on public.service_areas
  for select to anon using (true);

create policy if not exists "Allow read to authenticated" on public.service_areas
  for select to authenticated using (true);
