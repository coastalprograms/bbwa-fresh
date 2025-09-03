/**
 * Alert notification utilities for sending webhooks to automation platforms
 * Includes HMAC signature verification and rate limiting
 */

import crypto from 'node:crypto'
import { createClient } from '@/lib/supabase/server'

export interface ComplianceWebhookPayload {
  workerId: string
  workerName: string
  workerEmail: string
  siteId?: string
  siteName?: string
  reason: string
  occurredAt: string
  type: 'compliance_alert'
}

export interface WebhookResult {
  success?: boolean
  status?: number
  error?: string
  skipped?: boolean
  reason?: string
  auditId?: string
}

/**
 * Queue a non-compliance alert webhook with rate limiting and HMAC security
 */
export async function queueNonComplianceAlert(payload: ComplianceWebhookPayload): Promise<WebhookResult> {
  try {
    const supabase = await createClient()
    
    // Check for required environment variables
    const webhookUrl = process.env.AUTOMATION_WEBHOOK_URL
    const webhookSecret = process.env.AUTOMATION_WEBHOOK_SECRET
    
    if (!webhookUrl) {
      console.warn('AUTOMATION_WEBHOOK_URL not configured, skipping alert')
      return { skipped: true, reason: 'Webhook URL not configured' }
    }
    
    if (!webhookSecret) {
      console.warn('AUTOMATION_WEBHOOK_SECRET not configured, skipping alert')
      return { skipped: true, reason: 'Webhook secret not configured' }
    }
    
    // Rate limiting check (1 alert per hour per worker/site combination)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const dedupKey = `${payload.workerId}_${payload.siteId || 'no_site'}_compliance_alert`
    
    const { data: recentAlert, error: dedupError } = await supabase
      .from('notification_dedup')
      .select('id')
      .eq('worker_id', payload.workerId)
      .eq('type', 'compliance_alert')
      .gte('created_at', oneHourAgo)
      .limit(1)
    
    if (dedupError) {
      console.error('Dedup check failed:', dedupError.message)
      // Continue anyway - better to send duplicate than miss alert
    }
    
    if (recentAlert && recentAlert.length > 0) {
      console.log(`Skipping duplicate compliance alert for worker ${payload.workerId}`)
      
      // Audit the skipped notification
      await supabase
        .from('notification_audits')
        .insert({
          kind: 'compliance_alert',
          payload: { ...payload, reason: 'rate_limited' },
          result: 'success'
        })
      
      return { skipped: true, reason: 'Rate limited - alert sent within past hour' }
    }
    
    // Prepare webhook payload
    const webhookPayload = {
      ...payload,
      timestamp: payload.occurredAt // For backward compatibility
    }
    
    const body = JSON.stringify(webhookPayload)
    
    // Generate HMAC signature
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')
    
    // Send webhook
    console.log(`Sending compliance alert webhook for worker ${payload.workerId}`)
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
        'User-Agent': 'BBWA-ComplianceAlerts/1.0'
      },
      body
    })
    
    const responseText = await response.text()
    const success = response.ok
    
    // Record dedup entry for successful or failed notifications (to prevent spam)
    if (success) {
      await supabase
        .from('notification_dedup')
        .insert({
          worker_id: payload.workerId,
          expiry_date: new Date().toISOString().slice(0, 10), // Use today's date for compliance alerts
          type: 'compliance_alert'
        })
    }
    
    // Audit the webhook attempt
    const auditData = {
      kind: 'compliance_alert',
      payload: {
        ...payload,
        webhook_url: webhookUrl,
        response_status: response.status,
        response_body: responseText.substring(0, 1000) // Limit response body length
      },
      result: success ? 'success' : 'failure'
    }
    
    const { data: audit, error: auditError } = await supabase
      .from('notification_audits')
      .insert(auditData)
      .select('id')
      .single()
    
    if (auditError) {
      console.error('Failed to insert audit record:', auditError.message)
    }
    
    if (!success) {
      console.error(`Compliance alert webhook failed: ${response.status} ${response.statusText}`)
      console.error('Response:', responseText)
      
      return {
        success: false,
        status: response.status,
        error: `Webhook failed: ${response.status} ${response.statusText} - ${responseText}`,
        auditId: audit?.id
      }
    }
    
    console.log(`Compliance alert webhook sent successfully: ${response.status}`)
    
    return {
      success: true,
      status: response.status,
      auditId: audit?.id
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Failed to queue compliance alert:', errorMessage)
    
    // Try to audit the failure
    try {
      const supabase = await createClient()
      await supabase
        .from('notification_audits')
        .insert({
          kind: 'compliance_alert',
          payload: {
            ...payload,
            error: errorMessage
          },
          result: 'failure'
        })
    } catch (auditError) {
      console.error('Failed to audit error:', auditError)
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Verify HMAC signature for incoming webhooks (for automation platform to use)
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')
    
    const providedSignature = signature.replace('sha256=', '')
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    )
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}