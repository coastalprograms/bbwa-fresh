"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-dvh p-8">
      <div className="max-w-sm mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-red-600 text-sm">{error.message || 'An unexpected error occurred.'}</p>
        <button onClick={reset} className="px-4 py-2 bg-black text-white">
          Try again
        </button>
      </div>
    </main>
  )
}
