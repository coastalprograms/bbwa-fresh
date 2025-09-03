'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  TrendingUp,
  Activity
} from 'lucide-react'
import { SwmsStatusIndicator, SwmsCompletionBadge } from './SwmsStatusIndicator'

interface SwmsMetricsCardProps {
  jobSiteId: string
  metrics?: {
    total_jobs: number
    active_jobs: number
    completed_jobs: number
    total_submissions: number
    approved_submissions: number
    pending_submissions: number
    rejected_submissions: number
    completion_rate: number
    average_completion_time?: number // in days
  }
  className?: string
}

export function SwmsMetricsCard({ jobSiteId, metrics, className }: SwmsMetricsCardProps) {
  if (!metrics || metrics.total_jobs === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No SWMS Data</h3>
          <p className="text-sm text-gray-500 text-center">
            Create SWMS jobs to start tracking safety compliance metrics
          </p>
        </CardContent>
      </Card>
    )
  }

  const completionRate = metrics.completion_rate || 0
  const jobsCompletionRate = metrics.total_jobs > 0 
    ? (metrics.completed_jobs / metrics.total_jobs) * 100 
    : 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          SWMS Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Completion</span>
            <SwmsCompletionBadge completionRate={completionRate} size="sm" />
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {metrics.approved_submissions} of {metrics.total_submissions} submissions approved
          </p>
        </div>

        {/* Job Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Job Progress</span>
            <Badge variant="outline" className="text-xs">
              {metrics.completed_jobs}/{metrics.total_jobs} completed
            </Badge>
          </div>
          <Progress value={jobsCompletionRate} className="h-2" />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{metrics.total_jobs}</p>
            <p className="text-xs text-gray-600">Total Jobs</p>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{metrics.approved_submissions}</p>
            <p className="text-xs text-gray-600">Approved</p>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{metrics.pending_submissions}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{metrics.rejected_submissions}</p>
            <p className="text-xs text-gray-600">Rejected</p>
          </div>
        </div>

        {/* Active Jobs Status */}
        {metrics.active_jobs > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Active Jobs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {metrics.active_jobs} job{metrics.active_jobs !== 1 ? 's' : ''} currently active
              </span>
              <Badge variant="default" className="bg-blue-600">
                Active
              </Badge>
            </div>
          </div>
        )}

        {/* Performance Indicator */}
        {completionRate >= 80 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">Excellent Performance</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              High completion rate indicates strong safety compliance
            </p>
          </div>
        )}
        
        {completionRate < 50 && completionRate > 0 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-900">Needs Attention</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Low completion rate - consider following up on outstanding submissions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}