-- Add contractor foreign key to workers table for Story 1.1
-- Timestamp: 2025-09-03 00:00:01
-- Notes: Links workers to contractor companies, nullable initially for data migration

-- Add contractor_id foreign key column (nullable initially for migration)
alter table workers add column if not exists contractor_id uuid references contractors(id) on delete set null;

-- Create index on contractor_id for performance
create index if not exists idx_workers_contractor_id on workers(contractor_id);

-- Update workers table RLS policies to include contractor relationship access
-- Note: Existing policies remain for backward compatibility during migration