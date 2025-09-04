/**
 * Type definitions for admin dashboard data
 */

export interface DashboardMetrics {
  activeWorkers: number
  recentCheckIns: number
  upcomingExpirations: number
  // SWMS metrics for Story 1.7
  activeSwmsJobs?: number
  pendingSubmissions?: number
  overdueSubmissions?: number
  complianceRate?: number
  activeCampaigns?: number
}

export interface RecentCheckIn {
  id: string
  checked_in_at: string
  worker: {
    email: string
    first_name: string
    last_name: string | null
  } | null
  job_site: {
    name: string
  } | null
}

export interface UpcomingExpiration {
  id: string
  expiry_date: string
  worker: {
    email: string
    first_name: string
    last_name: string | null
  } | null
  certification_type: string | null
}

export interface KpiCardProps {
  title: string
  value: number
  subtitle?: string
  href?: string
}

// SWMS Dashboard Types for Story 1.7
export interface SwmsDashboardMetrics extends DashboardMetrics {
  activeSwmsJobs: number
  pendingSubmissions: number
  overdueSubmissions: number
  complianceRate: number
  activeCampaigns: number
}

export interface SwmsJobStatus {
  id: string
  job_site: {
    name: string
    id: string
  }
  contractor_count: number
  submitted_count: number
  pending_count: number
  overdue_count: number
  completion_percentage: number
  last_activity: string
  campaign_status: 'active' | 'completed' | 'pending'
}

export interface ComplianceExportData {
  job_site_id: string
  job_site_name: string
  contractors: {
    id: string
    company_name: string
    abn: string
    submission_date: string | null
    document_url: string | null
    status: 'submitted' | 'pending' | 'overdue'
  }[]
  export_date: string
  compliance_rate: number
  audit_trail: {
    action: string
    timestamp: string
    user: string
    details: string
  }[]
}