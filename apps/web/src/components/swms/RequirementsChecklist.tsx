import { CheckCircle2, Circle, FileText, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface RequirementsChecklistProps {
  swmsJob: {
    id: string
    name: string
    description: string | null
    start_date: string
    end_date: string | null
  }
  submissions: Array<{
    id: string
    document_name: string
    status: string
    submitted_at: string
    reviewed_at: string | null
    notes: string | null
  }>
}

interface RequirementItem {
  id: string
  name: string
  description: string
  required: boolean
  category: 'safety' | 'process' | 'compliance' | 'equipment'
}

// Default SWMS requirements based on Australian Work Safe standards
const DEFAULT_REQUIREMENTS: RequirementItem[] = [
  {
    id: 'swms-document',
    name: 'Safe Work Method Statement',
    description: 'Detailed SWMS document outlining work procedures and safety measures',
    required: true,
    category: 'safety'
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    description: 'Comprehensive risk assessment identifying hazards and control measures',
    required: true,
    category: 'safety'
  },
  {
    id: 'emergency-procedures',
    name: 'Emergency Response Procedures',
    description: 'Emergency contact details and response procedures',
    required: true,
    category: 'safety'
  },
  {
    id: 'personnel-qualifications',
    name: 'Personnel Qualifications',
    description: 'Proof of qualifications and certifications for all workers',
    required: true,
    category: 'compliance'
  },
  {
    id: 'equipment-list',
    name: 'Equipment & Tools List',
    description: 'List of all equipment, tools, and safety equipment to be used',
    required: true,
    category: 'equipment'
  },
  {
    id: 'method-sequence',
    name: 'Work Method Sequence',
    description: 'Step-by-step sequence of work activities',
    required: true,
    category: 'process'
  },
  {
    id: 'site-specific-hazards',
    name: 'Site-Specific Hazards',
    description: 'Identification of site-specific hazards and control measures',
    required: true,
    category: 'safety'
  },
  {
    id: 'consultation-records',
    name: 'Consultation Records',
    description: 'Evidence of consultation with workers and other parties',
    required: false,
    category: 'compliance'
  }
]

export function RequirementsChecklist({ swmsJob, submissions }: RequirementsChecklistProps) {
  // Check which requirements are satisfied by submissions
  const getRequirementStatus = (requirement: RequirementItem) => {
    const matchingSubmissions = submissions.filter(sub => {
      const docName = sub.document_name.toLowerCase()
      const reqName = requirement.name.toLowerCase()
      
      // Simple keyword matching - in production, this would be more sophisticated
      return docName.includes(reqName.split(' ')[0].toLowerCase()) ||
             reqName.includes(docName.split('.')[0].toLowerCase().substring(0, 5))
    })

    if (matchingSubmissions.length === 0) {
      return { status: 'missing', submission: null }
    }

    const approvedSubmission = matchingSubmissions.find(sub => sub.status === 'approved')
    if (approvedSubmission) {
      return { status: 'approved', submission: approvedSubmission }
    }

    const rejectedSubmission = matchingSubmissions.find(sub => sub.status === 'rejected')
    if (rejectedSubmission) {
      return { status: 'rejected', submission: rejectedSubmission }
    }

    const pendingSubmission = matchingSubmissions.find(sub => sub.status === 'submitted' || sub.status === 'under_review')
    if (pendingSubmission) {
      return { status: 'pending', submission: pendingSubmission }
    }

    return { status: 'missing', submission: null }
  }

  const getCategoryIcon = (category: RequirementItem['category']) => {
    switch (category) {
      case 'safety':
        return '🛡️'
      case 'process':
        return '⚙️'
      case 'compliance':
        return '📋'
      case 'equipment':
        return '🔧'
      default:
        return '📄'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'pending':
        return <Badge variant="secondary">Under Review</Badge>
      case 'missing':
        return <Badge variant="outline">Not Submitted</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'missing':
        return <Circle className="h-5 w-5 text-gray-400" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  // Calculate completion statistics
  const requiredCount = DEFAULT_REQUIREMENTS.filter(req => req.required).length
  const approvedRequired = DEFAULT_REQUIREMENTS
    .filter(req => req.required)
    .filter(req => getRequirementStatus(req).status === 'approved').length
  const completionPercentage = requiredCount > 0 ? Math.round((approvedRequired / requiredCount) * 100) : 0

  const totalSubmissions = submissions.length
  const approvedSubmissions = submissions.filter(sub => sub.status === 'approved').length
  const pendingSubmissions = submissions.filter(sub => sub.status === 'submitted' || sub.status === 'under_review').length
  const rejectedSubmissions = submissions.filter(sub => sub.status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Submission Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
            <div className="text-gray-600">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{approvedSubmissions}</div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingSubmissions}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{rejectedSubmissions}</div>
            <div className="text-gray-600">Rejected</div>
          </div>
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Document Requirements</h3>
        
        {DEFAULT_REQUIREMENTS.map((requirement) => {
          const { status, submission } = getRequirementStatus(requirement)
          
          return (
            <div 
              key={requirement.id}
              className={`
                border rounded-lg p-4 transition-colors
                ${status === 'approved' ? 'bg-green-50 border-green-200' :
                  status === 'rejected' ? 'bg-red-50 border-red-200' :
                  status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-gray-50 border-gray-200'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(requirement.category)}</span>
                    <h4 className="font-medium text-gray-900">
                      {requirement.name}
                      {requirement.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h4>
                    {getStatusBadge(status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {requirement.description}
                  </p>
                  
                  {submission && (
                    <div className="text-xs text-gray-500 bg-white rounded p-2 border">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3" />
                        <span className="font-medium">{submission.document_name}</span>
                      </div>
                      <div className="mt-1">
                        Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                        {submission.reviewed_at && (
                          <span className="ml-2">
                            • Reviewed: {new Date(submission.reviewed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {submission.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <strong>Review Notes:</strong> {submission.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Note */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Items marked with * are required for SWMS approval. 
          Ensure all required documents are submitted and approved before the work commencement date.
          {swmsJob.end_date && (
            <span className="block mt-1">
              <strong>Submission deadline:</strong> {new Date(swmsJob.end_date).toLocaleDateString()}
            </span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}