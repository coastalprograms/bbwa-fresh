import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, address, lat, lng, radius_m, active } = body

    // Validate required fields
    if (!name || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'Name, latitude, and longitude are required' },
        { status: 400 }
      )
    }

    // Create job site
    const { data, error } = await supabase
      .from('job_sites')
      .insert([
        {
          name,
          address: address || null,
          lat,
          lng,
          radius_m: radius_m || 500,
          active: active ?? true
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating job site:', error)
      return NextResponse.json(
        { error: 'Failed to create job site' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/admin/job-sites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}