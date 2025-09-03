import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/admin/AppSidebar'
import JobSiteForm from '../../JobSiteForm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Edit Job Site — Admin',
  description: 'Edit construction job site details'
}

interface EditJobSitePageProps {
  params: {
    id: string
  }
}

export default async function EditJobSitePage({ params }: EditJobSitePageProps) {
  const supabase = createClient()
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch job site
  const { data: jobSite, error } = await supabase
    .from('job_sites')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !jobSite) {
    notFound()
  }

  return (
    <AppSidebar title="Edit Job Site">
      <div className="space-y-6">
        {/* Back button */}
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/job-sites">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Sites
            </Link>
          </Button>
        </div>

        {/* Form */}
        <JobSiteForm jobSite={jobSite} />
      </div>
    </AppSidebar>
  )
}