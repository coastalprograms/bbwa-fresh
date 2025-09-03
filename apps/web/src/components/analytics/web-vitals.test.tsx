import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { WebVitals } from './web-vitals'

// Mock next/web-vitals
const mockUseReportWebVitals = jest.fn()
jest.mock('next/web-vitals', () => ({
  useReportWebVitals: mockUseReportWebVitals,
}))

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch as any

describe('WebVitals Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window.gtag
    Object.defineProperty(window, 'gtag', {
      value: jest.fn(),
      writable: true,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render without crashing', () => {
    render(<WebVitals />)
    // Component should not render any visible content
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('should register web vitals reporting', () => {
    render(<WebVitals />)
    expect(mockUseReportWebVitals).toHaveBeenCalledTimes(1)
    expect(mockUseReportWebVitals).toHaveBeenCalledWith(expect.any(Function))
  })

  describe('Metric Reporting', () => {
    let reportFunction: (metric: any) => void

    beforeEach(() => {
      render(<WebVitals />)
      reportFunction = mockUseReportWebVitals.mock.calls[0][0]
    })

    it('should log metrics in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      
      const metric = {
        name: 'FCP',
        value: 1500,
        id: 'test-id',
        delta: 100,
      }

      reportFunction(metric)

      expect(consoleSpy).toHaveBeenCalledWith('[Web Vitals]', metric)
      
      consoleSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })

    it('should send metrics to Google Analytics in production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      const mockGtag = jest.fn()
      ;(window as any).gtag = mockGtag

      const metric = {
        name: 'LCP',
        value: 2000,
        id: 'test-id',
        delta: 50,
      }

      reportFunction(metric)

      expect(mockGtag).toHaveBeenCalledWith('event', 'LCP', expect.objectContaining({
        event_category: 'Web Vitals',
        event_label: 'test-id',
        value: 2000,
        non_interaction: true,
      }))
      
      process.env.NODE_ENV = originalEnv
    })

    it('should send metrics to analytics endpoint in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const metric = {
        name: 'CLS',
        value: 0.05,
        id: 'test-id',
        delta: 0.01,
      }

      reportFunction(metric)

      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'CLS',
          value: 0.05,
          id: 'test-id',
          delta: 0.01,
          url: 'http://localhost:3000/',
          timestamp: expect.any(Number),
        }),
      })
      
      process.env.NODE_ENV = originalEnv
    })

    it('should handle CLS metric value scaling', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      const mockGtag = jest.fn()
      ;(window as any).gtag = mockGtag

      const metric = {
        name: 'CLS',
        value: 0.1,
        id: 'test-id',
        delta: 0.02,
      }

      reportFunction(metric)

      expect(mockGtag).toHaveBeenCalledWith('event', 'CLS', expect.objectContaining({
        value: 100, // 0.1 * 1000 = 100
      }))
      
      process.env.NODE_ENV = originalEnv
    })

    it('should handle fetch errors gracefully', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

      const metric = {
        name: 'FID',
        value: 50,
        id: 'test-id',
        delta: 10,
      }

      reportFunction(metric)

      // Wait for async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(consoleSpy).toHaveBeenCalledWith('Failed to send web vitals:', expect.any(Error))
      
      consoleSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })
  })
})