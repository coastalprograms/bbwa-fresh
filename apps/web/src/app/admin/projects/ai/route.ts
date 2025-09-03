import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { buildPrompt, callGemini, callOpenAI, getProvider, withRetry } from './provider'

function scrubPII(input: string): string {
  if (!input) return input
  // Remove emails
  let out = input.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted]')
  // Remove phone numbers (simple patterns)
  out = out.replace(/\b\+?\d[\d\s()-]{7,}\b/g, '[redacted]')
  return out
}

export async function POST(req: NextRequest) {
  const started = Date.now()
  const provider = getProvider()

  try {
    // Ensure only authenticated users can invoke the AI generation endpoint
    const supabaseAuth = createClient()
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const builderNotes: string = scrubPII((body?.builderNotes as string) || '')
    const imageUrls: string[] = Array.isArray(body?.imageUrls) ? (body.imageUrls as string[]) : []

    const prompt = buildPrompt(builderNotes, imageUrls)

    const text = await withRetry(
      () => (provider === 'gemini' ? callGemini(prompt) : callOpenAI(prompt)),
      2,
    )

    // Log usage server-side only
    try {
      const supabase = createAdminClient()
      await supabase.from('ai_generations').insert({
        project_id: null,
        provider,
        prompt_len: prompt.length,
        output_len: text?.length || 0,
        duration_ms: Date.now() - started,
        status: 'success',
      })
    } catch {}

    return NextResponse.json({ text })
  } catch (e: any) {
    const message = e?.message || 'Generation failed'
    try {
      const supabase = createAdminClient()
      await supabase.from('ai_generations').insert({
        project_id: null,
        provider,
        prompt_len: 0,
        output_len: 0,
        duration_ms: Date.now() - started,
        status: 'error',
      })
    } catch {}
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
