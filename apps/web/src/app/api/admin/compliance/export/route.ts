import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface ExportRequest {
  job_site_ids: string[]
  format: 'pdf' | 'csv'
  include_audit_trail?: boolean
}

interface ExportResponse {
  success: boolean
  export_id?: string
  download_url?: string
  expires_at?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Parse request body
    const body: ExportRequest = await request.json()
    
    if (!body.job_site_ids || !Array.isArray(body.job_site_ids) || body.job_site_ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid job_site_ids parameter' },
        { status: 400 }
      )
    }

    if (!body.format || !['pdf', 'csv'].includes(body.format)) {
      return NextResponse.json(
        { error: 'Invalid format parameter. Must be "pdf" or "csv"' },
        { status: 400 }
      )
    }

    // Call the Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/work-safe-export`
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        job_site_ids: body.job_site_ids,
        format: body.format,
        include_audit_trail: body.include_audit_trail || false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Edge Function failed:', response.status, errorText)
      return NextResponse.json(
        { error: 'Export service unavailable' },
        { status: 502 }
      )
    }

    const result: ExportResponse = await response.json()
    
    if (!result.success) {
      console.error('Edge Function returned error:', result.error)
      return NextResponse.json(
        { error: result.error || 'Export failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Compliance export API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}