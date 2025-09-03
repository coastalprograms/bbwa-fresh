/**
 * TypeScript types for SWMS (Safe Work Method Statements) system
 * Story 1.3: SWMS Data Structure Setup
 */

import type { UUID } from './supabase'

// Job Site Types
export type JobSite = {
  id: UUID
  name: string
  address: string
  lat?: number | null
  lng?: number | null
  status: 'active' | 'inactive' | 'completed'
  check_in_radius_meters: number
  created_at: string
  updated_at: string
}

export type JobSiteCreateData = Omit<JobSite, 'id' | 'created_at' | 'updated_at'>
export type JobSiteUpdateData = Partial<JobSiteCreateData>

// SWMS Job Types
export type SwmsJob = {
  id: UUID
  job_site_id: UUID
  name: string
  description?: string | null
  start_date: string
  end_date?: string | null
  status: 'planned' | 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export type SwmsJobCreateData = Omit<SwmsJob, 'id' | 'created_at' | 'updated_at'>
export type SwmsJobUpdateData = Partial<SwmsJobCreateData>

// SWMS Submission Types
export type SwmsSubmission = {
  id: UUID
  swms_job_id: UUID
  contractor_id: UUID
  document_name: string
  file_url: string
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_changes'
  submitted_at: string
  reviewed_at?: string | null
  reviewed_by?: UUID | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export type SwmsSubmissionCreateData = Omit<SwmsSubmission, 'id' | 'submitted_at' | 'reviewed_at' | 'reviewed_by' | 'created_at' | 'updated_at'>
export type SwmsSubmissionUpdateData = Partial<Pick<SwmsSubmission, 'status' | 'reviewed_by' | 'notes'>>

// Contractor type (from contractors.ts but included here for SWMS context)
export type Contractor = {
  id: UUID
  name: string
  abn?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  address?: string | null
  active: boolean
  magic_link_token?: string | null
  created_at: string
  updated_at: string
}

// Audit Log Types
export type SwmsAuditLog = {
  id: UUID
  table_name: string
  record_id: UUID
  action_type: 'insert' | 'update' | 'delete' | 'status_update'
  old_values?: Record<string, any> | null
  new_values?: Record<string, any> | null
  changed_by?: UUID | null
  changed_at: string
}

// Enhanced Types with Relations (for UI components)
export type JobSiteWithSwmsJobs = JobSite & {
  swms_jobs: SwmsJob[]
  active_jobs_count?: number
  total_submissions?: number
  completion_rate?: number
}

export type SwmsJobWithDetails = SwmsJob & {
  job_site: Pick<JobSite, 'id' | 'name' | 'address' | 'status'>
  submissions: SwmsSubmissionWithContractor[]
  submission_counts: {
    total: number
    submitted: number
    under_review: number
    approved: number
    rejected: number
    requires_changes: number
  }
}

export type SwmsSubmissionWithContractor = SwmsSubmission & {
  contractor: Pick<Contractor, 'id' | 'name' | 'abn' | 'contact_email' | 'contact_phone'>
  swms_job?: Pick<SwmsJob, 'id' | 'name' | 'description' | 'start_date' | 'end_date'>
}

export type SwmsSubmissionWithFullDetails = SwmsSubmission & {
  contractor: Pick<Contractor, 'id' | 'name' | 'abn' | 'contact_email' | 'contact_phone'>
  swms_job: SwmsJob & {
    job_site: Pick<JobSite, 'id' | 'name' | 'address'>
  }
}

// Dashboard Statistics Types
export type SwmsDashboardStats = {
  overall_stats: {
    total_jobs: number
    active_jobs: number
    average_completion_rate: number
    total_submissions: number
    approved_submissions: number
    pending_submissions: number
    rejected_submissions: number
  }
  job_details: {
    job_id: UUID
    job_name: string
    job_status: string
    job_site_name: string
    completion_rate: number
    total_submissions: number
    approved_submissions: number
    pending_submissions: number
    rejected_submissions: number
  }[]
}

export type ContractorSubmissionSummary = {
  contractor: Pick<Contractor, 'id' | 'name' | 'abn' | 'contact_email'>
  submissions: SwmsSubmissionWithFullDetails[]
  submission_summary: {
    total: number
    approved: number
    pending: number
    rejected: number
    requires_changes: number
  }
}

// Form Data Types
export type JobSiteFormData = {
  name: string
  address: string
  lat?: number
  lng?: number
  status: 'active' | 'inactive' | 'completed'
  check_in_radius_meters: number
}

export type SwmsJobFormData = {
  job_site_id: UUID
  name: string
  description?: string
  start_date: string
  end_date?: string
  status: 'planned' | 'active' | 'completed' | 'cancelled'
}

export type SwmsSubmissionFormData = {
  swms_job_id: UUID
  contractor_id: UUID
  document_name: string
  file_url: string
}

export type SwmsSubmissionReviewData = {
  status: 'under_review' | 'approved' | 'rejected' | 'requires_changes'
  reviewed_by: UUID
  notes?: string
}

// API Response Types
export type SwmsApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

export type SwmsJobWithSubmissionsResponse = SwmsApiResponse<SwmsJobWithDetails>
export type ContractorSubmissionsResponse = SwmsApiResponse<ContractorSubmissionSummary>
export type SwmsDashboardStatsResponse = SwmsApiResponse<SwmsDashboardStats>

// Function Return Types (matching database functions)
export type GetSwmsJobWithSubmissionsResult = {
  job: SwmsJobWithDetails['job_site'] & SwmsJob & {
    job_site: JobSite
  }
  submissions: SwmsSubmissionWithContractor[]
  submission_counts: SwmsJobWithDetails['submission_counts']
}

export type UpdateSwmsSubmissionStatusResult = {
  success: boolean
  error?: string
  submission?: {
    id: UUID
    status: SwmsSubmission['status']
    reviewed_at?: string | null
    reviewed_by?: UUID | null
    notes?: string | null
  }
}

// All types are already exported above with individual export statements