'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Send,
  Download,
  RefreshCw
} from 'lucide-react'
import type { SwmsJobStatus, SwmsDashboardMetrics } from '@/types/dashboard'
import { SwmsProgressIndicator } from '@/components/swms/SwmsProgressIndicator'

interface SwmsDashboardProps {
  jobSiteId?: string
  metrics: SwmsDashboardMetrics
  jobStatuses: SwmsJobStatus[]
  onExportCompliance?: (jobSiteIds: string[]) => void
  onSendReminder?: (jobId: string) => void
  onRefreshData?: () => void
  isLoading?: boolean
}

export function SwmsDashboard({ 
  jobSiteId,
  metrics, 
  jobStatuses,
  onExportCompliance,
  onSendReminder,
  onRefreshData,
  isLoading = false
}: SwmsDashboardProps) {
  
  const handleExportCompliance = () => {
    if (onExportCompliance) {
      const jobSiteIds = jobSiteId ? [jobSiteId] : jobStatuses.map(j => j.job_site.id)
      onExportCompliance(jobSiteIds)
    }
  }

  return (
    <div className="space-y-6">
      {/* SWMS Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">SWMS Jobs</p>
                <p className="text-2xl font-bold">{metrics.activeSwmsJobs}</p>
                <p className="text-xs text-muted-foreground">Active compliance tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{metrics.pendingSubmissions}</p>
                <p className="text-xs text-muted-foreground">Awaiting submission</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{metrics.overdueSubmissions}</p>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">{Math.round(metrics.complianceRate)}%</p>
                <p className="text-xs text-muted-foreground">Overall completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{metrics.activeCampaigns}</p>
                <p className="text-xs text-muted-foreground">Email reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Compliance Management</h3>
              <p className="text-sm text-muted-foreground">Quick actions for SWMS compliance</p>
            </div>
            <div className="flex gap-2">
              {onRefreshData && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRefreshData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleExportCompliance}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Compliance Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SWMS Job Status Overview */}
      {jobStatuses.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">SWMS Job Status</h3>
              <p className="text-sm text-muted-foreground">
                {jobSiteId ? 'Current job site progress' : 'All active SWMS jobs'}
              </p>
            </div>
            <div className="space-y-4">
              {jobStatuses.map((jobStatus) => (
                <div key={jobStatus.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{jobStatus.job_site.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {jobStatus.contractor_count} contractors • Last activity: {
                          new Date(jobStatus.last_activity).toLocaleDateString('en-AU')
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        jobStatus.campaign_status === 'active' ? 'default' :
                        jobStatus.campaign_status === 'completed' ? 'secondary' :
                        'outline'
                      }>
                        {jobStatus.campaign_status}
                      </Badge>
                      {onSendReminder && jobStatus.pending_count > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onSendReminder(jobStatus.id)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <SwmsProgressIndicator
                    total={jobStatus.contractor_count}
                    submitted={jobStatus.submitted_count}
                    pending={jobStatus.pending_count}
                    overdue={jobStatus.overdue_count}
                    completionPercentage={jobStatus.completion_percentage}
                  />
                  
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{jobStatus.submitted_count} submitted</span>
                    <span>{jobStatus.pending_count} pending</span>
                    <span>{jobStatus.overdue_count} overdue</span>
                    <span className="font-medium">{Math.round(jobStatus.completion_percentage)}% complete</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}