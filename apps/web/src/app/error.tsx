'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console and error reporting service
    console.error('Application error:', error)
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <Card className="border-destructive/20">
          <CardContent className="p-8">
            <div className="mb-6">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
              <p className="text-muted-foreground">
                We&apos;re sorry for the inconvenience. Please try refreshing the page or go back to the previous page.
              </p>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 p-4 bg-muted rounded-lg text-left">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-sm overflow-auto max-h-40">
                  <strong>Error:</strong> {error.message}
                  {error.stack && (
                    <pre className="mt-2 whitespace-pre-wrap text-xs">
                      {error.stack}
                    </pre>
                  )}
                  {error.digest && (
                    <p className="mt-2">
                      <strong>Error ID:</strong> {error.digest}
                    </p>
                  )}
                </div>
              </details>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
              <Button onClick={reset} className="min-w-[120px]">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => history.back()} className="min-w-[120px]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button variant="outline" asChild className="min-w-[120px]">
                <a href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              If the problem continues, please{' '}
              <a href="/contact" className="text-primary hover:underline">
                contact support
              </a>
              {error.digest && (
                <>
                  {' '}and reference error ID:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {error.digest}
                  </code>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
