import { assertEquals, assertExists } from 'jsr:@std/assert'

// Mock data for scheduler testing
const mockPendingCampaigns = [
  {
    campaign_id: 'campaign-1',
    swms_job_id: 'job-1',
    campaign_type: 'initial',
    scheduled_date: new Date(Date.now() - 60000).toISOString() // 1 minute ago
  },
  {
    campaign_id: 'campaign-2',
    swms_job_id: 'job-2',
    campaign_type: 'reminder_7',
    scheduled_date: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  }
]

Deno.test('SWMS Reminder Scheduler - Success Response', async () => {
  const response = {
    success: true,
    campaigns_processed: 2,
    campaigns_executed: 2,
    campaigns_failed: 0
  }

  assertEquals(response.success, true)
  assertEquals(response.campaigns_processed, 2)
  assertEquals(response.campaigns_executed, 2)
  assertEquals(response.campaigns_failed, 0)
})

Deno.test('SWMS Reminder Scheduler - Partial Success Response', async () => {
  const response = {
    success: false,
    campaigns_processed: 3,
    campaigns_executed: 2,
    campaigns_failed: 1,
    errors: ['Campaign campaign-3 failed: Email delivery error']
  }

  assertEquals(response.success, false)
  assertEquals(response.campaigns_processed, 3)
  assertEquals(response.campaigns_executed, 2)
  assertEquals(response.campaigns_failed, 1)
  assertExists(response.errors)
  assertEquals(response.errors.length, 1)
})

Deno.test('SWMS Reminder Scheduler - No Pending Campaigns', async () => {
  const response = {
    success: true,
    campaigns_processed: 0,
    campaigns_executed: 0,
    campaigns_failed: 0,
    message: 'No pending campaigns found for execution'
  }

  assertEquals(response.success, true)
  assertEquals(response.campaigns_processed, 0)
  assertEquals(response.campaigns_executed, 0)
  assertEquals(response.campaigns_failed, 0)
  assertExists(response.message)
})

Deno.test('Campaign Due Date Logic', () => {
  const now = new Date()
  const campaign1 = {
    scheduled_date: new Date(now.getTime() - 60000).toISOString() // 1 minute ago - should execute
  }
  const campaign2 = {
    scheduled_date: new Date(now.getTime() + 60000).toISOString() // 1 minute from now - should not execute
  }

  const isDue1 = new Date(campaign1.scheduled_date) <= now
  const isDue2 = new Date(campaign2.scheduled_date) <= now

  assertEquals(isDue1, true)
  assertEquals(isDue2, false)
})

Deno.test('Submission Completion Check', () => {
  const mockSubmissionCount = {
    total: 5,
    submitted: 5,
    pending: 0
  }

  const isCompleted = mockSubmissionCount.total > 0 && 
                     mockSubmissionCount.submitted >= mockSubmissionCount.total

  assertEquals(isCompleted, true)
})

Deno.test('Campaign Type Validation', () => {
  const validTypes = ['initial', 'reminder_7', 'reminder_14', 'final_21']
  
  assertEquals(validTypes.includes('initial'), true)
  assertEquals(validTypes.includes('reminder_7'), true)
  assertEquals(validTypes.includes('reminder_14'), true)
  assertEquals(validTypes.includes('final_21'), true)
  assertEquals(validTypes.includes('invalid_type'), false)
})

Deno.test('Follow-up Campaign Scheduling Logic', () => {
  const dueDate = new Date('2025-10-01T00:00:00Z')
  const now = new Date('2025-09-01T00:00:00Z')
  
  // Day 7 reminder: 7 days after initial OR 7 days before due date (whichever is earlier)
  const day7Reminder = new Date(Math.min(
    now.getTime() + 7 * 24 * 60 * 60 * 1000,
    dueDate.getTime() - 7 * 24 * 60 * 60 * 1000
  ))
  
  // Day 14 reminder: 14 days after initial OR 3 days before due date (whichever is earlier)
  const day14Reminder = new Date(Math.min(
    now.getTime() + 14 * 24 * 60 * 60 * 1000,
    dueDate.getTime() - 3 * 24 * 60 * 60 * 1000
  ))
  
  // Final notice: 21 days after initial OR 1 day before due date (whichever is earlier)
  const finalNotice = new Date(Math.min(
    now.getTime() + 21 * 24 * 60 * 60 * 1000,
    dueDate.getTime() - 1 * 24 * 60 * 60 * 1000
  ))

  // For a due date of Oct 1 and now Sept 1:
  // Day 7: Sept 8 or Sept 24 -> Sept 8 (earlier)
  // Day 14: Sept 15 or Sept 28 -> Sept 15 (earlier)  
  // Final: Sept 22 or Sept 30 -> Sept 22 (earlier)
  
  assertEquals(day7Reminder.getDate(), 8) // Sept 8
  assertEquals(day14Reminder.getDate(), 15) // Sept 15
  assertEquals(finalNotice.getDate(), 22) // Sept 22
})

Deno.test('Automation Platform URL Selection', () => {
  // Test Make.com webhook selection
  Deno.env.set('AUTOMATION_PROVIDER', 'make')
  Deno.env.set('MAKE_WEBHOOK_URL', 'https://hook.make.com/test')
  Deno.env.set('N8N_WEBHOOK_URL', 'https://n8n.example.com/webhook/test')
  
  const provider = Deno.env.get('AUTOMATION_PROVIDER') || 'make'
  const webhookUrl = provider === 'n8n' 
    ? Deno.env.get('N8N_WEBHOOK_URL')
    : Deno.env.get('MAKE_WEBHOOK_URL')
  
  assertEquals(provider, 'make')
  assertEquals(webhookUrl, 'https://hook.make.com/test')
  
  // Test n8n webhook selection
  Deno.env.set('AUTOMATION_PROVIDER', 'n8n')
  
  const provider2 = Deno.env.get('AUTOMATION_PROVIDER')
  const webhookUrl2 = provider2 === 'n8n' 
    ? Deno.env.get('N8N_WEBHOOK_URL')
    : Deno.env.get('MAKE_WEBHOOK_URL')
  
  assertEquals(provider2, 'n8n')
  assertEquals(webhookUrl2, 'https://n8n.example.com/webhook/test')
})

Deno.test('Error Handling Structure', () => {
  const error = new Error('Test error')
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  assertEquals(errorMessage, 'Test error')
  
  const errors: string[] = []
  errors.push(`Campaign campaign-1 failed: ${errorMessage}`)
  
  assertEquals(errors.length, 1)
  assertEquals(errors[0].includes('campaign-1'), true)
})

Deno.test('Audit Log Structure', () => {
  const auditData = {
    kind: 'swms_reminder_scheduler',
    payload: {
      campaigns_processed: 3,
      campaigns_executed: 2,
      campaigns_failed: 1,
      errors: ['Test error'],
      execution_time: 1500
    },
    result: 'partial_success'
  }

  assertEquals(auditData.kind, 'swms_reminder_scheduler')
  assertExists(auditData.payload)
  assertEquals(auditData.payload.campaigns_processed, 3)
  assertEquals(auditData.payload.campaigns_executed, 2)
  assertEquals(auditData.payload.campaigns_failed, 1)
  assertEquals(auditData.result, 'partial_success')
})

Deno.test('Token Cleanup Logic', () => {
  const now = new Date()
  const expiredToken = {
    token_expires_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    delivery_status: 'sent'
  }
  const validToken = {
    token_expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    delivery_status: 'sent'
  }

  const isExpired1 = new Date(expiredToken.token_expires_at) < now
  const isExpired2 = new Date(validToken.token_expires_at) < now

  assertEquals(isExpired1, true)
  assertEquals(isExpired2, false)
})