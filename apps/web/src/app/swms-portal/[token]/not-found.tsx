import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Access Token Invalid</CardTitle>
            <CardDescription>
              The SWMS submission portal link you&apos;re trying to access is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">This could be because:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>The token has expired (default 7-day expiry)</li>
                <li>The SWMS job is no longer active</li>
                <li>The link was typed incorrectly</li>
                <li>The contractor assignment has changed</li>
              </ul>
            </div>
            
            <div className="pt-4 space-y-3">
              <Button asChild className="w-full">
                <Link href="mailto:frank@baysidebuilders.com.au">
                  Contact Administration
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Return to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}