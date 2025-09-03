import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface NotificationPayload {
  certification_id: string
  worker_id: string
  status: 'processed' | 'failed'
  card_number?: string
  expiry_date?: string
  error_message?: string
}

// Mock email service - replace with actual email provider in production
async function mockEmailService(to: string, subject: string, body: string): Promise<void> {
  console.log('📧 Mock Email Service')
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('Body:', body)
  console.log('---')
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500))
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

    const payload = await req.json() as NotificationPayload
    const { certification_id, worker_id, status } = payload

    // Validate payload
    if (!certification_id || !worker_id || !status) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Missing required fields: certification_id, worker_id, status' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get worker and certification details
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select('full_name, email, company, trade')
      .eq('id', worker_id)
      .single()

    if (workerError || !worker) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Worker not found: ' + workerError?.message 
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { data: cert, error: certError } = await supabase
      .from('certifications')
      .select('type, created_at')
      .eq('id', certification_id)
      .single()

    if (certError || !cert) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Certification not found: ' + certError?.message 
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare email content based on status
    let subject: string
    let body: string
    
    if (status === 'processed') {
      subject = '✅ White Card Processing Complete'
      body = `
White card processing has completed successfully for:

Worker Details:
- Name: ${worker.full_name}
- Email: ${worker.email}
- Company: ${worker.company}
- Trade: ${worker.trade}

Extracted Information:
- Card Number: ${payload.card_number || 'Not extracted'}
- Expiry Date: ${payload.expiry_date || 'Not extracted'}

Next Steps:
1. Review the extracted information in the worker management system
2. Verify the details are correct
3. Approve or request corrections if needed

The certification is now ready for your review.
      `.trim()
    } else {
      subject = '❌ White Card Processing Failed'
      body = `
White card processing has failed for:

Worker Details:
- Name: ${worker.full_name}
- Email: ${worker.email}
- Company: ${worker.company}
- Trade: ${worker.trade}

Error Details:
${payload.error_message || 'Unknown error occurred during processing'}

Action Required:
1. Review the uploaded white card image/document
2. Check if the file is clear and readable
3. Re-upload if necessary or process manually
4. Contact the worker if a new document is needed

Please address this issue to complete the worker's induction process.
      `.trim()
    }

    // Send notification email (using mock service)
    // In production, replace with actual email service like SendGrid, AWS SES, etc.
    try {
      // For now, we'll send to a configured builder email
      // In production, this would come from configuration or database
      const builderEmail = Deno.env.get('BUILDER_EMAIL') || 'builder@example.com'
      
      await mockEmailService(builderEmail, subject, body)
      
      // Create audit log for notification
      await supabase
        .from('certification_audits')
        .insert({
          certification_id,
          event: 'notification_sent',
          detail: {
            notification_type: status,
            recipient: builderEmail,
            subject
          }
        })

      return new Response(
        JSON.stringify({ 
          ok: true,
          message: `${status} notification sent successfully`,
          recipient: builderEmail
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )

    } catch (emailError) {
      // Log the notification failure
      await supabase
        .from('certification_audits')
        .insert({
          certification_id,
          event: 'notification_failed',
          detail: {
            error: String(emailError),
            attempted_status: status
          }
        })

      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Failed to send notification: ' + String(emailError)
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

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