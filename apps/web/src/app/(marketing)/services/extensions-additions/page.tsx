import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon, ArrowLeft, Phone, Maximize, Home, ArrowUp, Trees } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Extensions & Additions - Bayside Builders WA',
  description: 'Add more space and value to your property with professional extensions. Second story additions, room extensions, and outdoor living spaces in Perth.',
  keywords: ['home extensions Perth', 'second story addition WA', 'room additions Perth', 'house extensions Western Australia'],
}

export default function ExtensionsAdditionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-4">Expand Your Living Space</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Extensions & Additions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create the extra space you need without moving. Professional extensions 
              that seamlessly blend with your existing home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Get Free Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">View Extensions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Extension Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Extension Options</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ArrowUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Second Story Additions</h3>
                    <p className="text-sm text-muted-foreground">
                      Double your living space by building up
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Maximize className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Room Extensions</h3>
                    <p className="text-sm text-muted-foreground">
                      Add extra bedrooms, living areas, or home offices
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Trees className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Outdoor Living</h3>
                    <p className="text-sm text-muted-foreground">
                      Alfresco areas, patios, and outdoor kitchens
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Garage Conversions</h3>
                    <p className="text-sm text-muted-foreground">
                      Transform your garage into livable space
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
                    <h3 className="font-semibold mb-2">Granny Flats</h3>
                    <p className="text-sm text-muted-foreground">
                      Self-contained living for family or rental income
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
                    <h3 className="font-semibold mb-2">Sunrooms</h3>
                    <p className="text-sm text-muted-foreground">
                      Light-filled spaces for year-round enjoyment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Benefits of Extending</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Add Value</h3>
              <p className="text-sm text-muted-foreground">
                Increase your property value significantly
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <Maximize className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">More Space</h3>
              <p className="text-sm text-muted-foreground">
                Create room for growing families
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <CheckIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Stay Put</h3>
              <p className="text-sm text-muted-foreground">
                Avoid the hassle and cost of moving
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Extension Service Includes</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Design Consultation</h3>
                <p className="text-sm text-muted-foreground">Work with architects to plan your extension</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Council Approvals</h3>
                <p className="text-sm text-muted-foreground">Handle all permits and compliance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Structural Engineering</h3>
                <p className="text-sm text-muted-foreground">Ensure safety and stability</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Seamless Integration</h3>
                <p className="text-sm text-muted-foreground">Match existing architecture and finishes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Quality Construction</h3>
                <p className="text-sm text-muted-foreground">Premium materials and workmanship</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Project Management</h3>
                <p className="text-sm text-muted-foreground">Complete coordination from start to finish</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need More Space? Let&apos;s Extend!
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get a free consultation and quote for your home extension project.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Get Free Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
              <Link href="/projects">
                View Extensions
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