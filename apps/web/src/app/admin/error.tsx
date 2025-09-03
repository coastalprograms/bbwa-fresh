'use client'

export default function Error({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void 
}) {
  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Error loading dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          
          <p className="text-gray-600 mb-2">
            There was an error loading the admin dashboard.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <p className="text-sm text-red-600 mb-6 font-mono">
              {error.message || 'An unexpected error occurred.'}
            </p>
          )}
          
          <div className="space-y-4">
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
            
            <div>
              <button
                onClick={() => window.location.href = '/admin'}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
