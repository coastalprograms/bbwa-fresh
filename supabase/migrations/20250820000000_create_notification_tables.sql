-- Migration: Create notification audit and deduplication tables
-- Story: 6.1 Automated Certificate Expiry Reminders

-- Table for auditing notification attempts (success/failure logging)
create table if not exists notification_audits (
  id bigserial primary key,
  kind text not null check (kind in ('expiry_reminders', 'compliance_alerts', 'project_updates')),
  payload jsonb,
  result text not null check (result in ('success', 'failure')),
  created_at timestamptz not null default now()
);

-- Table for deduplication to prevent spam notifications
create table if not exists notification_dedup (
  id bigserial primary key,
  worker_id uuid not null,
  expiry_date date not null,
  type text not null default 'expiry' check (type in ('expiry', 'compliance', 'renewal')),
  created_at timestamptz not null default now(),
  unique(worker_id, expiry_date, type)
);

-- Add indexes for performance
create index idx_notification_audits_kind_created on notification_audits(kind, created_at desc);
create index idx_notification_audits_result_created on notification_audits(result, created_at desc);
create index idx_notification_dedup_worker_type on notification_dedup(worker_id, type);
create index idx_notification_dedup_created on notification_dedup(created_at desc);

-- Enable Row Level Security
alter table notification_audits enable row level security;
alter table notification_dedup enable row level security;

-- RLS Policies for notification_audits
-- Authenticated users can read audit logs
create policy "authenticated_can_read_audits" on notification_audits 
  for select using (auth.role() = 'authenticated');

-- Service role can insert audit records
create policy "service_role_inserts_audits" on notification_audits 
  for insert with check (auth.role() = 'service_role');

-- RLS Policies for notification_dedup  
-- Authenticated users can read dedup records
create policy "authenticated_can_read_dedup" on notification_dedup 
  for select using (auth.role() = 'authenticated');

-- Service role can insert dedup records
create policy "service_role_inserts_dedup" on notification_dedup 
  for insert with check (auth.role() = 'service_role');

-- Service role can delete old dedup records (for cleanup)
create policy "service_role_deletes_dedup" on notification_dedup 
  for delete using (auth.role() = 'service_role');

-- Add comments for documentation
comment on table notification_audits is 'Audit log for all notification attempts (success/failure)';
comment on table notification_dedup is 'Deduplication table to prevent spam notifications within cooldown period';
comment on column notification_audits.kind is 'Type of notification: expiry_reminders, compliance_alerts, project_updates';
comment on column notification_audits.payload is 'JSON payload containing notification details and metadata';
comment on column notification_audits.result is 'Result of notification attempt: success or failure';
comment on column notification_dedup.worker_id is 'UUID of worker to prevent duplicate notifications';
comment on column notification_dedup.expiry_date is 'Date of certification expiry being notified about';
comment on column notification_dedup.type is 'Type of notification to deduplicate: expiry, compliance, renewal';