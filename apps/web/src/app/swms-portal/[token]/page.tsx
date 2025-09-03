import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { validateSwmsToken } from './actions'
import { PortalLayout } from '@/components/swms/PortalLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface SwmsPortalPageProps {
  params: {
    token: string
  }
}

async function SwmsPortalContent({ token }: { token: string }) {
  const validation = await validateSwmsToken(token)
  
  if (!validation.success) {
    notFound()
  }

  const { swmsJob, jobSite, contractor } = validation.data

  return (
    <PortalLayout 
      title={`SWMS Submission Portal - ${jobSite.name}`}
      jobSite={jobSite}
      swmsJob={swmsJob}
      contractor={contractor}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to SWMS Submission Portal</CardTitle>
            <CardDescription>
              Submit your Safe Work Method Statement documents for {jobSite.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Job Site</h4>
                  <p className="text-lg">{jobSite.name}</p>
                  <p className="text-sm text-gray-500">{jobSite.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">SWMS Job</h4>
                  <p className="text-lg">{swmsJob.name}</p>
                  {swmsJob.description && (
                    <p className="text-sm text-gray-500">{swmsJob.description}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Contractor</h4>
                  <p className="text-lg">{contractor.company_name}</p>
                  <p className="text-sm text-gray-500">{contractor.contact_email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Submission Period</h4>
                  <p className="text-sm">
                    From: {new Date(swmsJob.start_date).toLocaleDateString()}
                  </p>
                  {swmsJob.end_date && (
                    <p className="text-sm">
                      To: {new Date(swmsJob.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Please upload your SWMS documents below. Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              File upload component will be implemented in Task 2
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

export default function SwmsPortalPage({ params }: SwmsPortalPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SwmsPortalContent token={params.token} />
    </Suspense>
  )
}