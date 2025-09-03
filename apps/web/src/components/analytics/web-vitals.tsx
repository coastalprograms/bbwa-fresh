'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric)
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics 4
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as any).gtag
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
          custom_map: {
            metric_id: 'dimension1',
            metric_value: 'metric1',
            metric_delta: 'metric2',
          },
        })
      }

      // Example: Send to custom analytics endpoint
      // Use sendBeacon for better reliability when page is unloading
      const payload = JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        url: window.location.href,
        timestamp: Date.now(),
      })
      
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/api/analytics/web-vitals', payload)
      } else {
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: payload,
          keepalive: true,
        }).catch((error) => {
          console.warn('Failed to send web vitals:', error)
        })
      }
    }
  })

  return null
}