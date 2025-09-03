import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon, ArrowLeft, Phone, Building2, Store, Warehouse, Coffee } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Commercial Construction - Bayside Builders WA', 
  description: 'Professional commercial construction and fit-out services for businesses in Perth. Office spaces, retail shops, restaurants, and industrial buildings.',
  keywords: ['commercial construction Perth', 'office fit out WA', 'retail construction Perth', 'commercial builders Western Australia'],
}

export default function CommercialConstructionPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-4">Commercial Builders</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Commercial Construction
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional commercial construction and fit-out services for businesses. 
              On time, on budget, minimal disruption.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Get Free Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">View Commercial Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Commercial Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Office Fit-Outs</h3>
                    <p className="text-sm text-muted-foreground">
                      Modern workspaces designed for productivity
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Retail Spaces</h3>
                    <p className="text-sm text-muted-foreground">
                      Attractive shopfronts and retail interiors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Coffee className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Restaurant Build-Outs</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete hospitality venue construction
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Warehouse className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Industrial Buildings</h3>
                    <p className="text-sm text-muted-foreground">
                      Warehouses and manufacturing facilities
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
                    <h3 className="font-semibold mb-2">Medical Clinics</h3>
                    <p className="text-sm text-muted-foreground">
                      Healthcare facilities to compliance standards
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
                    <h3 className="font-semibold mb-2">Education Facilities</h3>
                    <p className="text-sm text-muted-foreground">
                      Schools, training centers, and childcare
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Businesses Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Minimal Disruption</h3>
                <p className="text-sm text-muted-foreground">Work around your business hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Compliance Expertise</h3>
                <p className="text-sm text-muted-foreground">Meet all commercial building codes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Fixed Price Contracts</h3>
                <p className="text-sm text-muted-foreground">No budget surprises</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Project Management</h3>
                <p className="text-sm text-muted-foreground">Single point of contact</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Quality Guarantee</h3>
                <p className="text-sm text-muted-foreground">Commercial-grade materials</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Safety First</h3>
                <p className="text-sm text-muted-foreground">Fully compliant safety protocols</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Business Space?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Professional commercial construction with minimal disruption to your operations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Get Free Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
              <Link href="/projects">
                View Portfolio
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