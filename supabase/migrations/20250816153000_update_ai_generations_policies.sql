-- Update ai_generations policies: restrict inserts to service role only
-- Timestamp: 2025-08-16 15:30:00

-- Drop previous insert policy if present
drop policy if exists "Auth insert: ai_generations" on ai_generations;

-- Allow only service_role inserts (server-side logging)
create policy "Service role insert: ai_generations" on ai_generations
  for insert with check (auth.role() = 'service_role');
