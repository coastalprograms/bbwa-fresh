'use client'

import { SwmsDashboard } from '@/components/admin/SwmsDashboard'
import { useSwmsDashboard } from '@/hooks/useSwmsDashboard'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, AlertCircle } from 'lucide-react'
// Note: Using console.log instead of toast for now - toast can be added later if needed

interface SwmsDashboardWrapperProps {
  jobSiteId?: string
}

export function SwmsDashboardWrapper({ jobSiteId }: SwmsDashboardWrapperProps) {
  const { 
    metrics, 
    jobStatuses, 
    isLoading, 
    error, 
    refreshData 
  } = useSwmsDashboard({ 
    jobSiteId,
    autoRefresh: true,
    refreshInterval: 30000 
  })

  const handleExportCompliance = async (jobSiteIds: string[]) => {
    try {
      const response = await fetch('/api/admin/compliance/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_site_ids: jobSiteIds,
          format: 'pdf',
          include_audit_trail: true
        })
      })

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success && result.download_url) {
        // Open download in new tab
        window.open(result.download_url, '_blank')
        alert('Compliance report generated successfully!')
      } else {
        throw new Error(result.error || 'Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleSendReminder = (jobId: string) => {
    // Placeholder for reminder functionality  
    // Will be implemented in Task 5
    alert('Reminder functionality will be available soon')
    console.log('Send reminder for job:', jobId)
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error loading SWMS dashboard</h3>
          </div>
          <p className="text-sm text-red-600 mt-2">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading || !metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading SWMS dashboard...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <SwmsDashboard
      jobSiteId={jobSiteId}
      metrics={metrics}
      jobStatuses={jobStatuses}
      onExportCompliance={handleExportCompliance}
      onSendReminder={handleSendReminder}
      onRefreshData={refreshData}
      isLoading={isLoading}
    />
  )
}