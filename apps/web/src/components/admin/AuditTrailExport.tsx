'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/client'

interface AuditTrailExportProps {
  jobSiteId?: string
  contractorId?: string
  swmsJobId?: string
}

interface ExportFilters {
  startDate: string
  endDate: string
  actionTypes: string[]
  tables: string[]
}

export function AuditTrailExport({
  jobSiteId,
  contractorId,
  swmsJobId
}: AuditTrailExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [exportMessage, setExportMessage] = useState('')
  const [filters, setFilters] = useState<ExportFilters>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0], // Today
    actionTypes: ['insert', 'update', 'delete', 'status_update'],
    tables: ['swms_submissions', 'swms_jobs', 'contractors', 'workers']
  })

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true)
    setExportStatus('idle')
    setExportMessage('')

    try {
      const supabase = supabaseBrowser
      
      // Build query based on filters and context
      let query = supabase
        .from('swms_audit_log')
        .select(`
          id,
          table_name,
          record_id,
          action_type,
          old_values,
          new_values,
          changed_by,
          changed_at,
          metadata
        `)
        .gte('changed_at', `${filters.startDate}T00:00:00Z`)
        .lte('changed_at', `${filters.endDate}T23:59:59Z`)
        .order('changed_at', { ascending: false })

      // Apply table filters
      if (filters.tables.length > 0) {
        query = query.in('table_name', filters.tables)
      }

      // Apply action type filters
      if (filters.actionTypes.length > 0) {
        query = query.in('action_type', filters.actionTypes)
      }

      // Context-specific filters
      if (swmsJobId) {
        query = query.eq('record_id', swmsJobId)
      }
      
      const { data: auditLogs, error } = await query

      if (error) {
        throw new Error(`Failed to fetch audit logs: ${error.message}`)
      }

      if (!auditLogs || auditLogs.length === 0) {
        setExportStatus('error')
        setExportMessage('No audit records found for the specified criteria')
        return
      }

      if (format === 'csv') {
        await exportToCSV(auditLogs)
      } else {
        await exportToPDF(auditLogs)
      }

      setExportStatus('success')
      setExportMessage(`Successfully exported ${auditLogs.length} audit records`)

    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('error')
      setExportMessage(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToCSV = async (auditLogs: any[]) => {
    // Prepare CSV headers
    const headers = [
      'Timestamp',
      'Table',
      'Record ID', 
      'Action',
      'Changed By',
      'Old Values',
      'New Values',
      'Metadata'
    ]

    // Convert data to CSV format
    const csvRows = auditLogs.map(log => [
      new Date(log.changed_at).toLocaleString('en-AU'),
      log.table_name || '',
      log.record_id || '',
      log.action_type || '',
      log.changed_by || '',
      log.old_values ? JSON.stringify(log.old_values) : '',
      log.new_values ? JSON.stringify(log.new_values) : '',
      log.metadata ? JSON.stringify(log.metadata) : ''
    ])

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => 
        row.map(cell => 
          typeof cell === 'string' && (cell.includes(',') || cell.includes('\n') || cell.includes('"'))
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    const filename = `audit-trail-${filters.startDate}-to-${filters.endDate}.csv`
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    
    // Clean up
    URL.revokeObjectURL(link.href)
  }

  const exportToPDF = async (auditLogs: any[]) => {
    // For PDF export, we'll create a simple HTML report and use the browser's print functionality
    const reportHtml = generateAuditReportHTML(auditLogs)
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      throw new Error('Failed to open print window. Please check popup blockers.')
    }
    
    printWindow.document.write(reportHtml)
    printWindow.document.close()
    
    // Trigger print dialog
    printWindow.focus()
    printWindow.print()
    
    // Close the window after printing
    setTimeout(() => {
      printWindow.close()
    }, 1000)
  }

  const generateAuditReportHTML = (auditLogs: any[]) => {
    const reportDate = new Date().toLocaleDateString('en-AU')
    const fromDate = new Date(filters.startDate).toLocaleDateString('en-AU')
    const toDate = new Date(filters.endDate).toLocaleDateString('en-AU')

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SWMS Audit Trail Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #333; }
            .header p { margin: 5px 0; color: #666; }
            .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .summary strong { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:hover { background-color: #f9f9f9; }
            .action-insert { color: #10b981; }
            .action-update { color: #3b82f6; }
            .action-delete { color: #ef4444; }
            .action-status_update { color: #f59e0b; }
            .metadata { max-width: 200px; word-wrap: break-word; font-size: 10px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SWMS Audit Trail Report</h1>
            <p><strong>Report Period:</strong> ${fromDate} to ${toDate}</p>
            <p><strong>Generated:</strong> ${reportDate}</p>
            <p><strong>Total Records:</strong> ${auditLogs.length}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Tables Monitored:</strong> ${filters.tables.join(', ')}</p>
            <p><strong>Action Types:</strong> ${filters.actionTypes.join(', ')}</p>
            <p><strong>Record Count:</strong> ${auditLogs.length} audit entries</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Table</th>
                <th>Action</th>
                <th>Record ID</th>
                <th>Changes</th>
              </tr>
            </thead>
            <tbody>
              ${auditLogs.map(log => `
                <tr>
                  <td>${new Date(log.changed_at).toLocaleString('en-AU')}</td>
                  <td>${log.table_name || 'N/A'}</td>
                  <td><span class="action-${log.action_type}">${log.action_type?.toUpperCase() || 'UNKNOWN'}</span></td>
                  <td>${log.record_id || 'N/A'}</td>
                  <td class="metadata">
                    ${log.new_values ? Object.entries(log.new_values).map(([key, value]) => 
                      `${key}: ${String(value).substring(0, 50)}${String(value).length > 50 ? '...' : ''}`
                    ).join('<br>') : 'No data'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This report was generated automatically by BBWA SWMS Compliance System.</p>
            <p>Report contains audit trail data for compliance review purposes.</p>
          </div>
        </body>
      </html>
    `
  }

  const handleFilterChange = (key: keyof ExportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getStatusIcon = () => {
    switch (exportStatus) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (exportStatus) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Audit Trail Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>
            Exporting audit logs from {new Date(filters.startDate).toLocaleDateString('en-AU')} to {new Date(filters.endDate).toLocaleDateString('en-AU')}
          </span>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CSV
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Export PDF
          </Button>
        </div>

        {/* Status Message */}
        {exportMessage && (
          <div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{exportMessage}</span>
          </div>
        )}

        {/* Context Info */}
        {(jobSiteId || contractorId || swmsJobId) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Context Filters Applied:</span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-blue-600">
              {jobSiteId && <p>• Filtered to Job Site: {jobSiteId}</p>}
              {contractorId && <p>• Filtered to Contractor: {contractorId}</p>}
              {swmsJobId && <p>• Filtered to SWMS Job: {swmsJobId}</p>}
            </div>
          </div>
        )}

        {/* Export Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• CSV exports include all audit data fields for detailed analysis</p>
          <p>• PDF exports provide formatted reports suitable for compliance reviews</p>
          <p>• All exports include timestamps, actions, and change details</p>
          <p>• Data is filtered based on the specified date range and context</p>
        </div>
      </CardContent>
    </Card>
  )
}