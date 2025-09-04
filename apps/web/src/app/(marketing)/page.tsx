"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/sections/hero-section"
import { AnimatedSection, AnimatedCard, AnimatedIcon, AnimatedText } from "@/components/ui/animated-components"

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
      {/* Hero Section - Slide up from foundation */}
      <AnimatedSection variant="hero" bidirectional={true}>
        <HeroSection
          title="Dunsborough's Premier Construction Partners"
          subtitle="Building Excellence Across the South West"
          description="From custom luxury homes to commercial developments and agricultural structures, we deliver quality construction services with expertise and reliability."
          badge="Trusted Since 2008"
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
      </AnimatedSection>

      {/* Services Section */}
      <section id="services-section" className="py-20 bg-background">
        <div className="container">
          <AnimatedSection className="text-center mb-16" variant="bidirectional" bidirectional={true}>
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
          </AnimatedSection>
          
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {servicesData.slice(0, 3).map((service, index) => {
              const getServiceImage = (slug: string) => {
                switch (slug) {
                  case 'custom-luxury-homes':
                    return 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&h=600&fit=crop&crop=center'
                  case 'commercial-construction':
                    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&crop=center'
                  case 'agricultural-farming':
                    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&crop=center'
                  default:
                    return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&crop=center'
                }
              }
              
              return (
                <AnimatedCard key={service.slug} index={index} stacked={true} className="h-full">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden h-full min-h-[600px] relative">
                    <Image
                      src={getServiceImage(service.slug)}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-8">
                      <CardTitle className="text-2xl font-bold mb-4 text-white">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-lg leading-relaxed text-white/90 mb-6">
                        {service.summary}
                      </CardDescription>
                      <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/10 font-semibold p-0 h-auto w-fit" asChild>
                        <Link href={`/services/${service.slug}` as any}>
                          Learn More
                          <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </AnimatedCard>
              )
            })}
          </div>
          
          <AnimatedSection className="text-center mt-12" variant="bidirectional" bidirectional={true} delay={0.6}>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">
                View All Construction Services
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left Side */}
            <AnimatedSection variant="text" bidirectional={true} className="space-y-6">
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
            </AnimatedSection>

            {/* Images - Right Side */}
            <AnimatedSection variant="image" bidirectional={true} className="relative flex justify-end" delay={0.3}>
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
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <ProjectsCarousel />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <AnimatedSection className="text-center mb-12" variant="bidirectional" bidirectional={true}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We don&apos;t do hype. Just real feedback from real businesses we&apos;ve helped streamline, scale and simplify.
            </p>
          </AnimatedSection>
          
          <AnimatedSection className="max-w-4xl mx-auto" variant="testimonial" delay={0.2}>
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
          </AnimatedSection>
        </div>
      </section>


      {/* Core Values Section */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <AnimatedSection className="text-center mb-16" variant="bidirectional" bidirectional={true}>
            <Badge variant="outline" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built on Strong Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to quality, reliability, and customer satisfaction drives everything we do in the South West.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value, index) => (
              <div key={index} className="text-center group">
                <AnimatedIcon index={index} className="mb-6 p-4 w-fit mx-auto rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <value.icon className="h-8 w-8" />
                </AnimatedIcon>
                <AnimatedSection variant="bidirectional" bidirectional={true} delay={index * 0.1 + 0.3}>
                  <h3 className="text-lg font-semibold mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </AnimatedSection>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}