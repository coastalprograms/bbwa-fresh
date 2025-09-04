import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface AuditTrailResponse {
  success: boolean
  audit_trail?: any[]
  email_activity?: any[]
  document_activity?: any[]
  error?: string
}

export async function GET(request: NextRequest): Promise<NextResponse<AuditTrailResponse>> {
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

    const { searchParams } = new URL(request.url)
    const jobSiteId = searchParams.get('job_site_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query for audit trail data
    let query = supabase
      .from('swms_audit_log')
      .select(`
        *,
        users:changed_by(email)
      `)
      .order('changed_at', { ascending: false })
      .limit(limit)

    // Add date filters if provided
    if (startDate) {
      query = query.gte('changed_at', startDate)
    }
    if (endDate) {
      query = query.lte('changed_at', endDate)
    }

    // Add job site filter if provided
    if (jobSiteId) {
      query = query.or(`record_id.eq.${jobSiteId},new_values->>job_site_id.eq.${jobSiteId},old_values->>job_site_id.eq.${jobSiteId}`)
    }

    const { data: auditData, error: auditError } = await query

    if (auditError) {
      console.error('Failed to fetch audit data:', auditError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch audit data' },
        { status: 500 }
      )
    }

    // Also get email audit data if relevant
    const { data: emailAuditData, error: emailError } = await supabase
      .rpc('get_recent_swms_email_activity', { limit_count: limit })

    if (emailError) {
      console.error('Failed to fetch email audit data:', emailError)
    }

    // Get document access logs
    const { data: documentAuditData, error: docError } = await supabase
      .from('document_access_log')
      .select(`
        *,
        compliance_documents(filename, document_type),
        users:accessed_by(email)
      `)
      .order('accessed_at', { ascending: false })
      .limit(limit)

    if (docError) {
      console.error('Failed to fetch document audit data:', docError)
    }

    return NextResponse.json({
      success: true,
      audit_trail: auditData || [],
      email_activity: emailAuditData || [],
      document_activity: documentAuditData || []
    })

  } catch (error) {
    console.error('Audit trail API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}