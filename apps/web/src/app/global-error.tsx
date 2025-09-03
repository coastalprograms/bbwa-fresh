'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
    
    // In production, you might want to send this to Sentry or similar
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error)
    }
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
          <div className="max-w-2xl w-full text-center">
            <Card className="border-destructive/20">
              <CardContent className="p-8">
                <div className="mb-6">
                  <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
                  <p className="text-muted-foreground text-lg mb-6">
                    We apologize for the inconvenience. An unexpected error has occurred.
                  </p>
                </div>

                {process.env.NODE_ENV === 'development' && (
                  <details className="mb-6 p-4 bg-muted rounded-lg text-left">
                    <summary className="cursor-pointer font-medium mb-2">
                      Error Details (Development Only)
                    </summary>
                    <pre className="text-sm overflow-auto whitespace-pre-wrap">
                      {error.message}
                      {error.stack && (
                        <>
                          {'\n\nStack trace:\n'}
                          {error.stack}
                        </>
                      )}
                      {error.digest && (
                        <>
                          {'\n\nError ID: '}
                          {error.digest}
                        </>
                      )}
                    </pre>
                  </details>
                )}

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Button onClick={reset} className="min-w-[140px]">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                    <Button variant="outline" asChild className="min-w-[140px]">
                      <a href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Go Home
                      </a>
                    </Button>
                    <Button variant="outline" asChild className="min-w-[140px]">
                      <a href="/contact">
                        <Mail className="mr-2 h-4 w-4" />
                        Report Issue
                      </a>
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    If this problem persists, please{' '}
                    <a href="/contact" className="text-primary hover:underline">
                      contact our support team
                    </a>
                    {error.digest && (
                      <>
                        {' '}and include error ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {error.digest}
                        </code>
                      </>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  )
}