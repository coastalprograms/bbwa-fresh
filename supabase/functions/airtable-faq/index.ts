// supabase/functions/airtable-faq/index.ts
// Fetch FAQs from Airtable via Edge Function. Never call Airtable from the client.
// Returns { items: Array<{ question: string; answer: string; updated_at: string }> } or { fallback: true }

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

interface FaqItem {
  question: string
  answer: string
  updated_at: string
}

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return toHex(digest)
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID()
  console.info('[airtable.faq] start', { requestId })
  try {
    const apiKey = Deno.env.get('AIRTABLE_API_KEY')
    const baseId = Deno.env.get('AIRTABLE_BASE_ID')
    const table = Deno.env.get('AIRTABLE_FAQ_TABLE')
    if (!apiKey || !baseId || !table) throw new Error('Airtable env not configured')

    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`)
    // Sort by position ascending, fallback handled by Airtable if field missing
    url.searchParams.set('sort[0][field]', 'position')
    url.searchParams.set('sort[0][direction]', 'asc')
    // Optional: page size cap
    url.searchParams.set('pageSize', '100')

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!res.ok) throw new Error(`Airtable error: ${res.status}`)

    const json = await res.json()
    const items: FaqItem[] = (json.records || [])
      .map((r: any) => ({
        question: r?.fields?.question ?? '',
        answer: r?.fields?.answer ?? '',
        updated_at: r?.fields?.updated_at ?? r?.createdTime ?? new Date().toISOString(),
      }))
      .filter((x: FaqItem) => x.question && x.answer)

    const body = JSON.stringify({ items })
    const etag = await sha256Hex(body)
    console.info('[airtable.faq] success', { requestId, count: items.length })

    return new Response(body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=120, s-maxage=300',
        ETag: etag,
        'X-Request-Id': requestId,
      },
    })
  } catch (e) {
    // Log limited error details; do not leak internals in response
    console.error('[airtable.faq] error', { requestId, error: String(e) })
    const body = JSON.stringify({ fallback: true, error: 'FAQ temporarily unavailable' })
    return new Response(body, {
      status: 200, // allow graceful UI fallback
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Request-Id': requestId,
      },
    })
  }
})
