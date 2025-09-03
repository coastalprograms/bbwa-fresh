import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/admin/AppSidebar'
import JobSiteForm from '../JobSiteForm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Add Job Site — Admin',
  description: 'Add a new construction job site'
}

export default async function NewJobSitePage() {
  const supabase = createClient()
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  return (
    <AppSidebar title="Add Job Site">
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
        <JobSiteForm />
      </div>
    </AppSidebar>
  )
}