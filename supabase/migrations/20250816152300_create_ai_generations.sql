-- Create AI generations audit table
-- Timestamp: 2025-08-16 15:23:00
-- Purpose: Log AI-assisted description generations with RLS

create table if not exists ai_generations (
  id bigserial primary key,
  project_id uuid references projects(id) on delete set null,
  provider text not null,
  prompt_len int not null,
  output_len int,
  duration_ms int,
  status text not null default 'success',
  created_at timestamptz not null default now()
);

alter table ai_generations enable row level security;

-- Authenticated users (builder/admin) can read audit logs
drop policy if exists "Auth read: ai_generations" on ai_generations;
create policy "Auth read: ai_generations" on ai_generations
  for select using (auth.role() = 'authenticated');

-- Authenticated users (builder/admin) can insert audit rows
drop policy if exists "Auth insert: ai_generations" on ai_generations;
create policy "Auth insert: ai_generations" on ai_generations
  for insert with check (auth.role() = 'authenticated');
