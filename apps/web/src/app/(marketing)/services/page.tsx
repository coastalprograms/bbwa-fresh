import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/sections/hero-section"
import { 
  CheckIcon, 
  ArrowRightIcon, 
  HomeIcon, 
  Building2Icon, 
  HammerIcon, 
  PaintbrushIcon,
  SparklesIcon,
  RocketIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  WrenchIcon,
  LayersIcon
} from "lucide-react"

export const metadata: Metadata = {
  title: 'Construction Services Dunsborough - New Homes, Renovations & Extensions',
  description: 'Complete construction services in Dunsborough, WA. New home construction, renovations, extensions, commercial projects & maintenance. Licensed builders with 20+ years experience.',
  keywords: ['construction services Dunsborough', 'new home construction South West', 'home renovations Dunsborough', 'extensions Dunsborough', 'commercial construction South West', 'maintenance repairs Dunsborough', 'project management construction'],
  openGraph: {
    title: 'Construction Services Dunsborough - Bayside Builders WA',
    description: 'Professional construction services across the South West. New homes, renovations, extensions & commercial projects by licensed builders.',
    images: [
      {
        url: '/images/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'Bayside Builders WA Construction Services Perth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Services Dunsborough - Bayside Builders WA',
    description: 'Professional construction services in Perth. New homes, renovations, extensions & more.',
    images: ['/images/twitter-services.jpg'],
  },
}

const services = [
  {
    icon: HomeIcon,
    title: "New Home Construction",
    description: "Custom homes built from the ground up with quality craftsmanship and attention to detail",
    features: [
      "Custom home design",
      "Foundation to finish",
      "Quality materials",
      "Energy efficient builds"
    ],
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
    href: "/services/new-home-construction"
  },
  {
    icon: HammerIcon,
    title: "Home Renovations",
    description: "Transform your existing space with expert renovation and remodeling services",
    features: [
      "Kitchen renovations",
      "Bathroom remodeling",
      "Interior upgrades",
      "Structural modifications"
    ],
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-500",
    href: "/services/home-renovations"
  },
  {
    icon: LayersIcon,
    title: "Extensions & Additions",
    description: "Add more space and value to your property with professional extensions",
    features: [
      "Second story additions",
      "Room extensions",
      "Outdoor living spaces",
      "Garage conversions"
    ],
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-500",
    href: "/services/extensions-additions"
  },
  {
    icon: Building2Icon,
    title: "Commercial Construction",
    description: "Professional commercial construction and fit-out services for businesses",
    features: [
      "Office fit-outs",
      "Retail spaces",
      "Industrial buildings",
      "Restaurant build-outs"
    ],
    gradient: "from-orange-500/10 to-red-500/10",
    iconColor: "text-orange-500",
    href: "/services/commercial-construction"
  },
  {
    icon: WrenchIcon,
    title: "Maintenance & Repairs",
    description: "Ongoing maintenance and repair services to keep your property in top condition",
    features: [
      "Emergency repairs",
      "Preventive maintenance",
      "Property inspections",
      "Warranty support"
    ],
    gradient: "from-indigo-500/10 to-blue-500/10",
    iconColor: "text-indigo-500",
    href: "/services/maintenance-repairs"
  },
  {
    icon: ShieldCheckIcon,
    title: "Project Management",
    description: "End-to-end project management ensuring timely and budget-conscious delivery",
    features: [
      "Timeline planning",
      "Budget management",
      "Quality assurance",
      "Permit assistance"
    ],
    gradient: "from-slate-500/10 to-gray-500/10",
    iconColor: "text-slate-500",
    href: "/services/project-management"
  }
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection
        title="Our Construction Services"
        subtitle="Complete Building Solutions"
        description="From new home construction to renovations and commercial projects, we deliver exceptional results across Western Australia with quality craftsmanship and professional service."
        badge="Licensed & Insured Builders"
        primaryCta={{
          text: "Get Free Quote",
          href: "/contact"
        }}
        secondaryCta={{
          text: "View Projects",
          href: "/projects"
        }}
        showCarousel={false}
      />

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-6xl">
        
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <Card 
                    key={service.title} 
                    className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-muted hover:border-primary/20"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <CardHeader className="relative">
                      <div className={`mb-4 p-3 w-fit rounded-lg bg-gradient-to-br ${service.gradient} backdrop-blur-sm`}>
                        <Icon className={`h-6 w-6 ${service.iconColor}`} />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <Link href={service.href as any}>
                          Learn More
                          <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Our Process
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How We Work</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A proven process that ensures successful project delivery
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Consultation</h3>
                <p className="text-sm text-muted-foreground">Meet to discuss your vision and assess your needs</p>
              </div>
              <div className="text-center">
                <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Planning</h3>
                <p className="text-sm text-muted-foreground">Create detailed plans and secure permits</p>
              </div>
              <div className="text-center">
                <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Construction</h3>
                <p className="text-sm text-muted-foreground">Build with quality materials and expert craftsmanship</p>
              </div>
              <div className="text-center">
                <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold mb-2">Completion</h3>
                <p className="text-sm text-muted-foreground">Final inspection and handover with warranty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
            <div className="absolute inset-0 bg-grid-pattern-white" />
            <CardContent className="relative p-12 text-center">
              <Badge variant="secondary" className="mb-6">
                Get Started Today
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Construction Project?</h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Let&apos;s discuss your project and see how we can help bring your vision to life with quality construction services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="group" asChild>
                  <Link href="/contact">
                    Get Free Quote
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" asChild>
                  <Link href="/projects">
                    View Our Work
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
