import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { 
  COMPLIANCE_REASONS, 
  RATE_LIMIT_WINDOW_HOURS, 
  MAX_ALERTS_PER_WINDOW,
  type ComplianceNotificationRequest, 
  type ComplianceNotificationResponse 
} from '../_shared/compliance-types.ts'

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const BUILDER_ALERT_EMAIL = Deno.env.get('BUILDER_ALERT_EMAIL') || 'admin@example.com'
const BUILDER_ALERT_PHONE = Deno.env.get('BUILDER_ALERT_PHONE')

// Mock notification providers (implement with real providers like Resend, Twilio, etc.)
async function sendEmail(to: string, subject: string, body: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('EMAIL NOTIFICATION:', { to, subject, body })
    // TODO: Implement with real email provider (Resend, SES, etc.)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // For development/testing, always succeed
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: String(error) }
  }
}

async function sendSMS(to: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('SMS NOTIFICATION:', { to, message })
    // TODO: Implement with real SMS provider (Twilio, MessageMedia, etc.)
    
    if (!to) {
      return { success: false, error: 'No phone number configured' }
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // For development/testing, always succeed if phone number is provided
    return { success: true }
  } catch (error) {
    console.error('SMS send error:', error)
    return { success: false, error: String(error) }
  }
}

async function checkRateLimit(
  supabase: any, 
  workerId: string, 
  jobSiteId?: string
): Promise<boolean> {
  const windowStart = new Date()
  windowStart.setHours(windowStart.getHours() - RATE_LIMIT_WINDOW_HOURS)
  
  let query = supabase
    .from('compliance_alerts')
    .select('id')
    .eq('worker_id', workerId)
    .gte('created_at', windowStart.toISOString())
  
  if (jobSiteId) {
    query = query.eq('job_site_id', jobSiteId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Rate limit check error:', error)
    return false // Allow the alert if we can't check rate limit
  }
  
  return (data?.length || 0) >= MAX_ALERTS_PER_WINDOW
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, errors: { request: 'Method not allowed' } }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const payload: ComplianceNotificationRequest = await req.json()
    
    // Validate required fields
    if (!payload.workerId || !payload.workerName || !payload.workerEmail || !payload.reason) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          errors: { validation: 'Missing required fields: workerId, workerName, workerEmail, reason' } 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Check rate limiting
    const isRateLimited = await checkRateLimit(supabase, payload.workerId, payload.jobSiteId)
    if (isRateLimited) {
      console.log('Rate limit exceeded for worker:', payload.workerId)
      return new Response(
        JSON.stringify({ 
          success: false, 
          errors: { rateLimit: 'Alert rate limit exceeded' } 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prepare notification content
    const siteName = payload.siteName || 'Unknown Site'
    const timestamp = new Date(payload.timestamp).toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    const emailSubject = `URGENT: Site Compliance Alert - ${payload.reason}`
    const emailBody = `
COMPLIANCE ALERT

Worker: ${payload.workerName} (${payload.workerEmail})
Site: ${siteName}
Issue: ${payload.reason}
Time: ${timestamp}

This worker has been denied site entry due to the above compliance issue.
Immediate action required.

---
BBWA Compliance System
    `.trim()

    const smsMessage = `COMPLIANCE ALERT: ${payload.workerName} denied entry to ${siteName} - ${payload.reason}. Check email for details. Time: ${timestamp}`

    // Send notifications in parallel
    const [emailResult, smsResult] = await Promise.all([
      sendEmail(BUILDER_ALERT_EMAIL, emailSubject, emailBody),
      sendSMS(BUILDER_ALERT_PHONE || '', smsMessage)
    ])

    // Create audit record
    const { data: alertRecord, error: insertError } = await supabase
      .from('compliance_alerts')
      .insert({
        worker_id: payload.workerId,
        job_site_id: payload.jobSiteId || null,
        reason: payload.reason,
        worker_name: payload.workerName,
        worker_email: payload.workerEmail,
        site_name: payload.siteName || null,
        sent_email: emailResult.success,
        sent_sms: smsResult.success,
        email_error: emailResult.error || null,
        sms_error: smsResult.error || null
      })
      .select('*')
      .single()

    if (insertError) {
      console.error('Failed to create compliance alert record:', insertError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          errors: { database: 'Failed to create audit record' } 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prepare response
    const response: ComplianceNotificationResponse = {
      success: true,
      alertId: alertRecord.id,
      emailSent: emailResult.success,
      smsSent: smsResult.success
    }

    // Include errors if any
    if (!emailResult.success || !smsResult.success) {
      response.errors = {}
      if (!emailResult.success) response.errors.email = emailResult.error
      if (!smsResult.success) response.errors.sms = smsResult.error
    }

    console.log('Compliance alert processed:', {
      alertId: alertRecord.id,
      workerId: payload.workerId,
      emailSent: emailResult.success,
      smsSent: smsResult.success
    })

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        errors: { internal: 'Internal server error' } 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})