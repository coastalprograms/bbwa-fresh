import Link from 'next/link'
import type { Route } from 'next'

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
          
          <p className="text-gray-600 mb-8">
            The project you&apos;re looking for doesn&apos;t exist or may have been deleted.
          </p>
          
          <div className="space-y-4">
            <Link
              href={'/admin/projects' as Route}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Back to Projects
            </Link>
            
            <div>
              <Link
                href={'/admin/projects/new' as Route}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Create a new project instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}