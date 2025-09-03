-- Migration: Create database trigger for automatic white card processing
-- Story 3.3: Automated White Card Data Extraction
-- Created: 2025-08-19

-- Create function to handle white card processing trigger
create or replace function handle_white_card_upload()
returns trigger as $$
begin
  -- Only trigger for new certifications with white_card_path and 'Awaiting Review' status
  if NEW.white_card_path is not null 
     and NEW.status = 'Awaiting Review' 
     and (OLD.white_card_path is null or OLD.white_card_path != NEW.white_card_path) then
    
    -- Update status to 'queued' to indicate processing is needed
    NEW.status = 'queued';
    
    -- Insert audit record for queueing
    insert into certification_audits (certification_id, event, detail)
    values (
      NEW.id,
      'queued_for_processing',
      jsonb_build_object(
        'white_card_path', NEW.white_card_path,
        'worker_id', NEW.worker_id,
        'queued_at', now()
      )
    );
    
    -- Call the Edge Function asynchronously via pg_net extension (if available)
    -- Note: This requires pg_net extension to be enabled
    -- Alternative: Use a separate queue/cron job to poll for queued items
    
    -- For now, we'll rely on external systems to poll for 'queued' status
    -- or manual triggering via the test scripts
    
  end if;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Create the trigger
drop trigger if exists white_card_processing_trigger on certifications;
create trigger white_card_processing_trigger
  before insert or update on certifications
  for each row
  execute function handle_white_card_upload();

-- Add comment for documentation
comment on function handle_white_card_upload() is 'Trigger function to automatically queue white card certifications for OCR processing';
comment on trigger white_card_processing_trigger on certifications is 'Automatically queues white card certifications for processing when white_card_path is provided';