export default function Loading() {
  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="animate-pulse">
            <div className="h-4 bg-yellow-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-yellow-200 rounded w-3/4"></div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    </main>
  )
}