import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon, ArrowLeft, Phone, ClipboardList, Calendar, Users, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Project Management - Bayside Builders WA',
  description: 'Professional project management services for construction projects. From planning to completion, we handle every detail of your build in Perth.',
  keywords: ['project management Perth', 'construction management WA', 'building project manager Perth', 'construction coordination Western Australia'],
}

export default function ProjectManagementPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-4">End-to-End Management</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Project Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional management of your construction project from concept to completion. 
              We handle the complexity so you can focus on your vision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Discuss Your Project
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">View Managed Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Management Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Planning & Design</h3>
                    <p className="text-sm text-muted-foreground">
                      Coordinate architects, engineers, and designers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Timeline Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep your project on schedule
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Contractor Coordination</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage all trades and suppliers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Budget Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Track costs and prevent overruns
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
                    <h3 className="font-semibold mb-2">Quality Assurance</h3>
                    <p className="text-sm text-muted-foreground">
                      Regular inspections and standards compliance
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
                    <h3 className="font-semibold mb-2">Permit Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Handle all approvals and compliance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Projects We Manage</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div>
              <h3 className="font-semibold mb-3">Residential</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• New homes</li>
                <li>• Renovations</li>
                <li>• Extensions</li>
                <li>• Multi-unit developments</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Commercial</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Office buildings</li>
                <li>• Retail spaces</li>
                <li>• Restaurants</li>
                <li>• Warehouses</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Specialty</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Medical facilities</li>
                <li>• Educational buildings</li>
                <li>• Heritage restorations</li>
                <li>• Green buildings</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Development</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Subdivisions</li>
                <li>• Townhouse complexes</li>
                <li>• Mixed-use projects</li>
                <li>• Master planning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Management Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Management Process</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Initial Assessment</h3>
                <p className="text-sm text-muted-foreground">Evaluate project scope and requirements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Team Assembly</h3>
                <p className="text-sm text-muted-foreground">Select the best contractors and suppliers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Schedule Creation</h3>
                <p className="text-sm text-muted-foreground">Develop detailed project timeline</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Daily Coordination</h3>
                <p className="text-sm text-muted-foreground">Manage all aspects of construction</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Progress Reporting</h3>
                <p className="text-sm text-muted-foreground">Regular updates and transparency</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Final Handover</h3>
                <p className="text-sm text-muted-foreground">Complete documentation and warranty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Professional Management */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Professional Management Matters</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Single Point of Contact</h3>
              <p className="text-sm text-muted-foreground">
                One person to coordinate everything
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Save Time</h3>
              <p className="text-sm text-muted-foreground">
                Avoid delays and keep on schedule
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Control Costs</h3>
              <p className="text-sm text-muted-foreground">
                Prevent budget overruns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let Us Manage Your Next Project
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Professional project management ensures your build runs smoothly from start to finish.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Start Your Project
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
              <Link href="/about">
                Learn About Us
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