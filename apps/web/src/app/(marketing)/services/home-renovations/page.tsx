import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon, ArrowLeft, Phone, Home, Hammer, Paintbrush, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Home Renovations - Bayside Builders WA',
  description: 'Transform your existing space with expert renovation and remodeling services. Kitchen, bathroom, and whole house renovations in Perth.',
  keywords: ['home renovations Perth', 'kitchen renovation WA', 'bathroom remodeling Perth', 'house renovations Western Australia'],
}

export default function HomeRenovationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-4">Transform Your Space</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Home Renovations
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Breathe new life into your home with our expert renovation services. 
              From kitchen makeovers to complete home transformations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Get Free Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">View Renovations</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Renovation Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Kitchen Renovations</h3>
                    <p className="text-sm text-muted-foreground">
                      Modern kitchens with custom cabinetry and premium appliances
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Bathroom Remodeling</h3>
                    <p className="text-sm text-muted-foreground">
                      Luxurious bathrooms with quality fixtures and finishes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Living Areas</h3>
                    <p className="text-sm text-muted-foreground">
                      Open plan living spaces and entertainment areas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Bedroom Upgrades</h3>
                    <p className="text-sm text-muted-foreground">
                      Master suites and built-in wardrobes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Structural Changes</h3>
                    <p className="text-sm text-muted-foreground">
                      Wall removal and space reconfiguration
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Complete Makeovers</h3>
                    <p className="text-sm text-muted-foreground">
                      Whole house renovations and updates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Renovations */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Popular Renovation Projects</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <Home className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Open Plan Living</h3>
              <p className="text-sm text-muted-foreground">
                Create spacious, modern living areas
              </p>
            </div>
            <div>
              <Hammer className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Kitchen Islands</h3>
              <p className="text-sm text-muted-foreground">
                Add functionality and style
              </p>
            </div>
            <div>
              <Paintbrush className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Feature Walls</h3>
              <p className="text-sm text-muted-foreground">
                Create stunning focal points
              </p>
            </div>
            <div>
              <Wrench className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Smart Home</h3>
              <p className="text-sm text-muted-foreground">
                Modern technology integration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Renovation Process</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Consultation</h3>
              <p className="text-sm text-muted-foreground">
                Assess your space and needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Design</h3>
              <p className="text-sm text-muted-foreground">
                Create plans and select materials
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Construction</h3>
              <p className="text-sm text-muted-foreground">
                Execute renovation with minimal disruption
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Completion</h3>
              <p className="text-sm text-muted-foreground">
                Final touches and walkthrough
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let&apos;s discuss your renovation project and bring your vision to life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Get Free Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
              <Link href="/projects">
                View Our Work
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Back to Services */}
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild>
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Services
          </Link>
        </Button>
      </div>
    </div>
  )
}