export default function Loading() {
  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 animate-pulse">
          {/* Overview Section */}
          <section>
            <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                      <div className="h-8 w-16 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-32 bg-gray-200 rounded" />
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Check-ins Skeleton */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="h-5 w-32 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="divide-y divide-gray-200">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gray-200 rounded-full" />
                        <div>
                          <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                          <div className="h-3 w-20 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Expirations Skeleton */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="h-5 w-40 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              <div className="divide-y divide-gray-200">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gray-200 rounded-full" />
                        <div>
                          <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                          <div className="h-3 w-32 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-12 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
