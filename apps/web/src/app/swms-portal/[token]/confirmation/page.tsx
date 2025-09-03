import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { validateSwmsToken, getSubmissionStatus } from '../actions'
import { PortalLayout } from '@/components/swms/PortalLayout'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle2, 
  Download, 
  FileText, 
  Clock,
  Mail,
  Calendar,
  Building,
  User
} from 'lucide-react'

interface ConfirmationPageProps {
  params: {
    token: string
  }
  searchParams: {
    submission?: string
    success?: string
  }
}

async function ConfirmationPageContent({ 
  token, 
  submissionId 
}: { 
  token: string
  submissionId?: string 
}) {
  const validation = await validateSwmsToken(token)
  
  if (!validation.success) {
    notFound()
  }

  const { swmsJob, jobSite, contractor } = validation.data

  // Get all submissions for this contractor and job
  const submissionStatus = await getSubmissionStatus(swmsJob.id, contractor.id)
  const submissions = submissionStatus.success ? submissionStatus.data : []

  // If a specific submission ID is provided, find it
  const specificSubmission = submissionId 
    ? submissions.find(sub => sub.id === submissionId)
    : submissions[0] // Get most recent

  // Generate confirmation number
  const confirmationNumber = specificSubmission
    ? `SWMS-${swmsJob.id.slice(0, 8).toUpperCase()}-${specificSubmission.id.slice(0, 8).toUpperCase()}`
    : `SWMS-${swmsJob.id.slice(0, 8).toUpperCase()}-PENDING`

  return (
    <PortalLayout 
      title="Submission Confirmed"
      jobSite={jobSite}
      swmsJob={swmsJob}
      contractor={contractor}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Message */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Submission Successful!
          </h2>
          <p className="text-gray-600">
            Your SWMS documents have been submitted and are now under review.
          </p>
        </div>

        {/* Confirmation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Submission Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirmation Number
                </label>
                <p className="text-lg font-mono bg-gray-50 px-3 py-2 rounded">
                  {confirmationNumber}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Submission Date
                </label>
                <p className="text-lg">
                  {specificSubmission 
                    ? new Date(specificSubmission.submitted_at).toLocaleString()
                    : new Date().toLocaleString()
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-gray-600" />
                <div>
                  <span className="text-sm text-gray-600">Job Site: </span>
                  <span className="font-medium">{jobSite.name}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <div>
                  <span className="text-sm text-gray-600">Contractor: </span>
                  <span className="font-medium">{contractor.company_name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <div>
                <span className="text-sm text-gray-600">SWMS Job: </span>
                <span className="font-medium">{swmsJob.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submitted Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Submitted Documents</CardTitle>
            <CardDescription>
              Documents included in this submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
              <div className="space-y-3">
                {submissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{submission.document_name}</p>
                        <p className="text-sm text-gray-600">
                          Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {submission.status === 'submitted' ? 'Under Review' : submission.status}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {submissions.length > 5 && (
                  <p className="text-sm text-gray-600 text-center pt-2">
                    And {submissions.length - 5} more document{submissions.length - 5 > 1 ? 's' : ''}...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No documents found for this submission.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>What Happens Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Review Process</h4>
                  <p className="text-sm text-gray-600">
                    Your documents will be reviewed by our compliance team within 2-3 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Email Notification</h4>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive an email notification at {contractor.contact_email} with the review results.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Work Authorization</h4>
                  <p className="text-sm text-gray-600">
                    Once approved, you&apos;ll be authorized to commence work as per the submitted SWMS.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Confirmation Alert */}
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Confirmation Email Sent:</strong> A detailed receipt has been sent to {contractor.contact_email}. 
            Please save this confirmation number: <strong>{confirmationNumber}</strong> for your records.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href={`/swms-portal/${token}/upload`}>
              Upload More Documents
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href={`/swms-portal/${token}/upload?tab=status`}>
              Check Submission Status
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.print()}>
            Print Receipt
          </Button>
        </div>
      </div>
    </PortalLayout>
  )
}

export default function ConfirmationPage({ params, searchParams }: ConfirmationPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ConfirmationPageContent 
        token={params.token} 
        submissionId={searchParams.submission}
      />
    </Suspense>
  )
}