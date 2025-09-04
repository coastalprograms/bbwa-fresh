'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  FileCheck, 
  FileX, 
  Mail, 
  User, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  Filter
} from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/client'

interface TimelineEvent {
  id: string
  type: 'submission' | 'email' | 'audit' | 'status_change' | 'reminder'
  title: string
  description: string
  timestamp: string
  contractor?: {
    id: string
    name: string
  }
  status?: 'success' | 'pending' | 'failed' | 'warning'
  metadata?: any
}

interface SwmsComplianceTimelineProps {
  jobSiteId?: string
  contractorId?: string
  swmsJobId?: string
}

export function SwmsComplianceTimeline({ 
  jobSiteId, 
  contractorId, 
  swmsJobId 
}: SwmsComplianceTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'submissions' | 'emails' | 'audits'>('all')

  const fetchTimelineEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const supabase = supabaseBrowser
      const events: TimelineEvent[] = []

      // Fetch SWMS submissions
      let submissionsQuery = supabase
        .from('swms_submissions')
        .select(`
          id,
          status,
          submitted_at,
          reviewed_at,
          notes,
          contractor_id,
          swms_job_id,
          contractors(name),
          swms_jobs(name)
        `)
        .order('submitted_at', { ascending: false })

      if (jobSiteId) {
        submissionsQuery = submissionsQuery.eq('swms_jobs.job_site_id', jobSiteId)
      }
      if (contractorId) {
        submissionsQuery = submissionsQuery.eq('contractor_id', contractorId)
      }
      if (swmsJobId) {
        submissionsQuery = submissionsQuery.eq('swms_job_id', swmsJobId)
      }

      const { data: submissions, error: submissionsError } = await submissionsQuery

      if (!submissionsError && submissions) {
        submissions.forEach((submission: any) => {
          // Submission event
          events.push({
            id: `submission-${submission.id}`,
            type: 'submission',
            title: 'SWMS Document Submitted',
            description: `${submission.contractors?.name || 'Unknown contractor'} submitted SWMS for ${submission.swms_jobs?.name || 'Unknown job'}`,
            timestamp: submission.submitted_at,
            contractor: submission.contractors ? {
              id: submission.contractor_id,
              name: submission.contractors.name
            } : undefined,
            status: submission.status === 'approved' ? 'success' : 
                   submission.status === 'rejected' ? 'failed' : 'pending',
            metadata: { submission_id: submission.id, status: submission.status }
          })

          // Review event if reviewed
          if (submission.reviewed_at) {
            events.push({
              id: `review-${submission.id}`,
              type: 'status_change',
              title: `SWMS ${submission.status === 'approved' ? 'Approved' : 'Reviewed'}`,
              description: submission.notes || `SWMS submission ${submission.status}`,
              timestamp: submission.reviewed_at,
              contractor: submission.contractors ? {
                id: submission.contractor_id,
                name: submission.contractors.name
              } : undefined,
              status: submission.status === 'approved' ? 'success' : 
                     submission.status === 'rejected' ? 'failed' : 'warning',
              metadata: { submission_id: submission.id, review_status: submission.status }
            })
          }
        })
      }

      // Fetch audit log events
      let auditQuery = supabase
        .from('swms_audit_log')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(50)

      if (swmsJobId) {
        auditQuery = auditQuery.eq('record_id', swmsJobId)
      }

      const { data: auditLogs, error: auditError } = await auditQuery

      if (!auditError && auditLogs) {
        auditLogs.forEach((audit: any) => {
          let title = 'System Action'
          let description = `${audit.action_type} on ${audit.table_name}`
          
          switch (audit.action_type) {
            case 'insert':
              title = 'Record Created'
              description = `New ${audit.table_name.replace('_', ' ')} created`
              break
            case 'update':
              title = 'Record Updated' 
              description = `${audit.table_name.replace('_', ' ')} updated`
              break
            case 'status_update':
              title = 'Status Changed'
              description = `Status updated for ${audit.table_name.replace('_', ' ')}`
              break
          }

          events.push({
            id: `audit-${audit.id}`,
            type: 'audit',
            title,
            description,
            timestamp: audit.changed_at,
            status: 'success',
            metadata: { 
              table: audit.table_name, 
              action: audit.action_type,
              changes: audit.new_values 
            }
          })
        })
      }

      // Fetch notification audits for email events
      const { data: notifications, error: notificationError } = await supabase
        .from('notification_audits')
        .select('*')
        .eq('kind', 'swms_email_automation')
        .order('created_at', { ascending: false })
        .limit(20)

      if (!notificationError && notifications) {
        notifications.forEach((notification: any) => {
          const payload = notification.payload || {}
          events.push({
            id: `email-${notification.id}`,
            type: 'email',
            title: 'Email Campaign Sent',
            description: `${payload.campaign_type || 'Email'} sent to ${payload.emails_sent || 0} contractors`,
            timestamp: notification.created_at,
            status: notification.result === 'success' ? 'success' : 'failed',
            metadata: payload
          })
        })
      }

      // Sort all events by timestamp (most recent first)
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setEvents(events)

    } catch (err) {
      console.error('Error fetching timeline events:', err)
      setError(err instanceof Error ? err.message : 'Failed to load timeline')
    } finally {
      setIsLoading(false)
    }
  }, [jobSiteId, contractorId, swmsJobId])

  useEffect(() => {
    fetchTimelineEvents()
  }, [fetchTimelineEvents])

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true
    if (filter === 'submissions') return event.type === 'submission' || event.type === 'status_change'
    if (filter === 'emails') return event.type === 'email' || event.type === 'reminder'
    if (filter === 'audits') return event.type === 'audit'
    return true
  })

  const getEventIcon = (event: TimelineEvent) => {
    switch (event.type) {
      case 'submission':
        return event.status === 'success' ? FileCheck : 
               event.status === 'failed' ? FileX : Clock
      case 'email':
      case 'reminder':
        return Mail
      case 'status_change':
        return event.status === 'success' ? CheckCircle : 
               event.status === 'failed' ? FileX : AlertCircle
      case 'audit':
        return User
      default:
        return Clock
    }
  }

  const getEventColor = (event: TimelineEvent) => {
    switch (event.status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'pending':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      default:
        return null
    }
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return timestamp
    }
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error loading timeline</h3>
          </div>
          <p className="text-sm text-red-600 mt-2">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Compliance Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex gap-1">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'submissions' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('submissions')}
              >
                Submissions
              </Button>
              <Button
                variant={filter === 'emails' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('emails')}
              >
                Emails
              </Button>
              <Button
                variant={filter === 'audits' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('audits')}
              >
                Audits
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading timeline...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No timeline events found</p>
            <p className="text-sm text-gray-400 mt-1">
              Events will appear as contractors interact with SWMS submissions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => {
              const Icon = getEventIcon(event)
              const isLast = index === filteredEvents.length - 1
              
              return (
                <div key={event.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                  )}
                  
                  {/* Event icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getEventColor(event)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 min-w-0 pb-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {event.title}
                          </h4>
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {event.description}
                        </p>
                        {event.contractor && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <User className="h-3 w-3" />
                            {event.contractor.name}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {filteredEvents.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Showing {filteredEvents.length} events</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchTimelineEvents}
                className="text-blue-600 hover:text-blue-700"
              >
                <Clock className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}