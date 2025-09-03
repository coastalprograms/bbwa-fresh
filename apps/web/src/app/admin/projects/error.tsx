"use client"

export default function ErrorProjects({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-dvh p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-red-700">{error.message || 'Unexpected error'}</p>
        <button onClick={reset} className="px-4 py-2 border rounded">Try again</button>
      </div>
    </main>
  )
}
