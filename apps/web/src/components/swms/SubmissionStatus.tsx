import { FileText, Download, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

interface SubmissionStatusProps {
  submissions: Array<{
    id: string
    document_name: string
    status: string
    submitted_at: string
    reviewed_at: string | null
    notes: string | null
  }>
  error?: string
}

export function SubmissionStatus({ submissions, error }: SubmissionStatusProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading submission status: {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Documents Submitted
        </h3>
        <p className="text-gray-600">
          Once you upload documents, their status will appear here.
        </p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'under_review':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'submitted':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'under_review':
        return <Badge variant="secondary">Under Review</Badge>
      case 'submitted':
        return <Badge variant="outline">Submitted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'approved':
        return 'This document has been approved and meets all requirements.'
      case 'rejected':
        return 'This document was rejected. Please review the feedback and resubmit if necessary.'
      case 'under_review':
        return 'This document is currently being reviewed by the administration team.'
      case 'submitted':
        return 'This document has been submitted and is awaiting initial review.'
      default:
        return 'Status unknown.'
    }
  }

  // Sort submissions by most recent first
  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  )

  // Group submissions by status
  const groupedSubmissions = sortedSubmissions.reduce((acc, submission) => {
    const status = submission.status
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(submission)
    return acc
  }, {} as Record<string, typeof submissions>)

  // Status order for display
  const statusOrder = ['approved', 'under_review', 'submitted', 'rejected']

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusOrder.map(status => {
          const count = groupedSubmissions[status]?.length || 0
          if (count === 0) return null
          
          return (
            <Card key={status}>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  {getStatusIcon(status)}
                </div>
                <div className="text-2xl font-bold mb-1">{count}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {status.replace('_', ' ')}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          All Submissions ({submissions.length})
        </h3>
        
        {sortedSubmissions.map((submission, index) => (
          <div
            key={submission.id}
            className={`
              border rounded-lg p-6 transition-colors
              ${submission.status === 'approved' ? 'bg-green-50 border-green-200' :
                submission.status === 'rejected' ? 'bg-red-50 border-red-200' :
                submission.status === 'under_review' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getStatusIcon(submission.status)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {submission.document_name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(submission.status)}
                    <span className="text-xs text-gray-500">
                      Submission #{submissions.length - index}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              {getStatusDescription(submission.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>
                <div className="text-gray-600">
                  {new Date(submission.submitted_at).toLocaleString()}
                </div>
              </div>
              
              {submission.reviewed_at && (
                <div>
                  <span className="font-medium text-gray-700">Reviewed:</span>
                  <div className="text-gray-600">
                    {new Date(submission.reviewed_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {submission.notes && (
              <div className="mt-4 p-3 bg-white border border-gray-200 rounded">
                <span className="font-medium text-gray-700 text-sm">Review Notes:</span>
                <p className="text-sm text-gray-600 mt-1">
                  {submission.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help Text */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Need help?</strong> If you have questions about document requirements or review status, 
          please contact the site administration team at{' '}
          <a href="mailto:frank@baysidebuilders.com.au" className="text-blue-600 hover:underline">
            frank@baysidebuilders.com.au
          </a>
        </AlertDescription>
      </Alert>
    </div>
  )
}