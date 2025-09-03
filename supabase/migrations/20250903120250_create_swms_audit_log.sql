-- Create audit log table for SWMS Story 1.3
-- Database structure for audit trail tracking

-- Create audit log table for SWMS operations
create table if not exists swms_audit_log (
  id uuid default gen_random_uuid() primary key,
  table_name text not null,
  record_id uuid not null,
  action_type text not null check (action_type in ('insert', 'update', 'delete', 'status_update')),
  old_values jsonb,
  new_values jsonb,
  changed_by uuid references auth.users(id),
  changed_at timestamptz default now() not null
);

-- Create indexes for audit log queries
create index if not exists idx_swms_audit_log_table_record on swms_audit_log(table_name, record_id);
create index if not exists idx_swms_audit_log_changed_at on swms_audit_log(changed_at);
create index if not exists idx_swms_audit_log_changed_by on swms_audit_log(changed_by);
create index if not exists idx_swms_audit_log_action_type on swms_audit_log(action_type);

-- Enable RLS
alter table swms_audit_log enable row level security;

-- Authenticated admin users can read all audit logs
create policy if not exists "Auth read access: swms_audit_log" on swms_audit_log 
  for select to authenticated 
  using (auth.role() = 'authenticated');

-- System can insert audit logs (definer functions)
create policy if not exists "System write access: swms_audit_log" on swms_audit_log 
  for insert to authenticated 
  with check (true);