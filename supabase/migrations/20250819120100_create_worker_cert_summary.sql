-- Create worker certification summary view for Story 5.4
-- Timestamp: 2025-08-19 12:01:00
-- Notes: Creates view to efficiently get worker list with latest certification status

-- Create view to get worker certification summary
create or replace view worker_cert_summary as
select 
  w.id as worker_id,
  w.full_name,
  w.email,
  w.company,
  w.trade,
  coalesce(latest_cert.status, 'Awaiting Review') as status,
  latest_cert.expiry_date,
  latest_cert.updated_at as last_updated
from workers w
left join (
  select 
    worker_id,
    status,
    expiry_date,
    updated_at,
    row_number() over (partition by worker_id order by updated_at desc, created_at desc) as rn
  from certifications
) latest_cert on w.id = latest_cert.worker_id and latest_cert.rn = 1;

-- Grant select permissions
grant select on worker_cert_summary to authenticated;