/**
 * Jest setup for SWMS migration tests
 */

// Set test timeout to 30 seconds for database operations
jest.setTimeout(30000)

// Set up environment variables for testing
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321'
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-key'

// Global test setup
beforeAll(() => {
  console.log('🧪 Starting SWMS migration tests...')
  console.log(`Using Supabase URL: ${process.env.SUPABASE_URL}`)
})

afterAll(() => {
  console.log('✅ SWMS migration tests completed')
})