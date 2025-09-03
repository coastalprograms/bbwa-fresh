import { submitContactForm } from './contact'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase client
jest.mock('@/lib/supabase/server')
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

// Mock Next.js headers
jest.mock('next/headers', () => ({
  headers: () => ({
    get: jest.fn().mockReturnValue('192.168.1.1')
  })
}))

const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockResolvedValue({ error: null })
}

describe('submitContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateClient.mockReturnValue(mockSupabaseClient as any)
    mockSupabaseClient.insert.mockResolvedValue({ error: null })
  })
  
  afterEach(() => {
    jest.resetModules()
  })

  const validFormData = {
    first_name: 'John',
    last_name: 'Smith',
    email: 'john@example.com',
    phone: '0400 000 000',
    message: 'This is a test message with more than 20 characters',
    service_interest: 'New Home Construction',
    source_page: '/contact',
    honeypot: ''
  }

  it('successfully submits valid form data', async () => {
    const result = await submitContactForm(validFormData)
    
    expect(result.success).toBe(true)
    expect(result.message).toBe('Thank you for your message! We&apos;ll get back to you within 24 hours.')
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('contact_leads')
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
      name: 'John Smith',
      email: 'john@example.com', 
      phone: '0400 000 000',
      message: 'This is a test message with more than 20 characters',
      service_interest: 'New Home Construction',
      source_page: '/contact',
      ip_address: '192.168.1.1'
    })
  })

  it('rejects form with honeypot filled', async () => {
    const formDataWithHoneypot = { ...validFormData, honeypot: 'spam' }
    
    const result = await submitContactForm(formDataWithHoneypot)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid submission')
    expect(mockSupabaseClient.insert).not.toHaveBeenCalled()
  })

  it('validates required first name field', async () => {
    const invalidData = { ...validFormData, first_name: 'J' }
    
    const result = await submitContactForm(invalidData)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('First name must be at least 2 characters')
  })

  it('validates required last name field', async () => {
    const invalidData = { ...validFormData, last_name: 'S' }
    
    const result = await submitContactForm(invalidData)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Last name must be at least 2 characters')
  })

  it('validates email format', async () => {
    const invalidData = { ...validFormData, email: 'invalid-email' }
    
    const result = await submitContactForm(invalidData)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid email address')
  })

  it('validates message minimum length', async () => {
    const invalidData = { ...validFormData, message: 'Too short' }
    
    const result = await submitContactForm(invalidData)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Message must be at least 20 characters')
  })

  it('handles optional fields correctly', async () => {
    const minimalData = {
      first_name: 'John',
      last_name: 'Smith',
      email: 'john@example.com',
      message: 'This is a test message with more than 20 characters',
      honeypot: ''
    }
    
    await submitContactForm(minimalData)
    
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
      name: 'John Smith',
      email: 'john@example.com',
      phone: null,
      message: 'This is a test message with more than 20 characters',
      service_interest: null,
      source_page: null,
      ip_address: '192.168.1.1'
    })
  })

  it('implements rate limiting', async () => {
    // Use isolateModules to get fresh state for this test
    await jest.isolateModulesAsync(async () => {
      // Mock headers to use a specific IP for this test
      const mockHeaders = {
        get: jest.fn().mockReturnValue('192.168.1.100') // Unique IP for rate limiting test
      }
      jest.doMock('next/headers', () => ({ headers: () => mockHeaders }))
      
      // Re-import the function to get fresh module with new IP
      const { submitContactForm: testSubmitContactForm } = await import('./contact')
      
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      // First 3 requests should succeed
      for (let i = 0; i < 3; i++) {
        const result = await testSubmitContactForm(validFormData)
        expect(result.success).toBe(true)
      }
      
      // 4th request should be rate limited
      const rateLimitedResult = await testSubmitContactForm(validFormData)
      expect(rateLimitedResult.success).toBe(false)
      expect(rateLimitedResult.error).toBe('Too many requests. Please wait a minute before trying again.')
      
      consoleSpy.mockRestore()
    })
  })

  it('handles Supabase errors', async () => {
    await jest.isolateModulesAsync(async () => {
      // Use unique IP to avoid rate limiting from other tests
      const mockHeaders = {
        get: jest.fn().mockReturnValue('192.168.1.101')
      }
      jest.doMock('next/headers', () => ({ headers: () => mockHeaders }))
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockSupabaseClient.insert.mockResolvedValue({ error: { message: 'Database error' } })
      
      const { submitContactForm: testSubmitContactForm } = await import('./contact')
      const result = await testSubmitContactForm(validFormData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to submit form. Please try again.')
      expect(consoleSpy).toHaveBeenCalledWith('Supabase error:', { message: 'Database error' })
      
      consoleSpy.mockRestore()
    })
  })

  it('handles unexpected errors', async () => {
    // Use unique IP to avoid rate limiting from other tests
    const mockHeaders = {
      get: jest.fn().mockReturnValue('192.168.1.102')
    }
    jest.doMock('next/headers', () => ({ headers: () => mockHeaders }))
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const mockCreateClientError = jest.fn().mockRejectedValue(new Error('Unexpected error'))
    jest.doMock('@/lib/supabase/server', () => ({
      createClient: mockCreateClientError
    }))
    
    const { submitContactForm: testSubmitContactForm } = await import('./contact')
    const result = await testSubmitContactForm(validFormData)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('An unexpected error occurred. Please try again.')
    
    consoleSpy.mockRestore()
  })

  it('extracts IP address from headers correctly', async () => {
    // Test different header scenarios
    const mockHeaders = {
      get: jest.fn()
        .mockReturnValueOnce('192.168.1.1, 10.0.0.1') // x-forwarded-for with multiple IPs
        .mockReturnValueOnce(null) // no x-forwarded-for
        .mockReturnValueOnce('192.168.1.2') // x-real-ip fallback
    }
    
    jest.doMock('next/headers', () => ({ headers: () => mockHeaders }))
    
    const { submitContactForm: testSubmitContactForm } = await import('./contact')
    
    await testSubmitContactForm(validFormData)
    
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith(
      expect.objectContaining({ ip_address: '192.168.1.1' })
    )
  })
})