'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        {/* Quick search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Search our site</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for services, projects, or information..."
                className="pl-10"
                aria-label="Search site content"
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation options */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Popular Pages</h3>
              <nav aria-label="Popular page links">
                <ul className="space-y-2 text-left">
                  <li>
                    <Link href="/services" className="text-primary hover:underline">
                      Our Construction Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/projects" className="text-primary hover:underline">
                      Recent Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-primary hover:underline">
                      About Bayside Builders
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-primary hover:underline">
                      Get In Touch
                    </Link>
                  </li>
                </ul>
              </nav>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <nav aria-label="Quick navigation links">
                <ul className="space-y-2 text-left">
                  <li>
                    <Link href="/portal" className="text-primary hover:underline">
                      Worker Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="/induction" className="text-primary hover:underline">
                      Site Induction
                    </Link>
                  </li>
                  <li>
                    <Link href="/check-in" className="text-primary hover:underline">
                      Site Check-In
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="text-primary hover:underline">
                      Admin Dashboard
                    </Link>
                  </li>
                </ul>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild className="min-w-[140px]">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => history.back()} className="min-w-[140px]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button variant="outline" asChild className="min-w-[140px]">
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <p className="text-sm text-muted-foreground mt-8">
          If you believe this is an error, please{' '}
          <Link href="/contact" className="text-primary hover:underline">
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  )
}