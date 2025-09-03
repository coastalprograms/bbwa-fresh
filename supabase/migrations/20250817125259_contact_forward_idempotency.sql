-- 20250817125259_contact_forward_idempotency.sql
-- Purpose: Create idempotency table to prevent duplicate Airtable forwards
-- Notes:
-- - RLS is enabled and no permissive policies are added.
-- - Service role (used by Edge Functions) bypasses RLS implicitly.
-- - Stores opaque keys only; no PII beyond optional `source` label.

create extension if not exists pgcrypto with schema public;

create table if not exists public.contact_forward_idempotency (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  source text,
  created_at timestamptz not null default now()
);

comment on table public.contact_forward_idempotency is 'Stores idempotency keys for contact forward function to Airtable. Keys are hour-bucketed hashes.';
comment on column public.contact_forward_idempotency.key is 'Opaque hash of name|email|message|bucketedTime';

alter table public.contact_forward_idempotency enable row level security;

-- Intentionally no RLS policies (deny-by-default). Edge Function uses service role and bypasses RLS.
