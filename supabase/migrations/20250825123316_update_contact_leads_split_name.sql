-- Update contact_leads table to split name into first_name and last_name
ALTER TABLE contact_leads 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Copy existing name data to first_name and last_name if name exists and new columns are empty
UPDATE contact_leads 
SET 
  first_name = COALESCE(first_name, split_part(name, ' ', 1)),
  last_name = COALESCE(last_name, 
    CASE 
      WHEN array_length(string_to_array(name, ' '), 1) > 1 
      THEN substring(name FROM position(' ' IN name) + 1) 
      ELSE '' 
    END
  )
WHERE name IS NOT NULL AND name != '' AND (first_name IS NULL OR last_name IS NULL);

-- Set default values for empty columns
UPDATE contact_leads 
SET first_name = 'Unknown'
WHERE first_name IS NULL OR first_name = '';

UPDATE contact_leads 
SET last_name = 'User'
WHERE last_name IS NULL OR last_name = '';

-- Make first_name and last_name required for new records
ALTER TABLE contact_leads 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;

-- Add defaults for future records
ALTER TABLE contact_leads 
ALTER COLUMN first_name SET DEFAULT '',
ALTER COLUMN last_name SET DEFAULT '';

-- Keep the old name column for backward compatibility