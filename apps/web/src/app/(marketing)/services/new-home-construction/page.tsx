import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon, ArrowLeft, Phone, Clock, Shield, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'New Home Construction - Bayside Builders WA',
  description: 'Custom homes built from the ground up with quality craftsmanship and attention to detail. Licensed builders serving Perth and Western Australia.',
  keywords: ['new home construction Perth', 'custom home builders WA', 'house construction Perth', 'home builders Western Australia'],
}

export default function NewHomeConstructionPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-4">Licensed & Insured Builders</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              New Home Construction
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Building your dream home from the ground up with quality craftsmanship, 
              attention to detail, and a commitment to exceeding your expectations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Get Free Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What&apos;s Included</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Custom Home Design</h3>
                    <p className="text-sm text-muted-foreground">
                      Work with our architects to create your perfect floor plan
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
                    <h3 className="font-semibold mb-2">Foundation to Finish</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete construction from groundwork to final touches
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
                    <h3 className="font-semibold mb-2">Quality Materials</h3>
                    <p className="text-sm text-muted-foreground">
                      Premium materials from trusted Australian suppliers
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
                    <h3 className="font-semibold mb-2">Energy Efficient Builds</h3>
                    <p className="text-sm text-muted-foreground">
                      Modern insulation and energy-saving features
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
                    <h3 className="font-semibold mb-2">Full Project Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Dedicated project manager from start to finish
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
                    <h3 className="font-semibold mb-2">Warranty & Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive warranty and after-sales support
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Process</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Initial Consultation</h3>
              <p className="text-sm text-muted-foreground">
                Meet to discuss your vision, budget, and timeline
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Design & Planning</h3>
              <p className="text-sm text-muted-foreground">
                Create detailed plans and secure all permits
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Construction</h3>
              <p className="text-sm text-muted-foreground">
                Build your home with quality and precision
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Bayside Builders</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">On-Time Delivery</h3>
              <p className="text-sm text-muted-foreground">
                We complete projects on schedule
              </p>
            </div>
            <div>
              <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fully Insured</h3>
              <p className="text-sm text-muted-foreground">
                Complete insurance coverage
              </p>
            </div>
            <div>
              <Award className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Licensed Builders</h3>
              <p className="text-sm text-muted-foreground">
                Qualified and experienced team
              </p>
            </div>
            <div>
              <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Always available for our clients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get a free consultation and quote from Perth&apos;s trusted construction professionals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Get Free Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
              <Link href="/projects">
                View Our Projects
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