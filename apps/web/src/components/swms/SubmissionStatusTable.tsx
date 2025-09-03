'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download
} from 'lucide-react'
import { SwmsStatusIndicator } from './SwmsStatusIndicator'
import { cn } from '@/lib/utils'
import type { SwmsSubmission, SwmsJob } from '@/types/swms'

interface SubmissionWithJob extends SwmsSubmission {
  swms_job: SwmsJob
  contractor_name?: string
  worker_name?: string
}

interface SubmissionStatusTableProps {
  jobSiteId: string
  submissions: SubmissionWithJob[]
  className?: string
}

type SortField = 'created_at' | 'contractor_name' | 'worker_name' | 'status' | 'swms_job_name'
type SortDirection = 'asc' | 'desc'

export function SubmissionStatusTable({ 
  jobSiteId, 
  submissions, 
  className 
}: SubmissionStatusTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Filter and sort submissions
  const filteredAndSortedSubmissions = useMemo(() => {
    let filtered = submissions

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(submission => 
        submission.contractor_name?.toLowerCase().includes(searchLower) ||
        submission.worker_name?.toLowerCase().includes(searchLower) ||
        submission.swms_job.name.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter)
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'created_at':
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
        case 'contractor_name':
          aValue = a.contractor_name || ''
          bValue = b.contractor_name || ''
          break
        case 'worker_name':
          aValue = a.worker_name || ''
          bValue = b.worker_name || ''
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'swms_job_name':
          aValue = a.swms_job.name
          bValue = b.swms_job.name
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [submissions, searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4" /> 
      : <ArrowDown className="h-4 w-4" />
  }

  const statusCounts = useMemo(() => {
    const counts = {
      all: submissions.length,
      submitted: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      requires_changes: 0
    }
    
    submissions.forEach(submission => {
      if (submission.status in counts) {
        counts[submission.status as keyof typeof counts]++
      }
    })
    
    return counts
  }, [submissions])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return '—'
    }
  }

  if (submissions.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
          <p className="text-sm text-gray-500 text-center">
            SWMS submissions will appear here once contractors start submitting their safety documentation
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          SWMS Submissions
          <Badge variant="outline" className="ml-auto">
            {filteredAndSortedSubmissions.length} of {submissions.length}
          </Badge>
        </CardTitle>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by contractor, worker, or job name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
              <SelectItem value="submitted">Submitted ({statusCounts.submitted})</SelectItem>
              <SelectItem value="under_review">Under Review ({statusCounts.under_review})</SelectItem>
              <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
              <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
              <SelectItem value="requires_changes">Needs Changes ({statusCounts.requires_changes})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('swms_job_name')}
                >
                  <div className="flex items-center gap-2">
                    SWMS Job
                    {getSortIcon('swms_job_name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('contractor_name')}
                >
                  <div className="flex items-center gap-2">
                    Contractor
                    {getSortIcon('contractor_name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('worker_name')}
                >
                  <div className="flex items-center gap-2">
                    Worker
                    {getSortIcon('worker_name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-2">
                    Submitted
                    {getSortIcon('created_at')}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.swms_job.name}</p>
                      <p className="text-xs text-gray-500">
                        Job: {submission.swms_job.status}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {submission.contractor_name || '—'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {submission.worker_name || '—'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <SwmsStatusIndicator 
                      status={submission.status} 
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {formatDate(submission.created_at)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {submission.status === 'submitted' && (
                        <>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {submission.status === 'under_review' && (
                        <Button size="sm" variant="outline">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{statusCounts.all}</p>
            <p className="text-xs text-gray-600">Total Submissions</p>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
            <p className="text-xs text-gray-600">Approved</p>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {statusCounts.submitted + statusCounts.under_review}
            </p>
            <p className="text-xs text-gray-600">Pending Review</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">
              {statusCounts.rejected + statusCounts.requires_changes}
            </p>
            <p className="text-xs text-gray-600">Needs Attention</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}