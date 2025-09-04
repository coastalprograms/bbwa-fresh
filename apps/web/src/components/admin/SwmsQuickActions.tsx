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
      // Prepare the API request
      const requestBody = {
        action: selectedAction.id,
        job_site_id: jobSiteId,
        contractor_id: contractorId,
        swms_job_id: swmsJobId,
        parameters: actionData
      }

      const response = await fetch('/api/admin/swms/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Action failed')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Action failed')
      }

      setExecutionResult({
        type: 'success',
        message: result.message || 'Action completed successfully'
      })

      // Store any returned data for potential follow-up actions
      if (result.data) {
        setActionData(prev => ({ ...prev, ...result.data }))
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
                        <Badge className={getCategoryColor(action.category)}>
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