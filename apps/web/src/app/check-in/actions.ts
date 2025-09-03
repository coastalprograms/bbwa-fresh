'use server'

import { createClient } from '@/lib/supabase/server'
import { findNearestSite, type Coordinates, type JobSite } from '@/lib/geo'
import { cookies } from 'next/headers'
import { COMPLIANCE_REASONS, type ComplianceAlertPayload } from '@/types/compliance'
import { queueNonComplianceAlert, type ComplianceWebhookPayload } from '@/lib/alerts'

interface CheckInData {
  email: string
  coords: Coordinates
  csrfToken: string
  website: string // Honeypot field
}

interface CheckInResult {
  success?: boolean
  message?: string
  errors?: Record<string, string>
}

async function queueComplianceAlert(payload: ComplianceAlertPayload): Promise<void> {
  try {
    const webhookPayload: ComplianceWebhookPayload = {
      workerId: payload.workerId,
      workerName: payload.workerName,
      workerEmail: payload.workerEmail,
      siteId: payload.jobSiteId,
      siteName: payload.siteName,
      reason: payload.reason,
      occurredAt: new Date().toISOString(),
      type: 'compliance_alert'
    }
    
    const result = await queueNonComplianceAlert(webhookPayload)
    
    if (result.skipped) {
      console.log(`Compliance alert skipped: ${result.reason}`)
    } else if (result.success) {
      console.log(`Compliance alert sent successfully (audit ID: ${result.auditId})`)
    } else {
      console.error(`Compliance alert failed: ${result.error}`)
    }
  } catch (error) {
    console.error('Failed to queue compliance alert:', error)
  }
}

export async function checkIn(data: CheckInData): Promise<CheckInResult> {
  try {
    // Get CSRF token from cookies
    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrf_token')
    
    // Validate CSRF token
    if (!csrfCookie?.value || csrfCookie.value !== data.csrfToken) {
      return { errors: { form: 'Security validation failed. Please refresh the page and try again.' } }
    }
    
    // Check honeypot field (should be empty)
    if (data.website.trim() !== '') {
      return { errors: { form: 'Spam detection triggered. Please try again.' } }
    }
    
    // Server-side validation
    const errors: Record<string, string> = {}
    
    if (!data.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!data.coords) {
      errors.location = 'Location is required for check-in'
    }
    
    if (Object.keys(errors).length > 0) {
      return { errors }
    }
    
    const supabase = await createClient()
    const email = data.email.trim().toLowerCase()
    
    // 1. Find worker by email
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select('id, email, first_name, last_name')
      .eq('email', email)
      .single()
    
    if (workerError || !worker) {
      return { 
        errors: { 
          email: 'Worker not found. Please complete induction first or contact your supervisor.' 
        } 
      }
    }
    
    // 2. Get all active job sites first (needed for compliance alerts)
    const { data: jobSites, error: sitesError } = await supabase
      .from('job_sites')
      .select('id, name, lat, lng, radius_m, active')
      .eq('active', true)
    
    if (sitesError) {
      console.error('Error fetching job sites:', sitesError)
      return { 
        errors: { 
          form: 'Unable to retrieve job sites. Please try again or contact support.' 
        } 
      }
    }
    
    if (!jobSites || jobSites.length === 0) {
      return { 
        errors: { 
          location: 'No active job sites available. Please contact your supervisor.' 
        } 
      }
    }
    
    // 3. Find nearest site within radius (for compliance alert context)
    const nearestSite = findNearestSite(data.coords, jobSites as JobSite[])

    // 4. Check white card validity from certifications table
    const { data: certification, error: certError } = await supabase
      .from('certifications')
      .select('id, expiry_date, status')
      .eq('worker_id', worker.id)
      .eq('type', 'White Card')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (certError || !certification) {
      return { 
        errors: { 
          form: 'White card information missing. Please complete your induction or contact your supervisor.' 
        } 
      }
    }

    if (certification.status !== 'Valid') {
      return { 
        errors: { 
          form: 'Your white card is not validated. Please wait for approval or contact your supervisor.' 
        } 
      }
    }
    
    const expiryDate = new Date(certification.expiry_date || '')
    const now = new Date()
    
    // Check for expired white card - prevent entry and trigger compliance alert
    if (!certification.expiry_date || expiryDate <= now) {
      const workerName = `${worker.first_name} ${worker.last_name || ''}`.trim() || 'Unknown'
      
      // Queue compliance alert notification with site context
      await queueComplianceAlert({
        workerId: worker.id,
        workerName,
        workerEmail: worker.email,
        jobSiteId: nearestSite?.id,
        siteName: nearestSite?.name,
        reason: COMPLIANCE_REASONS.EXPIRED_WHITE_CARD
      })
      
      // Return exact error message from story requirements - do NOT create site_attendances
      return { 
        errors: { 
          form: 'Sorry, your white card is out of date. Do not enter the site. Please fill out a new form to upload your new white card.' 
        } 
      }
    }
    
    // Check if expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
    const isExpiringSoon = expiryDate <= thirtyDaysFromNow
    
    if (!nearestSite) {
      return { 
        errors: { 
          location: 'You are not within range of any active job site. Please move closer to a job site and try again.' 
        } 
      }
    }
    
    // 6. Check if worker already checked in today at this site
    const today = new Date().toISOString().split('T')[0]
    const { data: existingAttendance } = await supabase
      .from('site_attendances')
      .select('id')
      .eq('worker_id', worker.id)
      .eq('job_site_id', nearestSite.id)
      .gte('checked_in_at', `${today}T00:00:00Z`)
      .lt('checked_in_at', `${today}T23:59:59Z`)
      .single()
    
    if (existingAttendance) {
      return { 
        errors: { 
          form: `You have already checked in to ${nearestSite.name} today.` 
        } 
      }
    }
    
    // 7. Insert attendance record
    const { error: insertError } = await supabase
      .from('site_attendances')
      .insert({
        worker_id: worker.id,
        job_site_id: nearestSite.id,
        checked_in_at: new Date().toISOString(),
        lat: data.coords.lat,
        lng: data.coords.lng
      })
    
    if (insertError) {
      console.error('Error inserting attendance:', insertError)
      return { 
        errors: { 
          form: 'Failed to record check-in. Please try again or contact support.' 
        } 
      }
    }
    
    // Success response with optional warning
    let successMessage = `Successfully checked in to ${nearestSite.name}! Stay safe on site.`
    
    if (isExpiringSoon) {
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      successMessage += ` Note: Your white card expires in ${daysUntilExpiry} days.`
    }
    
    return { success: true, message: successMessage }
    
  } catch (error) {
    console.error('Check-in error:', error)
    return { 
      errors: { 
        form: 'An unexpected error occurred. Please try again or contact support.' 
      } 
    }
  }
}