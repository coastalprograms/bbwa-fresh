import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { validateSwmsToken, getSubmissionStatus } from '../actions'
import { PortalLayout } from '@/components/swms/PortalLayout'
import { FileUpload } from '@/components/swms/FileUpload'
import { RequirementsChecklist } from '@/components/swms/RequirementsChecklist'
import { SubmissionStatus } from '@/components/swms/SubmissionStatus'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface UploadPageProps {
  params: {
    token: string
  }
}

async function UploadPageContent({ token }: { token: string }) {
  const validation = await validateSwmsToken(token)
  
  if (!validation.success) {
    notFound()
  }

  const { swmsJob, jobSite, contractor } = validation.data!

  // Get existing submissions
  const submissionStatus = await getSubmissionStatus(swmsJob.id, contractor.id)

  return (
    <PortalLayout 
      title={`Upload Documents - ${jobSite.name}`}
      jobSite={jobSite}
      swmsJob={swmsJob}
      contractor={contractor}
    >
      <div className="space-y-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="status">Submission Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Upload your SWMS documents. Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  swmsJobId={swmsJob.id}
                  contractorId={contractor.id}
                  token={token}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SWMS Requirements</CardTitle>
                <CardDescription>
                  Review the required documents for this SWMS job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequirementsChecklist 
                  swmsJob={swmsJob}
                  submissions={submissionStatus.success ? (submissionStatus.data ?? []) : []}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submission Status</CardTitle>
                <CardDescription>
                  Track the status of your submitted documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubmissionStatus 
                  submissions={submissionStatus.success ? (submissionStatus.data ?? []) : []}
                  error={submissionStatus.error}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

export default function UploadPage({ params }: UploadPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UploadPageContent token={params.token} />
    </Suspense>
  )
}