-- Initial schema migration for BBWA
-- Timestamp: 2025-08-16 02:10:00
-- Notes: Creates core tables, FKs, indexes, enables RLS and baseline policies

-- Extensions
create extension if not exists pgcrypto;

-- Tables
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  hero_image_url text,
  created_at timestamptz not null default now()
);

create table if not exists hero_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

create table if not exists workers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text not null,
  company text,
  trade text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references workers(id) on delete cascade,
  type text not null,
  number text,
  expiry_date date,
  file_url text,
  created_at timestamptz not null default now()
);

create table if not exists site_attendances (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references workers(id) on delete cascade,
  site_id text,
  lat double precision,
  lng double precision,
  checked_in_at timestamptz not null default now()
);

create table if not exists faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  updated_at timestamptz not null default now()
);

create table if not exists contact_form_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  submitted_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_certifications_worker_id on certifications(worker_id);
create index if not exists idx_site_attendances_worker_id on site_attendances(worker_id);

-- Enable Row Level Security
alter table projects enable row level security;
alter table hero_images enable row level security;
alter table workers enable row level security;
alter table certifications enable row level security;
alter table site_attendances enable row level security;
alter table faq enable row level security;
alter table contact_form_submissions enable row level security;

-- Policies: Public read for selected public content
create policy if not exists "Public read: projects" on projects for select using (true);
create policy if not exists "Public read: hero_images" on hero_images for select using (true);
create policy if not exists "Public read: faq" on faq for select using (true);

-- Policies: Authenticated read/write for admin data (builder)
-- Projects
create policy if not exists "Auth write: projects insert" on projects for insert with check (auth.role() = 'authenticated');
create policy if not exists "Auth write: projects update" on projects for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy if not exists "Auth write: projects delete" on projects for delete using (auth.role() = 'authenticated');
-- Hero Images
create policy if not exists "Auth write: hero_images insert" on hero_images for insert with check (auth.role() = 'authenticated');
create policy if not exists "Auth write: hero_images update" on hero_images for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy if not exists "Auth write: hero_images delete" on hero_images for delete using (auth.role() = 'authenticated');
-- FAQ
create policy if not exists "Auth write: faq insert" on faq for insert with check (auth.role() = 'authenticated');
create policy if not exists "Auth write: faq update" on faq for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy if not exists "Auth write: faq delete" on faq for delete using (auth.role() = 'authenticated');

-- Policies: Sensitive tables authenticated-only (no anon select)
-- Workers
create policy if not exists "Auth only: workers" on workers for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
-- Certifications
create policy if not exists "Auth only: certifications" on certifications for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
-- Site Attendances
create policy if not exists "Auth only: site_attendances" on site_attendances for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
-- Contact Form Submissions
create policy if not exists "Auth only: contact_form_submissions" on contact_form_submissions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
