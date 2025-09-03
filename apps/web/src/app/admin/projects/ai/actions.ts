'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export type Provider = 'gemini' | 'openai'

export interface GenerateDescriptionRequest {
  builderNotes: string
  imageUrls: string[]
}

export interface GenerateDescriptionResponse {
  text?: string
  error?: string
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

function getProvider(): Provider {
  return (process.env.AI_PROVIDER as Provider) || 'gemini'
}

// Basic PII scrubbing: remove emails and phone numbers from free-text inputs
function scrubPII(input: string): string {
  let s = input || ''
  // redact email addresses
  s = s.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted]')
  // redact phone numbers (simple heuristic for international/local formats)
  s = s.replace(/\b(\+?\d[\d\s\-()]{7,}\d)\b/g, '[redacted]')
  return s.trim()
}

function buildPrompt(builderNotes: string, imageUrls: string[]): string {
  const images = imageUrls?.length ? imageUrls.join(', ') : 'No images provided'
  return [
    'You are writing marketing copy for a professional Australian construction company.',
    '',
    'TASK: Transform the builder\'s rough project notes below into polished, client-ready website copy.',
    '',
    'BUILDER\'S NOTES:',
    `"${builderNotes || 'No details provided'}"`,
    '',
    'AVAILABLE IMAGES:',
    `${images}`,
    '',
    'REQUIREMENTS:',
    '• Write 120-200 words of engaging, professional copy',
    '• Use Australian English spelling and terminology', 
    '• Transform casual builder language into client-friendly marketing copy',
    '• Focus on quality, craftsmanship, and customer outcomes',
    '• Highlight specific materials, techniques, or features mentioned',
    '• Make it sound premium but approachable',
    '• Avoid technical jargon - write for homeowners, not tradies',
    '',
    'TONE: Professional, confident, showcasing expertise while being warm and approachable.',
  ].join('\n')
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(input, { ...init, signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

async function callGemini(prompt: string, timeoutMs = 20000): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Gemini API key not configured')
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
    timeoutMs,
  )
  if (!res.ok) throw new Error(`Gemini API error (${res.status})`)
  const json: GeminiResponse = await res.json()
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return text
}

async function callOpenAI(prompt: string, timeoutMs = 20000): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OpenAI API key not configured')
  const res = await fetchWithTimeout(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }] }),
    },
    timeoutMs,
  )
  if (!res.ok) throw new Error(`OpenAI API error (${res.status})`)
  const json: OpenAIResponse = await res.json()
  const text = json?.choices?.[0]?.message?.content || ''
  return text
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      // exponential backoff: 300ms, 900ms
      const delay = 300 * Math.pow(3, i)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Unknown error')
}

export async function generateDescription({
  builderNotes,
  imageUrls,
}: GenerateDescriptionRequest): Promise<GenerateDescriptionResponse> {
  const started = Date.now()
  const sanitizedBuilderNotes = scrubPII(builderNotes)
  const prompt = buildPrompt(sanitizedBuilderNotes, imageUrls)
  const provider = getProvider()

  let text = ''
  let status: 'success' | 'error' = 'success'
  let errorMsg: string | undefined

  try {
    text = await withRetry(() => (provider === 'gemini' ? callGemini(prompt) : callOpenAI(prompt)))
    if (!text) throw new Error('Empty response from AI provider')
    return { text }
  } catch (e: any) {
    status = 'error'
    errorMsg = e?.message || 'Generation failed'
    return { error: errorMsg }
  } finally {
    const duration = Date.now() - started
    // Audit log (no secrets to client; runs server-side only)
    try {
      const admin = createAdminClient()
      await admin.from('ai_generations').insert({
        project_id: null,
        provider,
        prompt_len: prompt.length,
        output_len: text?.length || 0,
        duration_ms: duration,
        status,
      })
    } catch {
      // swallow logging errors
    }
  }
}
