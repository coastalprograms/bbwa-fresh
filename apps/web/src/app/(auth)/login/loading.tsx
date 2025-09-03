export default function Loading() {
  return (
    <main className="min-h-dvh p-8">
      <div className="max-w-sm mx-auto animate-pulse">
        <div className="h-6 w-32 bg-gray-200 mb-6" />
        <div className="space-y-4">
          <div className="h-10 w-full bg-gray-200" />
          <div className="h-10 w-full bg-gray-200" />
          <div className="h-10 w-24 bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
