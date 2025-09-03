-- Update RLS for ai_generations: restrict inserts to service role only
-- Timestamp: 2025-08-16 15:35:00
-- Purpose: Remove authenticated insert policy; service role (SUPABASE_SERVICE_ROLE_KEY) bypasses RLS

-- Ensure table exists (no-op if already exists)
create table if not exists ai_generations (
  id bigserial primary key,
  project_id uuid,
  provider text not null,
  prompt_len int not null,
  output_len int,
  duration_ms int,
  status text not null default 'success',
  created_at timestamptz not null default now()
);

alter table ai_generations enable row level security;

-- Drop prior insert policy for authenticated users, if present
DROP POLICY IF EXISTS "Auth insert: ai_generations" ON ai_generations;

-- Keep read access for authenticated users (recreate if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_generations' AND policyname = 'Auth read: ai_generations'
  ) THEN
    EXECUTE 'CREATE POLICY "Auth read: ai_generations" ON ai_generations FOR SELECT USING (auth.role() = ''authenticated'')';
  END IF;
END $$;
