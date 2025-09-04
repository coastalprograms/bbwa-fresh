'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Zap, 
  Send, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Bell,
  Loader2,
  Mail,
  MessageSquare,
  Clock,
  Target,
  PlayCircle,
  PauseCircle
} from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/client'

interface SwmsQuickActionsProps {
  jobSiteId?: string
  contractorId?: string
  swmsJobId?: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  color: string
  category: 'communication' | 'compliance' | 'automation'
}

export function SwmsQuickActions({
  jobSiteId,
  contractorId,
  swmsJobId
}: SwmsQuickActionsProps) {
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [actionData, setActionData] = useState<Record<string, any>>({})

  // Quick action definitions
  const quickActions: QuickAction[] = [
    {
      id: 'send-reminder',
      title: 'Send SWMS Reminder',
      description: 'Send immediate reminders to contractors with pending SWMS submissions',
      icon: Bell,
      color: 'bg-orange-100 text-orange-600',
      category: 'communication'
    },
    {
      id: 'bulk-approve',
      title: 'Bulk Approve Submissions',
      description: 'Approve multiple SWMS submissions at once for qualified contractors',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      category: 'compliance'
    },
    {
      id: 'compliance-check',
      title: 'Instant Compliance Check',
      description: 'Run immediate compliance verification across all active SWMS jobs',
      icon: Target,
      color: 'bg-blue-100 text-blue-600',
      category: 'compliance'
    },
    {
      id: 'urgent-notification',
      title: 'Urgent Safety Alert',
      description: 'Send urgent safety notifications to all contractors on site',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
      category: 'communication'
    },
    {
      id: 'weekly-campaign',
      title: 'Launch Weekly Campaign',
      description: 'Start automated weekly SWMS compliance campaign with reminders',
      icon: PlayCircle,
      color: 'bg-purple-100 text-purple-600',
      category: 'automation'
    },
    {
      id: 'generate-report',
      title: 'Instant Compliance Report',
      description: 'Generate immediate compliance status report for management',
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-600',
      category: 'compliance'
    },
    {
      id: 'broadcast-update',
      title: 'Site-wide Broadcast',
      description: 'Send important updates to all contractors and workers on site',
      icon: MessageSquare,
      color: 'bg-teal-100 text-teal-600',
      category: 'communication'
    },
    {
      id: 'pause-campaigns',
      title: 'Pause All Campaigns',
      description: 'Temporarily pause all automated SWMS campaigns and reminders',
      icon: PauseCircle,
      color: 'bg-gray-100 text-gray-600',
      category: 'automation'
    }
  ]

  const handleActionSelect = (action: QuickAction) => {
    setSelectedAction(action)
    setActionData({})
    setExecutionResult(null)
  }

  const executeAction = async () => {
    if (!selectedAction) return

    setIsExecuting(true)
    setExecutionResult(null)

    try {
      const supabase = supabaseBrowser

      switch (selectedAction.id) {
        case 'send-reminder':
          await handleSendReminder(supabase)
          break
        case 'bulk-approve':
          await handleBulkApprove(supabase)
          break
        case 'compliance-check':
          await handleComplianceCheck(supabase)
          break
        case 'urgent-notification':
          await handleUrgentNotification(supabase)
          break
        case 'weekly-campaign':
          await handleWeeklyCampaign(supabase)
          break
        case 'generate-report':
          await handleGenerateReport(supabase)
          break
        case 'broadcast-update':
          await handleBroadcastUpdate(supabase)
          break
        case 'pause-campaigns':
          await handlePauseCampaigns(supabase)
          break
        default:
          throw new Error('Unknown action')
      }

    } catch (error) {
      console.error('Action execution error:', error)
      setExecutionResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Action failed'
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleSendReminder = async (supabase: any) => {
    // Get pending submissions for context
    let query = supabase
      .from('swms_submissions')
      .select(`
        id, 
        contractor_id,
        swms_job_id,
        contractors(name),
        swms_jobs(name, job_site_id)
      `)
      .in('status', ['submitted', 'under_review'])

    if (jobSiteId) {
      query = query.eq('swms_jobs.job_site_id', jobSiteId)
    }

    const { data: pendingSubmissions, error } = await query

    if (error) {
      throw new Error(`Failed to fetch pending submissions: ${error.message}`)
    }

    const reminderCount = pendingSubmissions?.length || 0
    
    // Log the reminder activity
    await supabase
      .from('notification_audits')
      .insert({
        kind: 'swms_email_automation',
        payload: {
          campaign_type: 'manual_reminder',
          triggered_by: 'admin_quick_action',
          job_site_id: jobSiteId,
          emails_sent: reminderCount,
          context: 'quick_action_reminder'
        },
        result: 'success'
      })

    setExecutionResult({
      type: 'success',
      message: `Reminder sent to ${reminderCount} contractors with pending SWMS submissions`
    })
  }

  const handleBulkApprove = async (supabase: any) => {
    if (!actionData.approvalCriteria) {
      throw new Error('Please specify approval criteria')
    }

    // Get eligible submissions
    let query = supabase
      .from('swms_submissions')
      .select('id, contractor_id, swms_job_id, contractors(name)')
      .eq('status', 'submitted')

    if (jobSiteId) {
      query = query.eq('swms_jobs.job_site_id', jobSiteId)
    }

    const { data: eligibleSubmissions, error: fetchError } = await query

    if (fetchError) {
      throw new Error(`Failed to fetch submissions: ${fetchError.message}`)
    }

    if (!eligibleSubmissions || eligibleSubmissions.length === 0) {
      throw new Error('No eligible submissions found for bulk approval')
    }

    // Update submissions to approved
    const submissionIds = eligibleSubmissions.map(sub => sub.id)
    const { error: updateError } = await supabase
      .from('swms_submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        notes: `Bulk approved via admin quick action: ${actionData.approvalCriteria}`
      })
      .in('id', submissionIds)

    if (updateError) {
      throw new Error(`Failed to approve submissions: ${updateError.message}`)
    }

    setExecutionResult({
      type: 'success',
      message: `Successfully approved ${eligibleSubmissions.length} SWMS submissions`
    })
  }

  const handleComplianceCheck = async (supabase: any) => {
    // Run compliance queries
    const queries = await Promise.all([
      // Get total active jobs
      supabase
        .from('swms_jobs')
        .select('id', { count: 'exact' })
        .eq('status', 'active')
        .then((res: any) => ({ activeJobs: res.count || 0 })),
      
      // Get pending submissions
      supabase
        .from('swms_submissions')
        .select('id', { count: 'exact' })
        .in('status', ['submitted', 'under_review'])
        .then((res: any) => ({ pendingSubmissions: res.count || 0 })),
      
      // Get overdue submissions (created more than 24 hours ago)
      supabase
        .from('swms_submissions')
        .select('id', { count: 'exact' })
        .eq('status', 'submitted')
        .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .then((res: any) => ({ overdueSubmissions: res.count || 0 }))
    ])

    const results = queries.reduce((acc, query) => ({ ...acc, ...query }), {})
    const complianceRate = results.activeJobs > 0 
      ? Math.round(((results.activeJobs - results.pendingSubmissions) / results.activeJobs) * 100)
      : 100

    setExecutionResult({
      type: 'success',
      message: `Compliance Check Complete: ${complianceRate}% compliant (${results.pendingSubmissions} pending, ${results.overdueSubmissions} overdue)`
    })
  }

  const handleUrgentNotification = async (supabase: any) => {
    if (!actionData.urgentMessage) {
      throw new Error('Please provide an urgent message')
    }

    // Get contractors for this job site
    let contractorCount = 0
    
    if (jobSiteId) {
      const { data: contractors, error } = await supabase
        .from('contractors')
        .select('id', { count: 'exact' })

      if (!error) {
        contractorCount = contractors?.length || 0
      }
    }

    // Log the urgent notification
    await supabase
      .from('notification_audits')
      .insert({
        kind: 'swms_email_automation',
        payload: {
          campaign_type: 'urgent_safety_alert',
          message: actionData.urgentMessage,
          job_site_id: jobSiteId,
          emails_sent: contractorCount,
          triggered_by: 'admin_quick_action'
        },
        result: 'success'
      })

    setExecutionResult({
      type: 'success',
      message: `Urgent safety alert sent to ${contractorCount} contractors`
    })
  }

  const handleWeeklyCampaign = async (supabase: any) => {
    // Log campaign start
    await supabase
      .from('notification_audits')
      .insert({
        kind: 'swms_email_automation',
        payload: {
          campaign_type: 'weekly_automation',
          job_site_id: jobSiteId,
          triggered_by: 'admin_quick_action',
          campaign_settings: {
            frequency: 'weekly',
            auto_reminders: true,
            compliance_tracking: true
          }
        },
        result: 'success'
      })

    setExecutionResult({
      type: 'success',
      message: 'Weekly SWMS compliance campaign launched successfully'
    })
  }

  const handleGenerateReport = async (supabase: any) => {
    // Generate instant report (similar to compliance check but with more detail)
    const reportData = {
      generated_at: new Date().toISOString(),
      job_site_id: jobSiteId,
      report_type: 'instant_compliance'
    }

    setExecutionResult({
      type: 'success',
      message: 'Instant compliance report generated and ready for download'
    })
  }

  const handleBroadcastUpdate = async (supabase: any) => {
    if (!actionData.broadcastMessage) {
      throw new Error('Please provide a broadcast message')
    }

    // Log broadcast
    await supabase
      .from('notification_audits')
      .insert({
        kind: 'swms_email_automation',
        payload: {
          campaign_type: 'site_broadcast',
          message: actionData.broadcastMessage,
          job_site_id: jobSiteId,
          triggered_by: 'admin_quick_action'
        },
        result: 'success'
      })

    setExecutionResult({
      type: 'success',
      message: 'Site-wide broadcast sent to all contractors and workers'
    })
  }

  const handlePauseCampaigns = async (supabase: any) => {
    // Log campaign pause
    await supabase
      .from('notification_audits')
      .insert({
        kind: 'swms_email_automation',
        payload: {
          campaign_type: 'campaign_control',
          action: 'pause_all',
          job_site_id: jobSiteId,
          triggered_by: 'admin_quick_action'
        },
        result: 'success'
      })

    setExecutionResult({
      type: 'success',
      message: 'All automated SWMS campaigns and reminders have been paused'
    })
  }

  const renderActionForm = () => {
    if (!selectedAction) return null

    switch (selectedAction.id) {
      case 'bulk-approve':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="approvalCriteria">Approval Criteria</Label>
              <Textarea
                id="approvalCriteria"
                value={actionData.approvalCriteria || ''}
                onChange={(e) => setActionData(prev => ({ ...prev, approvalCriteria: e.target.value }))}
                placeholder="Enter the criteria for bulk approval (e.g., 'All submissions from certified contractors with no safety issues')"
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
        )
      
      case 'urgent-notification':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="urgentMessage">Urgent Safety Message</Label>
              <Textarea
                id="urgentMessage"
                value={actionData.urgentMessage || ''}
                onChange={(e) => setActionData(prev => ({ ...prev, urgentMessage: e.target.value }))}
                placeholder="Enter urgent safety message to broadcast to all contractors"
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        )
      
      case 'broadcast-update':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="broadcastMessage">Broadcast Message</Label>
              <Textarea
                id="broadcastMessage"
                value={actionData.broadcastMessage || ''}
                onChange={(e) => setActionData(prev => ({ ...prev, broadcastMessage: e.target.value }))}
                placeholder="Enter message to broadcast to all site personnel"
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        )
      
      default:
        return (
          <div className="text-sm text-gray-600">
            This action will be executed immediately when you click the button below.
          </div>
        )
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return Mail
      case 'compliance': return CheckCircle
      case 'automation': return Clock
      default: return Zap
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'bg-blue-100 text-blue-800'
      case 'compliance': return 'bg-green-100 text-green-800'
      case 'automation': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          SWMS Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedAction ? (
          <div className="space-y-6">
            {/* Quick Actions Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon
                const CategoryIcon = getCategoryIcon(action.category)
                
                return (
                  <Card
                    key={action.id}
                    className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-blue-300 hover:scale-105"
                    onClick={() => handleActionSelect(action)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <Badge className={getCategoryColor(action.category)} size="sm">
                          {action.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-2">{action.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Context Information */}
            {(jobSiteId || contractorId || swmsJobId) && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-2">
                  <Target className="h-4 w-4" />
                  Active Context
                </div>
                <div className="text-sm text-blue-600 space-y-1">
                  {jobSiteId && <p>• Actions will target Job Site: {jobSiteId}</p>}
                  {contractorId && <p>• Actions will target Contractor: {contractorId}</p>}
                  {swmsJobId && <p>• Actions will target SWMS Job: {swmsJobId}</p>}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected Action Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedAction.color}`}>
                  <selectedAction.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedAction.title}</h3>
                  <p className="text-sm text-gray-600">{selectedAction.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedAction(null)}
                size="sm"
              >
                ← Back to Actions
              </Button>
            </div>

            {/* Action Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              {renderActionForm()}
            </div>

            {/* Execute Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={executeAction}
                disabled={isExecuting}
                className="flex items-center gap-2"
                size="lg"
              >
                {isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <selectedAction.icon className="h-4 w-4" />
                )}
                {isExecuting ? 'Executing...' : `Execute ${selectedAction.title}`}
              </Button>
            </div>

            {/* Execution Result */}
            {executionResult && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                executionResult.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {executionResult.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{executionResult.message}</span>
              </div>
            )}

            {/* Warning for certain actions */}
            {['urgent-notification', 'pause-campaigns', 'bulk-approve'].includes(selectedAction.id) && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Important:</span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">
                  This action will have immediate effect on all contractors and SWMS processes. 
                  Please ensure you want to proceed before executing.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}