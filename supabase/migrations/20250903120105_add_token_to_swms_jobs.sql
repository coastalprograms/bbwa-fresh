-- Add token functionality to swms_jobs table for Story 1.4
-- This enables token-based contractor access to SWMS submission portal

-- Add token and token expiry fields to swms_jobs table
alter table swms_jobs add column if not exists access_token uuid default gen_random_uuid();
alter table swms_jobs add column if not exists token_expires_at timestamptz default (now() + interval '7 days');
alter table swms_jobs add column if not exists contractor_id uuid references contractors(id);

-- Create indexes for token validation performance
create index if not exists idx_swms_jobs_access_token on swms_jobs(access_token);
create index if not exists idx_swms_jobs_token_expires_at on swms_jobs(token_expires_at);
create index if not exists idx_swms_jobs_contractor_id on swms_jobs(contractor_id);

-- Add function to regenerate tokens
create or replace function regenerate_swms_token(job_id uuid, expiry_days integer default 7)
returns uuid as $$
declare
  new_token uuid;
begin
  new_token := gen_random_uuid();
  
  update swms_jobs 
  set access_token = new_token,
      token_expires_at = now() + (expiry_days || ' days')::interval,
      updated_at = now()
  where id = job_id;
  
  return new_token;
end;
$$ language plpgsql security definer;

-- Update RLS policy for token-based access
create policy if not exists "Token access: swms_jobs" on swms_jobs 
  for select to anon 
  using (
    access_token is not null 
    and token_expires_at > now() 
    and status = 'active'
  );

-- Grant access to the regenerate function for authenticated users
grant execute on function regenerate_swms_token to authenticated;