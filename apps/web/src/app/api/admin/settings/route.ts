import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all settings
    const { data: settings, error } = await supabase
      .from('app_settings')
      .select('key, value, updated_at')
      .order('key')

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    return NextResponse.json(settings || [])
  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const { key, value } = await request.json()

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    // Upsert the setting (insert or update)
    const { data, error } = await supabase
      .from('app_settings')
      .upsert([
        {
          key,
          value: JSON.stringify(value),
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        }
      ], {
        onConflict: 'key'
      })
      .select()

    if (error) {
      console.error('Error saving setting:', error)
      return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Settings API POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}