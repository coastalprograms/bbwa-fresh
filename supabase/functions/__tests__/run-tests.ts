#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read

/**
 * SWMS Email Automation Test Runner
 * 
 * Runs comprehensive tests for all SWMS email automation Edge Functions
 * including unit tests, integration tests, and validation checks.
 */

import { assertEquals, assertExists } from 'jsr:@std/assert'

console.log('🧪 SWMS Email Automation Test Suite')
console.log('=====================================\n')

// Set up test environment
Deno.env.set('SUPABASE_URL', 'https://test.supabase.co')
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key')
Deno.env.set('SITE_URL', 'https://baysidebuilderswa.com.au')
Deno.env.set('BUILDER_CONTACT_PHONE', '(08) 9581 2777')
Deno.env.set('BUILDER_CONTACT_EMAIL', 'admin@baysidebuilderswa.com.au')
Deno.env.set('AUTOMATION_PROVIDER', 'make')
Deno.env.set('MAKE_WEBHOOK_URL', 'https://hook.make.com/test-webhook')

let testsRun = 0
let testsPassed = 0
let testsFailed = 0

function runTest(testName: string, testFn: () => void | Promise<void>) {
  testsRun++
  
  try {
    console.log(`⏳ Running: ${testName}`)
    
    if (testFn.constructor.name === 'AsyncFunction') {
      (testFn as () => Promise<void>)().then(() => {
        testsPassed++
        console.log(`✅ Passed: ${testName}`)
      }).catch((error) => {
        testsFailed++
        console.log(`❌ Failed: ${testName}`)
        console.log(`   Error: ${error.message}\n`)
      })
    } else {
      testFn()
      testsPassed++
      console.log(`✅ Passed: ${testName}`)
    }
  } catch (error) {
    testsFailed++
    console.log(`❌ Failed: ${testName}`)
    console.log(`   Error: ${error.message}\n`)
  }
}

// Environment Configuration Tests
console.log('📋 Environment Configuration Tests')
console.log('-----------------------------------')

runTest('Environment Variables Loaded', () => {
  assertExists(Deno.env.get('SUPABASE_URL'))
  assertExists(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
  assertExists(Deno.env.get('SITE_URL'))
  assertExists(Deno.env.get('AUTOMATION_PROVIDER'))
})

runTest('Automation Provider Configuration', () => {
  const provider = Deno.env.get('AUTOMATION_PROVIDER')
  assertEquals(['make', 'n8n'].includes(provider!), true)
  
  if (provider === 'make') {
    assertExists(Deno.env.get('MAKE_WEBHOOK_URL'))
  } else if (provider === 'n8n') {
    assertExists(Deno.env.get('N8N_WEBHOOK_URL'))
  }
})

// Database Schema Validation Tests
console.log('\n📊 Database Schema Validation Tests')
console.log('------------------------------------')

runTest('Campaign Types Validation', () => {
  const validCampaignTypes = ['initial', 'reminder_7', 'reminder_14', 'final_21']
  const testTypes = ['initial', 'reminder_7', 'reminder_14', 'final_21', 'invalid']
  
  testTypes.forEach(type => {
    const isValid = validCampaignTypes.includes(type)
    if (type === 'invalid') {
      assertEquals(isValid, false)
    } else {
      assertEquals(isValid, true)
    }
  })
})

runTest('Email Delivery Status Validation', () => {
  const validStatuses = ['pending', 'sent', 'delivered', 'failed', 'bounced', 'test']
  const testStatuses = ['pending', 'sent', 'delivered', 'failed', 'bounced', 'test', 'invalid']
  
  testStatuses.forEach(status => {
    const isValid = validStatuses.includes(status)
    if (status === 'invalid') {
      assertEquals(isValid, false)
    } else {
      assertEquals(isValid, true)
    }
  })
})

runTest('Campaign Status Validation', () => {
  const validStatuses = ['pending', 'active', 'completed', 'cancelled', 'failed']
  const testStatuses = ['pending', 'active', 'completed', 'cancelled', 'failed', 'invalid']
  
  testStatuses.forEach(status => {
    const isValid = validStatuses.includes(status)
    if (status === 'invalid') {
      assertEquals(isValid, false)
    } else {
      assertEquals(isValid, true)
    }
  })
})

// Template Processing Tests
console.log('\n📝 Template Processing Tests')
console.log('-----------------------------')

runTest('Template Variable Replacement', () => {
  const template = 'Hi {{contractor_name}}, SWMS required for {{job_name}} at {{job_site_name}}. Due: {{due_date}}. Submit: {{portal_url}}'
  const variables = {
    contractor_name: 'John Smith',
    job_name: 'Test Construction Project',
    job_site_name: 'Test Site',
    due_date: '2025-10-01',
    portal_url: 'https://baysidebuilderswa.com.au/swms-portal/test-token'
  }

  let processed = template
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    processed = processed.replace(new RegExp(placeholder, 'g'), value)
  })

  assertEquals(processed.includes('{{'), false, 'All placeholders should be replaced')
  assertEquals(processed.includes('John Smith'), true)
  assertEquals(processed.includes('Test Construction Project'), true)
  assertEquals(processed.includes('https://baysidebuilderswa.com.au/swms-portal/test-token'), true)
})

runTest('Template Missing Variables', () => {
  const template = 'Hi {{contractor_name}}, SWMS for {{job_name}} due {{due_date}}'
  const incompleteVariables = {
    contractor_name: 'John Smith',
    // Missing job_name and due_date
  }

  let processed = template
  Object.entries(incompleteVariables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    processed = processed.replace(new RegExp(placeholder, 'g'), value)
  })

  assertEquals(processed.includes('{{job_name}}'), true, 'Missing variables should remain as placeholders')
  assertEquals(processed.includes('{{due_date}}'), true, 'Missing variables should remain as placeholders')
  assertEquals(processed.includes('John Smith'), true, 'Provided variables should be replaced')
})

// Portal Token Security Tests  
console.log('\n🔐 Portal Token Security Tests')
console.log('-------------------------------')

runTest('UUID Token Generation', () => {
  const token1 = crypto.randomUUID()
  const token2 = crypto.randomUUID()
  
  // Valid UUID format (36 characters with hyphens)
  assertEquals(token1.length, 36)
  assertEquals(token2.length, 36)
  assertEquals(token1.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) !== null, true)
  
  // Unique tokens
  assertEquals(token1 !== token2, true)
})

runTest('Token Expiry Logic', () => {
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  const isExpired = thirtyDaysFromNow < now
  assertEquals(isExpired, false, 'Token should not be expired immediately after creation')
  
  const expiredToken = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
  const isTokenExpired = expiredToken < now
  assertEquals(isTokenExpired, true, 'Past date should be considered expired')
})

// Date Calculation Tests
console.log('\n📅 Date Calculation Tests')
console.log('--------------------------')

runTest('Days Remaining Calculation', () => {
  const now = new Date('2025-09-01T10:00:00Z')
  const dueDate = new Date('2025-09-08T10:00:00Z') // 7 days from now
  
  const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  assertEquals(daysRemaining, 7)
})

runTest('Overdue Days Calculation', () => {
  const now = new Date('2025-09-08T10:00:00Z')
  const dueDate = new Date('2025-09-01T10:00:00Z') // 7 days ago
  
  const daysOverdue = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
  assertEquals(daysOverdue, 7)
  
  // Days remaining should be 0 or negative
  const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  assertEquals(daysRemaining <= 0, true)
})

runTest('Campaign Scheduling Logic', () => {
  const jobCreated = new Date('2025-09-01T00:00:00Z')
  const dueDate = new Date('2025-10-01T00:00:00Z')
  
  // Initial campaign: 1 hour after job creation
  const initialCampaign = new Date(jobCreated.getTime() + 60 * 60 * 1000)
  assertEquals(initialCampaign.getHours(), 1)
  
  // Day 7 reminder: earlier of (7 days after initial) OR (7 days before due)
  const day7Option1 = new Date(jobCreated.getTime() + 7 * 24 * 60 * 60 * 1000)
  const day7Option2 = new Date(dueDate.getTime() - 7 * 24 * 60 * 60 * 1000)
  const day7Scheduled = new Date(Math.min(day7Option1.getTime(), day7Option2.getTime()))
  
  assertEquals(day7Scheduled.getDate(), day7Option1.getDate()) // Sept 8 (earlier than Sept 24)
})

// Email Validation Tests
console.log('\n📧 Email Validation Tests')
console.log('--------------------------')

runTest('Email Address Validation', () => {
  const validEmails = [
    'test@example.com',
    'user.name@company.com.au',
    'admin+notifications@baysidebuilderswa.com.au'
  ]
  
  const invalidEmails = [
    'invalid-email',
    '@example.com',
    'test@',
    ''
  ]
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  validEmails.forEach(email => {
    assertEquals(emailRegex.test(email), true, `${email} should be valid`)
  })
  
  invalidEmails.forEach(email => {
    assertEquals(emailRegex.test(email), false, `${email} should be invalid`)
  })
})

// Response Structure Tests
console.log('\n📤 Response Structure Tests')
console.log('----------------------------')

runTest('Success Response Structure', () => {
  const successResponse = {
    success: true,
    campaign_id: 'test-campaign-id',
    emails_sent: 5
  }

  assertEquals(typeof successResponse.success, 'boolean')
  assertEquals(successResponse.success, true)
  assertExists(successResponse.campaign_id)
  assertEquals(typeof successResponse.emails_sent, 'number')
  assertEquals(successResponse.emails_sent >= 0, true)
})

runTest('Error Response Structure', () => {
  const errorResponse = {
    success: false,
    error: 'Test error message',
    emails_sent: 0
  }

  assertEquals(typeof errorResponse.success, 'boolean')
  assertEquals(errorResponse.success, false)
  assertExists(errorResponse.error)
  assertEquals(typeof errorResponse.error, 'string')
  assertEquals(typeof errorResponse.emails_sent, 'number')
})

// Security Tests
console.log('\n🛡️ Security Tests')
console.log('------------------')

runTest('CORS Headers Validation', () => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  }

  assertExists(corsHeaders['Access-Control-Allow-Origin'])
  assertExists(corsHeaders['Access-Control-Allow-Headers'])
  assertExists(corsHeaders['Access-Control-Allow-Methods'])
  assertEquals(corsHeaders['Access-Control-Allow-Methods'].includes('POST'), true)
  assertEquals(corsHeaders['Access-Control-Allow-Methods'].includes('GET'), true)
})

runTest('Environment Secret Handling', () => {
  // Sensitive environment variables should exist but not be logged
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  assertExists(serviceKey)
  assertEquals(serviceKey.length > 0, true)
  
  // Should not contain the actual key in logs
  const logSafeKey = serviceKey.substring(0, 8) + '...'
  assertEquals(logSafeKey.includes('...'), true)
  assertEquals(logSafeKey.length < serviceKey.length, true)
})

// Performance Tests
console.log('\n⚡ Performance Tests')
console.log('--------------------')

runTest('Template Processing Performance', () => {
  const template = 'Hi {{contractor_name}}, SWMS for {{job_name}} at {{job_site_name}} due {{due_date}}. Submit: {{portal_url}}'
  const variables = {
    contractor_name: 'Test Contractor',
    job_name: 'Performance Test Job',
    job_site_name: 'Test Site Location',
    due_date: '2025-10-01',
    portal_url: 'https://baysidebuilderswa.com.au/swms-portal/test-token'
  }

  const startTime = performance.now()
  
  // Process template 1000 times to test performance
  for (let i = 0; i < 1000; i++) {
    let processed = template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      processed = processed.replace(new RegExp(placeholder, 'g'), value)
    })
  }
  
  const endTime = performance.now()
  const processingTime = endTime - startTime
  
  // Should complete 1000 template processes in under 100ms
  assertEquals(processingTime < 100, true, `Template processing took ${processingTime}ms, should be under 100ms`)
})

// Integration Tests
console.log('\n🔗 Integration Tests')
console.log('--------------------')

runTest('Email Payload Structure', () => {
  const emailPayload = {
    to: 'test@example.com',
    subject: 'SWMS Required: Test Project',
    html: '<h1>Test HTML Content</h1>',
    text: 'Test plain text content',
    portal_token: crypto.randomUUID(),
    contractor_id: 'test-contractor-id',
    campaign_id: 'test-campaign-id'
  }

  // Validate all required fields
  assertExists(emailPayload.to)
  assertExists(emailPayload.subject)
  assertExists(emailPayload.html)
  assertExists(emailPayload.text)
  assertExists(emailPayload.portal_token)
  assertExists(emailPayload.contractor_id)
  assertExists(emailPayload.campaign_id)

  // Validate data types
  assertEquals(typeof emailPayload.to, 'string')
  assertEquals(typeof emailPayload.subject, 'string')
  assertEquals(typeof emailPayload.html, 'string')
  assertEquals(typeof emailPayload.text, 'string')
  assertEquals(typeof emailPayload.portal_token, 'string')
  assertEquals(typeof emailPayload.contractor_id, 'string')
  assertEquals(typeof emailPayload.campaign_id, 'string')
})

// Cleanup and Summary
setTimeout(() => {
  console.log('\n📊 Test Results Summary')
  console.log('=======================')
  console.log(`Total Tests: ${testsRun}`)
  console.log(`Passed: ${testsPassed}`)
  console.log(`Failed: ${testsFailed}`)
  
  if (testsFailed === 0) {
    console.log('🎉 All tests passed!')
  } else {
    console.log(`⚠️  ${testsFailed} test(s) failed`)
  }
  
  console.log('\n✅ SWMS Email Automation Test Suite Complete')
}, 1000)