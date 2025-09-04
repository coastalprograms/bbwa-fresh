/**
 * Tests for Rate Limiting Implementation
 * Addresses SEC-002 from QA gate findings
 */

import { checkRateLimit, RATE_LIMITS } from '../rate-limit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    // Note: In production this would be Redis, here it's in-memory Map
    jest.clearAllMocks()
  })

  describe('Rate Limit Basic Functionality', () => {
    test('allows requests within limit', () => {
      const config = RATE_LIMITS.FILE_UPLOAD
      
      // First request should succeed
      const result1 = checkRateLimit('test-client-1', config)
      expect(result1.success).toBe(true)
      expect(result1.blocked).toBe(false)
      expect(result1.remaining).toBe(config.maxRequests - 1)
      
      // Second request should also succeed
      const result2 = checkRateLimit('test-client-1', config)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(config.maxRequests - 2)
    })

    test('blocks requests when limit exceeded', () => {
      const config = { windowMs: 60000, maxRequests: 2 }
      const clientId = 'test-client-blocked'
      
      // First two requests should succeed
      checkRateLimit(clientId, config)
      checkRateLimit(clientId, config)
      
      // Third request should be blocked
      const result = checkRateLimit(clientId, config)
      expect(result.success).toBe(false)
      expect(result.blocked).toBe(true)
      expect(result.remaining).toBe(0)
    })

    test('resets limit after time window', () => {
      const shortConfig = { windowMs: 100, maxRequests: 1 }
      const clientId = 'test-client-reset'
      
      // First request succeeds
      const result1 = checkRateLimit(clientId, shortConfig)
      expect(result1.success).toBe(true)
      
      // Second request blocked
      const result2 = checkRateLimit(clientId, shortConfig)
      expect(result2.blocked).toBe(true)
      
      // Wait for window to reset
      return new Promise(resolve => {
        setTimeout(() => {
          const result3 = checkRateLimit(clientId, shortConfig)
          expect(result3.success).toBe(true)
          expect(result3.remaining).toBe(shortConfig.maxRequests - 1)
          resolve(undefined)
        }, 150)
      })
    })

    test('tracks different clients separately', () => {
      const config = RATE_LIMITS.TOKEN_VALIDATION
      
      const result1 = checkRateLimit('client-a', config)
      const result2 = checkRateLimit('client-b', config)
      
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      
      // Both should have same remaining count
      expect(result1.remaining).toBe(result2.remaining)
    })
  })

  describe('Portal-Specific Rate Limits', () => {
    test('file upload rate limit is restrictive', () => {
      const config = RATE_LIMITS.FILE_UPLOAD
      expect(config.maxRequests).toBe(10) // 10 uploads per minute
      expect(config.windowMs).toBe(60000) // 1 minute window
    })

    test('token validation allows more frequent access', () => {
      const config = RATE_LIMITS.TOKEN_VALIDATION
      expect(config.maxRequests).toBe(20) // 20 validations per minute
      expect(config.windowMs).toBe(60000) // 1 minute window
    })

    test('email sending is highly restrictive', () => {
      const config = RATE_LIMITS.EMAIL_SEND
      expect(config.maxRequests).toBe(5) // Only 5 emails per hour
      expect(config.windowMs).toBe(60 * 60 * 1000) // 1 hour window
    })

    test('portal access allows reasonable browsing', () => {
      const config = RATE_LIMITS.PORTAL_ACCESS
      expect(config.maxRequests).toBe(30) // 30 requests per minute
      expect(config.windowMs).toBe(60000) // 1 minute window
    })
  })

  describe('Rate Limit Headers and Response', () => {
    test('provides correct rate limit information', () => {
      const config = { windowMs: 60000, maxRequests: 5 }
      const clientId = 'test-headers'
      
      const result = checkRateLimit(clientId, config)
      
      expect(result.limit).toBe(5)
      expect(result.remaining).toBe(4)
      expect(result.reset).toBeGreaterThan(Date.now())
      expect(result.reset).toBeLessThanOrEqual(Date.now() + 60000)
    })

    test('provides reset timestamp for blocked requests', () => {
      const config = { windowMs: 60000, maxRequests: 1 }
      const clientId = 'test-blocked-headers'
      
      // Use up the limit
      checkRateLimit(clientId, config)
      
      // Next request should be blocked with reset info
      const blockedResult = checkRateLimit(clientId, config)
      expect(blockedResult.blocked).toBe(true)
      expect(blockedResult.reset).toBeGreaterThan(Date.now())
    })
  })

  describe('Edge Cases and Error Handling', () => {
    test('handles empty client identifier', () => {
      const config = RATE_LIMITS.FILE_UPLOAD
      
      const result = checkRateLimit('', config)
      expect(result.success).toBe(true) // Should still work with empty string
    })

    test('handles very high request volumes', () => {
      const config = { windowMs: 60000, maxRequests: 100 }
      const clientId = 'high-volume-client'
      
      // Make many requests rapidly
      for (let i = 0; i < 150; i++) {
        const result = checkRateLimit(clientId, config)
        
        if (i < 100) {
          expect(result.success).toBe(true)
        } else {
          expect(result.blocked).toBe(true)
        }
      }
    })

    test('cleanup removes old entries', () => {
      const config = { windowMs: 50, maxRequests: 1 }
      const oldClient = 'old-client'
      const newClient = 'new-client'
      
      // Make request with old client
      checkRateLimit(oldClient, config)
      
      // Wait for window to expire
      return new Promise(resolve => {
        setTimeout(() => {
          // Make many requests with new client to trigger cleanup
          for (let i = 0; i < 100; i++) {
            checkRateLimit(newClient + i, config)
          }
          
          // Old client should now work again (entry was cleaned up)
          const result = checkRateLimit(oldClient, config)
          expect(result.success).toBe(true)
          resolve(undefined)
        }, 100)
      })
    })
  })

  describe('Security Considerations', () => {
    test('prevents abuse from single IP', () => {
      const config = { windowMs: 60000, maxRequests: 3 }
      const maliciousIp = '192.168.1.100'
      
      // Simulate rapid requests from potentially malicious source
      const results = []
      for (let i = 0; i < 5; i++) {
        results.push(checkRateLimit(maliciousIp, config))
      }
      
      // First 3 should succeed, last 2 should be blocked
      expect(results[0].success).toBe(true)
      expect(results[1].success).toBe(true)
      expect(results[2].success).toBe(true)
      expect(results[3].blocked).toBe(true)
      expect(results[4].blocked).toBe(true)
    })

    test('handles distributed attacks across IPs', () => {
      const config = { windowMs: 60000, maxRequests: 2 }
      
      // Each IP gets its own allowance
      const ips = ['10.0.0.1', '10.0.0.2', '10.0.0.3']
      
      ips.forEach(ip => {
        const result1 = checkRateLimit(ip, config)
        const result2 = checkRateLimit(ip, config)
        const result3 = checkRateLimit(ip, config)
        
        expect(result1.success).toBe(true)
        expect(result2.success).toBe(true)
        expect(result3.blocked).toBe(true)
      })
    })
  })
})