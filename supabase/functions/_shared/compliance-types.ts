export interface ComplianceNotificationRequest {
  workerId: string
  workerName: string
  workerEmail: string
  jobSiteId?: string
  siteName?: string
  reason: string
  timestamp: string
}

export interface ComplianceNotificationResponse {
  success: boolean
  alertId?: string
  emailSent?: boolean
  smsSent?: boolean
  errors?: {
    email?: string
    sms?: string
    database?: string
    validation?: string
    rateLimit?: string
    internal?: string
  }
}

export const COMPLIANCE_REASONS = {
  EXPIRED_WHITE_CARD: 'Expired white card',
  MISSING_CERTIFICATION: 'Missing certification',
  INVALID_CERTIFICATION: 'Invalid certification'
} as const

export type ComplianceReason = typeof COMPLIANCE_REASONS[keyof typeof COMPLIANCE_REASONS]

// Rate limiting constants
export const RATE_LIMIT_WINDOW_HOURS = 1
export const MAX_ALERTS_PER_WINDOW = 1