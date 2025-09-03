export default function Loading() {
  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-8 animate-pulse">
            {/* Project Information Section */}
            <div className="space-y-6">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              
              {/* Name field */}
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-12 w-full bg-gray-200 rounded" />
              </div>
              
              {/* Description field */}
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-32 w-full bg-gray-200 rounded" />
              </div>
              
              {/* Status field */}
              <div>
                <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
                <div className="h-12 w-full bg-gray-200 rounded" />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-6">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-10 w-full bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <div className="h-10 w-20 bg-gray-200 rounded" />
              <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}