import { getActiveContractors, submitWorkerInduction } from '../actions'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn()
}))

// Mock Next.js revalidatePath
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}))

const mockSupabase = {
  from: jest.fn()
}

const mockContractorData = [
  {
    id: 'contractor-1',
    name: 'ABC Construction',
    abn: '12345678901'
  },
  {
    id: 'contractor-2', 
    name: 'XYZ Builders',
    abn: '98765432109'
  }
]

describe('Worker Induction Actions', () => {
  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getActiveContractors', () => {
    it('should return formatted contractor options', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockContractorData,
              error: null
            })
          })
        })
      })

      const result = await getActiveContractors()

      expect(result.success).toBe(true)
      expect(result.contractors).toEqual([
        {
          value: 'contractor-1',
          label: 'ABC Construction',
          abn: '12345678901'
        },
        {
          value: 'contractor-2',
          label: 'XYZ Builders',
          abn: '98765432109'
        }
      ])

      expect(mockSupabase.from).toHaveBeenCalledWith('contractors')
    })

    it('should handle database errors gracefully', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Database connection failed')
            })
          })
        })
      })

      const result = await getActiveContractors()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database connection failed')
    })
  })

  describe('submitWorkerInduction', () => {
    const mockFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobile: '0400123456',
      contractorId: 'contractor-1',
      position: 'Carpenter',
      trade: 'Carpentry',
      allergies: 'None',
      emergencyName: 'Jane Doe',
      emergencyPhone: '0400987654',
      emergencyRelationship: 'Spouse',
      noAlcoholDrugs: true,
      electricalEquipment: true,
      hazardousSubstances: true,
      usePPE: true,
      highRiskWorkMeeting: true,
      appropriateSignage: true,
      noUnauthorizedVisitors: true,
      housekeeping: true,
      employerTraining: true,
      employerSWMS: true,
      discussedSWMS: true,
      preStartMeeting: true,
      readSafetyBooklet: true,
      understandSMP: true,
      otherLicense: false
    }

    it('should create worker with contractor_id', async () => {
      const mockWorkerResponse = {
        id: 'worker-1',
        ...mockFormData
      }

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockWorkerResponse,
              error: null
            })
          })
        })
      })

      const result = await submitWorkerInduction(mockFormData)

      expect(result.success).toBe(true)
      expect(result.workerId).toBe('worker-1')

      // Verify contractor_id is included in the insert
      expect(mockSupabase.from).toHaveBeenCalledWith('workers')
      const insertCall = mockSupabase.from().insert
      expect(insertCall).toHaveBeenCalledWith(expect.objectContaining({
        contractor_id: 'contractor-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com'
      }))
    })

    it('should handle database insertion errors', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Foreign key constraint violation')
            })
          })
        })
      })

      const result = await submitWorkerInduction(mockFormData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Foreign key constraint violation')
    })

    it('should set induction_completed to true', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'worker-1' },
              error: null
            })
          })
        })
      })

      await submitWorkerInduction(mockFormData)

      const insertCall = mockSupabase.from().insert
      expect(insertCall).toHaveBeenCalledWith(expect.objectContaining({
        induction_completed: true,
        induction_completed_at: expect.any(String)
      }))
    })
  })
})