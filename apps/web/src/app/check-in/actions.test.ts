import { checkIn } from './actions'
import { createClient } from '@/lib/supabase/server'
import { findNearestSite } from '@/lib/geo'
import { queueNonComplianceAlert } from '@/lib/alerts'
import { cookies } from 'next/headers'

// Mock all dependencies
jest.mock('@/lib/supabase/server')
jest.mock('@/lib/geo')
jest.mock('@/lib/alerts')
jest.mock('next/headers')

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockFindNearestSite = findNearestSite as jest.MockedFunction<typeof findNearestSite>
const mockQueueNonComplianceAlert = queueNonComplianceAlert as jest.MockedFunction<typeof queueNonComplianceAlert>
const mockCookies = cookies as jest.MockedFunction<typeof cookies>

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  insert: jest.fn(),
  gte: jest.fn().mockReturnThis(),
  lt: jest.fn().mockReturnThis(),
}

describe('Construction Compliance Check-In System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateClient.mockResolvedValue(mockSupabaseClient as any)
    
    // Mock valid CSRF token
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'valid-csrf-token' })
    } as any)
    
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const validCheckInData = {
    email: 'john.worker@example.com',
    coords: { lat: -31.9505, lng: 115.8605 }, // Perth coordinates
    csrfToken: 'valid-csrf-token',
    website: '', // Empty honeypot
  }

  const mockWorker = {
    id: 'worker-123',
    email: 'john.worker@example.com',
    first_name: 'John',
    last_name: 'Worker'
  }

  const mockJobSites = [
    {
      id: 'site-123',
      name: 'Perth CBD Construction Site',
      lat: -31.9505,
      lng: 115.8605,
      radius_m: 100,
      active: true
    }
  ]

  const mockValidCertification = {
    id: 'cert-123',
    expiry_date: '2025-12-31',
    status: 'Valid'
  }

  describe('Security Validation', () => {
    it('should reject requests with invalid CSRF tokens', async () => {
      mockCookies.mockResolvedValue({
        get: jest.fn().mockReturnValue({ value: 'different-token' })
      } as any)

      const result = await checkIn(validCheckInData)

      expect(result.success).toBeUndefined()
      expect(result.errors?.form).toBe('Security validation failed. Please refresh the page and try again.')
    })

    it('should reject requests with honeypot field filled (spam protection)', async () => {
      const spamData = {
        ...validCheckInData,
        website: 'spam-content'
      }

      const result = await checkIn(spamData)

      expect(result.success).toBeUndefined()
      expect(result.errors?.form).toBe('Spam detection triggered. Please try again.')
    })
  })

  describe('Input Validation', () => {
    it('should validate email is required', async () => {
      const invalidData = { ...validCheckInData, email: '' }

      const result = await checkIn(invalidData)

      expect(result.errors?.email).toBe('Email is required')
    })

    it('should validate email format', async () => {
      const invalidData = { ...validCheckInData, email: 'invalid-email' }

      const result = await checkIn(invalidData)

      expect(result.errors?.email).toBe('Please enter a valid email address')
    })

    it('should require location coordinates', async () => {
      const invalidData = { ...validCheckInData, coords: undefined as any }

      const result = await checkIn(invalidData)

      expect(result.errors?.location).toBe('Location is required for check-in')
    })
  })

  describe('Critical Compliance Workflows', () => {
    it('should prevent entry for workers without induction', async () => {
      // Mock worker not found
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      })

      const result = await checkIn(validCheckInData)

      expect(result.errors?.email).toBe('Worker not found. Please complete induction first or contact your supervisor.')
    })

    it('should prevent entry for expired white cards and trigger compliance alert', async () => {
      // Mock worker found
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockWorker,
              error: null
            })
          })
        })
      })

      // Mock job sites
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'workers') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockWorker,
                  error: null
                })
              })
            })
          }
        }
        if (table === 'job_sites') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockJobSites,
                error: null
              })
            })
          }
        }
        if (table === 'certifications') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn((field, value) => ({
                eq: jest.fn().mockReturnValue({
                  order: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                      single: jest.fn().mockResolvedValue({
                        data: {
                          id: 'cert-123',
                          expiry_date: '2023-01-01', // EXPIRED
                          status: 'Valid'
                        },
                        error: null
                      })
                    })
                  })
                })
              }))
            })
          }
        }
        return mockSupabaseClient
      })

      mockFindNearestSite.mockReturnValue(mockJobSites[0] as any)
      mockQueueNonComplianceAlert.mockResolvedValue({
        success: true,
        auditId: 'audit-123'
      })

      const result = await checkIn(validCheckInData)

      // Should prevent entry
      expect(result.success).toBeUndefined()
      expect(result.errors?.form).toBe('Sorry, your white card is out of date. Do not enter the site. Please fill out a new form to upload your new white card.')

      // Should trigger compliance alert
      expect(mockQueueNonComplianceAlert).toHaveBeenCalledWith({
        workerId: mockWorker.id,
        workerName: 'John Worker',
        workerEmail: mockWorker.email,
        siteId: mockJobSites[0].id,
        siteName: mockJobSites[0].name,
        reason: 'Expired white card',
        occurredAt: expect.any(String),
        type: 'compliance_alert'
      })
    })

    it('should prevent entry for non-validated white cards', async () => {
      // Set up sequential mock responses
      mockSupabaseClient.single
        .mockResolvedValueOnce({
          data: mockWorker,
          error: null
        })
        .mockResolvedValueOnce({
          data: {
            ...mockValidCertification,
            status: 'Pending' // NOT VALIDATED
          },
          error: null
        })

      // Mock job sites
      mockSupabaseClient.eq.mockResolvedValue({
        data: mockJobSites,
        error: null
      })

      const result = await checkIn(validCheckInData)

      expect(result.errors?.form).toBe('Your white card is not validated. Please wait for approval or contact your supervisor.')
    })

    it('should allow valid check-in and record attendance', async () => {
      // Mock all successful database calls
      let dbCallCount = 0
      mockSupabaseClient.from.mockImplementation((table: string) => {
        dbCallCount++
        if (table === 'workers') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockWorker,
                  error: null
                })
              })
            })
          }
        }
        if (table === 'job_sites') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockJobSites,
                error: null
              })
            })
          }
        }
        if (table === 'certifications') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  order: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                      single: jest.fn().mockResolvedValue({
                        data: mockValidCertification,
                        error: null
                      })
                    })
                  })
                })
              })
            })
          }
        }
        if (table === 'site_attendances') {
          if (dbCallCount === 4) { // First call to check existing attendance
            return {
              select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  eq: jest.fn().mockReturnValue({
                    gte: jest.fn().mockReturnValue({
                      lt: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({
                          data: null, // No existing attendance
                          error: { code: 'PGRST116' } // Not found
                        })
                      })
                    })
                  })
                })
              })
            }
          } else { // Second call to insert attendance
            return {
              insert: jest.fn().mockResolvedValue({
                error: null
              })
            }
          }
        }
        return mockSupabaseClient
      })

      mockFindNearestSite.mockReturnValue(mockJobSites[0] as any)

      const result = await checkIn(validCheckInData)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Successfully checked in to Perth CBD Construction Site! Stay safe on site.')
    })

    it('should warn about expiring white cards but still allow entry', async () => {
      // Mock certification expiring in 10 days
      const expiringDate = new Date()
      expiringDate.setDate(expiringDate.getDate() + 10)

      let dbCallCount = 0
      mockSupabaseClient.from.mockImplementation((table: string) => {
        dbCallCount++
        if (table === 'workers') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockWorker,
                  error: null
                })
              })
            })
          }
        }
        if (table === 'job_sites') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockJobSites,
                error: null
              })
            })
          }
        }
        if (table === 'certifications') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  order: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                      single: jest.fn().mockResolvedValue({
                        data: {
                          ...mockValidCertification,
                          expiry_date: expiringDate.toISOString().split('T')[0]
                        },
                        error: null
                      })
                    })
                  })
                })
              })
            })
          }
        }
        if (table === 'site_attendances') {
          if (dbCallCount === 4) {
            return {
              select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  eq: jest.fn().mockReturnValue({
                    gte: jest.fn().mockReturnValue({
                      lt: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({
                          data: null,
                          error: { code: 'PGRST116' }
                        })
                      })
                    })
                  })
                })
              })
            }
          } else {
            return {
              insert: jest.fn().mockResolvedValue({ error: null })
            }
          }
        }
        return mockSupabaseClient
      })

      mockFindNearestSite.mockReturnValue(mockJobSites[0] as any)

      const result = await checkIn(validCheckInData)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Your white card expires in 10 days')
    })

    it('should prevent duplicate check-ins on same day', async () => {
      let dbCallCount = 0
      mockSupabaseClient.from.mockImplementation((table: string) => {
        dbCallCount++
        if (table === 'workers') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockWorker,
                  error: null
                })
              })
            })
          }
        }
        if (table === 'job_sites') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockJobSites,
                error: null
              })
            })
          }
        }
        if (table === 'certifications') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  order: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                      single: jest.fn().mockResolvedValue({
                        data: mockValidCertification,
                        error: null
                      })
                    })
                  })
                })
              })
            })
          }
        }
        if (table === 'site_attendances' && dbCallCount === 4) {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  gte: jest.fn().mockReturnValue({
                    lt: jest.fn().mockReturnValue({
                      single: jest.fn().mockResolvedValue({
                        data: { id: 'existing-attendance' }, // EXISTING ATTENDANCE
                        error: null
                      })
                    })
                  })
                })
              })
            })
          }
        }
        return mockSupabaseClient
      })

      mockFindNearestSite.mockReturnValue(mockJobSites[0] as any)

      const result = await checkIn(validCheckInData)

      expect(result.errors?.form).toBe('You have already checked in to Perth CBD Construction Site today.')
    })

    it('should prevent check-in when outside job site radius', async () => {
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'workers') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockWorker,
                  error: null
                })
              })
            })
          }
        }
        if (table === 'job_sites') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockJobSites,
                error: null
              })
            })
          }
        }
        if (table === 'certifications') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  order: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                      single: jest.fn().mockResolvedValue({
                        data: mockValidCertification,
                        error: null
                      })
                    })
                  })
                })
              })
            })
          }
        }
        return mockSupabaseClient
      })

      // Mock no nearby site found
      mockFindNearestSite.mockReturnValue(null)

      const result = await checkIn(validCheckInData)

      expect(result.errors?.location).toBe('You are not within range of any active job site. Please move closer to a job site and try again.')
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Reset mocks and simulate worker not found
      mockSupabaseClient.single.mockClear()
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' }
      })

      const result = await checkIn(validCheckInData)

      expect(result.errors?.email).toBe('Worker not found. Please complete induction first or contact your supervisor.')
    })

    it('should handle unexpected errors', async () => {
      mockCreateClient.mockRejectedValue(new Error('Unexpected error'))

      const result = await checkIn(validCheckInData)

      expect(result.errors?.form).toBe('An unexpected error occurred. Please try again or contact support.')
    })
  })
})