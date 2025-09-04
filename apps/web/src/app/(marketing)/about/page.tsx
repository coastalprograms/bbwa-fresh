import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroSection } from "@/components/sections/hero-section"
import { Building2, Target, MapPin, Zap, Phone, Mail, TrendingUp, Shield, Users, CheckCircle, HardHat, HomeIcon, UsersIcon, AwardIcon } from "lucide-react"
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
      {/* 1. Hero Section - Keep existing HeroSection component and design */}
      <HeroSection
        title="Dunsborough's Boutique Builder for Discerning Clients"
        description="While others chase volume, we perfect craft. From Margaret River commercial projects to Geographe Bay luxury homes - we're the builder sophisticated clients choose when quality matters more than speed. Founded on 20+ years of industry expertise."
        badge="Southwest WA Specialists"
        primaryCta={{
          text: "Discuss Your Vision",
          href: "/contact"
        }}
        secondaryCta={{
          text: "Our Story",
          href: "#story"
        }}
        showCarousel={true}
      />

      <div className="container py-16">
        <div className="mx-auto max-w-7xl">
          {/* 2. Our Story - Two-column layout: text left, image right */}
          <section id="story" className="mb-16">
            <Badge variant="secondary" className="mb-4">Our Story</Badge>
            <h2 className="text-3xl font-bold mb-8">Building Excellence Through Vision and Experience</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">The Beginning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Bayside Builders WA was born from a simple but powerful realization: Southwest WA deserved a construction company that understood both the sophistication of its clientele and the unique demands of its diverse landscape.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    After spending over two decades in Western Australia's construction industry, founder Frank Giglia recognized a gap in the market. Clients in the Margaret River region and Geographe Bay were seeking a builder who could deliver luxury residential projects with the same precision and professionalism applied to complex commercial developments. They wanted quality craftsmanship, but they also wanted a partner who understood their vision for Southwest living.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Our Evolution</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Since establishing Bayside Builders in 2020, we've deliberately grown as a boutique operation rather than chasing volume. Every project we undertake - whether a sophisticated commercial development or a luxury coastal home - receives the same meticulous attention to detail and commitment to excellence.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Our portfolio speaks to our unique position in the Southwest WA market: we're equally at home delivering complex commercial builds as we are creating dream homes where families will make lifelong memories. This dual expertise means we bring commercial-grade project management and precision to every luxury residence, while understanding that every commercial project represents someone's business dreams.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Today</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We've built our reputation one satisfied client at a time. Today, Bayside Builders is recognized as the boutique choice for discerning clients who refuse to compromise on quality, whether they're envisioning their forever home or their next business venture.
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <HomeIcon className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm">Our Story Image Placeholder</p>
                  <p className="text-xs">Company history visual</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Proven Track Record - Three-column stats/highlights layout */}
          <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
            <div className="container mx-auto px-6">
              <Badge variant="secondary" className="mb-4">Proven Excellence</Badge>
              <h2 className="text-4xl font-bold mb-16 text-center text-slate-900">Results That Speak for Themselves</h2>
              
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-xl text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-4xl font-bold text-orange-600">7</CardTitle>
                  <CardDescription className="text-lg font-semibold text-slate-700">Active & Completed Projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Currently managing luxury homes and commercial developments across Southwest WA with 100% on-time delivery record
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-xl text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-4xl font-bold text-orange-600">100%</CardTitle>
                  <CardDescription className="text-lg font-semibold text-slate-700">Client Satisfaction Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Every completed project delivered to specification with zero client disputes - our commercial clients return for additional developments
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-xl text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                    <AwardIcon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-4xl font-bold text-orange-600">2</CardTitle>
                  <CardDescription className="text-lg font-semibold text-slate-700">Sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    One of the few Southwest WA builders successfully operating in both luxury residential and commercial markets
                  </p>
                </CardContent>
              </Card>
              </div>

              {/* Body Content */}
              <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">Portfolio in Progress</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Our current active portfolio demonstrates our multi-sector capability and growing reputation. We're simultaneously managing four luxury custom homes across the Geographe Bay region while completing a significant commercial development. This diverse workload isn't by accident - it's by design.
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-4">
                    Our completed commercial projects have resulted in repeat business, with clients returning for additional developments. Meanwhile, our luxury residential clients consistently refer family and friends, creating a natural growth trajectory built on satisfaction rather than marketing spend.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">Quality Over Quantity</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We deliberately maintain a selective project load to ensure every build receives our complete attention. This boutique approach means we're not the cheapest option - we're the choice for clients who understand that true value comes from exceptional execution, reliable timelines, and builds that exceed expectations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. What Sets Us Apart - Four-column value propositions with icons */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <Badge variant="secondary" className="mb-4">Our Difference</Badge>
              <h2 className="text-4xl font-bold mb-16 text-center text-slate-900">Why Sophisticated Clients Choose Bayside Builders</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl text-center h-full group">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg text-slate-900">Multi-Sector Mastery</CardTitle>
                  <CardDescription className="font-semibold text-orange-600">Commercial Precision Meets Residential Luxury</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    We're one of the few Southwest WA builders operating successfully in both commercial and luxury residential markets. This dual expertise means your custom home benefits from commercial-grade project management, while our commercial clients enjoy residential-level attention to detail.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl text-center h-full group">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300">
                    <Target className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg text-slate-900">Boutique Focus</CardTitle>
                  <CardDescription className="font-semibold text-orange-600">Selective Projects, Exceptional Results</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    While volume builders juggle 20+ projects, we deliberately limit our active builds to ensure every client receives our complete attention. You're not a number in our system - you're a partnership we're committed to perfecting.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl text-center h-full group">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg text-slate-900">Southwest WA Specialists</CardTitle>
                  <CardDescription className="font-semibold text-orange-600">Local Knowledge, Proven Results</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    From coastal wind considerations to agricultural zoning requirements, we understand Southwest WA's unique building challenges. Our local expertise ensures your project navigates regulations smoothly and performs beautifully in our climate.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl text-center h-full group">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300">
                    <Zap className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg text-slate-900">Decision-Maker Access</CardTitle>
                  <CardDescription className="font-semibold text-orange-600">Direct Line to Leadership</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    No account managers or middlemen. You work directly with our senior team and founder on every decision. When questions arise or changes are needed, you get immediate answers from people with authority to act.
                  </p>
                </CardContent>
              </Card>
              </div>
            </div>
          </section>

          {/* 5. Our Values in Action - Keep similar layout to current Core Values but rename section */}
          <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="container mx-auto px-6">
              <Badge variant="secondary" className="mb-4">Our Foundation</Badge>
              <h2 className="text-4xl font-bold mb-16 text-center text-slate-900">Our Principles, Your Peace of Mind</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl text-center h-full group">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300">
                    <Shield className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 text-slate-900">Uncompromising Craftsmanship</CardTitle>
                  <CardDescription className="font-semibold text-orange-600">Premium Materials, Proven Techniques</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    We source only the finest materials and employ time-tested construction methods. Every joint is precise, every finish is perfect, every detail reflects our commitment to builds that last generations. No shortcuts, no compromises.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl text-center h-full group">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 text-slate-900">Client-First Partnership</CardTitle>
                  <CardDescription className="font-semibold text-orange-600">Your Vision, Our Expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Regular communication isn't optional - it's standard. We listen first, advise honestly, and deliver exactly what we promise. From initial consultation to final walkthrough, you're informed, involved, and in control.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl text-center h-full group">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300">
                    <HardHat className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 text-slate-900">Safety Without Exception</CardTitle>
                  <CardDescription className="font-semibold text-orange-600">Protecting People, Property, Investment</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Every job site maintains the highest safety standards. We protect our team, your property, and your investment through rigorous safety protocols and comprehensive insurance coverage. Zero incidents across all current projects.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl text-center h-full group">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 text-slate-900">Excellence in Execution</CardTitle>
                  <CardDescription className="font-semibold text-orange-600">Exceeding Expectations, Every Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    We don't just meet deadlines - we beat them. Our projects consistently deliver ahead of schedule and under budget without sacrificing quality. When we commit to excellence, we deliver it measurably.
                  </p>
                </CardContent>
              </Card>
              </div>
            </div>
          </section>

          {/* 6. Meet the Team - Expand current team section, add space for more detailed bios */}
          <section id="team" className="mb-16">
            <Badge variant="secondary" className="mb-4">Our People</Badge>
            <h2 className="text-3xl font-bold mb-8 text-center">Meet the Team</h2>
            <div className="max-w-4xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="bg-muted rounded-lg h-48 mb-6 flex items-center justify-center mx-auto max-w-xs">
                    <p className="text-sm text-muted-foreground">Frank's Photo Placeholder</p>
                  </div>
                  <CardTitle className="text-2xl">Frank Giglia</CardTitle>
                  <CardDescription className="text-lg">Owner & Founder</CardDescription>
                </CardHeader>
                <CardContent className="text-left max-w-3xl mx-auto">
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Frank Giglia understands that building someone's dream home or business isn't just about construction - it's about bringing their vision to life during one of the most important decisions they'll ever make.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      As a dedicated family man who's called Southwest WA home for years, Frank approaches every project with genuine care for what it means to his clients. He builds personal relationships before he builds structures, taking time to truly understand not just what you want to build, but why you want to build it.
                    </p>
                    <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted/30 rounded-r-lg">
                      <p className="text-muted-foreground italic leading-relaxed">
                        "I've been in construction for over 20 years, but what drives me isn't just building - it's helping families and business owners create something they'll be proud of for generations. When you trust me with your dreams, I take that personally."
                      </p>
                      <cite className="text-sm font-semibold text-primary mt-2 block">- Frank Giglia</cite>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 7. Our Commitment to You - Two-column layout for process/guarantees */}
          <section className="mb-16">
            <Badge variant="secondary" className="mb-4">Our Promise</Badge>
            <h2 className="text-3xl font-bold mb-8 text-center">What You Can Expect When You Choose Bayside Builders</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Our Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Transparent Communication</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You'll never wonder what's happening with your project. Frank provides regular updates, honest timelines, and immediate answers to your questions. No project managers or middlemen - just direct communication with the person responsible for your build.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Fixed-Price Integrity</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your quoted price is your final price. We provide detailed, transparent estimates with no hidden costs or surprise extras. If changes are needed, we discuss them upfront with clear pricing before proceeding.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Timeline Reliability</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We commit to realistic timelines and deliver on our promises. Our current track record shows 100% on-time completion because we plan thoroughly and communicate honestly about any challenges.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Our Guarantees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Quality Workmanship Warranty</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every Bayside Builders project comes with comprehensive workmanship warranties. We stand behind our work long after final payment because we build for longevity, not just completion.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Budget Transparency</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      No hidden costs, no surprise fees, no change orders without your approval. Your budget is respected from first quote to final invoice.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Personal Accountability</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Frank personally guarantees your satisfaction. If something isn't right, he'll make it right. Your success is his reputation, and that means everything to him.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Stress-Free Experience</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Building should be exciting, not stressful. We handle permits, inspections, and coordination so you can focus on the excitement of watching your vision come to life.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 8. Vision for the Future - Full-width section, centered content */}
          <section className="mb-16">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4">Looking Ahead</Badge>
              <h2 className="text-3xl font-bold mb-8">Building Southwest WA's Future, One Dream at a Time</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Bayside Builders WA is committed to becoming Southwest WA's most respected boutique construction company - not the biggest, but the best. We envision a future where discerning clients throughout the Margaret River region and Geographe Bay area automatically think of us when they're ready to build something exceptional.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Sustainable Growth, Unwavering Standards</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    As we grow, we'll never compromise the personal service and craftsmanship quality that defines us today. Our future includes expanding our portfolio while maintaining our boutique approach - adding carefully selected projects that challenge us to innovate while staying true to our core values of quality, integrity, and client satisfaction.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Community Impact</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We're not just building structures - we're contributing to the Southwest WA lifestyle that drew us all here. Every luxury home we complete enhances the region's appeal. Every commercial project supports local business growth. We're proud to play a role in building the community we call home.
                  </p>
                </div>
                
                <div className="mt-8 bg-primary/5 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Frank's Promise for Tomorrow</h3>
                  <blockquote className="text-muted-foreground italic leading-relaxed">
                    "Five years from now, I want every completed Bayside Builders project to be a testament to what's possible when you choose quality over compromise. My goal isn't to be the busiest builder in Southwest WA - it's to be the one sophisticated clients trust with their most important investments."
                  </blockquote>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Ready to Build Together - Strong CTA section with contact form integration */}
          <section className="py-20 bg-slate-900">
            <div className="container mx-auto px-6">
              <div className="bg-white rounded-2xl p-12 text-center max-w-6xl mx-auto shadow-2xl">
                <Badge variant="secondary" className="mb-6">Let's Connect</Badge>
                <h2 className="text-4xl font-bold mb-8 text-slate-900">Your Dream Project Starts with a Conversation</h2>
                <div className="max-w-4xl mx-auto text-left mb-12">
                  <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                    Whether you're envisioning a luxury custom home overlooking Geographe Bay or planning a commercial development that will define your business success, every exceptional project starts the same way - with an honest conversation about your vision.
                  </p>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Frank personally handles every initial consultation because understanding your goals, timeline, and expectations is too important to delegate. During this conversation, you'll discover not just what's possible, but what's best for your specific situation and budget.
                  </p>
                </div>
              
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                  <Card className="bg-slate-50 border border-slate-200 shadow-lg text-left">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">Get Your Free Consultation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                          <Phone className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Call Frank Directly</h4>
                          <p className="font-medium text-orange-600 text-lg">0417 927 979</p>
                          <p className="text-sm text-slate-600 mt-1">Speak directly with the owner and craftsman who'll be building your project</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Email Your Questions</h4>
                          <p className="font-medium text-orange-600 text-lg">frank@baysidebuilders.com.au</p>
                          <p className="text-sm text-slate-600 mt-1">Get detailed responses to your specific project requirements</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                
                  <Card className="bg-slate-50 border border-slate-200 shadow-lg text-left">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">What Happens Next</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Free Consultation</h4>
                          <p className="text-sm text-slate-600">Frank meets with you to understand your vision, timeline, and budget requirements.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Detailed Proposal</h4>
                          <p className="text-sm text-slate-600">Receive a transparent, fixed-price quote with detailed timelines and specifications.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Project Partnership</h4>
                          <p className="text-sm text-slate-600">Begin your stress-free building experience with Southwest WA's most trusted boutique builder.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              
                <div className="mt-12">
                  <button className="bg-orange-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Book Your Free Consultation
                  </button>
                </div>
                
                <p className="text-slate-600 mt-6 italic text-lg">
                  "Ready to create something exceptional? Frank is ready to listen."
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}