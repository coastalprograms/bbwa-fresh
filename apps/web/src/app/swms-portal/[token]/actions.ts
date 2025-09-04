'use server'

import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { headers } from 'next/headers'

interface TokenValidationResult {
  success: boolean
  data?: {
    swmsJob: {
      id: string
      name: string
      description: string | null
      start_date: string
      end_date: string | null
      status: string
      job_site_id: string
      contractor_id: string | null
    }
    jobSite: {
      id: string
      name: string
      address: string
      lat: number | null
      lng: number | null
    }
    contractor: {
      id: string
      company_name: string
      contact_email: string
      abn: string | null
    }
  }
  error?: string
}

/**
 * Validate SWMS portal access token
 * Checks if token exists, is not expired, and job is active
 */
export async function validateSwmsToken(token: string): Promise<TokenValidationResult> {
  try {
    // Rate limiting check
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const clientIp = forwardedFor?.split(',')[0]?.trim() || 'unknown'
    
    const rateLimit = checkRateLimit(clientIp, RATE_LIMITS.TOKEN_VALIDATION)
    if (rateLimit.blocked) {
      return {
        success: false,
        error: 'Too many validation attempts. Please wait before trying again.'
      }
    }

    // Input validation
    if (!token || typeof token !== 'string') {
      return { 
        success: false, 
        error: 'Invalid token format' 
      }
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(token)) {
      return { 
        success: false, 
        error: 'Invalid token format' 
      }
    }

    const supabase = createClient()

    // Query swms_jobs with related data
    const { data: swmsJob, error: jobError } = await supabase
      .from('swms_jobs')
      .select(`
        id,
        name,
        description,
        start_date,
        end_date,
        status,
        job_site_id,
        contractor_id,
        access_token,
        token_expires_at,
        job_sites (
          id,
          name,
          address,
          lat,
          lng
        ),
        contractors (
          id,
          company_name,
          contact_email,
          abn
        )
      `)
      .eq('access_token', token)
      .single()

    if (jobError) {
      console.error('Token validation error:', jobError)
      return { 
        success: false, 
        error: 'Invalid or expired token' 
      }
    }

    if (!swmsJob) {
      return { 
        success: false, 
        error: 'Invalid or expired token' 
      }
    }

    // Check if token is expired
    if (new Date(swmsJob.token_expires_at) <= new Date()) {
      return { 
        success: false, 
        error: 'Token has expired' 
      }
    }

    // Check if job is active
    if (swmsJob.status !== 'active') {
      return { 
        success: false, 
        error: 'SWMS job is not currently active' 
      }
    }

    // Ensure contractor is assigned
    if (!swmsJob.contractor_id || !swmsJob.contractors) {
      return { 
        success: false, 
        error: 'No contractor assigned to this SWMS job' 
      }
    }

    // Ensure job site exists
    if (!swmsJob.job_sites) {
      return { 
        success: false, 
        error: 'Job site not found' 
      }
    }

    return {
      success: true,
      data: {
        swmsJob: {
          id: swmsJob.id,
          name: swmsJob.name,
          description: swmsJob.description,
          start_date: swmsJob.start_date,
          end_date: swmsJob.end_date,
          status: swmsJob.status,
          job_site_id: swmsJob.job_site_id,
          contractor_id: swmsJob.contractor_id
        },
        jobSite: Array.isArray(swmsJob.job_sites) ? swmsJob.job_sites[0] : swmsJob.job_sites,
        contractor: Array.isArray(swmsJob.contractors) ? swmsJob.contractors[0] : swmsJob.contractors
      }
    }

  } catch (error) {
    console.error('Unexpected error validating token:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    }
  }
}

/**
 * Get submission status for a specific SWMS job and contractor
 */
export async function getSubmissionStatus(swmsJobId: string, contractorId: string) {
  try {
    const supabase = createClient()

    const { data: submissions, error } = await supabase
      .from('swms_submissions')
      .select(`
        id,
        document_name,
        status,
        submitted_at,
        reviewed_at,
        notes
      `)
      .eq('swms_job_id', swmsJobId)
      .eq('contractor_id', contractorId)
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Error fetching submissions:', error)
      return { success: false, error: 'Failed to fetch submission status' }
    }

    return { success: true, data: submissions || [] }

  } catch (error) {
    console.error('Unexpected error fetching submissions:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Regenerate access token for a SWMS job (admin only)
 */
export async function regenerateSwmsToken(jobId: string, expiryDays: number = 7) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated (admin)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Use the database function to regenerate token
    const { data: newToken, error } = await supabase
      .rpc('regenerate_swms_token', { 
        job_id: jobId, 
        expiry_days: expiryDays 
      })

    if (error) {
      console.error('Error regenerating token:', error)
      return { success: false, error: 'Failed to regenerate token' }
    }

    return { success: true, token: newToken }

  } catch (error) {
    console.error('Unexpected error regenerating token:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}