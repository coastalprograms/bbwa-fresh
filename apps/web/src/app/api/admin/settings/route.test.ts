import { GET, POST } from './route'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn()
}))

const mockSupabase = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      order: jest.fn(() => Promise.resolve({ data: [], error: null }))
    })),
    upsert: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null }))
    }))
  }))
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
})

describe('/api/admin/settings', () => {
  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      
      const response = await GET()
      const json = await response.json()
      
      expect(response.status).toBe(401)
      expect(json.error).toBe('Unauthorized')
    })

    it('should return settings when user is authenticated', async () => {
      const mockSettings = [
        { key: 'terms_and_conditions', value: 'Test terms', updated_at: '2025-08-25' },
        { key: 'privacy_policy', value: 'Test privacy', updated_at: '2025-08-25' }
      ]
      
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } } 
      })
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ 
            data: mockSettings, 
            error: null 
          })
        })
      })
      
      const response = await GET()
      const json = await response.json()
      
      expect(response.status).toBe(200)
      expect(json).toEqual(mockSettings)
    })

    it('should handle database errors gracefully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } } 
      })
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Database error' }
          })
        })
      })
      
      const response = await GET()
      const json = await response.json()
      
      expect(response.status).toBe(500)
      expect(json.error).toBe('Failed to fetch settings')
    })
  })

  describe('POST', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      
      const request = new NextRequest('http://localhost:3000/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({ key: 'test', value: 'value' })
      })
      
      const response = await POST(request)
      const json = await response.json()
      
      expect(response.status).toBe(401)
      expect(json.error).toBe('Unauthorized')
    })

    it('should return 400 if key or value is missing', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } } 
      })
      
      const request = new NextRequest('http://localhost:3000/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({ key: 'test' }) // missing value
      })
      
      const response = await POST(request)
      const json = await response.json()
      
      expect(response.status).toBe(400)
      expect(json.error).toBe('Key and value are required')
    })

    it('should save setting successfully when valid data provided', async () => {
      const mockUser = { id: 'user123' }
      const mockData = [{ key: 'test_key', value: 'test_value' }]
      
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: mockUser } 
      })
      mockSupabase.from.mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ 
            data: mockData, 
            error: null 
          })
        })
      })
      
      const request = new NextRequest('http://localhost:3000/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({ key: 'test_key', value: 'test_value' })
      })
      
      const response = await POST(request)
      const json = await response.json()
      
      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data).toEqual(mockData)
    })

    it('should handle database save errors', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user123' } } 
      })
      mockSupabase.from.mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Save failed' }
          })
        })
      })
      
      const request = new NextRequest('http://localhost:3000/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({ key: 'test_key', value: 'test_value' })
      })
      
      const response = await POST(request)
      const json = await response.json()
      
      expect(response.status).toBe(500)
      expect(json.error).toBe('Failed to save setting')
    })
  })
})