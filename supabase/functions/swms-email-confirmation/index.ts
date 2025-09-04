import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SwmsEmailPayload {
  submission_id: string
  contractor_email: string
  contractor_name: string
  job_site_name: string
  swms_job_name: string
  document_name: string
  confirmation_number: string
  submitted_at: string
}

// Mock email service - replace with actual email provider in production
async function mockEmailService(to: string, subject: string, body: string): Promise<void> {
  console.log('📧 SWMS Email Confirmation Service')
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('Body:', body)
  console.log('---')
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500))
}

function generateEmailTemplate(payload: SwmsEmailPayload): { subject: string; body: string } {
  const subject = `SWMS Submission Confirmed - ${payload.job_site_name}`
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1a472a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Bayside Builders WA</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">SWMS Submission Confirmation</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <strong>✅ Submission Successful!</strong><br>
          Your SWMS documents have been received and are now under review.
        </div>
        
        <h2 style="color: #1a472a; margin-top: 0;">Submission Details</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: white;">
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Confirmation Number:</td>
            <td style="padding: 12px; border: 1px solid #dee2e6; font-family: monospace; background-color: #f8f9fa;">${payload.confirmation_number}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Job Site:</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${payload.job_site_name}</td>
          </tr>
          <tr style="background-color: white;">
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">SWMS Job:</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${payload.swms_job_name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Document Submitted:</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${payload.document_name}</td>
          </tr>
          <tr style="background-color: white;">
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Submission Date:</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${new Date(payload.submitted_at).toLocaleString()}</td>
          </tr>
        </table>
        
        <h3 style="color: #1a472a;">What Happens Next?</h3>
        <ol style="padding-left: 20px; line-height: 1.6;">
          <li><strong>Review Process:</strong> Your documents will be reviewed by our compliance team within 2-3 business days.</li>
          <li><strong>Status Updates:</strong> You'll receive email notifications about any status changes or required actions.</li>
          <li><strong>Work Authorization:</strong> Once approved, you'll be authorized to commence work as per the submitted SWMS.</li>
        </ol>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>📋 Important:</strong> Please save your confirmation number <strong>${payload.confirmation_number}</strong> for your records. 
          You may need it for future reference or inquiries.
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; color: #6c757d; font-size: 14px;">
            For questions or support, contact us at 
            <a href="mailto:frank@baysidebuilders.com.au" style="color: #1a472a;">frank@baysidebuilders.com.au</a>
          </p>
          <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 12px;">
            This is an automated message from the Bayside Builders WA SWMS Management System.
          </p>
        </div>
      </div>
    </div>
  `
  
  return { subject, body }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: SwmsEmailPayload = await req.json()
    
    // Validate required fields
    const required = [
      'submission_id', 'contractor_email', 'contractor_name', 
      'job_site_name', 'swms_job_name', 'document_name', 
      'confirmation_number', 'submitted_at'
    ]
    
    for (const field of required) {
      if (!payload[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Generate email content
    const { subject, body } = generateEmailTemplate(payload)

    // Send email notification
    await mockEmailService(payload.contractor_email, subject, body)

    // Initialize Supabase client for audit logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Log email sending attempt
    const { error: auditError } = await supabase
      .from('swms_audit_log')
      .insert({
        swms_job_id: payload.submission_id,
        action: 'email_sent',
        details: {
          type: 'submission_confirmation',
          recipient: payload.contractor_email,
          subject: subject,
          sent_at: new Date().toISOString()
        },
        occurred_at: new Date().toISOString()
      })

    if (auditError) {
      console.error('Failed to log email audit:', auditError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email confirmation sent successfully',
        recipient: payload.contractor_email
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending SWMS email confirmation:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to send email confirmation' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})