import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

interface WorkerExpiry {
  worker_id: string
  first_name: string
  last_name: string | null
  email: string
  expiry_date: string
}

interface BuilderPayload {
  type: 'builder_summary'
  generated_at: string
  expiries: Array<{
    name: string
    email: string
    expiry_date: string
  }>
}

interface WorkerPayload {
  type: 'worker_notice'
  worker_id: string
  name: string
  email: string
  expiry_date: string
  induction_url: string | undefined
}

interface NotificationAudit {
  kind: string
  payload: any
  result: string
}

interface NotificationDedup {
  worker_id: string
  expiry_date: string
  type: string
}

Deno.serve(async (req: Request) => {
  const started = Date.now()
  let auditResult = 'failure'
  let expiriesCount = 0
  
  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Calculate date range (today to 30 days from now)
    const today = new Date().toISOString().slice(0, 10)
    const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    
    console.log(`Checking for expiries between ${today} and ${in30}`)
    
    // Query workers with certifications expiring between today and in30
    const { data: rawExpiries, error: queryError } = await supabase
      .from('workers')
      .select(`
        id,
        first_name,
        last_name,
        email,
        certifications!inner(
          status,
          expiry_date,
          created_at,
          type
        )
      `)
      .eq('certifications.type', 'White Card')
      .eq('certifications.status', 'Valid')
      .gte('certifications.expiry_date', today)
      .lte('certifications.expiry_date', in30)
      .not('email', 'is', null)
    
    if (queryError) {
      throw new Error(`Query failed: ${queryError.message}`)
    }
    
    // Process workers data to get latest certification per worker
    const expiries: WorkerExpiry[] = []
    
    if (rawExpiries && rawExpiries.length > 0) {
      // Group by worker and get latest certification
      const workerMap = new Map<string, any>()
      
      for (const worker of rawExpiries) {
        const workerId = worker.id
        const certs = Array.isArray(worker.certifications) ? worker.certifications : [worker.certifications]
        
        // Get latest certification for this worker
        const latestCert = certs
          .filter((cert: any) => cert && cert.expiry_date)
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        
        if (latestCert && latestCert.expiry_date >= today && latestCert.expiry_date <= in30) {
          workerMap.set(workerId, {
            worker_id: workerId,
            first_name: worker.first_name,
            last_name: worker.last_name,
            email: worker.email,
            expiry_date: latestCert.expiry_date
          })
        }
      }
      
      expiries.push(...workerMap.values())
    }
    
    if (expiries.length === 0) {
      console.log('No expiring certifications found')
      auditResult = 'success'
      
      // Still audit the successful run with zero results
      await supabase
        .from('notification_audits')
        .insert({
          kind: 'expiry_reminders',
          payload: { count: 0, date_range: { from: today, to: in30 } },
          result: 'success'
        })
      
      return new Response(
        JSON.stringify({ ok: true, count: 0, message: 'No expiring certifications found' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Filter out duplicates using dedup table (7-day cooldown)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    
    const filteredExpiries: WorkerExpiry[] = []
    
    for (const expiry of expiries) {
      // Check if we've already sent a notification for this worker/expiry within 7 days
      const { data: existing, error: dedupError } = await supabase
        .from('notification_dedup')
        .select('id')
        .eq('worker_id', expiry.worker_id)
        .eq('expiry_date', expiry.expiry_date)
        .eq('type', 'expiry')
        .gte('created_at', sevenDaysAgo)
        .limit(1)
      
      if (dedupError) {
        console.warn(`Dedup check failed for worker ${expiry.worker_id}:`, dedupError.message)
        // Continue anyway - better to send duplicate than miss notification
      }
      
      if (!existing || existing.length === 0) {
        filteredExpiries.push(expiry)
      } else {
        console.log(`Skipping duplicate notification for worker ${expiry.worker_id}, expiry ${expiry.expiry_date}`)
      }
    }
    
    if (filteredExpiries.length === 0) {
      console.log('All expiring certifications were filtered out due to recent notifications')
      auditResult = 'success'
      
      await supabase
        .from('notification_audits')
        .insert({
          kind: 'expiry_reminders',
          payload: { 
            total_found: expiries.length, 
            filtered_count: 0, 
            reason: 'all_filtered_duplicates',
            date_range: { from: today, to: in30 }
          },
          result: 'success'
        })
      
      return new Response(
        JSON.stringify({ ok: true, count: 0, message: 'All notifications filtered due to recent duplicates' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    expiriesCount = filteredExpiries.length
    
    // Build payloads
    const builderPayload: BuilderPayload = {
      type: 'builder_summary',
      generated_at: new Date().toISOString(),
      expiries: filteredExpiries.map(e => ({
        name: `${e.first_name} ${e.last_name || ''}`.trim() || e.email,
        email: e.email,
        expiry_date: e.expiry_date
      }))
    }
    
    const workerPayloads: WorkerPayload[] = filteredExpiries.map(e => ({
      type: 'worker_notice',
      worker_id: e.worker_id,
      name: `${e.first_name} ${e.last_name || ''}`.trim() || e.email,
      email: e.email,
      expiry_date: e.expiry_date,
      induction_url: Deno.env.get('INDUCTION_URL')
    }))
    
    // Determine webhook URL based on provider
    const provider = Deno.env.get('AUTOMATION_PROVIDER') || 'make'
    const webhookUrl = provider === 'n8n' 
      ? Deno.env.get('N8N_WEBHOOK_URL') 
      : Deno.env.get('MAKE_WEBHOOK_URL')
    
    if (!webhookUrl) {
      throw new Error(`Webhook URL not configured for provider: ${provider}`)
    }
    
    // Send to automation platform
    const webhookPayload = {
      builder: builderPayload,
      workers: workerPayloads
    }
    
    console.log(`Sending ${filteredExpiries.length} notifications to ${provider} webhook`)
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'BBWA-ExpiryReminders/1.0'
      },
      body: JSON.stringify(webhookPayload)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Automation webhook failed: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    // Record dedup entries for successful notifications
    const dedupInserts: NotificationDedup[] = filteredExpiries.map(e => ({
      worker_id: e.worker_id,
      expiry_date: e.expiry_date,
      type: 'expiry'
    }))
    
    const { error: dedupError } = await supabase
      .from('notification_dedup')
      .insert(dedupInserts)
    
    if (dedupError) {
      console.warn('Failed to insert dedup records:', dedupError.message)
      // Don't fail the whole operation for this
    }
    
    auditResult = 'success'
    
    // Audit successful run
    const auditData: NotificationAudit = {
      kind: 'expiry_reminders',
      payload: {
        count: filteredExpiries.length,
        provider,
        webhook_url: webhookUrl,
        date_range: { from: today, to: in30 },
        workers: filteredExpiries.map(e => ({
          worker_id: e.worker_id,
          expiry_date: e.expiry_date
        }))
      },
      result: 'success'
    }
    
    await supabase
      .from('notification_audits')
      .insert(auditData)
    
    console.log(`Successfully sent ${filteredExpiries.length} expiry reminder notifications`)
    
    return new Response(
      JSON.stringify({ 
        ok: true, 
        count: filteredExpiries.length,
        provider,
        message: `Sent ${filteredExpiries.length} expiry notifications`
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Expiry reminders failed:', errorMessage)
    
    // Audit failure
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        
        const auditData: NotificationAudit = {
          kind: 'expiry_reminders',
          payload: {
            error: errorMessage,
            count: expiriesCount,
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
        ok: false, 
        error: errorMessage,
        count: expiriesCount
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } finally {
    const duration = Date.now() - started
    console.log(`expiry-reminders completed in ${duration}ms, result: ${auditResult}`)
  }
})