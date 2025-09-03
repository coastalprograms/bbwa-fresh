/**
 * Type definitions for admin dashboard data
 */

export interface DashboardMetrics {
  activeWorkers: number
  recentCheckIns: number
  upcomingExpirations: number
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