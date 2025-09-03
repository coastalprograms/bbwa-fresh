-- Add missing safety checkbox fields to workers table
-- These fields are collected by the induction form but were not being saved to database

ALTER TABLE workers ADD COLUMN IF NOT EXISTS allergies text;

-- Site Rules Safety Checkboxes
ALTER TABLE workers ADD COLUMN IF NOT EXISTS no_alcohol_drugs boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS electrical_equipment_responsibility boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS hazardous_substances_understanding boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS use_ppe_when_necessary boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS high_risk_work_meeting_understanding boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS appropriate_signage_display boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS no_unauthorized_visitors_understanding boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS housekeeping_responsibility boolean DEFAULT false;

-- Employer Safety Requirements  
ALTER TABLE workers ADD COLUMN IF NOT EXISTS employer_provided_training boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS employer_provided_swms boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS discussed_swms_with_employer boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS pre_start_meeting_understanding boolean DEFAULT false;

-- Safety Documentation
ALTER TABLE workers ADD COLUMN IF NOT EXISTS read_safety_booklet boolean DEFAULT false;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS understand_site_management_plan boolean DEFAULT false;

-- Update existing boolean columns to have proper defaults if they don't already
ALTER TABLE workers ALTER COLUMN agree_safety SET DEFAULT false;
ALTER TABLE workers ALTER COLUMN agree_terms SET DEFAULT false;