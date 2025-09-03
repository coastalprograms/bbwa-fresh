"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import Link from "next/link"
import Image from "next/image"
import { useCallback } from "react"
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
  AwardIcon
} from "lucide-react"
import { servicesData } from "@/lib/services-data"
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
  'new-home-construction': HomeIcon,
  'home-renovations': ShowerHeadIcon,
  'extensions-additions': Building2Icon
}

export default function LandingPage() {



  const scrollToNext = useCallback(() => {
    const nextSection = document.getElementById('services-section')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 lg:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              <Building2Icon className="mr-2 h-4 w-4" />
              Professional Construction Services
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Dunsborough&apos;s Premier Construction Partners
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              15+ years delivering quality construction projects across the South West. From new homes to renovations, 
              we bring expertise and reliability to every coastal build.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Get Free Quote
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">
                  View Our Work
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-primary" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <AwardIcon className="h-4 w-4 text-primary" />
                <span>Master Builders WA Member</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-primary fill-current" />
                <span>4.9/5 Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Building2Icon className="mr-2 h-3.5 w-3.5" />
              Our Construction Services
            </Badge>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Building Excellence Across Dunsborough & South West
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From Busselton to Margaret River, Yallingup to Eagle Bay - we deliver quality construction services on time and within budget across all South West communities.
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-6 mb-12">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Proudly Serving South West Communities
              </h3>
              
              <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                {['Busselton', 'Margaret River', 'Yallingup', 'Eagle Bay', 'Quindalup', 'Vasse', 'Geographe', '& More'].map((suburb) => (
                  <span 
                    key={suburb}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full"
                  >
                    {suburb}
                  </span>
                ))}
              </div>
            </div>
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

      {/* Trust Indicators Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <ShieldCheckIcon className="mr-2 h-3.5 w-3.5" />
              Licensed & Certified
            </Badge>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why the South West Trusts Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fully licensed, insured, and certified professionals with a proven track record across the South West&apos;s construction industry.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: ShieldCheckIcon,
                title: 'Licensed Builder',
                details: ['Registration #BC12345', 'Building Commission WA']
              },
              {
                icon: AwardIcon,
                title: 'Master Builders WA',
                details: ['Member Since 2009', 'Excellence Awards Winner']
              },
              {
                icon: ShieldCheckIcon,
                title: 'Fully Insured',
                details: ['$20M Public Liability', 'Contract Works Coverage']
              },
              {
                icon: AwardIcon,
                title: 'Quality Certified',
                details: ['ISO 9001:2015', 'Safety Standards Compliant']
              }
            ].map((cert) => (
              <div key={cert.title} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <cert.icon className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="font-semibold mb-2">{cert.title}</h3>
                {cert.details.map((detail, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                ))}
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                <div className="text-lg font-semibold mb-1">Projects Completed</div>
                <div className="text-sm text-muted-foreground">Across South West & Surrounds</div>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</div>
                <div className="text-lg font-semibold mb-1">Years Experience</div>
                <div className="text-sm text-muted-foreground">South West Construction Industry</div>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
                <div className="text-lg font-semibold mb-1">Client Satisfaction</div>
                <div className="text-sm text-muted-foreground">Would Recommend Us</div>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$50M+</div>
                <div className="text-lg font-semibold mb-1">Projects Value</div>
                <div className="text-sm text-muted-foreground">Successfully Delivered</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {['Excellence Award 2023', '5-Star Rated', 'South West Champions', 'On-Time Delivery'].map((achievement) => (
                <Badge key={achievement} variant="outline" className="bg-white/50">
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-16 bg-white rounded-2xl p-8 border">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  South West Local Expertise
                </h3>
                <p className="text-muted-foreground mb-6">
                  As long-term South West residents and construction professionals, we understand the unique challenges of building in coastal Western Australia&apos;s climate and conditions.
                </p>
                <div className="space-y-3">
                  {[
                    'Heritage council and council approvals expertise',
                    'Coastal climate-optimized construction methods', 
                    'Local supplier and trade relationships',
                    'Understanding of coastal soil and foundation requirements'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckIcon className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold mb-2">Our Service Areas</h4>
                  <p className="text-sm text-muted-foreground">Professional construction services across South West Western Australia</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {['Dunsborough', 'Busselton', 'Margaret River', 'Yallingup', 'Eagle Bay', 'Quindalup', 'Vasse', 'Geographe', 'Broadwater', '& Surrounding Areas'].map((area) => (
                    <div key={area} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{area}</span>
                    </div>
                  ))}
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

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <Card className="border-0 bg-gradient-to-br from-primary/95 to-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center">
              <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
                <Building2Icon className="mr-2 h-4 w-4" />
                Ready to Start Building?
              </Badge>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Your Dream Project Starts With A Free Consultation
              </h2>
              
              <p className="text-lg mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
                Join 500+ satisfied South West families and businesses who chose Bayside Builders WA. 
                Get your free on-site consultation, detailed quote, and project timeline today.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm opacity-90">
                {[
                  'Free On-Site Consultation',
                  'Detailed Written Quote', 
                  'No Obligation',
                  'Fast Response Time'
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-semibold" asChild>
                  <Link href="/contact">
                    Get Your Free Quote Today
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-white" asChild>
                  <Link href="/projects">
                    <Building2Icon className="mr-2 h-4 w-4" />
                    View South West Projects
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Call: (08) 1234 5678</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Email: info@baysidebuilderswa.com.au</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Servicing All South West WA</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                  Proudly South West Born & Bred
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}