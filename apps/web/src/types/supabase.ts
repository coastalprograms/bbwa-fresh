/**
 * Minimal TypeScript types for app usage.
 * For full types, generate via Supabase CLI/codegen and replace with the generated Database types.
 */

export type UUID = string

export type Project = {
  id: UUID
  title: string
  description: string | null
  hero_image_url: string | null
  created_at: string
}

export type HeroImage = {
  id: UUID
  url: string
  alt_text: string | null
  sort_order: number | null
  created_at: string
}

export type Worker = {
  id: UUID
  first_name: string
  last_name: string | null
  email: string
  company: string | null
  trade: string | null
  mobile: string | null
  position: string | null
  allergies: string | null
  white_card: boolean
  other_license: boolean
  other_license_details: string | null
  emergency_name: string | null
  emergency_phone: string | null
  emergency_relationship: string | null
  // Site Rules Safety Checkboxes
  no_alcohol_drugs: boolean
  electrical_equipment_responsibility: boolean
  hazardous_substances_understanding: boolean
  use_ppe_when_necessary: boolean
  high_risk_work_meeting_understanding: boolean
  appropriate_signage_display: boolean
  no_unauthorized_visitors_understanding: boolean
  housekeeping_responsibility: boolean
  // Employer Safety Requirements
  employer_provided_training: boolean
  employer_provided_swms: boolean
  discussed_swms_with_employer: boolean
  pre_start_meeting_understanding: boolean
  // Safety Documentation
  read_safety_booklet: boolean
  understand_site_management_plan: boolean
  agree_safety: boolean
  agree_terms: boolean
  induction_completed: boolean
  induction_completed_at: string | null
  created_at: string
}

export type Certification = {
  id: UUID
  worker_id: UUID
  type: string
  number: string | null
  expiry_date: string | null
  file_url: string | null
  created_at: string
}

export type SiteAttendance = {
  id: UUID
  worker_id: UUID
  site_id: string | null
  lat: number | null
  lng: number | null
  checked_in_at: string
}

export type FAQ = {
  id: UUID
  question: string
  answer: string
  updated_at: string
}

export type ContactFormSubmission = {
  id: UUID
  name: string
  email: string
  message: string
  submitted_at: string
}

export type User = {
  id: UUID
  full_name: string | null
  avatar_url: string | null
  created_at: string
}
