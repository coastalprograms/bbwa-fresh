import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroSection } from "@/components/sections/hero-section"
import { HammerIcon, UsersIcon, ShieldCheckIcon, AwardIcon } from "lucide-react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - South West&apos;s Trusted Construction Experts',
  description: 'Learn about Bayside Builders WA, South West&apos;s family-owned construction company with 20+ years experience. Meet our licensed team and discover our commitment to quality.',
  keywords: ['about Dunsborough builders', 'construction company South West', 'licensed builders Dunsborough', 'family owned builders', 'South West construction team', 'quality builders Western Australia'],
  openGraph: {
    title: 'About Bayside Builders WA - South West&apos;s Construction Experts',
    description: 'Family-owned construction company serving the South West for 20+ years. Licensed builders committed to quality craftsmanship and customer satisfaction.',
    images: [
      {
        url: '/images/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'Bayside Builders WA Team - South West Construction Experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Bayside Builders WA - South West Construction Experts',
    description: 'Family-owned builders serving the South West for 20+ years. Licensed, experienced, and committed to quality.',
    images: ['/images/twitter-about.jpg'],
  },
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection
        title="About Bayside Builders WA"
        subtitle="Your Trusted Construction Partner"
        description="With over 15 years of experience in the Western Australian construction industry, we've built our reputation on quality craftsmanship, reliable service, and customer satisfaction."
        badge="Family-Owned Business Since 2008"
        primaryCta={{
          text: "Meet Our Team",
          href: "#team"
        }}
        secondaryCta={{
          text: "Our Story",
          href: "#story"
        }}
        showCarousel={true}
      />

      <div className="container py-16">
        <div className="mx-auto max-w-4xl">
          {/* Our Story Section */}
          <section id="story" className="mb-16">
            <Badge variant="secondary" className="mb-4">Our Story</Badge>
            <h2 className="text-3xl font-bold mb-6">Building Excellence Since 2008</h2>
            <div className="prose max-w-none text-muted-foreground space-y-4">
              <p className="text-lg">
                Bayside Builders WA was founded with a simple mission: to deliver exceptional construction services that exceed our clients&apos; expectations. What started as a small family business has grown into one of the South West&apos;s most trusted construction companies.
              </p>
              <p>
                Our journey began when founder John Smith, a licensed builder with a passion for quality craftsmanship, recognized the need for a construction company that truly put customers first. Over the years, we&apos;ve completed hundreds of projects across Western Australia, from custom homes to commercial developments.
              </p>
              <p>
                Today, we continue to uphold the same values that established our reputation: integrity, quality, and a commitment to turning our clients&apos; visions into reality.
              </p>
            </div>
          </section>
          
          {/* Values Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 w-fit rounded-lg bg-primary/10 text-primary">
                    <HammerIcon className="h-6 w-6" />
                  </div>
                  <CardTitle>Quality Craftsmanship</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We take pride in every detail, using premium materials and proven techniques to ensure lasting results.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 w-fit rounded-lg bg-primary/10 text-primary">
                    <UsersIcon className="h-6 w-6" />
                  </div>
                  <CardTitle>Customer Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your satisfaction is our priority. We listen, communicate clearly, and deliver on our promises.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 w-fit rounded-lg bg-primary/10 text-primary">
                    <ShieldCheckIcon className="h-6 w-6" />
                  </div>
                  <CardTitle>Safety First</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We maintain the highest safety standards on every job site to protect our team and your property.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 w-fit rounded-lg bg-primary/10 text-primary">
                    <AwardIcon className="h-6 w-6" />
                  </div>
                  <CardTitle>Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We strive for excellence in every project, big or small, from conception to completion.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Team Section */}
          <section id="team">
            <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>John Smith</CardTitle>
                  <CardDescription>Founder & Master Builder</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    With over 20 years in the construction industry, John leads our team with expertise in custom homes, renovations, and commercial projects. He&apos;s committed to maintaining the highest standards of quality and customer service.
                  </p>
                  <div className="mt-4 space-y-1 text-sm">
                    <p><strong>License:</strong> BC123456</p>
                    <p><strong>Specialties:</strong> Custom Homes, Project Management</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sarah Johnson</CardTitle>
                  <CardDescription>Project Manager & Interior Design</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sarah brings 12 years of project management experience and a keen eye for design. She ensures every project runs smoothly while helping clients achieve their vision for beautiful, functional spaces.
                  </p>
                  <div className="mt-4 space-y-1 text-sm">
                    <p><strong>Qualifications:</strong> Dip. Interior Design, PMP Certified</p>
                    <p><strong>Specialties:</strong> Renovations, Interior Design</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
