-- Add users table referencing auth.users
-- Timestamp: 2025-08-16 02:15:00

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table users enable row level security;

-- Users can only access their own row
create policy if not exists "Users self-select" on users
  for select using (auth.uid() = id);

create policy if not exists "Users self-update" on users
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy if not exists "Users self-insert" on users
  for insert with check (auth.uid() = id);

create policy if not exists "Users self-delete" on users
  for delete using (auth.uid() = id);
