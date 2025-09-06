import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { DiagonalHeroSection } from '@/components/sections/diagonal-hero-section'
import { ContactForm } from '@/components/forms/ContactForm'
import { AnimatedSection } from '@/components/ui/animated-components'
import { Building2, Users, MapPin, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - South West\'s Trusted Construction Experts',
  description: 'Learn about Bayside Builders WA, South West\'s family-owned construction company with 20+ years experience. Meet our licensed team and discover our commitment to quality.',
  keywords: ['about Dunsborough builders', 'construction company South West', 'licensed builders Dunsborough', 'family owned builders', 'South West construction team', 'quality builders Western Australia'],
  openGraph: {
    title: 'About Bayside Builders WA - South West\'s Construction Experts',
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
        title="Dunsborough's Boutique Builder for Discerning Clients"
        description="While others chase volume, we perfect craft. From Margaret River commercial projects to Geographe Bay luxury homes - we're the builder sophisticated clients choose when quality matters more than speed. Founded on 20+ years of industry expertise."
      />

      {/* Our Story Section */}
      <section id="story" className="relative py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection variant="simpleFade" bidirectional={true} delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-slate-900">Our Story</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">From humble beginnings to becoming Southwest WA&apos;s premier construction company, our journey reflects our commitment to excellence and client satisfaction.</p>
            </div>
          </AnimatedSection>
        </div>
        
        <div className="grid grid-cols-1 gap-8 w-full max-w-6xl mx-auto">
            {/* The Beginning */}
            <AnimatedSection variant="slideLeft" bidirectional={true} delay={0.2}>
              <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
                <h3 className="text-2xl font-bold mb-2">The Beginning</h3>
                <p className="text-base leading-relaxed">Bayside Builders WA was born from a simple but powerful realization: Southwest WA deserved a construction company that understood both the sophistication of its clientele and the unique demands of its diverse landscape. After spending over two decades in Western Australia&apos;s construction industry, founder Frank Giglia recognized a gap in the market. Clients in the Margaret River region and Geographe Bay were seeking a builder who could deliver luxury residential projects with the same precision and professionalism applied to complex commercial developments. They wanted quality craftsmanship, but they also wanted a partner who understood their vision for Southwest living.</p>
              </div>
              </div>
            </AnimatedSection>

            {/* Our Evolution */}
            <AnimatedSection variant="slideRight" bidirectional={true} delay={0.3}>
              <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80")'
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
                <h3 className="text-2xl font-bold mb-2">Our Evolution</h3>
                <p className="text-base leading-relaxed">Since establishing Bayside Builders in 2020, we&apos;ve deliberately grown as a boutique operation rather than chasing volume. Every project we undertake - whether a sophisticated commercial development or a luxury coastal home - receives the same meticulous attention to detail and commitment to excellence. Our portfolio speaks to our unique position in the Southwest WA market: we&apos;re equally at home delivering complex commercial builds as we are creating dream homes where families will make lifelong memories. This dual expertise means we bring commercial-grade project management and precision to every luxury residence, while understanding that every commercial project represents someone&apos;s business dreams.</p>
              </div>
              </div>
            </AnimatedSection>

            {/* Today */}
            <AnimatedSection variant="slideUp" bidirectional={true} delay={0.4}>
              <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
                <h3 className="text-2xl font-bold mb-2">Today</h3>
                <p className="text-base leading-relaxed">We&apos;ve built our reputation one satisfied client at a time. Today, Bayside Builders is recognized as the boutique choice for discerning clients who refuse to compromise on quality, whether they&apos;re envisioning their forever home or their next business venture.</p>
              </div>
              </div>
            </AnimatedSection>
        </div>
      </section>

      {/* What Sets Bayside Builders Apart */}
      <section className="relative py-20 pb-32 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80")'}}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-6">
          <AnimatedSection variant="simpleFade" bidirectional={true} delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-white">What Sets Bayside Builders Apart</h2>
              <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">When you choose Bayside Builders, you&apos;re choosing more than construction services - you&apos;re choosing a partnership with Southwest WA&apos;s most dedicated craftsman.</p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 gap-8 w-full">
            {/* Specialized Expertise - Top Left (baseline - stays where it is) */}
            <AnimatedSection variant="slideLeft" bidirectional={true} delay={0.2}>
              <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-base text-slate-600 mb-3 font-medium">&quot;Three Sectors, One Standard of Excellence&quot;</p>
              <p className="text-sm text-slate-600 leading-relaxed">Frank exclusively builds luxury custom homes, commercial developments, and agricultural facilities across Southwest WA. This focused specialization means deep expertise in complex building types rather than generalist approaches. When you choose Bayside Builders, you&apos;re choosing a craftsman who understands the unique requirements of sophisticated projects.</p>
              </div>
            </AnimatedSection>

            {/* Personal Craftsmanship - Top Right (20% lower than top left) */}
            <AnimatedSection variant="slideRight" bidirectional={true} delay={0.25}>
              <div className="bg-white rounded-xl p-6 shadow-lg transform md:translate-y-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-base text-slate-600 mb-3 font-medium">&quot;Direct Access to the Builder&quot;</p>
              <p className="text-sm text-slate-600 leading-relaxed">No project managers, no middlemen. Frank personally handles every consultation, oversees every build phase, and guarantees every outcome. As both owner and on-site craftsman, he brings 20+ years of hands-on experience to your project. When questions arise or decisions are needed, you get immediate answers from the person responsible.</p>
              </div>
            </AnimatedSection>

            {/* Southwest WA Focus - Bottom Left (20% lower than top right = 40% from baseline) */}
            <AnimatedSection variant="slideLeft" bidirectional={true} delay={0.3}>
              <div className="bg-white rounded-xl p-6 shadow-lg transform md:translate-y-16">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-base text-slate-600 mb-3 font-medium">&quot;Local Knowledge, Premium Results&quot;</p>
              <p className="text-sm text-slate-600 leading-relaxed">From coastal wind considerations to agricultural zoning requirements, Frank understands what it takes to build successfully in Southwest WA. His local expertise ensures every project meets regional standards and performs beautifully in our climate. Currently managing luxury homes and commercial projects from Dunsborough to Margaret River, with a deliberate focus on quality over quantity.</p>
              </div>
            </AnimatedSection>

            {/* Boutique Approach - Bottom Right (20% lower than bottom left = 60% from baseline) */}
            <AnimatedSection variant="slideRight" bidirectional={true} delay={0.35}>
              <div className="bg-white rounded-xl p-6 shadow-lg transform md:translate-y-24">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-base text-slate-600 mb-3 font-medium">&quot;Selective Projects, Exceptional Outcomes&quot;</p>
              <p className="text-sm text-slate-600 leading-relaxed">Frank maintains a deliberately limited project schedule to ensure every build receives complete attention. You&apos;re not competing with 20 other builds for attention - you&apos;re partnering with a craftsman committed to perfecting your vision. This boutique approach means we&apos;re not the cheapest option, but we&apos;re the choice for clients who understand that exceptional quality requires focused dedication.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection variant="simpleFade" bidirectional={true} delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6 text-slate-900">Meet the Team</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">Behind every successful project is a dedicated team of professionals committed to excellence.</p>
              </div>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <AnimatedSection variant="slideLeft" bidirectional={true} delay={0.2}>
                <div className="relative">
                  <div className="w-full h-96 bg-slate-200 rounded-2xl flex items-center justify-center">
                    <span className="text-slate-500 text-lg">Frank&apos;s Photo Placeholder</span>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection variant="slideRight" bidirectional={true} delay={0.3}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Frank - Founder & Lead Builder</h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-4">
                    With over 20 years of hands-on experience in the construction industry, Frank founded Bayside Builders WA with a vision to deliver exceptional craftsmanship and personalized service. His expertise spans luxury residential construction, commercial developments, and specialized agricultural facilities.
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Frank&apos;s commitment to quality and attention to detail has earned him a reputation as one of Southwest WA&apos;s most respected builders. He personally oversees every project, ensuring that each build meets the highest standards of excellence.
                  </p>
                </div>
                
                  <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-slate-700">
                    &quot;Every project is a partnership. We don&apos;t just build structures - we bring our clients&apos; visions to life with the care and attention they deserve.&quot;
                  </blockquote>
                  <cite className="text-base text-slate-500">- Frank, Founder</cite>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Going Forward */}
      <section className="relative py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <AnimatedSection variant="slideUp" bidirectional={true} delay={0.1}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8 text-slate-900">Our Vision Going Forward</h2>
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Bayside Builders WA is committed to becoming Southwest WA&apos;s most respected boutique construction company. As we grow, we will maintain our selective approach to projects, ensuring every build receives the attention to detail that has built our reputation.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Our future includes expanding our portfolio of luxury homes, commercial developments, and agricultural buildings while never compromising the personal service and craftsmanship quality that defines us today. We envision contributing to Southwest WA&apos;s growth through exceptional construction that enhances both the region&apos;s business landscape and residential appeal.
              </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  The company will continue operating as a boutique firm - growing our capabilities and expertise while maintaining the direct client relationships and hands-on approach that sets us apart from volume builders. Success for Bayside Builders means every completed project serves as a testament to what&apos;s possible when quality takes precedence over quantity.
                </p>
              </div>
            </div>
          </AnimatedSection>
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
        imageUrl="https://dslerptraitfgcmxkhkq.supabase.co/storage/v1/object/public/media/hero_images/Mewett%20Road%20-%20Bayside%20Builders%20Med-Res%2013.jpg"
        imageAlt="Bayside Builders construction project"
        animated={true}
        animationVariant="slideUp"
      />

    </div>
  )
}
