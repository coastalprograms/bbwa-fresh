// Shared TypeScript types for SWMS Email Automation System

export interface SwmsEmailRequest {
  swms_job_id: string
  campaign_type: 'initial' | 'reminder_7' | 'reminder_14' | 'final_21'
  test_mode?: boolean
}

export interface SwmsEmailResponse {
  success: boolean
  campaign_id?: string
  emails_sent: number
  errors?: string[]
}

export interface ContractorRecord {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone?: string
}

export interface SwmsJobDetails {
  id: string
  job_name: string
  description?: string
  requirements?: string
  due_date: string
  job_site: {
    id: string
    name: string
    address: string
  }
}

export interface EmailTemplate {
  id: string
  template_type: 'initial' | 'reminder_7' | 'reminder_14' | 'final_21'
  subject_template: string
  html_template: string
  text_template: string
  is_active: boolean
}

export interface EmailCampaign {
  id: string
  swms_job_id: string
  campaign_type: 'initial' | 'reminder_7' | 'reminder_14' | 'final_21'
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'failed'
  scheduled_date: string
  created_at: string
  updated_at: string
}

export interface EmailSend {
  id: string
  campaign_id: string
  contractor_id: string
  email_address: string
  portal_token: string
  token_expires_at: string
  sent_at?: string
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'test'
  opened_at?: string
  clicked_at?: string
  retry_count: number
  last_retry_at?: string
  created_at: string
}

export interface TemplateVariables {
  contractor_name: string
  company_name: string
  job_name: string
  job_site_name: string
  job_site_address: string
  days_remaining: number
  portal_url: string
  due_date: string
  contact_phone: string
  contact_email: string
}

export interface EmailPayload {
  to: string
  subject: string
  html: string
  text: string
  portal_token: string
  contractor_id: string
  campaign_id: string
}

export interface NotificationAudit {
  kind: string
  payload: Record<string, any>
  result: 'success' | 'failure' | 'partial_success'
}

export interface SchedulerResponse {
  success: boolean
  campaigns_processed: number
  campaigns_executed: number
  campaigns_failed: number
  errors?: string[]
}

export interface PendingCampaign {
  campaign_id: string
  swms_job_id: string
  campaign_type: string
  scheduled_date: string
}

export interface CampaignMetrics {
  total_campaigns: number
  active_campaigns: number
  completed_campaigns: number
  total_emails_sent: number
  total_emails_failed: number
  emails_opened: number
  portal_clicks: number
  open_rate: number
  click_rate: number
}

export interface SubmissionCount {
  total: number
  submitted: number
  pending: number
}

// Utility type for email automation provider
export type AutomationProvider = 'make' | 'n8n'

// Environment variable interface
export interface SwmsEmailEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  SITE_URL: string
  BUILDER_CONTACT_PHONE: string
  BUILDER_CONTACT_EMAIL: string
  AUTOMATION_PROVIDER: AutomationProvider
  MAKE_WEBHOOK_URL?: string
  N8N_WEBHOOK_URL?: string
}

// Error types for better error handling
export class SwmsEmailError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'SwmsEmailError'
  }
}

export class SwmsEmailConfigError extends SwmsEmailError {
  constructor(message: string, missingConfig?: string[]) {
    super(message, 'CONFIG_ERROR', { missingConfig })
    this.name = 'SwmsEmailConfigError'
  }
}

export class SwmsEmailDatabaseError extends SwmsEmailError {
  constructor(message: string, originalError?: any) {
    super(message, 'DATABASE_ERROR', { originalError })
    this.name = 'SwmsEmailDatabaseError'
  }
}

export class SwmsEmailDeliveryError extends SwmsEmailError {
  constructor(message: string, emailAddress?: string, provider?: string) {
    super(message, 'DELIVERY_ERROR', { emailAddress, provider })
    this.name = 'SwmsEmailDeliveryError'
  }
}