import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/sections/hero-section"
import { DiagonalHeroSection } from "@/components/sections/diagonal-hero-section"
import { 
  CheckIcon, 
  ArrowRightIcon, 
  HomeIcon, 
  Building2Icon, 
  TractorIcon
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
        alt: 'Bayside Builders WA Construction Services Dunsborough',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Services Dunsborough - Bayside Builders WA',
    description: 'Professional construction services in Dunsborough. New homes, renovations, extensions & more.',
    images: ['/images/twitter-services.jpg'],
  },
}

const services = [
  {
    icon: HomeIcon,
    title: "Custom Luxury Homes",
    description: "Bespoke luxury homes designed and built to your exact specifications with premium finishes",
    features: [
      "Bespoke architectural design",
      "Premium materials and finishes",
      "Smart home integration",
      "Luxury amenities",
      "Energy efficient construction",
      "Comprehensive warranty"
    ],
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
    href: "/services/custom-luxury-homes"
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
    icon: TractorIcon,
    title: "Agricultural & Farming",
    description: "Specialised farming and rural construction services for agricultural operations",
    features: [
      "Machinery sheds",
      "Hay storage facilities",
      "Livestock shelters",
      "Farm workshops",
      "Equipment storage",
      "Rural building expertise"
    ],
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-500",
    href: "/services/agricultural-farming"
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
          text: "FAQ",
          href: "/contact"
        }}
        secondaryCta={{
          text: "View Projects",
          href: "/projects"
        }}
        showCarousel={false}
      />

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-slate-700 leading-relaxed">
              Bayside Builders WA specializes in three distinct construction sectors: luxury custom homes, commercial developments, and agricultural buildings across Southwest WA. Our focused expertise ensures deep knowledge of complex building requirements and specialized construction techniques. Every project receives dedicated attention from consultation through completion, delivering exceptional craftsmanship and reliable results.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-6xl">
        
            <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              {/* Custom Luxury Homes - Move 20% left */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl transform -translate-x-[20%]">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                  }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Custom Luxury Homes</h3>
                  <p className="text-base leading-relaxed">Create your dream luxury home with our custom construction service. We specialise in building high-end residential properties that combine exceptional design with superior craftsmanship and premium materials. From architectural masterpieces to contemporary coastal retreats, our luxury home construction covers every detail from initial concept through to final handover. We work with leading architects and designers to bring your vision to life, whether you're building a waterfront estate, a hillside retreat, or a modern family compound.</p>
                </div>
              </div>

              {/* Commercial Construction - Keep centered */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                  }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Commercial Construction</h3>
                  <p className="text-base leading-relaxed">Drive your business forward with our professional commercial construction services. We deliver high-quality commercial buildings, office fit-outs, retail spaces, and industrial facilities designed to support your business success. Our commercial expertise spans office developments, retail complexes, restaurant build-outs, warehouse construction, and industrial facilities. We understand the unique requirements of commercial projects, including tight timelines, budget management, and minimal disruption to ongoing operations.</p>
                </div>
              </div>

              {/* Agricultural & Farming - Move 20% right */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl transform translate-x-[20%]">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                  }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Agricultural & Farming</h3>
                  <p className="text-base leading-relaxed">Support your agricultural operations with our specialised farming and rural construction services. We build everything from machinery sheds and hay storage to livestock facilities and farm workshops. Our agricultural construction expertise covers a wide range of rural buildings designed to withstand the elements while providing practical, functional spaces for your farming operations. From small equipment sheds to large machinery storage facilities, we understand the unique requirements of rural construction and deliver buildings that work hard for your farm.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                Our Process
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Bayside Difference</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our proven process ensures your project is delivered with exceptional quality, on time, and within budget. Here's what sets us apart from other builders in the South West.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 pb-20">
              {/* Step 1 - Initial Consultation & Site Visit (baseline) */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    01
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">
                    Initial Consultation & Site Visit
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Meet our team at your site for honest, expert advice. No sales pressure - just genuine consultation about your project possibilities and realistic expectations. We'll assess site conditions and provide preliminary guidance.
                  </p>
                </div>
              </div>

              {/* Step 2 - Design & Planning (10% lower) */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 transform md:translate-y-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    02
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">
                    Design & Planning
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Custom architectural plans specifically designed for South West coastal conditions. All permits, engineering, and council approvals managed with transparent pricing and expert coordination.
                  </p>
                </div>
              </div>

              {/* Step 3 - Quality Construction (20% lower) */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 transform md:translate-y-16">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    03
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">
                    Quality Construction
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Premium construction with daily progress updates sent directly to you. Direct communication throughout ensures your vision becomes reality using quality materials and proven techniques.
                  </p>
                </div>
              </div>

              {/* Step 4 - Completion & Handover (30% lower) */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 transform md:translate-y-24">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    04
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">
                    Completion & Handover
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Professional final inspection, complete cleanup, and comprehensive documentation. Enjoy peace of mind with our warranty and ongoing support for your completed project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

              {/* Video Showcase Section */}
              <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                  <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-100">
                      {/* Video will go here - placeholder for now */}
                      <div className="aspect-video flex items-center justify-center bg-slate-200">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-slate-300 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                          <p className="text-slate-500 font-medium">Video Player</p>
                          <p className="text-sm text-slate-400">Upload your optimized video to complete this section</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions about our services
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "How long does a typical construction project take?",
                  a: "Project timelines vary depending on scope and size. Home renovations typically take 2-6 weeks, while new construction can take 3-6 months."
                },
                {
                  q: "Do you provide free quotes?",
                  a: "Yes, we provide free, no-obligation quotes for all projects. We'll assess your needs and provide a detailed estimate within 48 hours."
                },
                {
                  q: "Are you licensed and insured?",
                  a: "Absolutely! We are fully licensed builders with comprehensive insurance coverage for all our projects and workers."
                },
                {
                  q: "Do you handle permits and approvals?",
                  a: "Yes, we can assist with all necessary permits and council approvals to ensure your project meets all regulatory requirements."
                }
              ].map((faq, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <DiagonalHeroSection
        title="Let's start building your dream home"
        description="Ready to bring your vision to life? Contact us today for a free consultation and let's discuss your project."
        primaryCta={{
          text: "CALL US",
          href: "tel:+61417927979"
        }}
        secondaryCta={{
          text: "SEND US A MESSAGE",
          href: "/contact"
        }}
        imageUrl="https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        imageAlt="Modern luxury kitchen with white cabinets and marble island"
      />
    </div>
  )
}
