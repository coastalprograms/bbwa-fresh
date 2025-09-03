-- Performance optimization for SWMS tables - Story 1.3
-- Additional indexes and views for frequently accessed data

-- Additional composite indexes for common query patterns

-- Job sites with location-based queries
create index if not exists idx_job_sites_status_location on job_sites(status, lat, lng) 
  where status = 'active';

-- SWMS jobs with date range queries  
create index if not exists idx_swms_jobs_site_dates on swms_jobs(job_site_id, start_date, end_date);
create index if not exists idx_swms_jobs_status_dates on swms_jobs(status, start_date, end_date);

-- Submissions with contractor and job filtering
create index if not exists idx_swms_submissions_contractor_status on swms_submissions(contractor_id, status);
create index if not exists idx_swms_submissions_job_status on swms_submissions(swms_job_id, status);
create index if not exists idx_swms_submissions_status_dates on swms_submissions(status, submitted_at, reviewed_at);

-- Audit log performance indexes
create index if not exists idx_swms_audit_log_record_date on swms_audit_log(table_name, record_id, changed_at);

-- Create materialized view for dashboard statistics (refreshed periodically)
create materialized view if not exists swms_dashboard_stats as
select 
  'overall' as scope,
  null::uuid as job_site_id,
  count(distinct sj.id) as total_jobs,
  count(distinct sj.id) filter (where sj.status = 'active') as active_jobs,
  count(distinct sj.id) filter (where sj.status = 'completed') as completed_jobs,
  count(ss.id) as total_submissions,
  count(ss.id) filter (where ss.status = 'approved') as approved_submissions,
  count(ss.id) filter (where ss.status = 'submitted') as pending_submissions,
  count(ss.id) filter (where ss.status = 'rejected') as rejected_submissions,
  case 
    when count(ss.id) = 0 then 0::numeric
    else round((count(ss.id) filter (where ss.status = 'approved'))::numeric / count(ss.id)::numeric * 100, 2)
  end as completion_rate,
  count(distinct ss.contractor_id) as active_contractors,
  current_timestamp as last_updated
from swms_jobs sj
left join swms_submissions ss on sj.id = ss.swms_job_id

union all

select 
  'by_site' as scope,
  sj.job_site_id,
  count(distinct sj.id) as total_jobs,
  count(distinct sj.id) filter (where sj.status = 'active') as active_jobs,
  count(distinct sj.id) filter (where sj.status = 'completed') as completed_jobs,
  count(ss.id) as total_submissions,
  count(ss.id) filter (where ss.status = 'approved') as approved_submissions,
  count(ss.id) filter (where ss.status = 'submitted') as pending_submissions,
  count(ss.id) filter (where ss.status = 'rejected') as rejected_submissions,
  case 
    when count(ss.id) = 0 then 0::numeric
    else round((count(ss.id) filter (where ss.status = 'approved'))::numeric / count(ss.id)::numeric * 100, 2)
  end as completion_rate,
  count(distinct ss.contractor_id) as active_contractors,
  current_timestamp as last_updated
from swms_jobs sj
left join swms_submissions ss on sj.id = ss.swms_job_id
group by sj.job_site_id;

-- Create index on the materialized view
create unique index if not exists idx_swms_dashboard_stats_scope_site on swms_dashboard_stats(scope, job_site_id);

-- Create function to refresh dashboard stats
create or replace function refresh_swms_dashboard_stats()
returns void
language plpgsql
security definer
as $$
begin
  refresh materialized view concurrently swms_dashboard_stats;
end;
$$;

-- Create view for frequently accessed joined data (job sites with active SWMS jobs)
create or replace view swms_active_jobs_summary as
select 
  js.id as job_site_id,
  js.name as job_site_name,
  js.address as job_site_address,
  js.status as job_site_status,
  sj.id as swms_job_id,
  sj.name as swms_job_name,
  sj.description as swms_job_description,
  sj.start_date,
  sj.end_date,
  sj.status as swms_job_status,
  count(ss.id) as submission_count,
  count(ss.id) filter (where ss.status = 'approved') as approved_count,
  count(ss.id) filter (where ss.status = 'submitted') as pending_count,
  count(distinct ss.contractor_id) as contractor_count,
  case 
    when count(ss.id) = 0 then 0::numeric
    else round((count(ss.id) filter (where ss.status = 'approved'))::numeric / count(ss.id)::numeric * 100, 2)
  end as completion_rate
from job_sites js
join swms_jobs sj on js.id = sj.job_site_id
left join swms_submissions ss on sj.id = ss.swms_job_id
where sj.status = 'active'
group by js.id, js.name, js.address, js.status, sj.id, sj.name, sj.description, sj.start_date, sj.end_date, sj.status;

-- Create view for contractor submission summary
create or replace view contractor_submission_summary as
select 
  c.id as contractor_id,
  c.name as contractor_name,
  c.abn,
  c.contact_email,
  c.active as contractor_active,
  count(ss.id) as total_submissions,
  count(ss.id) filter (where ss.status = 'approved') as approved_submissions,
  count(ss.id) filter (where ss.status = 'submitted') as pending_submissions,
  count(ss.id) filter (where ss.status = 'rejected') as rejected_submissions,
  count(distinct sj.job_site_id) as active_job_sites,
  max(ss.submitted_at) as last_submission_date,
  case 
    when count(ss.id) = 0 then 0::numeric
    else round((count(ss.id) filter (where ss.status = 'approved'))::numeric / count(ss.id)::numeric * 100, 2)
  end as approval_rate
from contractors c
left join swms_submissions ss on c.id = ss.contractor_id
left join swms_jobs sj on ss.swms_job_id = sj.id
where c.active = true
group by c.id, c.name, c.abn, c.contact_email, c.active;