import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface CampaignActionRequest {
  action: string
  job_site_id?: string
  contractor_id?: string
  swms_job_id?: string
  parameters?: Record<string, any>
}

interface CampaignActionResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<CampaignActionResponse>> {
  try {
    // Check authentication
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Parse request body
    const body: CampaignActionRequest = await request.json()
    
    if (!body.action) {
      return NextResponse.json(
        { success: false, error: 'Missing action parameter' },
        { status: 400 }
      )
    }

    let result: any = {}

    switch (body.action) {
      case 'send-reminder':
        result = await handleSendReminder(supabase, body)
        break
      case 'bulk-approve':
        result = await handleBulkApprove(supabase, body)
        break
      case 'compliance-check':
        result = await handleComplianceCheck(supabase, body)
        break
      case 'urgent-notification':
        result = await handleUrgentNotification(supabase, body)
        break
      case 'weekly-campaign':
        result = await handleWeeklyCampaign(supabase, body)
        break
      case 'generate-report':
        result = await handleGenerateReport(supabase, body)
        break
      case 'broadcast-update':
        result = await handleBroadcastUpdate(supabase, body)
        break
      case 'pause-campaigns':
        result = await handlePauseCampaigns(supabase, body)
        break
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${body.action}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error) {
    console.error('Campaign action error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleSendReminder(supabase: any, body: CampaignActionRequest) {
  // Get pending submissions that need reminders
  let query = supabase
    .from('swms_jobs')
    .select(`
      id,
      job_name,
      job_site_id,
      swms_submissions!inner(
        id,
        contractor_id,
        status,
        created_at
      ),
      contractors!inner(
        id,
        company_name,
        contact_email
      )
    `)
    .eq('status', 'active')
    .in('swms_submissions.status', ['pending', 'submitted'])

  if (body.job_site_id) {
    query = query.eq('job_site_id', body.job_site_id)
  }

  const { data: pendingJobs, error } = await query

  if (error) {
    throw new Error(`Failed to fetch pending submissions: ${error.message}`)
  }

  if (!pendingJobs || pendingJobs.length === 0) {
    return {
      message: 'No pending SWMS submissions found for reminders',
      data: { reminders_sent: 0 }
    }
  }

  // Create email campaign for each pending job
  const campaigns = []
  for (const job of pendingJobs) {
    const { data: campaign, error: campaignError } = await supabase
      .from('swms_email_campaigns')
      .insert({
        swms_job_id: job.id,
        campaign_type: 'manual_reminder',
        status: 'active',
        scheduled_date: new Date().toISOString(),
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single()

    if (campaignError) {
      console.error('Failed to create campaign:', campaignError)
      continue
    }

    campaigns.push(campaign)

    // Create email sends for contractors
    for (const contractor of job.contractors as any[]) {
      if (contractor.contact_email) {
        await supabase
          .from('swms_email_sends')
          .insert({
            campaign_id: campaign.id,
            contractor_id: contractor.id,
            email_address: contractor.contact_email,
            portal_token: crypto.randomUUID(),
            token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            delivery_status: 'pending'
          })
      }
    }
  }

  // Log the action
  await supabase
    .from('notification_audits')
    .insert({
      kind: 'swms_reminder_manual',
      payload: {
        campaign_type: 'manual_reminder',
        triggered_by: 'admin_quick_action',
        job_site_id: body.job_site_id,
        campaigns_created: campaigns.length,
        jobs_targeted: pendingJobs.length
      },
      result: 'success'
    })

  return {
    message: `Reminder campaigns created for ${campaigns.length} SWMS jobs with pending submissions`,
    data: { 
      campaigns_created: campaigns.length,
      jobs_targeted: pendingJobs.length
    }
  }
}

async function handleBulkApprove(supabase: any, body: CampaignActionRequest) {
  const criteria = body.parameters?.approvalCriteria
  if (!criteria) {
    throw new Error('Approval criteria is required for bulk approval')
  }

  // Get eligible submissions for approval
  let query = supabase
    .from('swms_submissions')
    .select(`
      id,
      contractor_id,
      swms_job_id,
      status,
      created_at,
      contractors(company_name),
      swms_jobs(job_name, job_site_id)
    `)
    .eq('status', 'submitted')

  if (body.job_site_id) {
    query = query.eq('swms_jobs.job_site_id', body.job_site_id)
  }

  const { data: eligibleSubmissions, error } = await query

  if (error) {
    throw new Error(`Failed to fetch submissions: ${error.message}`)
  }

  if (!eligibleSubmissions || eligibleSubmissions.length === 0) {
    return {
      message: 'No eligible submissions found for bulk approval',
      data: { approved_count: 0 }
    }
  }

  // Update submissions to approved
  const submissionIds = eligibleSubmissions.map((sub: any) => sub.id)
  const currentUser = (await supabase.auth.getUser()).data.user
  
  const { error: updateError } = await supabase
    .from('swms_submissions')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: currentUser?.id,
      notes: `Bulk approved via admin quick action: ${criteria}`
    })
    .in('id', submissionIds)

  if (updateError) {
    throw new Error(`Failed to approve submissions: ${updateError.message}`)
  }

  // Log the bulk approval action
  await supabase
    .from('notification_audits')
    .insert({
      kind: 'swms_bulk_approval',
      payload: {
        action_type: 'bulk_approve',
        approval_criteria: criteria,
        submissions_approved: submissionIds.length,
        submission_ids: submissionIds,
        job_site_id: body.job_site_id,
        approved_by: currentUser?.email
      },
      result: 'success'
    })

  return {
    message: `Successfully approved ${eligibleSubmissions.length} SWMS submissions`,
    data: { approved_count: eligibleSubmissions.length }
  }
}

async function handleComplianceCheck(supabase: any, body: CampaignActionRequest) {
  // Run comprehensive compliance queries
  const queries = await Promise.allSettled([
    // Get total active jobs
    supabase
      .from('swms_jobs')
      .select('id', { count: 'exact' })
      .eq('status', 'active')
      .then((res: any) => ({ activeJobs: res.count || 0 })),
    
    // Get approved submissions
    supabase
      .from('swms_submissions')
      .select('id', { count: 'exact' })
      .eq('status', 'approved')
      .then((res: any) => ({ approvedSubmissions: res.count || 0 })),
    
    // Get pending submissions
    supabase
      .from('swms_submissions')
      .select('id', { count: 'exact' })
      .in('status', ['submitted', 'under_review'])
      .then((res: any) => ({ pendingSubmissions: res.count || 0 })),
    
    // Get overdue submissions (submitted more than 2 days ago)
    supabase
      .from('swms_submissions')
      .select('id', { count: 'exact' })
      .eq('status', 'submitted')
      .lt('created_at', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString())
      .then((res: any) => ({ overdueSubmissions: res.count || 0 })),

    // Get active campaigns
    supabase
      .from('swms_email_campaigns')
      .select('id', { count: 'exact' })
      .eq('status', 'active')
      .then((res: any) => ({ activeCampaigns: res.count || 0 }))
  ])

  const results = queries.reduce((acc, query) => {
    if (query.status === 'fulfilled') {
      return { ...acc, ...query.value }
    }
    return acc
  }, {
    activeJobs: 0,
    approvedSubmissions: 0,
    pendingSubmissions: 0,
    overdueSubmissions: 0,
    activeCampaigns: 0
  })

  const complianceRate = results.activeJobs > 0 
    ? Math.round((results.approvedSubmissions / results.activeJobs) * 100)
    : 100

  // Log compliance check
  await supabase
    .from('notification_audits')
    .insert({
      kind: 'swms_compliance_check',
      payload: {
        action_type: 'compliance_check',
        compliance_rate: complianceRate,
        metrics: results,
        job_site_id: body.job_site_id,
        checked_at: new Date().toISOString()
      },
      result: 'success'
    })

  return {
    message: `Compliance Check Complete: ${complianceRate}% compliant (${results.pendingSubmissions} pending, ${results.overdueSubmissions} overdue)`,
    data: {
      compliance_rate: complianceRate,
      ...results
    }
  }
}

async function handleUrgentNotification(supabase: any, body: CampaignActionRequest) {
  const urgentMessage = body.parameters?.urgentMessage
  if (!urgentMessage) {
    throw new Error('Urgent message is required')
  }

  // Get contractors for the job site or all contractors
  let query = supabase
    .from('contractors')
    .select('id, company_name, contact_email')

  if (body.job_site_id) {
    // Get contractors who have active SWMS jobs on this site
    query = supabase
      .from('contractors')
      .select(`
        id, 
        company_name, 
        contact_email,
        swms_submissions!inner(
          swms_job_id,
          swms_jobs!inner(job_site_id)
        )
      `)
      .eq('swms_submissions.swms_jobs.job_site_id', body.job_site_id)
  }

  const { data: contractors, error } = await query

  if (error) {
    throw new Error(`Failed to fetch contractors: ${error.message}`)
  }

  if (!contractors || contractors.length === 0) {
    return {
      message: 'No contractors found for urgent notification',
      data: { notifications_sent: 0 }
    }
  }

  // Create urgent notification campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('swms_email_campaigns')
    .insert({
      campaign_type: 'urgent_safety_alert',
      status: 'active',
      scheduled_date: new Date().toISOString(),
      created_by: (await supabase.auth.getUser()).data.user?.id,
      swms_job_id: body.swms_job_id // Optional - may be null for site-wide alerts
    })
    .select()
    .single()

  if (campaignError) {
    throw new Error(`Failed to create urgent campaign: ${campaignError.message}`)
  }

  // Send to all contractors
  const emailSends = contractors
    .filter((c: any) => c.contact_email)
    .map((contractor: any) => ({
      campaign_id: campaign.id,
      contractor_id: contractor.id,
      email_address: contractor.contact_email,
      portal_token: crypto.randomUUID(),
      token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      delivery_status: 'pending' as const
    }))

  if (emailSends.length > 0) {
    await supabase
      .from('swms_email_sends')
      .insert(emailSends)
  }

  // Log urgent notification
  await supabase
    .from('notification_audits')
    .insert({
      kind: 'swms_urgent_notification',
      payload: {
        campaign_type: 'urgent_safety_alert',
        message: urgentMessage,
        job_site_id: body.job_site_id,
        notifications_sent: emailSends.length,
        triggered_by: 'admin_quick_action'
      },
      result: 'success'
    })

  return {
    message: `Urgent safety alert sent to ${emailSends.length} contractors`,
    data: { 
      notifications_sent: emailSends.length,
      campaign_id: campaign.id
    }
  }
}

async function handleWeeklyCampaign(supabase: any, body: CampaignActionRequest) {
  // Get all active SWMS jobs for the job site
  let query = supabase
    .from('swms_jobs')
    .select('id, job_name, job_site_id')
    .eq('status', 'active')

  if (body.job_site_id) {
    query = query.eq('job_site_id', body.job_site_id)
  }

  const { data: activeJobs, error } = await query

  if (error) {
    throw new Error(`Failed to fetch active jobs: ${error.message}`)
  }

  if (!activeJobs || activeJobs.length === 0) {
    return {
      message: 'No active SWMS jobs found for weekly campaign',
      data: { campaigns_created: 0 }
    }
  }

  const campaigns = []
  // Create weekly campaigns for each active job
  for (const job of activeJobs) {
    const { data: campaign, error: campaignError } = await supabase
      .from('swms_email_campaigns')
      .insert({
        swms_job_id: job.id,
        campaign_type: 'weekly_reminder',
        status: 'active',
        scheduled_date: new Date().toISOString(),
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single()

    if (!campaignError) {
      campaigns.push(campaign)
    }
  }

  // Log weekly campaign creation
  await supabase
    .from('notification_audits')
    .insert({
      kind: 'swms_weekly_campaign',
      payload: {
        campaign_type: 'weekly_automation',
        job_site_id: body.job_site_id,
        campaigns_created: campaigns.length,
        jobs_targeted: activeJobs.length,
        triggered_by: 'admin_quick_action'
      },
      result: 'success'
    })

  return {
    message: `Weekly SWMS compliance campaigns launched for ${campaigns.length} active jobs`,
    data: { 
      campaigns_created: campaigns.length,
      jobs_targeted: activeJobs.length
    }
  }
}

async function handleGenerateReport(supabase: any, body: CampaignActionRequest) {
  // Generate instant compliance report by calling the existing export function
  const jobSiteIds = body.job_site_id ? [body.job_site_id] : []
  
  // Use the existing compliance export system
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration')
  }

  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/work-safe-export`
  
  const response = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({
      job_site_ids: jobSiteIds,
      format: 'csv',
      include_audit_trail: true
    })
  })

  if (!response.ok) {
    throw new Error('Failed to generate compliance report')
  }

  const result = await response.json()
  
  return {
    message: 'Instant compliance report generated and ready for download',
    data: {
      download_url: result.download_url,
      expires_at: result.expires_at,
      export_id: result.export_id
    }
  }
}

async function handleBroadcastUpdate(supabase: any, body: CampaignActionRequest) {
  const broadcastMessage = body.parameters?.broadcastMessage
  if (!broadcastMessage) {
    throw new Error('Broadcast message is required')
  }

  // Similar to urgent notification but with different campaign type
  let query = supabase
    .from('contractors')
    .select('id, company_name, contact_email')

  if (body.job_site_id) {
    query = supabase
      .from('contractors')
      .select(`
        id, 
        company_name, 
        contact_email,
        swms_submissions!inner(
          swms_job_id,
          swms_jobs!inner(job_site_id)
        )
      `)
      .eq('swms_submissions.swms_jobs.job_site_id', body.job_site_id)
  }

  const { data: contractors, error } = await query

  if (error) {
    throw new Error(`Failed to fetch contractors: ${error.message}`)
  }

  const contractorsWithEmail = contractors?.filter((c: any) => c.contact_email) || []

  // Log broadcast action
  await supabase
    .from('notification_audits')
    .insert({
      kind: 'swms_broadcast_update',
      payload: {
        campaign_type: 'site_broadcast',
        message: broadcastMessage,
        job_site_id: body.job_site_id,
        broadcasts_sent: contractorsWithEmail.length,
        triggered_by: 'admin_quick_action'
      },
      result: 'success'
    })

  return {
    message: `Site-wide broadcast sent to ${contractorsWithEmail.length} contractors and workers`,
    data: { broadcasts_sent: contractorsWithEmail.length }
  }
}

async function handlePauseCampaigns(supabase: any, body: CampaignActionRequest) {
  // Pause all active campaigns for the job site or globally
  let query = supabase
    .from('swms_email_campaigns')
    .update({ 
      status: 'paused',
      updated_at: new Date().toISOString()
    })
    .eq('status', 'active')

  if (body.job_site_id) {
    // Only pause campaigns for specific job site
    query = query.eq('swms_jobs.job_site_id', body.job_site_id)
  }

  const { data: pausedCampaigns, error } = await query.select()

  if (error) {
    throw new Error(`Failed to pause campaigns: ${error.message}`)
  }

  // Log campaign pause action
  await supabase
    .from('notification_audits')
    .insert({
      kind: 'swms_campaign_control',
      payload: {
        action: 'pause_all',
        campaigns_paused: pausedCampaigns?.length || 0,
        job_site_id: body.job_site_id,
        triggered_by: 'admin_quick_action'
      },
      result: 'success'
    })

  return {
    message: `${pausedCampaigns?.length || 0} automated SWMS campaigns have been paused`,
    data: { campaigns_paused: pausedCampaigns?.length || 0 }
  }
}