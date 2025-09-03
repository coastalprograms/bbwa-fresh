import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface TrackingRequest {
  token?: string
  type?: 'open' | 'click'
  email?: string
  timestamp?: string
  user_agent?: string
  ip_address?: string
}

interface TrackingResponse {
  success: boolean
  message?: string
  error?: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return handlePixelTracking(req, supabase)
      case 'POST':
        return handleWebhookTracking(req, supabase)
      default:
        return new Response('Method not allowed', { 
          status: 405, 
          headers: corsHeaders 
        })
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Email tracking error:', errorMessage)

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})

// Handle pixel tracking for email opens (GET request)
async function handlePixelTracking(req: Request, supabase: any): Promise<Response> {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  
  if (!token) {
    // Return 1x1 transparent pixel even for invalid requests
    return new Response(
      atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),
      {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          ...corsHeaders
        }
      }
    )
  }

  try {
    // Track email open
    const { data: tracked } = await supabase.rpc('track_email_engagement', {
      portal_token_param: token,
      engagement_type: 'open'
    })

    if (tracked) {
      console.log(`Email opened: token=${token}`)
    }

  } catch (error) {
    console.error('Failed to track email open:', error)
    // Don't fail the response - return pixel anyway
  }

  // Return 1x1 transparent pixel
  return new Response(
    atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),
    {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...corsHeaders
      }
    }
  )
}

// Handle webhook tracking for email events (POST request)
async function handleWebhookTracking(req: Request, supabase: any): Promise<Response> {
  const requestBody: TrackingRequest = await req.json()
  const { token, type, email, timestamp, user_agent, ip_address } = requestBody

  if (!token || !type) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: token and type' 
      }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }

  if (!['open', 'click'].includes(type)) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Invalid type. Must be "open" or "click"' 
      }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }

  try {
    // Track the engagement
    const { data: tracked } = await supabase.rpc('track_email_engagement', {
      portal_token_param: token,
      engagement_type: type
    })

    if (!tracked) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired token' 
        }),
        { 
          status: 404,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Log additional metadata for audit trail
    await supabase
      .from('notification_audits')
      .insert({
        kind: 'swms_email_tracking',
        payload: {
          token,
          type,
          email,
          timestamp: timestamp || new Date().toISOString(),
          user_agent,
          ip_address: ip_address || req.headers.get('CF-Connecting-IP') || req.headers.get('X-Forwarded-For')
        },
        result: 'success'
      })

    console.log(`Email ${type} tracked: token=${token}, email=${email}`)

    const response: TrackingResponse = {
      success: true,
      message: `Email ${type} tracked successfully`
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
    console.error(`Failed to track email ${type}:`, errorMessage)

    // Audit the failure
    try {
      await supabase
        .from('notification_audits')
        .insert({
          kind: 'swms_email_tracking',
          payload: {
            token,
            type,
            email,
            error: errorMessage,
            timestamp: timestamp || new Date().toISOString()
          },
          result: 'failure'
        })
    } catch (auditError) {
      console.error('Failed to audit tracking error:', auditError)
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to track email engagement' 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
}