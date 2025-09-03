import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/admin/AppSidebar'
import { SwmsJobForm } from '@/components/swms/SwmsJobForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { JobSite } from '@/types/swms'

export const metadata = {
  title: 'Create SWMS Job — Admin',
  description: 'Create a new SWMS job for the job site'
}

interface NewSwmsJobPageProps {
  params: {
    id: string
  }
}

export default async function NewSwmsJobPage({ params }: NewSwmsJobPageProps) {
  const supabase = createClient()
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch job site to inherit data
  const { data: jobSite, error } = await supabase
    .from('job_sites')
    .select('*')
    .eq('id', params.id)
    .single() as { data: JobSite | null; error: any }

  if (error || !jobSite) {
    notFound()
  }

  function handleCancel() {
    // This will be handled by the client component
    return
  }

  return (
    <AppSidebar title="Create SWMS Job">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/job-sites/${params.id}?tab=swms`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {jobSite.name}
            </Link>
          </Button>
        </div>

        {/* Form */}
        <SwmsJobForm
          jobSite={jobSite}
          onCancel={() => {
            // This will be handled client-side with router.push
          }}
        />
      </div>
    </AppSidebar>
  )
}