/**
 * Critical P0 Tests for SWMS Portal Token Validation
 * Addresses TEST-001 high severity gap from QA gate
 */

import { validateSwmsToken } from '../actions'
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
    TOKEN_VALIDATION: {
      windowMs: 60000,
      maxRequests: 20
    }
  }
}))

describe('SWMS Portal Token Validation', () => {
  const mockSupabase = {
    from: jest.fn(() => mockSupabase),
    select: jest.fn(() => mockSupabase),
    eq: jest.fn(() => mockSupabase),
    single: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe('1.4-UNIT-001: Token format validation (UUID)', () => {
    test('accepts valid UUID format', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000'
      
      mockSupabase.single.mockResolvedValue({
        data: {
          id: validUUID,
          name: 'Test Job',
          status: 'active',
          access_token: validUUID,
          token_expires_at: new Date(Date.now() + 86400000).toISOString(),
          job_sites: { id: 'site1', name: 'Test Site', address: '123 Test St' },
          contractors: { id: 'contractor1', company_name: 'Test Co', contact_email: 'test@example.com' }
        },
        error: null
      })

      const result = await validateSwmsToken(validUUID)
      expect(result.success).toBe(true)
    })

    test('rejects invalid UUID format', async () => {
      const invalidTokens = [
        'invalid-token',
        '123e4567-e89b-12d3-a456',  // Too short
        '123e4567-e89b-12d3-a456-426614174000-extra', // Too long
        'not-a-uuid-at-all',
        '123e4567-e89b-12d3-g456-426614174000', // Invalid hex character
        ''
      ]

      for (const token of invalidTokens) {
        const result = await validateSwmsToken(token)
        expect(result.success).toBe(false)
        expect(result.error).toBe('Invalid token format')
      }
    })

    test('rejects null or undefined tokens', async () => {
      const result1 = await validateSwmsToken(null as any)
      expect(result1.success).toBe(false)

      const result2 = await validateSwmsToken(undefined as any)
      expect(result2.success).toBe(false)
    })
  })

  describe('1.4-UNIT-002: Token expiry calculation', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000'

    test('accepts non-expired token', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString() // 24 hours from now

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: {
          id: validUUID,
          name: 'Test Job',
          status: 'active',
          access_token: validUUID,
          token_expires_at: futureDate,
          job_sites: { id: 'site1', name: 'Test Site', address: '123 Test St' },
          contractors: { id: 'contractor1', company_name: 'Test Co', contact_email: 'test@example.com' }
        },
        error: null
      })

      const result = await validateSwmsToken(validUUID)
      expect(result.success).toBe(true)
    })

    test('rejects expired token', async () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString() // 24 hours ago

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: {
          id: validUUID,
          name: 'Test Job',
          status: 'active',
          access_token: validUUID,
          token_expires_at: pastDate,
          job_sites: { id: 'site1', name: 'Test Site', address: '123 Test St' },
          contractors: { id: 'contractor1', company_name: 'Test Co', contact_email: 'test@example.com' }
        },
        error: null
      })

      const result = await validateSwmsToken(validUUID)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Token has expired')
    })

    test('handles missing expiry date', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: {
          id: validUUID,
          name: 'Test Job',
          status: 'active',
          access_token: validUUID,
          token_expires_at: null,
          job_sites: { id: 'site1', name: 'Test Site', address: '123 Test St' },
          contractors: { id: 'contractor1', company_name: 'Test Co', contact_email: 'test@example.com' }
        },
        error: null
      })

      const result = await validateSwmsToken(validUUID)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Token configuration error')
    })
  })

  describe('1.4-INT-001: Token lookup against swms_jobs table', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000'

    test('successfully finds token in database', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: {
          id: validUUID,
          name: 'Construction Site Safety Review',
          description: 'SWMS documents required for site access',
          status: 'active',
          access_token: validUUID,
          token_expires_at: new Date(Date.now() + 86400000).toISOString(),
          job_sites: { 
            id: 'site1', 
            name: 'Perth CBD Development', 
            address: '123 Murray Street, Perth WA 6000',
            lat: -31.9505,
            lng: 115.8605
          },
          contractors: { 
            id: 'contractor1', 
            company_name: 'SafeWork Solutions Pty Ltd', 
            contact_email: 'admin@safeworksolutions.com.au',
            abn: '12345678901'
          }
        },
        error: null
      })

      const result = await validateSwmsToken(validUUID)
      
      expect(result.success).toBe(true)
      expect(result.data?.swmsJob.name).toBe('Construction Site Safety Review')
      expect(result.data?.jobSite.name).toBe('Perth CBD Development')
      expect(result.data?.contractor.company_name).toBe('SafeWork Solutions Pty Ltd')
    })

    test('handles token not found in database', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' }
      })

      const result = await validateSwmsToken(validUUID)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid token')
    })

    test('handles database connection errors', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { code: 'CONNECTION_ERROR', message: 'Database connection failed' }
      })

      const result = await validateSwmsToken(validUUID)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Unable to validate token')
    })
  })

  describe('1.4-INT-002: Invalid/expired token handling', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000'

    test('rejects inactive job status', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: {
          id: validUUID,
          name: 'Test Job',
          status: 'completed', // Inactive status
          access_token: validUUID,
          token_expires_at: new Date(Date.now() + 86400000).toISOString(),
          job_sites: { id: 'site1', name: 'Test Site', address: '123 Test St' },
          contractors: { id: 'contractor1', company_name: 'Test Co', contact_email: 'test@example.com' }
        },
        error: null
      })

      const result = await validateSwmsToken(validUUID)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Job is no longer active')
    })

    test('rejects mismatched token', async () => {
      const requestToken = '123e4567-e89b-12d3-a456-426614174000'
      const storedToken = '987fcdeb-51d2-43ba-9876-543210987654'

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: {
          id: requestToken,
          name: 'Test Job',
          status: 'active',
          access_token: storedToken, // Different token stored
          token_expires_at: new Date(Date.now() + 86400000).toISOString(),
          job_sites: { id: 'site1', name: 'Test Site', address: '123 Test St' },
          contractors: { id: 'contractor1', company_name: 'Test Co', contact_email: 'test@example.com' }
        },
        error: null
      })

      const result = await validateSwmsToken(requestToken)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid token')
    })

    test('handles malformed database response', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: {
          id: validUUID,
          // Missing required fields
          status: 'active'
        },
        error: null
      })

      const result = await validateSwmsToken(validUUID)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Token configuration error')
    })
  })

  describe('Rate Limiting Integration', () => {
    test('blocks when rate limit exceeded', async () => {
      const { checkRateLimit } = require('@/lib/rate-limit')
      checkRateLimit.mockReturnValue({
        blocked: true,
        remaining: 0,
        reset: Date.now() + 60000
      })

      const result = await validateSwmsToken('123e4567-e89b-12d3-a456-426614174000')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Too many validation attempts')
    })
  })
})