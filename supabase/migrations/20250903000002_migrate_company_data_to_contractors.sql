-- Data migration: Convert existing company text to contractor records for Story 1.1
-- Timestamp: 2025-09-03 00:00:02
-- Notes: Extracts unique company names and creates contractor records

-- Step 1: Create contractors for unique company names from workers table
insert into contractors (name, active, created_at, updated_at)
select distinct 
  trim(company) as name,
  true as active,
  now() as created_at,
  now() as updated_at
from workers 
where company is not null 
  and trim(company) != '' 
  and trim(company) not in (select name from contractors)
on conflict do nothing;

-- Step 2: Update workers records with contractor_id references
update workers 
set contractor_id = contractors.id
from contractors
where workers.company is not null 
  and trim(workers.company) = contractors.name;

-- Step 3: Create a default contractor for any workers without company info
insert into contractors (name, active, created_at, updated_at)
values ('Individual Contractor', true, now(), now())
on conflict do nothing;

-- Step 4: Assign default contractor to workers with null/empty company
update workers 
set contractor_id = (select id from contractors where name = 'Individual Contractor')
where contractor_id is null;

-- Step 5: After migration, make contractor_id NOT NULL
alter table workers alter column contractor_id set not null;

-- Step 6: Drop the old company column (commented out for safety - can be run later after verification)
-- alter table workers drop column company;