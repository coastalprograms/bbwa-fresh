import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface TimelineRequest {
  job_site_id: string
  days_back?: number
}

interface TimelineResponse {
  success: boolean
  timeline?: any[]
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<TimelineResponse>> {
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
    const body: TimelineRequest = await request.json()
    
    if (!body.job_site_id) {
      return NextResponse.json(
        { success: false, error: 'Missing job_site_id parameter' },
        { status: 400 }
      )
    }

    const daysBack = body.days_back || 30

    // Call the database function to get compliance timeline
    const { data: timelineData, error: timelineError } = await supabase
      .rpc('get_compliance_timeline', {
        job_site_id_param: body.job_site_id,
        days_back: daysBack
      })

    if (timelineError) {
      console.error('Failed to fetch compliance timeline:', timelineError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch compliance timeline' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      timeline: timelineData || []
    })

  } catch (error) {
    console.error('Timeline API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}