-- Create database functions for SWMS data management - Story 1.3

-- Function 1: Get SWMS job with submissions (joined data)
create or replace function get_swms_job_with_submissions(job_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  select json_build_object(
    'job', json_build_object(
      'id', sj.id,
      'job_site_id', sj.job_site_id,
      'name', sj.name,
      'description', sj.description,
      'start_date', sj.start_date,
      'end_date', sj.end_date,
      'status', sj.status,
      'created_at', sj.created_at,
      'updated_at', sj.updated_at,
      'job_site', json_build_object(
        'id', js.id,
        'name', js.name,
        'address', js.address,
        'lat', js.lat,
        'lng', js.lng,
        'status', js.status
      )
    ),
    'submissions', coalesce(
      json_agg(
        json_build_object(
          'id', ss.id,
          'document_name', ss.document_name,
          'file_url', ss.file_url,
          'status', ss.status,
          'submitted_at', ss.submitted_at,
          'reviewed_at', ss.reviewed_at,
          'reviewed_by', ss.reviewed_by,
          'notes', ss.notes,
          'contractor', json_build_object(
            'id', c.id,
            'name', c.name,
            'abn', c.abn,
            'contact_email', c.contact_email,
            'contact_phone', c.contact_phone
          )
        ) order by ss.submitted_at desc
      ) filter (where ss.id is not null),
      '[]'::json
    ),
    'submission_counts', json_build_object(
      'total', count(ss.id),
      'submitted', count(ss.id) filter (where ss.status = 'submitted'),
      'under_review', count(ss.id) filter (where ss.status = 'under_review'),
      'approved', count(ss.id) filter (where ss.status = 'approved'),
      'rejected', count(ss.id) filter (where ss.status = 'rejected'),
      'requires_changes', count(ss.id) filter (where ss.status = 'requires_changes')
    )
  ) into result
  from swms_jobs sj
  join job_sites js on sj.job_site_id = js.id
  left join swms_submissions ss on sj.id = ss.swms_job_id
  left join contractors c on ss.contractor_id = c.id
  where sj.id = job_id
  group by sj.id, js.id;
  
  return result;
end;
$$;

-- Function 2: Update SWMS submission status with audit logging
create or replace function update_swms_submission_status(
  submission_id uuid,
  new_status text,
  reviewer_id uuid default null,
  review_notes text default null
)
returns json
language plpgsql
security definer
as $$
declare
  old_record swms_submissions%rowtype;
  new_record swms_submissions%rowtype;
begin
  -- Get current record for audit
  select * into old_record 
  from swms_submissions 
  where id = submission_id;
  
  if not found then
    return json_build_object('success', false, 'error', 'Submission not found');
  end if;
  
  -- Validate status transition
  if new_status not in ('submitted', 'under_review', 'approved', 'rejected', 'requires_changes') then
    return json_build_object('success', false, 'error', 'Invalid status');
  end if;
  
  -- Update the record
  update swms_submissions
  set 
    status = new_status,
    reviewed_by = case when new_status in ('approved', 'rejected') then reviewer_id else reviewed_by end,
    notes = coalesce(review_notes, notes),
    updated_at = now()
  where id = submission_id
  returning * into new_record;
  
  -- Log the change (simple audit trail)
  insert into swms_audit_log (
    table_name, 
    record_id, 
    action_type, 
    old_values, 
    new_values, 
    changed_by,
    changed_at
  ) values (
    'swms_submissions',
    submission_id,
    'status_update',
    json_build_object(
      'status', old_record.status,
      'reviewed_by', old_record.reviewed_by,
      'notes', old_record.notes
    ),
    json_build_object(
      'status', new_record.status,
      'reviewed_by', new_record.reviewed_by,
      'notes', new_record.notes
    ),
    reviewer_id,
    now()
  );
  
  return json_build_object(
    'success', true,
    'submission', json_build_object(
      'id', new_record.id,
      'status', new_record.status,
      'reviewed_at', new_record.reviewed_at,
      'reviewed_by', new_record.reviewed_by,
      'notes', new_record.notes
    )
  );
exception
  when others then
    return json_build_object('success', false, 'error', sqlerrm);
end;
$$;

-- Function 3: Calculate SWMS completion rate for dashboard metrics
create or replace function calculate_swms_completion_rate(job_site_id_param uuid default null)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  with job_stats as (
    select 
      sj.id as job_id,
      sj.name as job_name,
      sj.status as job_status,
      js.name as job_site_name,
      count(ss.id) as total_submissions,
      count(ss.id) filter (where ss.status = 'approved') as approved_submissions,
      count(ss.id) filter (where ss.status = 'submitted') as pending_submissions,
      count(ss.id) filter (where ss.status = 'rejected') as rejected_submissions,
      case 
        when count(ss.id) = 0 then 0
        else round((count(ss.id) filter (where ss.status = 'approved'))::numeric / count(ss.id)::numeric * 100, 2)
      end as completion_rate
    from swms_jobs sj
    join job_sites js on sj.job_site_id = js.id
    left join swms_submissions ss on sj.id = ss.swms_job_id
    where (job_site_id_param is null or sj.job_site_id = job_site_id_param)
    group by sj.id, sj.name, sj.status, js.name
  )
  select json_build_object(
    'overall_stats', json_build_object(
      'total_jobs', count(*),
      'active_jobs', count(*) filter (where job_status = 'active'),
      'average_completion_rate', round(avg(completion_rate), 2),
      'total_submissions', sum(total_submissions),
      'approved_submissions', sum(approved_submissions),
      'pending_submissions', sum(pending_submissions),
      'rejected_submissions', sum(rejected_submissions)
    ),
    'job_details', coalesce(
      json_agg(
        json_build_object(
          'job_id', job_id,
          'job_name', job_name,
          'job_status', job_status,
          'job_site_name', job_site_name,
          'completion_rate', completion_rate,
          'total_submissions', total_submissions,
          'approved_submissions', approved_submissions,
          'pending_submissions', pending_submissions,
          'rejected_submissions', rejected_submissions
        ) order by job_name
      ),
      '[]'::json
    )
  ) into result
  from job_stats;
  
  return result;
end;
$$;

-- Function 4: Get contractor SWMS submissions for portal queries
create or replace function get_contractor_swms_submissions(contractor_id_param uuid)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  select json_build_object(
    'contractor', json_build_object(
      'id', c.id,
      'name', c.name,
      'abn', c.abn,
      'contact_email', c.contact_email
    ),
    'submissions', coalesce(
      json_agg(
        json_build_object(
          'id', ss.id,
          'document_name', ss.document_name,
          'file_url', ss.file_url,
          'status', ss.status,
          'submitted_at', ss.submitted_at,
          'reviewed_at', ss.reviewed_at,
          'notes', ss.notes,
          'swms_job', json_build_object(
            'id', sj.id,
            'name', sj.name,
            'description', sj.description,
            'start_date', sj.start_date,
            'end_date', sj.end_date,
            'job_site', json_build_object(
              'id', js.id,
              'name', js.name,
              'address', js.address
            )
          )
        ) order by ss.submitted_at desc
      ) filter (where ss.id is not null),
      '[]'::json
    ),
    'submission_summary', json_build_object(
      'total', count(ss.id),
      'approved', count(ss.id) filter (where ss.status = 'approved'),
      'pending', count(ss.id) filter (where ss.status in ('submitted', 'under_review')),
      'rejected', count(ss.id) filter (where ss.status = 'rejected'),
      'requires_changes', count(ss.id) filter (where ss.status = 'requires_changes')
    )
  ) into result
  from contractors c
  left join swms_submissions ss on c.id = ss.contractor_id
  left join swms_jobs sj on ss.swms_job_id = sj.id
  left join job_sites js on sj.job_site_id = js.id
  where c.id = contractor_id_param
  group by c.id;
  
  return result;
end;
$$;