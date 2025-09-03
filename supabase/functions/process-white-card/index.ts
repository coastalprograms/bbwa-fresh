import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface Payload {
  certification_id: string
  worker_id: string
  white_card_path: string
}

interface OCRResult {
  card_number: string
  name_on_card: string
  expiry_date: string
  confidence: number
}

// Mock OCR service - replace with actual OCR provider in production
async function mockOCRService(fileUrl: string): Promise<OCRResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock extracted data with realistic values
  const cardNumbers = ['WC123456789', 'WC987654321', 'WC456789123', 'WC789123456']
  const names = ['John Smith', 'Jane Doe', 'Mike Wilson', 'Sarah Johnson']
  const dates = ['15/03/2026', '22/07/2027', '10/11/2025', '05/09/2026']
  
  const randomIndex = Math.floor(Math.random() * cardNumbers.length)
  
  return {
    card_number: cardNumbers[randomIndex],
    name_on_card: names[randomIndex],
    expiry_date: dates[randomIndex],
    confidence: 0.85 + Math.random() * 0.1 // 0.85-0.95
  }
}

// Parse Australian date format (DD/MM/YYYY) to ISO date (YYYY-MM-DD)
function parseAustralianDate(dateStr: string): string | null {
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
  const match = dateStr.match(regex)
  
  if (!match) return null
  
  const [, day, month, year] = match
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  // Validate date is reasonable (not in past, not too far future)
  const now = new Date()
  const maxFuture = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate())
  
  if (date < now || date > maxFuture) return null
  
  return date.toISOString().split('T')[0] // Return YYYY-MM-DD
}

async function createAuditLog(
  supabase: any,
  certificationId: string,
  event: string,
  detail: any = null
) {
  await supabase
    .from('certification_audits')
    .insert({
      certification_id: certificationId,
      event,
      detail
    })
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json() as Payload
    const { certification_id, worker_id, white_card_path } = payload

    // Validate payload
    if (!certification_id || !worker_id || !white_card_path) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Missing required fields: certification_id, worker_id, white_card_path' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if already processed or processing (rate limiting)
    const { data: existing } = await supabase
      .from('certifications')
      .select('status, processed_at')
      .eq('id', certification_id)
      .single()

    if (!existing) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Certification not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (existing.status === 'processing') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Already processing' }),
        { 
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (existing.status === 'processed' && existing.processed_at) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Already processed' }),
        { 
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 1: Update status to processing
    await supabase
      .from('certifications')
      .update({ status: 'processing' })
      .eq('id', certification_id)

    await createAuditLog(supabase, certification_id, 'processing_started', {
      worker_id,
      white_card_path
    })

    // Step 2: Get signed URL for file access
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('certifications')
      .createSignedUrl(white_card_path, 300) // 5 minutes

    if (signedUrlError || !signedUrlData) {
      await supabase
        .from('certifications')
        .update({ 
          status: 'failed',
          processing_error: 'Failed to access file: ' + signedUrlError?.message
        })
        .eq('id', certification_id)

      await createAuditLog(supabase, certification_id, 'processing_failed', {
        error: 'File access failed',
        detail: signedUrlError
      })

      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Failed to access file: ' + signedUrlError?.message 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 3: Call OCR service
    let ocrResult: OCRResult
    try {
      ocrResult = await mockOCRService(signedUrlData.signedUrl)
      
      await createAuditLog(supabase, certification_id, 'ocr_completed', {
        confidence: ocrResult.confidence,
        extracted_fields: {
          card_number: ocrResult.card_number,
          name_on_card: ocrResult.name_on_card,
          expiry_date: ocrResult.expiry_date
        }
      })
    } catch (ocrError) {
      await supabase
        .from('certifications')
        .update({ 
          status: 'failed',
          processing_error: 'OCR processing failed: ' + String(ocrError)
        })
        .eq('id', certification_id)

      await createAuditLog(supabase, certification_id, 'processing_failed', {
        error: 'OCR processing failed',
        detail: String(ocrError)
      })

      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'OCR processing failed: ' + String(ocrError)
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 4: Parse and validate extracted data
    const parsedExpiryDate = parseAustralianDate(ocrResult.expiry_date)
    
    // Step 5: Update certification with extracted data
    const { error: updateError } = await supabase
      .from('certifications')
      .update({
        status: 'processed',
        card_number: ocrResult.card_number,
        name_on_card: ocrResult.name_on_card,
        expiry_date: parsedExpiryDate,
        processed_at: new Date().toISOString(),
        processing_error: null
      })
      .eq('id', certification_id)

    if (updateError) {
      await createAuditLog(supabase, certification_id, 'processing_failed', {
        error: 'Database update failed',
        detail: updateError
      })

      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Failed to update certification: ' + updateError.message 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    await createAuditLog(supabase, certification_id, 'processing_completed', {
      extracted_data: {
        card_number: ocrResult.card_number,
        name_on_card: ocrResult.name_on_card,
        expiry_date: parsedExpiryDate,
        confidence: ocrResult.confidence
      }
    })

    // Step 6: Trigger notification
    try {
      await supabase.functions.invoke('notify-builder', {
        body: {
          certification_id,
          worker_id,
          status: 'processed',
          card_number: ocrResult.card_number,
          expiry_date: parsedExpiryDate
        }
      })

      await createAuditLog(supabase, certification_id, 'notification_sent', {
        notification_type: 'success'
      })
    } catch (notificationError) {
      // Don't fail the whole process if notification fails
      await createAuditLog(supabase, certification_id, 'notification_failed', {
        error: String(notificationError)
      })
    }

    return new Response(
      JSON.stringify({ 
        ok: true,
        certification_id,
        extracted_data: {
          card_number: ocrResult.card_number,
          name_on_card: ocrResult.name_on_card,
          expiry_date: parsedExpiryDate,
          confidence: ocrResult.confidence
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: 'Internal server error: ' + String(error)
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})