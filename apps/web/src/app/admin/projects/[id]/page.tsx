import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Route } from 'next'
import { ProjectForm } from '../_components/ProjectForm'
import type { ProjectWithPhotos } from '@/types/projects'

export const metadata = {
  title: 'Edit Project — Admin — Bayside Builders WA',
  description: 'Edit construction project details and photos'
}

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch project with photos
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      description,
      status,
      deleted_at,
      created_at,
      updated_at,
      project_photos(id, project_id, path, category, alt_text, sort_order, created_at)
    `)
    .eq('id', params.id)
    .is('deleted_at', null)
    .single()

  if (error || !project) {
    console.error('Project fetch error:', error)
    notFound()
  }

  // Transform the data to match our interface
  const projectWithPhotos = {
    ...project,
    photos: (project.project_photos || []) as any[]
  } as ProjectWithPhotos

  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update project details and manage photos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href={'/admin/projects' as Route} 
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                ← Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <ProjectForm mode="edit" initialProject={projectWithPhotos} />
        </div>
      </div>
    </main>
  )
}