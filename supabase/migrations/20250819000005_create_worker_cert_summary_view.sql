-- Create worker certification summary view for Story 5.4
-- Timestamp: 2025-08-19 00:05:00
-- Notes: Efficient view for listing workers with their latest certification status

-- First, let's add necessary fields to workers table for the admin interface
ALTER TABLE workers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE workers ADD COLUMN IF NOT EXISTS white_card_expiry DATE;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update certifications table status values to match Story 5.4 requirements
-- We need 'Valid', 'Expired', 'Awaiting Review' instead of the current values
ALTER TABLE certifications DROP CONSTRAINT IF EXISTS certifications_status_check;
ALTER TABLE certifications ADD CONSTRAINT certifications_status_check 
  CHECK (status IN ('Valid', 'Expired', 'Awaiting Review'));

-- Create a trigger to update workers.updated_at when workers table is modified
CREATE OR REPLACE FUNCTION update_workers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workers_updated_at_trigger
  BEFORE UPDATE ON workers
  FOR EACH ROW
  EXECUTE FUNCTION update_workers_updated_at();

-- Create the worker certification summary view
CREATE OR REPLACE VIEW worker_cert_summary AS
WITH latest_certs AS (
  SELECT DISTINCT ON (worker_id)
    worker_id,
    status,
    expiry_date,
    created_at,
    updated_at
  FROM certifications
  ORDER BY worker_id, created_at DESC, updated_at DESC
)
SELECT 
  w.id AS worker_id,
  w.full_name,
  w.email,
  w.company,
  w.phone,
  w.trade,
  w.status AS worker_status,
  COALESCE(lc.status, 'Awaiting Review') AS certification_status,
  lc.expiry_date,
  -- Determine overall white card status based on certification and expiry
  CASE
    WHEN lc.status = 'Valid' AND (lc.expiry_date IS NULL OR lc.expiry_date >= CURRENT_DATE) THEN 'Valid'
    WHEN lc.status = 'Valid' AND lc.expiry_date < CURRENT_DATE THEN 'Expired'
    WHEN lc.status = 'Expired' THEN 'Expired'
    ELSE 'Awaiting Review'
  END AS white_card_status,
  w.created_at AS worker_created_at,
  w.updated_at AS worker_updated_at,
  lc.created_at AS cert_created_at,
  lc.updated_at AS cert_updated_at
FROM workers w
LEFT JOIN latest_certs lc ON w.id = lc.worker_id
WHERE w.status = 'approved'  -- Only show approved workers
ORDER BY w.full_name;

-- Add RLS policy for the view (inherits from underlying tables)
GRANT SELECT ON worker_cert_summary TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workers_status ON workers(status);
CREATE INDEX IF NOT EXISTS idx_workers_updated_at ON workers(updated_at);
CREATE INDEX IF NOT EXISTS idx_certifications_worker_created ON certifications(worker_id, created_at DESC);

-- Comment on the view for documentation
COMMENT ON VIEW worker_cert_summary IS 'Summary view of workers with their latest certification status and computed white card status. Used for admin worker management interface.';