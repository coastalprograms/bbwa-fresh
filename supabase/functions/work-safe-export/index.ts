import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface WorkSafeExportRequest {
  job_site_ids: string[]
  format: 'pdf' | 'csv'
  include_audit_trail?: boolean
}

interface WorkSafeExportResponse {
  success: boolean
  export_id: string
  download_url?: string
  expires_at?: string
  error?: string
}

interface ComplianceExportData {
  job_site_id: string
  job_site_name: string
  contractors: {
    id: string
    company_name: string
    abn: string
    submission_date: string | null
    document_url: string | null
    status: 'submitted' | 'pending' | 'overdue'
  }[]
  export_date: string
  compliance_rate: number
  audit_trail: {
    action: string
    timestamp: string
    user: string
    details: string
  }[]
}

Deno.serve(async (req: Request) => {
  const started = Date.now()
  let exportId = ''

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
    const requestBody: WorkSafeExportRequest = await req.json()
    const { job_site_ids, format, include_audit_trail = false } = requestBody

    if (!job_site_ids || !Array.isArray(job_site_ids) || job_site_ids.length === 0) {
      throw new Error('Missing or invalid job_site_ids parameter')
    }

    if (!format || !['pdf', 'csv'].includes(format)) {
      throw new Error('Invalid format parameter. Must be "pdf" or "csv"')
    }

    exportId = crypto.randomUUID()
    console.log(`Starting Work Safe compliance export ${exportId} for ${job_site_ids.length} job sites, format: ${format}`)

    // Aggregate compliance data from all relevant tables
    const complianceData = await aggregateComplianceData(supabase, job_site_ids, include_audit_trail)
    
    // Generate the compliance report in the requested format
    const reportContent = format === 'pdf' 
      ? await generatePDFReport(complianceData)
      : generateCSVReport(complianceData)

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `work-safe-compliance-${timestamp}-${exportId}.${format}`
    
    // Store the report in Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('compliance-exports')
      .upload(filename, reportContent, {
        contentType: format === 'pdf' ? 'application/pdf' : 'text/csv',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Failed to store export file: ${uploadError.message}`)
    }

    // Generate signed URL with 24-hour expiry
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('compliance-exports')
      .createSignedUrl(filename, 24 * 60 * 60) // 24 hours

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw new Error(`Failed to create download URL: ${signedUrlError?.message}`)
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    // Log the export activity for audit purposes
    await supabase
      .from('compliance_export_logs')
      .insert({
        export_id: exportId,
        job_site_ids,
        format,
        filename,
        include_audit_trail,
        file_size: reportContent.byteLength || reportContent.length,
        expires_at: expiresAt,
        created_at: new Date().toISOString()
      })

    console.log(`Work Safe compliance export ${exportId} completed successfully`)

    const response: WorkSafeExportResponse = {
      success: true,
      export_id: exportId,
      download_url: signedUrlData.signedUrl,
      expires_at: expiresAt
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
    console.error('Work Safe compliance export failed:', errorMessage)

    const response: WorkSafeExportResponse = {
      success: false,
      export_id: exportId || crypto.randomUUID(),
      error: errorMessage
    }

    return new Response(
      JSON.stringify(response),
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
    console.log(`work-safe-export completed in ${duration}ms`)
  }
})

// Aggregate compliance data from database
async function aggregateComplianceData(
  supabase: any,
  jobSiteIds: string[],
  includeAuditTrail: boolean
): Promise<ComplianceExportData[]> {
  const results: ComplianceExportData[] = []

  for (const jobSiteId of jobSiteIds) {
    // Get job site information
    const { data: jobSite, error: jobSiteError } = await supabase
      .from('job_sites')
      .select('id, name')
      .eq('id', jobSiteId)
      .single()

    if (jobSiteError || !jobSite) {
      console.warn(`Job site ${jobSiteId} not found, skipping`)
      continue
    }

    // Get all SWMS jobs for this job site
    const { data: swmsJobs, error: swmsJobsError } = await supabase
      .from('swms_jobs')
      .select('id')
      .eq('job_site_id', jobSiteId)

    if (swmsJobsError) {
      throw new Error(`Failed to fetch SWMS jobs for site ${jobSiteId}: ${swmsJobsError.message}`)
    }

    const swmsJobIds = swmsJobs?.map(job => job.id) || []

    // Get contractors and their submission status
    const { data: contractorsData, error: contractorsError } = await supabase
      .from('contractors')
      .select(`
        id,
        company_name,
        abn,
        swms_submissions!left(
          id,
          status,
          created_at,
          swms_job_id
        )
      `)
      .eq('swms_submissions.swms_job_id', 'in', swmsJobIds.length > 0 ? `(${swmsJobIds.join(',')})` : '()')

    if (contractorsError) {
      throw new Error(`Failed to fetch contractors for site ${jobSiteId}: ${contractorsError.message}`)
    }

    // Process contractor data
    const contractors = (contractorsData || []).map((contractor: any) => {
      const submissions = Array.isArray(contractor.swms_submissions) 
        ? contractor.swms_submissions 
        : contractor.swms_submissions ? [contractor.swms_submissions] : []
      
      // Find the most recent submission
      const latestSubmission = submissions
        .filter((sub: any) => sub && swmsJobIds.includes(sub.swms_job_id))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

      // Determine status based on submission
      let status: 'submitted' | 'pending' | 'overdue' = 'pending'
      if (latestSubmission) {
        status = latestSubmission.status === 'approved' ? 'submitted' : 'pending'
      } else {
        // Check if overdue (more than 7 days since SWMS job creation)
        const oldestJob = swmsJobs?.find(job => swmsJobIds.includes(job.id))
        if (oldestJob) {
          const jobCreated = new Date(oldestJob.created_at || Date.now())
          const daysSinceCreation = (Date.now() - jobCreated.getTime()) / (1000 * 60 * 60 * 24)
          if (daysSinceCreation > 7) {
            status = 'overdue'
          }
        }
      }

      return {
        id: contractor.id,
        company_name: contractor.company_name || 'Unknown',
        abn: contractor.abn || '',
        submission_date: latestSubmission?.created_at || null,
        document_url: null, // TODO: Implement document URL from submission data
        status
      }
    })

    // Calculate compliance rate
    const submittedCount = contractors.filter(c => c.status === 'submitted').length
    const complianceRate = contractors.length > 0 ? (submittedCount / contractors.length) * 100 : 0

    // Get audit trail if requested
    let auditTrail: any[] = []
    if (includeAuditTrail) {
      const { data: auditData, error: auditError } = await supabase
        .from('notification_audits')
        .select('*')
        .contains('payload', { job_site_id: jobSiteId })
        .order('created_at', { ascending: false })
        .limit(50)

      if (!auditError && auditData) {
        auditTrail = auditData.map((audit: any) => ({
          action: audit.kind || 'Unknown',
          timestamp: audit.created_at,
          user: 'System', // TODO: Extract user from audit payload
          details: JSON.stringify(audit.payload)
        }))
      }
    }

    results.push({
      job_site_id: jobSiteId,
      job_site_name: jobSite.name,
      contractors,
      export_date: new Date().toISOString(),
      compliance_rate: Math.round(complianceRate * 100) / 100,
      audit_trail: auditTrail
    })
  }

  return results
}

// Generate PDF report (placeholder - would use a PDF library like jsPDF or Puppeteer)
async function generatePDFReport(complianceData: ComplianceExportData[]): Promise<Uint8Array> {
  // For now, return a simple text-based "PDF" as a placeholder
  // In production, this would use a proper PDF generation library
  
  let content = `WORK SAFE COMPLIANCE REPORT
Generated: ${new Date().toLocaleString('en-AU')}

`

  complianceData.forEach((siteData, index) => {
    content += `JOB SITE ${index + 1}: ${siteData.job_site_name}
Job Site ID: ${siteData.job_site_id}
Compliance Rate: ${siteData.compliance_rate}%
Total Contractors: ${siteData.contractors.length}

CONTRACTOR STATUS:
`
    siteData.contractors.forEach(contractor => {
      content += `- ${contractor.company_name} (ABN: ${contractor.abn}): ${contractor.status.toUpperCase()}`
      if (contractor.submission_date) {
        content += ` (Submitted: ${new Date(contractor.submission_date).toLocaleDateString('en-AU')})`
      }
      content += `\n`
    })

    if (siteData.audit_trail.length > 0) {
      content += `\nAUDIT TRAIL:\n`
      siteData.audit_trail.slice(0, 10).forEach(audit => {
        content += `- ${new Date(audit.timestamp).toLocaleString('en-AU')}: ${audit.action}\n`
      })
    }

    content += `\n---\n\n`
  })

  return new TextEncoder().encode(content)
}

// Generate CSV report
function generateCSVReport(complianceData: ComplianceExportData[]): string {
  const headers = [
    'Job Site Name',
    'Job Site ID', 
    'Contractor Name',
    'ABN',
    'Status',
    'Submission Date',
    'Compliance Rate'
  ]

  const rows: string[] = [headers.join(',')]

  complianceData.forEach(siteData => {
    siteData.contractors.forEach(contractor => {
      const row = [
        `"${siteData.job_site_name}"`,
        `"${siteData.job_site_id}"`,
        `"${contractor.company_name}"`,
        `"${contractor.abn}"`,
        `"${contractor.status}"`,
        `"${contractor.submission_date ? new Date(contractor.submission_date).toLocaleDateString('en-AU') : ''}"`,
        `"${siteData.compliance_rate}%"`
      ]
      rows.push(row.join(','))
    })

    // Add empty row between job sites
    if (siteData !== complianceData[complianceData.length - 1]) {
      rows.push('')
    }
  })

  return rows.join('\n')
}