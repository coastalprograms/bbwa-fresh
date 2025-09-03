import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    if (!body.name || !body.value || !body.id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, you would typically:
    // 1. Store in a database or analytics service
    // 2. Send to monitoring services like DataDog, New Relic, etc.
    // 3. Log to structured logging service
    
    console.log('[Web Vitals Analytics]', {
      metric: body.name,
      value: body.value,
      id: body.id,
      delta: body.delta,
      url: body.url,
      timestamp: body.timestamp,
      userAgent: request.headers.get('user-agent'),
    })

    // Example: Set thresholds and alert on poor performance
    const thresholds = {
      CLS: 0.1, // Cumulative Layout Shift
      FCP: 1800, // First Contentful Paint (ms)
      FID: 100, // First Input Delay (ms)
      LCP: 2500, // Largest Contentful Paint (ms)
      TTFB: 800, // Time to First Byte (ms)
    }

    const threshold = thresholds[body.name as keyof typeof thresholds]
    if (threshold && body.value > threshold) {
      console.warn(`[Performance Alert] ${body.name} exceeded threshold:`, {
        value: body.value,
        threshold,
        url: body.url,
      })
      
      // In production, send alert to monitoring service
      // await sendPerformanceAlert(body.name, body.value, threshold, body.url)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Web Vitals Analytics] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}