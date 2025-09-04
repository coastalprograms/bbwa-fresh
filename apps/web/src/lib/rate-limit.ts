// Rate limiting utilities for SWMS portal security
// Uses in-memory storage for simplicity - replace with Redis in production

interface RateLimitEntry {
  count: number
  windowStart: number
}

// In-memory rate limit store (replace with Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean // Don't count successful requests
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number // Timestamp when window resets
  blocked: boolean
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const windowStart = Math.floor(now / config.windowMs) * config.windowMs
  
  const key = `${identifier}:${windowStart}`
  const entry = rateLimitStore.get(key) || { count: 0, windowStart }
  
  // Clean old entries periodically
  if (Math.random() < 0.01) {
    cleanupOldEntries(config.windowMs)
  }
  
  // Check if limit exceeded
  const blocked = entry.count >= config.maxRequests
  
  if (!blocked) {
    entry.count += 1
    rateLimitStore.set(key, entry)
  }
  
  return {
    success: !blocked,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    reset: windowStart + config.windowMs,
    blocked
  }
}

function cleanupOldEntries(windowMs: number) {
  const cutoff = Date.now() - windowMs
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.windowStart < cutoff) {
      rateLimitStore.delete(key)
    }
  }
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Portal access - allow frequent legitimate access
  PORTAL_ACCESS: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30 // 30 requests per minute
  },
  
  // File upload - more restrictive to prevent abuse
  FILE_UPLOAD: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10 // 10 uploads per minute
  },
  
  // Token validation - moderate restrictions
  TOKEN_VALIDATION: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20 // 20 validations per minute
  },
  
  // Email sending - very restrictive
  EMAIL_SEND: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5 // 5 emails per hour
  }
} as const

// Helper to get client identifier for rate limiting
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for production with reverse proxy)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  // Use the first IP from x-forwarded-for chain
  const clientIp = forwardedFor?.split(',')[0]?.trim() || 
                  realIp || 
                  'unknown'
  
  return clientIp
}

// Middleware helper for Next.js API routes
export function withRateLimit<T extends any[]>(
  config: RateLimitConfig,
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    // Assume first argument is Request for API routes
    const request = args[0] as Request
    const identifier = getClientIdentifier(request)
    
    const rateLimit = checkRateLimit(identifier, config)
    
    if (rateLimit.blocked) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Limit: ${rateLimit.limit} per ${Math.round(config.windowMs / 1000)}s`,
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.reset.toString(),
            'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString()
          }
        }
      )
    }
    
    // Add rate limit headers to response
    const response = await handler(...args)
    
    response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimit.reset.toString())
    
    return response
  }
}