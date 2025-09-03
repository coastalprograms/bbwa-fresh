-- Add slug to projects and create project_photos with RLS
-- Timestamp: 2025-08-17 09:50:00

-- 1) Add slug column to projects
alter table projects add column if not exists slug text;

-- Backfill slug from title for existing rows
update projects
set slug = trim(both '-' from regexp_replace(lower(coalesce(title, '')), '[^a-z0-9]+', '-', 'g'))
where slug is null;

-- Ensure slug is NOT NULL and unique
alter table projects alter column slug set not null;
create unique index if not exists idx_projects_slug_unique on projects(slug);

-- 2) Create project_photos table
create table if not exists project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  category text not null default 'General', -- e.g. Inside, Outside, Bathroom
  url text not null,
  alt_text text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_project_photos_project_id on project_photos(project_id);
create index if not exists idx_project_photos_project_id_category on project_photos(project_id, category);

-- 3) Enable Row Level Security and policies
alter table project_photos enable row level security;

-- Public read of project photos
create policy if not exists "Public read: project_photos" on project_photos for select using (true);

-- Authenticated write policies (builder/admin)
create policy if not exists "Auth write: project_photos insert" on project_photos for insert with check (auth.role() = 'authenticated');
create policy if not exists "Auth write: project_photos update" on project_photos for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy if not exists "Auth write: project_photos delete" on project_photos for delete using (auth.role() = 'authenticated');
