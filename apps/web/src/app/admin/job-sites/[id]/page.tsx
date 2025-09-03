import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/admin/AppSidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Edit, MapPin, CheckCircle, XCircle, Settings2 } from 'lucide-react'
import { SwmsJobsSection } from '@/components/swms/SwmsJobsSection'
import { SubmissionStatusTable } from '@/components/swms/SubmissionStatusTable'
import type { JobSite, SwmsJob, SwmsSubmission } from '@/types/swms'

export const metadata = {
  title: 'Job Site Details — Admin',
  description: 'View job site details and SWMS management'
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  } catch {
    return '—'
  }
}

interface JobSiteDetailPageProps {
  params: {
    id: string
  }
}

export default async function JobSiteDetailPage({ params }: JobSiteDetailPageProps) {
  const supabase = createClient()
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch job site with related data
  const { data: jobSite, error } = await supabase
    .from('job_sites')
    .select('*')
    .eq('id', params.id)
    .single() as { data: JobSite | null; error: any }

  if (error || !jobSite) {
    notFound()
  }

  // Fetch SWMS jobs for this site
  const { data: swmsJobs, error: swmsError } = await supabase
    .from('swms_jobs')
    .select(`
      id,
      name,
      description,
      start_date,
      end_date,
      status,
      created_at,
      updated_at
    `)
    .eq('job_site_id', params.id)
    .order('created_at', { ascending: false }) as { data: SwmsJob[] | null; error: any }

  // Fetch submissions with detailed info
  const { data: submissions, error: submissionsError } = await supabase
    .from('swms_submissions')
    .select(`
      id,
      status,
      created_at,
      updated_at,
      contractor_id,
      worker_id,
      submission_data,
      swms_job_id,
      swms_jobs!inner(
        id,
        name,
        status,
        job_site_id
      ),
      contractors(name),
      workers(name)
    `)
    .eq('swms_jobs.job_site_id', params.id)
    .order('created_at', { ascending: false })

  // Process submissions data for display
  const submissionsWithJob = (submissions || []).map(submission => ({
    ...submission,
    swms_job: submission.swms_jobs,
    contractor_name: submission.contractors?.name,
    worker_name: submission.workers?.name
  }))

  // Calculate stats from submissions
  const stats = submissions || []

  const submissionStats = {
    total: stats?.length || 0,
    approved: stats?.filter(s => s.status === 'approved').length || 0,
    pending: stats?.filter(s => s.status === 'submitted').length || 0,
    under_review: stats?.filter(s => s.status === 'under_review').length || 0,
    rejected: stats?.filter(s => s.status === 'rejected').length || 0
  }

  return (
    <AppSidebar title="Job Site Details">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/job-sites">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Sites
            </Link>
          </Button>
        </div>

        {/* Job Site Overview */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{jobSite.name}</h1>
              {jobSite.active ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  <XCircle className="mr-1 h-3 w-3" />
                  Inactive
                </Badge>
              )}
            </div>
            {jobSite.address && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <p>{jobSite.address}</p>
              </div>
            )}
          </div>
          <Button variant="outline" asChild>
            <Link href={`/admin/job-sites/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Site
            </Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Settings2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SWMS Jobs</p>
                  <p className="text-2xl font-bold">{swmsJobs?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{submissionStats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                  <XCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{submissionStats.pending + submissionStats.under_review}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                  <p className="text-2xl font-bold">{submissionStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="swms">SWMS Management</TabsTrigger>
            <TabsTrigger value="submissions">Submissions ({submissionStats.total})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Site Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Site Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">{jobSite.name}</p>
                  </div>
                  {jobSite.address && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-sm text-gray-900">{jobSite.address}</p>
                    </div>
                  )}
                  {jobSite.lat && jobSite.lng && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Coordinates</p>
                      <p className="text-sm text-gray-900">
                        {jobSite.lat.toFixed(6)}, {jobSite.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-in Radius</p>
                    <p className="text-sm text-gray-900">{jobSite.radius_m || 500}m</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(jobSite.created_at)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {swmsJobs && swmsJobs.length > 0 ? (
                    <div className="space-y-3">
                      {swmsJobs.slice(0, 5).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{job.name}</p>
                            <p className="text-xs text-gray-500">
                              {job.status} • {formatDate(job.created_at)}
                            </p>
                          </div>
                          <Badge variant={
                            job.status === 'active' ? 'default' : 
                            job.status === 'completed' ? 'secondary' : 
                            'outline'
                          }>
                            {job.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <Settings2 className="w-12 h-12 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-500">No SWMS jobs created yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="swms" className="space-y-4">
            <SwmsJobsSection 
              jobSiteId={params.id} 
              swmsJobs={swmsJobs || []} 
            />
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <SubmissionStatusTable 
              jobSiteId={params.id}
              submissions={submissionsWithJob}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppSidebar>
  )
}