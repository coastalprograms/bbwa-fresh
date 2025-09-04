/**
 * Critical P0 Integration Tests for SWMS Submission Workflow
 * Addresses TEST-001 high severity gap from QA gate
 */

import { uploadSwmsDocument } from '../actions/upload-actions'
import { validateSwmsToken } from '../[token]/actions'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn()
}))

// Mock Next.js headers
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn(() => '127.0.0.1')
  }))
}))

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn(() => ({
    blocked: false,
    remaining: 10,
    reset: Date.now() + 60000
  })),
  RATE_LIMITS: {
    FILE_UPLOAD: { windowMs: 60000, maxRequests: 10 },
    TOKEN_VALIDATION: { windowMs: 60000, maxRequests: 20 }
  }
}))

// Mock token validation
jest.mock('../[token]/actions', () => ({
  validateSwmsToken: jest.fn()
}))

describe('SWMS Submission Integration Tests', () => {
  let mockSupabase: any

  beforeAll(() => {
    // Basic mock setup - each test will configure its own behavior
    mockSupabase = {
      from: jest.fn(),
      storage: {
        from: jest.fn()
      },
      functions: {
        invoke: jest.fn()
      }
    }
  })

  const validTokenData = {
    id: 'job-123',
    name: 'Construction Safety Review',
    description: 'Required SWMS documentation',
    status: 'active',
    job_site_id: 'site-456',
    contractor_id: 'contractor-789',
    access_token: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    token_expires_at: new Date(Date.now() + 86400000).toISOString(),
    job_sites: {
      id: 'site-456',
      name: 'Perth CBD Development',
      address: '123 Murray Street, Perth WA'
    },
    contractors: {
      id: 'contractor-789',
      company_name: 'SafeWork Solutions',
      contact_email: 'admin@safework.com.au',
      abn: '12345678901'
    }
  }

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the createClient mock to return our mockSupabase
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    
    // Mock successful token validation by default
    (validateSwmsToken as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        swmsJob: {
          id: validTokenData.id,
          name: validTokenData.name,
          description: validTokenData.description,
          status: validTokenData.status,
          job_site_id: validTokenData.job_site_id,
          contractor_id: validTokenData.contractor_id
        },
        jobSite: validTokenData.job_sites,
        contractor: validTokenData.contractors
      }
    })
  })

  // Helper function to set up working Supabase mocks
  const setupSupabaseMocks = (submissionId: string, shouldSucceed: boolean = true) => {
    // Mock storage operations
    mockSupabase.storage.from.mockReturnValue({
      upload: jest.fn().mockResolvedValue({
        data: { path: 'test-path' },
        error: null
      }),
      createSignedUrl: jest.fn().mockResolvedValue({
        data: { signedUrl: 'https://example.com/signed-url' },
        error: null
      }),
      remove: jest.fn().mockResolvedValue({
        data: {},
        error: null
      })
    })

    // Mock database operations
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn()
        })
      }),
      insert: jest.fn()
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue(shouldSucceed ? {
              data: { id: submissionId },
              error: null
            } : {
              data: null,
              error: { code: 'DATABASE_ERROR', message: 'Insert failed' }
            })
          })
        })
        .mockResolvedValueOnce({
          data: {},
          error: null
        })
    })

    // Mock email and validation functions
    mockSupabase.functions.invoke.mockResolvedValue({
      data: { success: true },
      error: null
    })
  }

  describe('1.4-INT-006: Email confirmation integration', () => {
    test('sends email confirmation after successful upload', async () => {
      setupSupabaseMocks('submission-123')

      const formData = new FormData()
      formData.append('file', new File(['content'], 'safety-plan.pdf', { type: 'application/pdf' }))
      formData.append('swmsJobId', 'job-123')
      formData.append('contractorId', 'contractor-789')
      formData.append('token', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')

      const result = await uploadSwmsDocument(formData)
      console.log('Upload result:', result)

      expect(result.success).toBe(true)
      
      // Verify email confirmation was triggered
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
        'swms-email-confirmation',
        expect.objectContaining({
          body: expect.objectContaining({
            submission_id: 'submission-123',
            contractor_email: 'admin@safework.com.au',
            contractor_name: 'SafeWork Solutions',
            job_site_name: 'Perth CBD Development',
            document_name: 'safety-plan.pdf'
          })
        })
      )
    })

    test('continues upload even if email fails', async () => {
      setupSupabaseMocks('submission-123')
      
      // Override the email function to fail
      mockSupabase.functions.invoke
        .mockRejectedValueOnce(new Error('Email service unavailable'))

      const formData = new FormData()
      formData.append('file', new File(['content'], 'test.pdf', { type: 'application/pdf' }))
      formData.append('swmsJobId', 'job-123')
      formData.append('contractorId', 'contractor-789')
      formData.append('token', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')

      const result = await uploadSwmsDocument(formData)

      // Upload should still succeed even if email fails
      expect(result.success).toBe(true)
      expect(result.data?.submissionId).toBe('submission-123')
    })
  })

  describe('1.4-INT-011: Database submission record creation', () => {
    test('creates complete submission record with all required fields', async () => {
      setupSupabaseMocks('submission-abc123')

      const testFile = new File(
        ['Mock PDF content'], 
        'comprehensive-safety-plan.pdf', 
        { type: 'application/pdf' }
      )

      const formData = new FormData()
      formData.append('file', testFile)
      formData.append('swmsJobId', 'job-123')
      formData.append('contractorId', 'contractor-789')
      formData.append('token', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')

      const result = await uploadSwmsDocument(formData)

      expect(result.success).toBe(true)

      // Verify submission record was created with correct structure
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        swms_job_id: 'job-123',
        contractor_id: 'contractor-789',
        document_name: 'comprehensive-safety-plan.pdf',
        file_url: expect.stringContaining('documents/'),
        status: 'submitted',
        submitted_at: expect.any(String)
      })
    })

    test('cleans up uploaded file if database insert fails', async () => {
      setupSupabaseMocks('submission-fail', false) // Use false to trigger database failure

      const formData = new FormData()
      formData.append('file', new File(['content'], 'test.pdf', { type: 'application/pdf' }))
      formData.append('swmsJobId', 'job-123')
      formData.append('contractorId', 'contractor-789')
      formData.append('token', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')

      const result = await uploadSwmsDocument(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to create submission record')

      // Verify file cleanup was attempted (path will be dynamically generated)
      expect(mockSupabase.storage.from().remove).toHaveBeenCalled()
    })
  })

  describe('1.4-INT-012: Audit logging integration', () => {
    test('creates audit log entry for successful submission', async () => {
      setupSupabaseMocks('submission-audit-test')

      const testFile = new File(['audit test content'], 'audit-test.pdf', { type: 'application/pdf' })
      Object.defineProperty(testFile, 'size', { value: 2048 })

      const formData = new FormData()
      formData.append('file', testFile)
      formData.append('swmsJobId', 'job-123')
      formData.append('contractorId', 'contractor-789')
      formData.append('token', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')

      const result = await uploadSwmsDocument(formData)

      expect(result.success).toBe(true)

      // Verify audit log entry was created
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        swms_job_id: 'job-123',
        contractor_id: 'contractor-789',
        action: 'document_submitted',
        details: {
          submission_id: 'submission-audit-test',
          document_name: 'audit-test.pdf',
          file_size: 2048,
          file_type: 'application/pdf'
        },
        occurred_at: expect.any(String)
      })
    })
  })

  describe('1.4-INT-009: Security validation integration', () => {
    test('triggers file validation after successful upload', async () => {
      setupSupabaseMocks('submission-security-test')
      
      // Override functions to return specific validation results
      mockSupabase.functions.invoke
        .mockResolvedValueOnce({ data: { validation_result: { valid: true } }, error: null }) // Validator
        .mockResolvedValue({ data: {}, error: null }) // Email

      const testFile = new File(['security validation test'], 'security-test.pdf', { type: 'application/pdf' })
      Object.defineProperty(testFile, 'size', { value: 1024 })

      const formData = new FormData()
      formData.append('file', testFile)
      formData.append('swmsJobId', 'job-123')
      formData.append('contractorId', 'contractor-789')
      formData.append('token', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')

      const result = await uploadSwmsDocument(formData)

      expect(result.success).toBe(true)

      // Verify file validation was triggered
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
        'swms-file-validator',
        expect.objectContaining({
          body: {
            file_url: expect.stringContaining('swms-documents/job-sites/'),
            file_name: 'security-test.pdf',
            file_size: 1024,
            file_type: 'application/pdf',
            submission_id: 'submission-security-test',
            contractor_id: 'contractor-789'
          }
        })
      )
    })

    test('continues upload if validation fails non-critically', async () => {
      setupSupabaseMocks('submission-validation-fail')

      // Mock validation failure
      mockSupabase.functions.invoke
        .mockRejectedValueOnce(new Error('Validation service unavailable'))
        .mockResolvedValue({ data: {}, error: null }) // Email still works

      const formData = new FormData()
      formData.append('file', new File(['content'], 'test.pdf', { type: 'application/pdf' }))
      formData.append('swmsJobId', 'job-123')
      formData.append('contractorId', 'contractor-789')
      formData.append('token', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')

      const result = await uploadSwmsDocument(formData)

      // Upload should succeed even if validation fails
      expect(result.success).toBe(true)
      expect(result.data?.submissionId).toBe('submission-validation-fail')
    })
  })

  describe('End-to-End Happy Path', () => {
    test('completes full submission workflow successfully', async () => {
      setupSupabaseMocks('e2e-submission-success')
      
      // Override to use E2E specific results
      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: { path: 'e2e-test/comprehensive-safety-plan.pdf' },
          error: null
        }),
        createSignedUrl: jest.fn().mockResolvedValue({
          data: { signedUrl: 'https://storage.example.com/signed-url-e2e' },
          error: null
        }),
        remove: jest.fn()
      })

      mockSupabase.functions.invoke
        .mockResolvedValueOnce({ 
          data: { validation_result: { valid: true, risk_level: 'low' } }, 
          error: null 
        })
        .mockResolvedValueOnce({ 
          data: { message_id: 'email-sent-123' }, 
          error: null 
        })

      const comprehensiveFile = new File(
        ['Complete safety management system documentation...'], 
        'comprehensive-safety-plan.pdf',
        { type: 'application/pdf' }
      )
      Object.defineProperty(comprehensiveFile, 'size', { value: 5 * 1024 * 1024 }) // 5MB

      const formData = new FormData()
      formData.append('file', comprehensiveFile)
      formData.append('swmsJobId', 'job-123')
      formData.append('contractorId', 'contractor-789')
      formData.append('token', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')

      const result = await uploadSwmsDocument(formData)

      // Verify complete success
      expect(result.success).toBe(true)
      expect(result.data?.submissionId).toBe('e2e-submission-success')
      expect(result.data?.fileUrl).toBe('https://storage.example.com/signed-url-e2e')

      // Verify all integrations were called
      expect(mockSupabase.storage.from().upload).toHaveBeenCalled()
      expect(mockSupabase.from().insert).toHaveBeenCalledTimes(2) // Submission + Audit
      expect(mockSupabase.functions.invoke).toHaveBeenCalledTimes(2) // Validation + Email
    })
  })
})