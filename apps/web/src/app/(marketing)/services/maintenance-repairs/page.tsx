import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon, ArrowLeft, Phone, Wrench, Clock, Shield, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maintenance & Repairs - Bayside Builders WA',
  description: 'Ongoing maintenance and repair services to keep your property in top condition. Emergency repairs, preventive maintenance, and property inspections in Perth.',
  keywords: ['property maintenance Perth', 'home repairs WA', 'emergency repairs Perth', 'building maintenance Western Australia'],
}

export default function MaintenanceRepairsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-4">24/7 Emergency Service</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Maintenance & Repairs
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Keep your property in perfect condition with our comprehensive 
              maintenance and repair services. From emergency fixes to preventive care.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Call for Emergency Repair
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Schedule Maintenance</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Maintenance Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Emergency Repairs</h3>
                    <p className="text-sm text-muted-foreground">
                      24/7 response for urgent issues
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Preventive Maintenance</h3>
                    <p className="text-sm text-muted-foreground">
                      Regular servicing to prevent issues
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
                    <h3 className="font-semibold mb-2">Property Inspections</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive property assessments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">General Repairs</h3>
                    <p className="text-sm text-muted-foreground">
                      Plumbing, electrical, and structural fixes
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
                    <h3 className="font-semibold mb-2">Warranty Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Coverage for our construction projects
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Scheduled Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Regular maintenance programs available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Repairs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Common Repair Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div>
              <h3 className="font-semibold mb-3">Structural</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Wall cracks</li>
                <li>• Foundation issues</li>
                <li>• Roof repairs</li>
                <li>• Window & door fixes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Plumbing</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Leaking pipes</li>
                <li>• Blocked drains</li>
                <li>• Hot water systems</li>
                <li>• Tap repairs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Electrical</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Power outages</li>
                <li>• Switch replacements</li>
                <li>• Lighting fixes</li>
                <li>• Safety checks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">External</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Fence repairs</li>
                <li>• Gutter cleaning</li>
                <li>• Deck maintenance</li>
                <li>• Driveway fixes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Maintenance Plans</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-xl mb-3">Basic</h3>
                <p className="text-3xl font-bold mb-4">$150<span className="text-lg">/month</span></p>
                <ul className="space-y-2 text-sm">
                  <li>Quarterly inspections</li>
                  <li>Priority scheduling</li>
                  <li>10% repair discount</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardContent className="p-6 text-center">
                <Badge className="mb-3">Most Popular</Badge>
                <h3 className="font-bold text-xl mb-3">Professional</h3>
                <p className="text-3xl font-bold mb-4">$300<span className="text-lg">/month</span></p>
                <ul className="space-y-2 text-sm">
                  <li>Monthly inspections</li>
                  <li>Emergency priority</li>
                  <li>20% repair discount</li>
                  <li>Preventive maintenance</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-xl mb-3">Premium</h3>
                <p className="text-3xl font-bold mb-4">$500<span className="text-lg">/month</span></p>
                <ul className="space-y-2 text-sm">
                  <li>Bi-weekly inspections</li>
                  <li>24/7 emergency response</li>
                  <li>30% repair discount</li>
                  <li>All maintenance included</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Keep Your Property in Perfect Condition
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Regular maintenance saves money and prevents major issues. Let us take care of your property.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Schedule Service
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
              <Link href="tel:0890001234">
                <Phone className="mr-2 h-4 w-4" />
                Call Emergency Line
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