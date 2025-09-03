import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const startDate = formData.get('start_date') as string
    const endDate = formData.get('end_date') as string
    const status = formData.get('status') as string

    // Validate required fields
    if (!name || !startDate) {
      return NextResponse.json(
        { error: 'Name and start date are required' },
        { status: 400 }
      )
    }

    // Verify job site exists
    const { data: jobSite, error: jobSiteError } = await supabase
      .from('job_sites')
      .select('id')
      .eq('id', params.id)
      .single()

    if (jobSiteError || !jobSite) {
      return NextResponse.json(
        { error: 'Job site not found' },
        { status: 404 }
      )
    }

    // Create SWMS job
    const { data: swmsJob, error } = await supabase
      .from('swms_jobs')
      .insert({
        job_site_id: params.id,
        name: name.trim(),
        description: description?.trim() || null,
        start_date: startDate,
        end_date: endDate || null,
        status: status || 'planned'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create SWMS job' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: swmsJob })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}