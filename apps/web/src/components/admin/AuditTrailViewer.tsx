'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, DownloadIcon, FilterIcon, RefreshCcwIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuditTrailEntry {
  id: string
  table_name: string
  record_id: string
  action_type: string
  old_values?: any
  new_values?: any
  changed_by?: string
  changed_at: string
  users?: { email: string }
}

interface EmailActivity {
  activity_type: string
  activity_time: string
  campaign_id: string
  campaign_type: string
  contractor_name?: string
  email_address?: string
  delivery_status?: string
  job_name?: string
  details: any
}

interface DocumentActivity {
  id: string
  document_id: string
  accessed_by?: string
  access_type: string
  accessed_at: string
  compliance_documents?: {
    filename: string
    document_type: string
  }
  users?: { email: string }
}

interface AuditTrailViewerProps {
  jobSiteId?: string
  showFilters?: boolean
}

export function AuditTrailViewer({ jobSiteId, showFilters = true }: AuditTrailViewerProps) {
  const [auditData, setAuditData] = useState<AuditTrailEntry[]>([])
  const [emailData, setEmailData] = useState<EmailActivity[]>([])
  const [documentData, setDocumentData] = useState<DocumentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'database' | 'email' | 'documents'>('database')
  
  // Filter states
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [limit, setLimit] = useState(50)

  const fetchAuditData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (jobSiteId) params.append('job_site_id', jobSiteId)
      if (startDate) params.append('start_date', startDate.toISOString())
      if (endDate) params.append('end_date', endDate.toISOString())
      params.append('limit', limit.toString())

      const response = await fetch(`/api/admin/compliance/audit-trail?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch audit data')
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch audit data')
      }

      setAuditData(data.audit_trail || [])
      setEmailData(data.email_activity || [])
      setDocumentData(data.document_activity || [])
    } catch (err) {
      console.error('Error fetching audit data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditData()
  }, [jobSiteId, startDate, endDate, limit])

  const exportAuditTrail = async () => {
    try {
      const params = new URLSearchParams()
      if (jobSiteId) params.append('job_site_id', jobSiteId)
      if (startDate) params.append('start_date', startDate.toISOString())
      if (endDate) params.append('end_date', endDate.toISOString())
      params.append('format', 'csv')
      params.append('include_audit_trail', 'true')

      const response = await fetch(`/api/admin/compliance/export?${params}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_site_ids: jobSiteId ? [jobSiteId] : [],
          format: 'csv',
          include_audit_trail: true
        })
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const data = await response.json()
      if (data.download_url) {
        window.open(data.download_url, '_blank')
      }
    } catch (err) {
      console.error('Export error:', err)
      setError('Failed to export audit trail')
    }
  }

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'insert': return 'default'
      case 'update': return 'secondary'
      case 'delete': return 'destructive'
      case 'status_update': return 'outline'
      default: return 'secondary'
    }
  }

  const formatChanges = (oldValues: any, newValues: any) => {
    if (!oldValues && !newValues) return 'No changes recorded'
    
    const changes: string[] = []
    if (newValues && typeof newValues === 'object') {
      Object.keys(newValues).forEach(key => {
        const oldVal = oldValues?.[key]
        const newVal = newValues[key]
        if (oldVal !== newVal) {
          changes.push(`${key}: ${oldVal || 'null'} → ${newVal || 'null'}`)
        }
      })
    }
    
    return changes.length > 0 ? changes.join(', ') : 'No specific changes tracked'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCcwIcon className="h-6 w-6 animate-spin mr-2" />
            Loading audit trail...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <Button onClick={fetchAuditData} className="mt-2">
              <RefreshCcwIcon className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FilterIcon className="h-5 w-5 mr-2" />
              Audit Trail Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">Limit</label>
                <Select value={limit.toString()} onValueChange={(val) => setLimit(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 records</SelectItem>
                    <SelectItem value="50">50 records</SelectItem>
                    <SelectItem value="100">100 records</SelectItem>
                    <SelectItem value="200">200 records</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Actions</label>
                <div className="flex space-x-2">
                  <Button onClick={fetchAuditData} size="sm">
                    <RefreshCcwIcon className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                  <Button onClick={exportAuditTrail} size="sm" variant="outline">
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>
            Comprehensive audit trail of all SWMS-related activities
          </CardDescription>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'database' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('database')}
            >
              Database Changes ({auditData.length})
            </Button>
            <Button
              variant={activeTab === 'email' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('email')}
            >
              Email Activity ({emailData.length})
            </Button>
            <Button
              variant={activeTab === 'documents' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('documents')}
            >
              Document Access ({documentData.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'database' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">
                      {new Date(entry.changed_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{entry.table_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(entry.action_type)}>
                        {entry.action_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.users?.email || 'System'}
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate">
                      {formatChanges(entry.old_values, entry.new_values)}
                    </TableCell>
                  </TableRow>
                ))}
                {auditData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No audit entries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === 'email' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Job</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailData.map((activity, index) => (
                  <TableRow key={`${activity.campaign_id}-${index}`}>
                    <TableCell className="text-sm">
                      {new Date(activity.activity_time).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.activity_type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {activity.campaign_type}
                    </TableCell>
                    <TableCell className="text-sm">
                      {activity.contractor_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={activity.delivery_status === 'sent' ? 'default' : 'secondary'}>
                        {activity.delivery_status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {activity.job_name || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
                {emailData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No email activity found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {activeTab === 'documents' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentData.map((access) => (
                  <TableRow key={access.id}>
                    <TableCell className="text-sm">
                      {new Date(access.accessed_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(access.access_type)}>
                        {access.access_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {access.compliance_documents?.filename || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {access.compliance_documents?.document_type || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {access.users?.email || 'System'}
                    </TableCell>
                  </TableRow>
                ))}
                {documentData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No document access found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}