import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SchedulerResponse {
  success: boolean
  campaigns_processed: number
  campaigns_executed: number
  campaigns_failed: number
  errors?: string[]
}

interface PendingCampaign {
  campaign_id: string
  swms_job_id: string
  campaign_type: string
  scheduled_date: string
}

interface NotificationAudit {
  kind: string
  payload: any
  result: string
}

Deno.serve(async (req: Request) => {
  const started = Date.now()
  let auditResult = 'failure'
  let campaignsProcessed = 0
  let campaignsExecuted = 0
  let campaignsFailed = 0
  const errors: string[] = []

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

    console.log('Starting SWMS reminder scheduler execution')

    // Get all pending campaigns that are due for execution
    const { data: pendingCampaigns, error: campaignsError } = await supabase
      .rpc('get_pending_campaigns')

    if (campaignsError) {
      throw new Error(`Failed to fetch pending campaigns: ${campaignsError.message}`)
    }

    if (!pendingCampaigns || pendingCampaigns.length === 0) {
      console.log('No pending campaigns found for execution')
      auditResult = 'success'
      
      // Audit the successful run with zero campaigns
      await supabase
        .from('notification_audits')
        .insert({
          kind: 'swms_reminder_scheduler',
          payload: { 
            campaigns_processed: 0,
            reason: 'no_pending_campaigns'
          },
          result: 'success'
        })
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          campaigns_processed: 0,
          campaigns_executed: 0,
          campaigns_failed: 0,
          message: 'No pending campaigns found for execution'
        }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }

    campaignsProcessed = pendingCampaigns.length
    console.log(`Found ${campaignsProcessed} pending campaigns for execution`)

    // Process each pending campaign
    for (const campaign of pendingCampaigns as PendingCampaign[]) {
      try {
        console.log(`Processing campaign ${campaign.campaign_id} (${campaign.campaign_type}) for job ${campaign.swms_job_id}`)

        // Check if we should skip this campaign due to completion
        const { data: submissionCount, error: countError } = await supabase
          .rpc('count_swms_submissions_for_job', { job_id: campaign.swms_job_id })

        if (countError) {
          console.warn(`Failed to check submission count for job ${campaign.swms_job_id}: ${countError.message}`)
          // Continue processing anyway
        }

        // Skip if all contractors have already submitted
        if (submissionCount && submissionCount.total > 0 && submissionCount.submitted >= submissionCount.total) {
          console.log(`Skipping campaign ${campaign.campaign_id} - all contractors have submitted`)
          
          // Mark campaign as cancelled due to completion
          await supabase
            .from('swms_email_campaigns')
            .update({ 
              status: 'cancelled', 
              updated_at: new Date().toISOString() 
            })
            .eq('id', campaign.campaign_id)
          
          continue
        }

        // Execute the campaign by calling the email automation function
        const automationUrl = `${supabaseUrl}/functions/v1/swms-email-automation`
        
        const automationResponse = await fetch(automationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'User-Agent': 'BBWA-SwmsReminderScheduler/1.0'
          },
          body: JSON.stringify({
            swms_job_id: campaign.swms_job_id,
            campaign_type: campaign.campaign_type,
            test_mode: false
          })
        })

        if (!automationResponse.ok) {
          const errorText = await automationResponse.text()
          throw new Error(`Automation function failed: ${automationResponse.status} - ${errorText}`)
        }

        const automationResult = await automationResponse.json()
        
        if (automationResult.success) {
          campaignsExecuted++
          console.log(`Campaign ${campaign.campaign_id} executed successfully - ${automationResult.emails_sent} emails sent`)
        } else {
          campaignsFailed++
          const errorMsg = `Campaign ${campaign.campaign_id} failed: ${automationResult.error || 'Unknown error'}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }

      } catch (error) {
        campaignsFailed++
        const errorMessage = error instanceof Error ? error.message : String(error)
        const errorMsg = `Failed to process campaign ${campaign.campaign_id}: ${errorMessage}`
        console.error(errorMsg)
        errors.push(errorMsg)

        // Mark campaign as failed
        try {
          await supabase
            .from('swms_email_campaigns')
            .update({ 
              status: 'failed', 
              updated_at: new Date().toISOString() 
            })
            .eq('id', campaign.campaign_id)
        } catch (updateError) {
          console.error(`Failed to update campaign status: ${updateError}`)
        }
      }
    }

    // Schedule follow-up campaigns for any new SWMS jobs that need them
    try {
      await scheduleFollowUpCampaigns(supabase)
    } catch (error) {
      console.warn(`Failed to schedule follow-up campaigns: ${error}`)
      // Don't fail the whole operation for this
    }

    // Clean up expired portal tokens
    try {
      const { data: cleanupCount } = await supabase.rpc('cleanup_expired_portal_tokens')
      if (cleanupCount && cleanupCount > 0) {
        console.log(`Cleaned up ${cleanupCount} expired portal tokens`)
      }
    } catch (error) {
      console.warn(`Failed to cleanup expired tokens: ${error}`)
      // Don't fail the whole operation for this
    }

    auditResult = campaignsFailed === 0 ? 'success' : 'partial_success'

    // Audit the execution
    const auditData: NotificationAudit = {
      kind: 'swms_reminder_scheduler',
      payload: {
        campaigns_processed: campaignsProcessed,
        campaigns_executed: campaignsExecuted,
        campaigns_failed: campaignsFailed,
        errors: errors.length > 0 ? errors : undefined,
        execution_time: Date.now() - started
      },
      result: auditResult
    }

    await supabase
      .from('notification_audits')
      .insert(auditData)

    console.log(`SWMS reminder scheduler completed: ${campaignsExecuted}/${campaignsProcessed} campaigns executed successfully`)

    const response: SchedulerResponse = {
      success: campaignsFailed < campaignsProcessed,
      campaigns_processed: campaignsProcessed,
      campaigns_executed: campaignsExecuted,
      campaigns_failed: campaignsFailed,
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
    console.error('SWMS reminder scheduler failed:', errorMessage)

    // Audit failure
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        
        const auditData: NotificationAudit = {
          kind: 'swms_reminder_scheduler',
          payload: {
            error: errorMessage,
            campaigns_processed: campaignsProcessed,
            campaigns_executed: campaignsExecuted,
            campaigns_failed: campaignsFailed,
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
        campaigns_processed: campaignsProcessed,
        campaigns_executed: campaignsExecuted,
        campaigns_failed: campaignsFailed
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
    console.log(`swms-reminder-scheduler completed in ${duration}ms, result: ${auditResult}`)
  }
})

// Helper function to schedule follow-up campaigns for jobs that don't have them yet
async function scheduleFollowUpCampaigns(supabase: any): Promise<void> {
  console.log('Checking for SWMS jobs needing follow-up campaigns')

  // Find SWMS jobs that only have initial campaigns but no follow-ups scheduled
  const { data: jobsNeedingFollowUps, error: jobsError } = await supabase
    .from('swms_jobs')
    .select(`
      id,
      due_date,
      swms_email_campaigns!inner(campaign_type)
    `)
    .eq('status', 'active')
    .not('due_date', 'is', null)

  if (jobsError) {
    console.warn(`Failed to fetch jobs needing follow-ups: ${jobsError.message}`)
    return
  }

  if (!jobsNeedingFollowUps || jobsNeedingFollowUps.length === 0) {
    console.log('No jobs found needing follow-up campaigns')
    return
  }

  for (const job of jobsNeedingFollowUps) {
    try {
      // Check if this job already has all campaign types scheduled
      const existingCampaigns = job.swms_email_campaigns || []
      const existingTypes = new Set(existingCampaigns.map((c: any) => c.campaign_type))

      const allTypes = ['initial', 'reminder_7', 'reminder_14', 'final_21']
      const missingTypes = allTypes.filter(type => !existingTypes.has(type))

      if (missingTypes.length === 0) {
        continue // This job already has all campaign types
      }

      console.log(`Scheduling follow-up campaigns for job ${job.id}: ${missingTypes.join(', ')}`)

      // Schedule missing follow-up campaigns
      await supabase.rpc('schedule_swms_follow_ups', { job_id: job.id })

    } catch (error) {
      console.warn(`Failed to schedule follow-ups for job ${job.id}: ${error}`)
      // Continue with other jobs
    }
  }
}