// supabase/functions/airtable-contact-forward/index.ts
// Forwards validated contact submissions to Airtable with idempotency protection.
// Input: { name, email, message, created_at?, source? }
// Output: { ok: true, idempotent?: boolean } | { ok: false, error: string }

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

interface ContactPayload {
  name: string
  email: string
  message: string
  created_at?: string
  source?: string
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

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchWithRetry(url: string, init: RequestInit, attempts = 3) {
  let lastErr: any
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, init)
    if (res.ok) return res
    // retry on 5xx only
    if (res.status >= 500) {
      lastErr = new Error(`Airtable ${res.status}`)
      const backoff = 200 * Math.pow(2, i) + Math.floor(Math.random() * 50)
      console.warn('[airtable.retry]', { attempt: i + 1, status: res.status, backoffMs: backoff })
      await sleep(backoff)
      continue
    }
    // non-retryable
    return res
  }
  if (lastErr) throw lastErr
  throw new Error('Airtable request failed')
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID()
  console.info('[airtable.contact_forward] start', { requestId, method: req.method })
  try {
    // Env
    const apiKey = Deno.env.get('AIRTABLE_API_KEY')
    const baseId = Deno.env.get('AIRTABLE_BASE_ID')
    const table = Deno.env.get('AIRTABLE_CONTACT_TABLE')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!apiKey || !baseId || !table) throw new Error('Airtable env not configured')
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Supabase service env not configured')

    // Validate
    if (req.method !== 'POST')
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405 })

    const payload = (await req.json()) as ContactPayload
    if (!payload || typeof payload !== 'object')
      return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), { status: 400 })

    const name = (payload.name || '').trim()
    const email = (payload.email || '').trim()
    const message = (payload.message || '').trim()
    const source = (payload.source || '').trim() || null
    const created_at = payload.created_at || new Date().toISOString()

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!name || !emailOk || !message)
      return new Response(JSON.stringify({ ok: false, error: 'Validation failed' }), { status: 400 })

    // Idempotency key (hour bucket)
    const bucketHour = new Date().toISOString().slice(0, 13)
    const idempotencyKey = await sha256Hex(`${name}|${email}|${message}|${bucketHour}`)

    // Check existing key via PostgREST
    const selUrl = `${supabaseUrl}/rest/v1/contact_forward_idempotency?select=id&key=eq.${idempotencyKey}&limit=1`
    const selRes = await fetch(selUrl, {
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    })
    if (!selRes.ok) throw new Error('Idempotency check failed')
    const existing = (await selRes.json()) as Array<{ id: string }>
    const alreadyForwarded = Array.isArray(existing) && existing.length > 0
    if (alreadyForwarded) {
      console.info('[idempotency.duplicate]', { requestId })
      return new Response(JSON.stringify({ ok: true, idempotent: true }), {
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Request-Id': requestId },
      })
    }

    // Insert key (race-safe). If unique violation occurs, treat as idempotent.
    const insUrl = `${supabaseUrl}/rest/v1/contact_forward_idempotency`
    const insRes = await fetch(insUrl, {
      method: 'POST',
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ key: idempotencyKey, source }),
    })
    if (!insRes.ok && insRes.status !== 409) {
      throw new Error('Idempotency insert failed')
    }

    // Forward to Airtable with retries on 5xx
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`
    const airtableBody = JSON.stringify({
      records: [
        {
          fields: {
            name,
            email,
            message,
            created_at,
            source,
          },
        },
      ],
    })

    console.info('[airtable.forward] attempt', { requestId })
    const res = await fetchWithRetry(airtableUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: airtableBody,
    })

    if (!res.ok) {
      // Clean up idempotency record to allow retry later
      const delUrl = `${supabaseUrl}/rest/v1/contact_forward_idempotency?key=eq.${idempotencyKey}`
      await fetch(delUrl, {
        method: 'DELETE',
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      })
      return new Response(JSON.stringify({ ok: false, error: 'Airtable rejected request' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Request-Id': requestId },
      })
    }

    console.info('[airtable.forward] success', { requestId })
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Request-Id': requestId },
    })
  } catch (e) {
    console.error('[airtable.contact_forward] error', { requestId, error: String(e) })
    return new Response(JSON.stringify({ ok: false, error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Request-Id': requestId },
    })
  }
})
