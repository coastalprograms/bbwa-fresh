'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import type { SwmsDashboardMetrics, SwmsJobStatus } from '@/types/dashboard'

interface UseSwmsDashboardOptions {
  jobSiteId?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseSwmsDashboardReturn {
  metrics: SwmsDashboardMetrics | null
  jobStatuses: SwmsJobStatus[]
  isLoading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

export function useSwmsDashboard(options: UseSwmsDashboardOptions = {}): UseSwmsDashboardReturn {
  const { jobSiteId, autoRefresh = false, refreshInterval = 30000 } = options
  
  const [metrics, setMetrics] = useState<SwmsDashboardMetrics | null>(null)
  const [jobStatuses, setJobStatuses] = useState<SwmsJobStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = supabaseBrowser

  const fetchSwmsData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch SWMS jobs
      let swmsJobsQuery = supabase
        .from('swms_jobs')
        .select('id, status, job_site_id, name, created_at')
      
      if (jobSiteId) {
        swmsJobsQuery = swmsJobsQuery.eq('job_site_id', jobSiteId)
      }

      const { data: swmsJobs, error: swmsJobsError } = await swmsJobsQuery

      if (swmsJobsError) throw swmsJobsError

      // Fetch submissions with related data
      let submissionsQuery = supabase
        .from('swms_submissions')
        .select(`
          id, 
          status, 
          created_at, 
          swms_job_id,
          contractor_id,
          swms_jobs!inner(
            id,
            job_site_id,
            name
          ),
          contractors(name)
        `)
      
      if (jobSiteId) {
        submissionsQuery = submissionsQuery.eq('swms_jobs.job_site_id', jobSiteId)
      }

      const { data: submissions, error: submissionsError } = await submissionsQuery

      if (submissionsError) throw submissionsError

      // Fetch job sites for job status data
      const jobSiteIds = jobSiteId 
        ? [jobSiteId] 
        : [...new Set(swmsJobs?.map(j => j.job_site_id) || [])]

      const { data: jobSites, error: jobSitesError } = await supabase
        .from('job_sites')
        .select('id, name')
        .in('id', jobSiteIds)

      if (jobSitesError) throw jobSitesError

      // Calculate metrics
      const activeSwmsJobs = swmsJobs?.filter(j => j.status === 'active').length || 0
      const totalSubmissions = submissions?.length || 0
      const pendingSubmissions = submissions?.filter(s => 
        s.status === 'submitted' || s.status === 'under_review'
      ).length || 0

      // Calculate overdue submissions (older than 7 days without approval)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const overdueSubmissions = submissions?.filter(s => 
        (s.status === 'submitted' || s.status === 'under_review') &&
        new Date(s.created_at) < sevenDaysAgo
      ).length || 0

      const approvedSubmissions = submissions?.filter(s => s.status === 'approved').length || 0
      const complianceRate = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0

      // Calculate job statuses
      const jobStatusesData: SwmsJobStatus[] = jobSites?.map((site: any) => {
        const siteJobs = swmsJobs?.filter((j: any) => j.job_site_id === site.id) || []
        const siteSubmissions = submissions?.filter((s: any) => 
          siteJobs.some((job: any) => job.id === s.swms_job_id)
        ) || []

        // Count unique contractors for this site
        const contractorIds = new Set(siteSubmissions.map((s: any) => s.contractor_id).filter(Boolean))
        const contractor_count = contractorIds.size

        const submitted_count = siteSubmissions.filter((s: any) => s.status === 'approved').length
        const pending_count = siteSubmissions.filter((s: any) => 
          s.status === 'submitted' || s.status === 'under_review'
        ).length
        const overdue_count = siteSubmissions.filter((s: any) => 
          (s.status === 'submitted' || s.status === 'under_review') &&
          new Date(s.created_at) < sevenDaysAgo
        ).length

        const completion_percentage = contractor_count > 0 
          ? (submitted_count / contractor_count) * 100 
          : 0

        // Get most recent activity
        const mostRecentSubmission = siteSubmissions
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        
        const last_activity = mostRecentSubmission?.created_at || new Date().toISOString()

        // Determine campaign status (placeholder - will be implemented with Story 1.6)
        const campaign_status: 'active' | 'completed' | 'pending' = 
          completion_percentage >= 90 ? 'completed' :
          pending_count > 0 ? 'active' : 'pending'

        return {
          id: siteJobs[0]?.id || site.id,
          job_site: {
            name: site.name,
            id: site.id
          },
          contractor_count,
          submitted_count,
          pending_count,
          overdue_count,
          completion_percentage,
          last_activity,
          campaign_status
        }
      }) || []

      // Set calculated data
      setMetrics({
        activeWorkers: 0, // Placeholder - from original dashboard
        recentCheckIns: 0, // Placeholder - from original dashboard  
        upcomingExpirations: 0, // Placeholder - from original dashboard
        activeSwmsJobs,
        pendingSubmissions,
        overdueSubmissions,
        complianceRate,
        activeCampaigns: 0 // Placeholder - will be implemented with Story 1.6
      })
      
      setJobStatuses(jobStatusesData)

    } catch (err) {
      console.error('Error fetching SWMS dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }, [jobSiteId])

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('swms-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'swms_submissions'
        },
        () => {
          // Refresh data when submissions change
          fetchSwmsData()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'swms_jobs'
        },
        () => {
          // Refresh data when jobs change
          fetchSwmsData()
        }
      )
      .subscribe()

    // Initial data fetch
    fetchSwmsData()

    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout | undefined
    if (autoRefresh) {
      interval = setInterval(fetchSwmsData, refreshInterval)
    }

    return () => {
      supabase.removeChannel(channel)
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [fetchSwmsData, autoRefresh, refreshInterval])

  return {
    metrics,
    jobStatuses,
    isLoading,
    error,
    refreshData: fetchSwmsData
  }
}