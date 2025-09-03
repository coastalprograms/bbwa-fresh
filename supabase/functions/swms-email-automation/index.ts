import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SwmsEmailRequest {
  swms_job_id: string
  campaign_type: 'initial' | 'reminder_7' | 'reminder_14' | 'final_21'
  test_mode?: boolean
}

interface SwmsEmailResponse {
  success: boolean
  campaign_id?: string
  emails_sent: number
  errors?: string[]
}

interface ContractorRecord {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone?: string
}

interface SwmsJobDetails {
  id: string
  job_name: string
  description?: string
  requirements?: string
  due_date: string
  job_site: {
    name: string
    address: string
  }
}

interface EmailPayload {
  to: string
  subject: string
  html: string
  text: string
  portal_token: string
  contractor_id: string
  campaign_id: string
}

interface NotificationAudit {
  kind: string
  payload: any
  result: string
}

Deno.serve(async (req: Request) => {
  const started = Date.now()
  let auditResult = 'failure'
  let emailsSent = 0
  let campaignId = ''

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const requestBody: SwmsEmailRequest = await req.json()
    const { swms_job_id, campaign_type, test_mode = false } = requestBody

    if (!swms_job_id || !campaign_type) {
      throw new Error('Missing required parameters: swms_job_id and campaign_type')
    }

    console.log(`Starting SWMS email automation for job ${swms_job_id}, campaign type: ${campaign_type}`)

    // Get SWMS job details with job site information
    const { data: swmsJob, error: jobError } = await supabase
      .from('swms_jobs')
      .select(`
        id,
        job_name,
        description,
        requirements,
        due_date,
        job_site:job_sites(
          name,
          address
        )
      `)
      .eq('id', swms_job_id)
      .single()

    if (jobError || !swmsJob) {
      throw new Error(`Failed to fetch SWMS job: ${jobError?.message || 'Job not found'}`)
    }

    // Get contractors assigned to this SWMS job (who haven't submitted yet)
    const { data: contractors, error: contractorsError } = await supabase
      .from('contractors')
      .select(`
        id,
        company_name,
        contact_name,
        email,
        phone
      `)
      .eq('swms_jobs.id', swms_job_id)
      .is('swms_submissions.id', null) // Only contractors who haven't submitted
      .not('email', 'is', null)

    if (contractorsError) {
      throw new Error(`Failed to fetch contractors: ${contractorsError.message}`)
    }

    if (!contractors || contractors.length === 0) {
      console.log('No contractors found requiring SWMS submissions')
      auditResult = 'success'
      
      // Audit the successful run with zero results
      await supabase
        .from('notification_audits')
        .insert({
          kind: 'swms_email_automation',
          payload: { 
            swms_job_id,
            campaign_type,
            count: 0,
            reason: 'no_contractors_requiring_submission'
          },
          result: 'success'
        })
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          emails_sent: 0, 
          message: 'No contractors requiring SWMS submissions found' 
        }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }

    // Create campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('swms_email_campaigns')
      .insert({
        swms_job_id,
        campaign_type,
        status: 'active',
        scheduled_date: new Date().toISOString()
      })
      .select()
      .single()

    if (campaignError || !campaign) {
      throw new Error(`Failed to create campaign: ${campaignError?.message}`)
    }

    campaignId = campaign.id

    // Get email template for campaign type
    const { data: template, error: templateError } = await supabase
      .from('swms_email_templates')
      .select('*')
      .eq('template_type', campaign_type)
      .eq('is_active', true)
      .single()

    if (templateError || !template) {
      throw new Error(`Failed to fetch email template for type ${campaign_type}: ${templateError?.message}`)
    }

    console.log(`Sending ${campaign_type} emails to ${contractors.length} contractors`)

    // Process each contractor
    const emailPromises = contractors.map(async (contractor: ContractorRecord) => {
      try {
        // Generate secure portal token (30 days expiry)
        const portalToken = crypto.randomUUID()
        const tokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

        // Calculate days remaining until due date
        const daysRemaining = Math.ceil(
          (new Date(swmsJob.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )

        // Template variables for email content
        const templateVars = {
          contractor_name: contractor.contact_name || contractor.company_name,
          company_name: contractor.company_name,
          job_name: swmsJob.job_name,
          job_site_name: swmsJob.job_site.name,
          job_site_address: swmsJob.job_site.address,
          days_remaining: Math.max(0, daysRemaining),
          portal_url: `${Deno.env.get('SITE_URL')}/swms-portal/${portalToken}`,
          due_date: new Date(swmsJob.due_date).toLocaleDateString('en-AU'),
          contact_phone: Deno.env.get('BUILDER_CONTACT_PHONE') || '(08) 9581 2777',
          contact_email: Deno.env.get('BUILDER_CONTACT_EMAIL') || 'admin@baysidebuilderswa.com.au'
        }

        // Replace template variables in subject and content
        let subject = template.subject_template
        let htmlContent = template.html_template
        let textContent = template.text_template

        Object.entries(templateVars).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`
          subject = subject.replace(new RegExp(placeholder, 'g'), String(value))
          htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value))
          textContent = textContent.replace(new RegExp(placeholder, 'g'), String(value))
        })

        // Create email send record
        const { data: emailSend, error: emailSendError } = await supabase
          .from('swms_email_sends')
          .insert({
            campaign_id: campaignId,
            contractor_id: contractor.id,
            email_address: contractor.email,
            portal_token: portalToken,
            token_expires_at: tokenExpiresAt,
            delivery_status: 'pending'
          })
          .select()
          .single()

        if (emailSendError) {
          console.error(`Failed to create email send record for contractor ${contractor.id}:`, emailSendError.message)
          throw new Error(`Database error: ${emailSendError.message}`)
        }

        // Send email via automation platform (Make.com or n8n)
        const emailPayload: EmailPayload = {
          to: contractor.email,
          subject,
          html: htmlContent,
          text: textContent,
          portal_token: portalToken,
          contractor_id: contractor.id,
          campaign_id: campaignId
        }

        if (!test_mode) {
          await sendEmail(emailPayload)
        }

        // Update email send status
        await supabase
          .from('swms_email_sends')
          .update({
            sent_at: new Date().toISOString(),
            delivery_status: test_mode ? 'test' : 'sent'
          })
          .eq('id', emailSend.id)

        console.log(`${test_mode ? 'Test email prepared' : 'Email sent'} to ${contractor.email}`)
        return { success: true, contractor_id: contractor.id }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`Failed to process email for contractor ${contractor.id}:`, errorMessage)
        
        // Update email send status to failed
        await supabase
          .from('swms_email_sends')
          .update({
            delivery_status: 'failed',
            sent_at: new Date().toISOString()
          })
          .eq('campaign_id', campaignId)
          .eq('contractor_id', contractor.id)

        return { success: false, contractor_id: contractor.id, error: errorMessage }
      }
    })

    // Wait for all email processing to complete
    const results = await Promise.all(emailPromises)
    emailsSent = results.filter(r => r.success).length
    const errors = results.filter(r => !r.success).map(r => r.error).filter(Boolean)

    // Update campaign status
    await supabase
      .from('swms_email_campaigns')
      .update({
        status: emailsSent > 0 ? 'completed' : 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId)

    auditResult = emailsSent > 0 ? 'success' : 'failure'

    // Audit successful run
    const auditData: NotificationAudit = {
      kind: 'swms_email_automation',
      payload: {
        swms_job_id,
        campaign_type,
        campaign_id: campaignId,
        total_contractors: contractors.length,
        emails_sent: emailsSent,
        errors: errors.length > 0 ? errors : undefined,
        test_mode
      },
      result: auditResult
    }

    await supabase
      .from('notification_audits')
      .insert(auditData)

    console.log(`SWMS email automation completed: ${emailsSent}/${contractors.length} emails sent successfully`)

    const response: SwmsEmailResponse = {
      success: emailsSent > 0,
      campaign_id: campaignId,
      emails_sent: emailsSent,
      errors: errors.length > 0 ? errors : undefined
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('SWMS email automation failed:', errorMessage)

    // Audit failure
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        
        const auditData: NotificationAudit = {
          kind: 'swms_email_automation',
          payload: {
            error: errorMessage,
            campaign_id: campaignId,
            emails_sent: emailsSent,
            duration: Date.now() - started
          },
          result: 'failure'
        }
        
        await supabase
          .from('notification_audits')
          .insert(auditData)
      }
    } catch (auditError) {
      console.error('Failed to audit error:', auditError)
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        emails_sent: emailsSent
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } finally {
    const duration = Date.now() - started
    console.log(`swms-email-automation completed in ${duration}ms, result: ${auditResult}`)
  }
})

// Helper function to send email via automation platform
async function sendEmail(payload: EmailPayload): Promise<void> {
  // Determine webhook URL based on provider
  const provider = Deno.env.get('AUTOMATION_PROVIDER') || 'make'
  const webhookUrl = provider === 'n8n' 
    ? Deno.env.get('N8N_WEBHOOK_URL') 
    : Deno.env.get('MAKE_WEBHOOK_URL')

  if (!webhookUrl) {
    throw new Error(`Email webhook URL not configured for provider: ${provider}`)
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'User-Agent': 'BBWA-SwmsEmailAutomation/1.0'
    },
    body: JSON.stringify({
      type: 'swms_email',
      provider,
      ...payload
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Email webhook failed: ${response.status} ${response.statusText} - ${errorText}`)
  }
}