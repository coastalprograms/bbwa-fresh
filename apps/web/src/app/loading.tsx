export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" aria-busy="true" aria-live="polite">
      <div role="status" className="space-y-6">
        <div className="h-64 rounded-lg bg-gray-700/40 animate-pulse" />
        <div className="h-48 rounded-lg bg-gray-700/40 animate-pulse" />
        <div className="h-48 rounded-lg bg-gray-700/40 animate-pulse" />
      </div>
    </main>
  )
}
