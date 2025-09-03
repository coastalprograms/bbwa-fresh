'use client'

import { useRef, useState } from 'react'

interface ProjectFormInitial {
  title?: string
  summary?: string
  description?: string
  imageUrls?: string[]
}

export function ProjectForm({ initial }: { initial?: ProjectFormInitial }) {
  const [genStatus, setGenStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [genError, setGenError] = useState('')

  const titleRef = useRef<HTMLInputElement | null>(null)
  const summaryRef = useRef<HTMLTextAreaElement | null>(null)
  const descRef = useRef<HTMLTextAreaElement | null>(null)

  async function onGenerate() {
    try {
      setGenStatus('loading')
      setGenError('')
      const summary = summaryRef.current?.value || initial?.summary || ''
      const imageUrls = initial?.imageUrls || []
      const res = await fetch('/admin/projects/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary, imageUrls }),
      })
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string }
      if (!res.ok || data?.error) {
        setGenStatus('error')
        setGenError(data?.error || 'Unable to generate at this time.')
        return
      }
      if (data?.text && descRef.current) {
        descRef.current.value = data.text
        descRef.current.focus()
      }
    } finally {
      setGenStatus((s) => (s === 'loading' ? 'idle' : s))
    }
  }

  return (
    <form className="space-y-4" aria-live="polite">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          ref={titleRef}
          defaultValue={initial?.title || ''}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g. Heritage Kitchen Renovation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="summary">
          Brief summary
        </label>
        <textarea
          id="summary"
          name="summary"
          ref={summaryRef}
          defaultValue={initial?.summary || ''}
          rows={4}
          className="w-full border rounded px-3 py-2"
          placeholder="Short bullet points or overview for AI"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          ref={descRef}
          defaultValue={initial?.description || ''}
          rows={8}
          className="w-full border rounded px-3 py-2"
          placeholder="AI-generated or manual description"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onGenerate}
          aria-disabled={genStatus === 'loading'}
          className="rounded border px-3 py-2 disabled:opacity-50"
        >
          {genStatus === 'loading' ? 'Generating…' : 'Generate Description with AI'}
        </button>
        {genStatus === 'error' && (
          <p role="alert" className="text-red-700 text-sm">
            {genError || 'Unable to generate at this time.'}
          </p>
        )}
      </div>
    </form>
  )
}
