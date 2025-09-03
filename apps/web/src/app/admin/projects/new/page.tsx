import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Route } from 'next'
import { ProjectForm } from '../_components/ProjectForm'

export const metadata = {
  title: 'Add Project — Admin — Bayside Builders WA',
  description: 'Create a new construction project with photos'
}

export default async function NewProjectPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a new construction project with photos and details
              </p>
            </div>
            <Link 
              href={'/admin/projects' as Route} 
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <ProjectForm mode="create" />
        </div>
      </div>
    </main>
  )
}