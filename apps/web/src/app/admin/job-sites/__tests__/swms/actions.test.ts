import { createSwmsJob, updateSwmsJob, deleteSwmsJob } from '../../[id]/actions'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { SwmsJobCreateData, SwmsJobUpdateData } from '@/types/swms'

// Mock Supabase client
jest.mock('@/lib/supabase/server')
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

// Mock Next.js functions
jest.mock('next/cache')
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>

// Mock console.error to avoid cluttering test output
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('SWMS Job Server Actions', () => {
  const mockSupabaseClient = {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn()
  }

  const mockQuery = {
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    select: jest.fn(),
    single: jest.fn(),
    eq: jest.fn()
  }

  const jobSiteId = 'job-site-123'
  const swmsJobId = 'swms-job-456'
  const mockUser = { id: 'user-123', email: 'test@example.com' }

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockCreateClient.mockReturnValue(mockSupabaseClient as any)
    
    // Setup chain-able query methods - each method returns mockQuery to allow chaining
    mockQuery.insert.mockReturnValue(mockQuery)
    mockQuery.update.mockReturnValue(mockQuery)
    mockQuery.delete.mockReturnValue(mockQuery)
    mockQuery.select.mockReturnValue(mockQuery)
    mockQuery.single.mockReturnValue(mockQuery)
    mockQuery.eq.mockReturnValue(mockQuery) // This is crucial for chaining .eq().eq()
    
    mockSupabaseClient.from.mockReturnValue(mockQuery)
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  describe('createSwmsJob', () => {
    const mockSwmsJobData: SwmsJobCreateData = {
      name: 'Test SWMS Job',
      description: 'Test description',
      start_date: '2025-01-15',
      end_date: '2025-01-30',
      status: 'planned'
    }

    const mockCreatedJob = {
      id: swmsJobId,
      job_site_id: jobSiteId,
      name: 'Test SWMS Job',
      description: 'Test description',
      start_date: '2025-01-15',
      end_date: '2025-01-30',
      status: 'planned',
      created_at: '2025-01-01T00:00:00Z'
    }

    it('successfully creates SWMS job with valid data', async () => {
      // Mock successful authentication
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock successful database insert
      mockQuery.single.mockResolvedValue({
        data: mockCreatedJob,
        error: null
      })

      const result = await createSwmsJob(jobSiteId, mockSwmsJobData)

      expect(result).toEqual({
        success: true,
        data: mockCreatedJob
      })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('swms_jobs')
      expect(mockQuery.insert).toHaveBeenCalledWith({
        job_site_id: jobSiteId,
        name: mockSwmsJobData.name,
        description: mockSwmsJobData.description,
        start_date: mockSwmsJobData.start_date,
        end_date: mockSwmsJobData.end_date,
        status: mockSwmsJobData.status
      })
      expect(mockQuery.select).toHaveBeenCalled()
      expect(mockQuery.single).toHaveBeenCalled()
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/job-sites/${jobSiteId}`)
    })

    it('handles missing optional fields correctly', async () => {
      const minimalData: SwmsJobCreateData = {
        name: 'Minimal SWMS Job',
        start_date: '2025-01-15'
      }

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      mockQuery.single.mockResolvedValue({
        data: { ...mockCreatedJob, name: 'Minimal SWMS Job', description: null, end_date: null },
        error: null
      })

      const result = await createSwmsJob(jobSiteId, minimalData)

      expect(result.success).toBe(true)
      expect(mockQuery.insert).toHaveBeenCalledWith({
        job_site_id: jobSiteId,
        name: 'Minimal SWMS Job',
        description: null,
        start_date: '2025-01-15',
        end_date: null,
        status: 'planned'
      })
    })

    it('returns error when user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      const result = await createSwmsJob(jobSiteId, mockSwmsJobData)

      expect(result).toEqual({
        success: false,
        error: 'Unauthorized'
      })

      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })

    it('handles authentication errors', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Auth error' }
      })

      const result = await createSwmsJob(jobSiteId, mockSwmsJobData)

      expect(result).toEqual({
        success: false,
        error: 'Unauthorized'
      })
    })

    it('handles database insertion errors', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock the error to be thrown, not returned in resolved value
      const dbError = new Error('Database constraint violation')
      mockQuery.single.mockRejectedValue(dbError)

      const result = await createSwmsJob(jobSiteId, mockSwmsJobData)

      expect(result).toEqual({
        success: false,
        error: 'Database constraint violation'
      })

      expect(mockConsoleError).toHaveBeenCalledWith('Create SWMS job error:', dbError)
    })

    it('handles unexpected errors gracefully', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock an unexpected error
      mockQuery.single.mockRejectedValue('Unexpected error')

      const result = await createSwmsJob(jobSiteId, mockSwmsJobData)

      expect(result).toEqual({
        success: false,
        error: 'Unknown error'
      })
    })
  })

  describe('updateSwmsJob', () => {
    const mockUpdateData: SwmsJobUpdateData = {
      name: 'Updated SWMS Job',
      description: 'Updated description',
      start_date: '2025-02-01',
      end_date: '2025-02-15',
      status: 'active'
    }

    const mockUpdatedJob = {
      id: swmsJobId,
      job_site_id: jobSiteId,
      ...mockUpdateData,
      created_at: '2025-01-01T00:00:00Z'
    }

    it('successfully updates SWMS job with valid data', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Update chains: .update().eq('id').eq('job_site_id').select().single()
      // So we need the second eq to return mockQuery, then single returns the final result
      mockQuery.eq.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockQuery)
      mockQuery.single.mockResolvedValue({
        data: mockUpdatedJob,
        error: null
      })

      const result = await updateSwmsJob(jobSiteId, swmsJobId, mockUpdateData)

      expect(result).toEqual({
        success: true,
        data: mockUpdatedJob
      })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('swms_jobs')
      expect(mockQuery.update).toHaveBeenCalledWith(mockUpdateData)
      expect(mockQuery.eq).toHaveBeenCalledWith('id', swmsJobId)
      expect(mockQuery.eq).toHaveBeenCalledWith('job_site_id', jobSiteId)
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/job-sites/${jobSiteId}`)
    })

    it('enforces job site security by checking job_site_id', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      mockQuery.eq.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockQuery)
      mockQuery.single.mockResolvedValue({
        data: mockUpdatedJob,
        error: null
      })

      await updateSwmsJob(jobSiteId, swmsJobId, mockUpdateData)

      // Verify that both conditions are checked
      expect(mockQuery.eq).toHaveBeenCalledWith('id', swmsJobId)
      expect(mockQuery.eq).toHaveBeenCalledWith('job_site_id', jobSiteId)
    })

    it('returns error when user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      const result = await updateSwmsJob(jobSiteId, swmsJobId, mockUpdateData)

      expect(result).toEqual({
        success: false,
        error: 'Unauthorized'
      })

      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })

    it('handles database update errors', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const dbError = new Error('SWMS job not found')
      mockQuery.eq.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockQuery)
      mockQuery.single.mockRejectedValue(dbError)

      const result = await updateSwmsJob(jobSiteId, swmsJobId, mockUpdateData)

      expect(result).toEqual({
        success: false,
        error: 'SWMS job not found'
      })
    })

    it('handles partial update data', async () => {
      const partialData: Partial<SwmsJobUpdateData> = {
        name: 'Updated Name Only'
      }

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      mockQuery.eq.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockQuery)
      mockQuery.single.mockResolvedValue({
        data: { ...mockUpdatedJob, name: 'Updated Name Only' },
        error: null
      })

      const result = await updateSwmsJob(jobSiteId, swmsJobId, partialData)

      expect(result.success).toBe(true)
      expect(mockQuery.update).toHaveBeenCalledWith(partialData)
    })
  })

  describe('deleteSwmsJob', () => {
    it('successfully deletes SWMS job', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // For delete operations, the final eq() call is what gets resolved
      // The delete operation chains: .delete().eq('id', id).eq('job_site_id', jobSiteId)
      // So the second .eq() call should return the final result
      const finalEq = jest.fn().mockResolvedValue({
        data: null,
        error: null
      })
      mockQuery.eq.mockReturnValueOnce(mockQuery).mockReturnValueOnce(finalEq)

      const result = await deleteSwmsJob(jobSiteId, swmsJobId)

      expect(result).toEqual({
        success: true
      })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('swms_jobs')
      expect(mockQuery.delete).toHaveBeenCalled()
      expect(mockQuery.eq).toHaveBeenCalledWith('id', swmsJobId)
      expect(mockQuery.eq).toHaveBeenCalledWith('job_site_id', jobSiteId)
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/job-sites/${jobSiteId}`)
    })

    it('enforces job site security when deleting', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const finalEq = jest.fn().mockResolvedValue({
        data: null,
        error: null
      })
      mockQuery.eq.mockReturnValueOnce(mockQuery).mockReturnValueOnce(finalEq)

      await deleteSwmsJob(jobSiteId, swmsJobId)

      // Verify security constraints
      expect(mockQuery.eq).toHaveBeenCalledWith('id', swmsJobId)
      expect(mockQuery.eq).toHaveBeenCalledWith('job_site_id', jobSiteId)
    })

    it('returns error when user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      const result = await deleteSwmsJob(jobSiteId, swmsJobId)

      expect(result).toEqual({
        success: false,
        error: 'Unauthorized'
      })

      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })

    it('handles database deletion errors', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Create a separate mock query object for this error case
      const errorMockQuery = {
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        select: jest.fn(),
        single: jest.fn(),
        eq: jest.fn()
      }
      
      // Set up the chain that ends with an error
      errorMockQuery.delete.mockReturnValue(errorMockQuery)
      errorMockQuery.eq.mockReturnValueOnce(errorMockQuery).mockReturnValueOnce({
        data: null,
        error: new Error('SWMS job not found')
      })
      
      // Override the from method to return our error mock
      mockSupabaseClient.from.mockReturnValue(errorMockQuery)

      const result = await deleteSwmsJob(jobSiteId, swmsJobId)

      expect(result).toEqual({
        success: false,
        error: 'SWMS job not found'
      })
    })

    it('handles foreign key constraint errors when deleting', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Create a separate mock query object for this error case that throws an Error
      const errorMockQuery = {
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        select: jest.fn(),
        single: jest.fn(),
        eq: jest.fn()
      }
      
      // Set up the chain that ends with a thrown error
      const constraintError = new Error('Cannot delete job with existing submissions')
      errorMockQuery.delete.mockReturnValue(errorMockQuery)
      errorMockQuery.eq.mockReturnValueOnce(errorMockQuery).mockReturnValueOnce(
        Promise.resolve({ data: null, error: constraintError })
      )
      
      // Override the from method to return our error mock
      mockSupabaseClient.from.mockReturnValue(errorMockQuery)

      const result = await deleteSwmsJob(jobSiteId, swmsJobId)

      expect(result).toEqual({
        success: false,
        error: 'Cannot delete job with existing submissions'
      })

      expect(mockConsoleError).toHaveBeenCalledWith('Delete SWMS job error:', constraintError)
    })
  })

  describe('Error Handling and Logging', () => {
    it('logs errors with appropriate context', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const testError = new Error('Test database error')
      mockQuery.single.mockRejectedValue(testError)

      await createSwmsJob(jobSiteId, { name: 'Test', start_date: '2025-01-01' })

      expect(mockConsoleError).toHaveBeenCalledWith('Create SWMS job error:', testError)
    })

    it('handles errors without message property', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      mockQuery.single.mockRejectedValue('String error')

      const result = await createSwmsJob(jobSiteId, { name: 'Test', start_date: '2025-01-01' })

      expect(result).toEqual({
        success: false,
        error: 'Unknown error'
      })
    })
  })

  describe('Path Revalidation', () => {
    it('revalidates correct paths after successful operations', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Test create
      mockQuery.single.mockResolvedValue({
        data: { id: 'job-1' },
        error: null
      })

      await createSwmsJob(jobSiteId, { name: 'Test', start_date: '2025-01-01' })
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/job-sites/${jobSiteId}`)

      mockRevalidatePath.mockClear()

      // Test update
      mockQuery.eq.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockQuery)
      await updateSwmsJob(jobSiteId, swmsJobId, { name: 'Updated' })
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/job-sites/${jobSiteId}`)

      mockRevalidatePath.mockClear()

      // Test delete
      const finalEqForDelete = jest.fn().mockResolvedValue({ data: null, error: null })
      mockQuery.eq.mockReturnValueOnce(mockQuery).mockReturnValueOnce(finalEqForDelete)
      await deleteSwmsJob(jobSiteId, swmsJobId)
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/admin/job-sites/${jobSiteId}`)
    })

    it('does not revalidate paths after failed operations', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      await createSwmsJob(jobSiteId, { name: 'Test', start_date: '2025-01-01' })

      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })
  })

  describe('Input Validation', () => {
    it('handles empty or invalid job site IDs', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock the error to be thrown (simulating database validation error)
      const validationError = new Error('Invalid job site ID')
      mockQuery.single.mockRejectedValue(validationError)

      const result = await createSwmsJob('', { name: 'Test', start_date: '2025-01-01' })

      expect(result).toEqual({
        success: false,
        error: 'Invalid job site ID'
      })
    })

    it('handles empty or invalid SWMS job IDs', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock the error to be thrown (simulating database validation error)
      const validationError = new Error('Invalid SWMS job ID')
      mockQuery.eq.mockReturnValueOnce(mockQuery).mockReturnValueOnce(mockQuery)
      mockQuery.single.mockRejectedValue(validationError)

      const result = await updateSwmsJob(jobSiteId, '', { name: 'Test' })

      expect(result).toEqual({
        success: false,
        error: 'Invalid SWMS job ID'
      })
    })
  })
})