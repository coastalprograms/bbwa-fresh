"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/sections/hero-section"

import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRightIcon, 
  CheckIcon, 
  StarIcon,
  ChevronDownIcon,
  Building2Icon,
  ShowerHeadIcon,
  HomeIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  AwardIcon,
  CrownIcon,
  WarehouseIcon,
  TractorIcon
} from "lucide-react"
import { servicesData } from "@/lib/services-data"
import { ProjectsCarousel } from "@/components/projects/ProjectsCarousel"
import type { LucideIcon } from "lucide-react"

// Define types for better type safety
interface CoreValue {
  icon: LucideIcon
  title: string
  description: string
}

const CORE_VALUES: CoreValue[] = [
  {
    icon: ShieldCheckIcon,
    title: "Quality First",
    description: "We deliver workmanship that stands the test of time with attention to every detail."
  },
  {
    icon: ClockIcon,
    title: "On-Time Delivery",
    description: "Clear schedules and dependable delivery. Your time is valuable to us."
  },
  {
    icon: UsersIcon,
    title: "Expert Team",
    description: "Licensed professionals with years of experience in residential construction."
  },
  {
    icon: AwardIcon,
    title: "Trusted Service",
    description: "Open communication, fair pricing, and complete transparency throughout your project."
  }
]

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  'custom-luxury-homes': CrownIcon,
  'commercial-construction': WarehouseIcon,
  'agricultural-farming': TractorIcon
}

export default function LandingPage() {

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection
        title="Dunsborough's Premier Construction Partners"
        subtitle="Building Excellence for 15+ Years"
        description="Delivering quality construction projects across the South West. From new homes to renovations, we bring expertise and reliability to every coastal build."
        badge="Professional Construction Services"
        primaryCta={{
          text: "Get Free Quote",
          href: "/contact"
        }}
        secondaryCta={{
          text: "View Our Work",
          href: "/projects"
        }}
        showCarousel={true}
      />

      {/* Services Section */}
      <section id="services-section" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Building2Icon className="mr-2 h-3.5 w-3.5" />
              Our Services
            </Badge>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Professional Construction Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From luxury custom homes to commercial developments and agricultural structures - we deliver quality construction services tailored to your specific needs across the South West.
            </p>
          </div>
          
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicesData.slice(0, 3).map((service) => {
              const IconComponent = SERVICE_ICON_MAP[service.slug] || Building2Icon
              
              return (
                <Card key={service.slug} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="group-hover:text-primary" asChild>
                      <Link href={`/services/${service.slug}` as any}>
                        Learn More
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">
                View All Construction Services
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left Side */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  About Bayside Builders WA
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Bayside Builders WA is a local custom builder specialising in luxury homes, 
                  commercial construction, and agricultural structures across the South West region.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  With over 15 years of experience, we deliver exceptional quality and craftsmanship 
                  on every project. Our commitment to quality, client satisfaction, and timely delivery 
                  has made us the trusted choice for construction projects throughout the region.
                </p>
                <p className="text-lg text-muted-foreground">
                  From custom luxury homes to commercial developments and farming infrastructure, 
                  we bring expertise, reliability, and attention to detail to every build.
                </p>
              </div>
            </div>

            {/* Images - Right Side */}
            <div className="relative flex justify-end">
              {/* First Image - Higher (left side) */}
              <div className="relative z-10 mr-8">
                <div className="w-64 h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg shadow-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <Building2Icon className="w-16 h-16 text-primary/60" />
                  </div>
                </div>
              </div>
              
              {/* Second Image - Lower (right side) */}
              <div className="relative mt-8 z-0">
                <div className="w-64 h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg shadow-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                    <TractorIcon className="w-16 h-16 text-primary/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <ProjectsCarousel />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We don&apos;t do hype. Just real feedback from real businesses we&apos;ve helped streamline, scale and simplify.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className="h-5 w-5 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">Google Review</span>
              </div>
              
              <blockquote className="text-lg leading-relaxed mb-8 text-gray-800">
                &quot;I engaged Bayside Builders to build a website and enhance the online presence of my heavy mechanical business. From the outset, 
                Jake demonstrated a high level of professionalism, technical expertise, and a genuine interest in helping my business grow. He was 
                prompt, well-organised, and communicative throughout the entire process, making the experience smooth and stress-free. I highly 
                recommend Bayside Builders to anyone looking for a reliable and cost-effective solution.&quot;
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">B</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Ben Scott</div>
                  <div className="text-gray-500 text-sm">July 18, 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Core Values Section */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built on Strong Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to quality, reliability, and customer satisfaction drives everything we do in the South West.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="mb-6 p-4 w-fit mx-auto rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}