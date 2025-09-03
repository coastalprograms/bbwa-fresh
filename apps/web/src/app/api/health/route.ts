import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Basic health metrics
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      build: {
        timestamp: process.env.BUILD_TIMESTAMP || 'unknown',
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
        branch: process.env.VERCEL_GIT_COMMIT_REF || 'unknown',
      },
    }

    // Performance check
    const responseTime = Date.now() - startTime
    
    // Status checks
    const checks = {
      database: await checkDatabase(),
      environment: checkEnvironment(),
      performance: {
        responseTime: `${responseTime}ms`,
        memoryUsage: `${healthData.memory.used}MB`,
        status: responseTime < 1000 ? 'good' : 'slow'
      }
    }
    
    const overallStatus = Object.values(checks).every(check => 
      typeof check === 'object' ? check.status !== 'error' : check !== 'error'
    ) ? 'healthy' : 'unhealthy'
    
    return NextResponse.json({
      ...healthData,
      status: overallStatus,
      checks,
      responseTime: `${responseTime}ms`
    }, {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${Date.now() - startTime}ms`
    }, { status: 500 })
  }
}

async function checkDatabase() {
  try {
    // Basic connectivity check to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      return { status: 'warning', message: 'Database URL not configured' }
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
      }
    })
    
    return {
      status: response.ok || response.status === 401 ? 'healthy' : 'error',
      responseTime: response.headers.get('x-response-time') || 'unknown',
      statusCode: response.status
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed'
    }
  }
}

function checkEnvironment() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  
  const missing = requiredEnvVars.filter(varName => !process.env[varName])
  
  return {
    status: missing.length === 0 ? 'healthy' : 'error',
    missing: missing.length > 0 ? missing : undefined,
    configured: requiredEnvVars.length - missing.length,
    total: requiredEnvVars.length
  }
}