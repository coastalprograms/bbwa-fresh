import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { ContactForm } from '@/components/forms/ContactForm'
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Our Story</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">From humble beginnings to becoming Southwest WA's premier construction company, our journey reflects our commitment to excellence and client satisfaction.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* The Beginning */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
                <h3 className="text-2xl font-bold mb-4">The Beginning</h3>
                <p className="text-lg leading-relaxed">Founded with a vision to deliver exceptional construction services, Bayside Builders WA started as a small family business with big dreams. Our commitment to quality and customer satisfaction has been the cornerstone of our success.</p>
              </div>
            </div>

            {/* Our Evolution */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80")'
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
                <h3 className="text-2xl font-bold mb-4">Our Evolution</h3>
                <p className="text-lg leading-relaxed">Over the years, we've grown from a small local builder to a respected name in Southwest WA construction. Our evolution has been marked by continuous learning, adaptation, and an unwavering commitment to excellence.</p>
              </div>
            </div>

            {/* Today */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
                <h3 className="text-2xl font-bold mb-4">Today</h3>
                <p className="text-lg leading-relaxed">Today, we stand as Southwest WA's premier boutique construction company, known for our attention to detail, personalized service, and commitment to delivering exceptional results on every project we undertake.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Bayside Builders Apart */}
      <section className="relative py-20 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80")'}}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">What Sets Bayside Builders Apart</h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">When you choose Bayside Builders, you're choosing more than construction services - you're choosing a partnership with Southwest WA's most dedicated craftsman.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-32 w-full">
            {/* Specialized Expertise */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-xl mr-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Specialized Expertise</h3>
              </div>
              <p className="text-lg text-slate-600 mb-4">"Three Sectors, One Standard of Excellence"</p>
              <p className="text-lg text-slate-600 leading-relaxed">Frank exclusively builds luxury custom homes, commercial developments, and agricultural facilities across Southwest WA. This focused specialization means deep expertise in complex building types rather than generalist approaches. When you choose Bayside Builders, you're choosing a craftsman who understands the unique requirements of sophisticated projects.</p>
            </div>

            {/* Personal Craftsmanship */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-xl mr-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Personal Craftsmanship</h3>
              </div>
              <p className="text-lg text-slate-600 mb-4">"Direct Access to the Builder"</p>
              <p className="text-lg text-slate-600 leading-relaxed">No project managers, no middlemen. Frank personally handles every consultation, oversees every build phase, and guarantees every outcome. As both owner and on-site craftsman, he brings 20+ years of hands-on experience to your project. When questions arise or decisions are needed, you get immediate answers from the person responsible.</p>
            </div>

            {/* Southwest WA Focus */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-xl mr-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Southwest WA Focus</h3>
              </div>
              <p className="text-lg text-slate-600 mb-4">"Local Knowledge, Premium Results"</p>
              <p className="text-lg text-slate-600 leading-relaxed">From coastal wind considerations to agricultural zoning requirements, Frank understands what it takes to build successfully in Southwest WA. His local expertise ensures every project meets regional standards and performs beautifully in our climate. Currently managing luxury homes and commercial projects from Dunsborough to Margaret River, with a deliberate focus on quality over quantity.</p>
            </div>

            {/* Boutique Approach */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-xl mr-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Boutique Approach</h3>
              </div>
              <p className="text-lg text-slate-600 mb-4">"Selective Projects, Exceptional Outcomes"</p>
              <p className="text-lg text-slate-600 leading-relaxed">Frank maintains a deliberately limited project schedule to ensure every build receives complete attention. You're not competing with 20 other builds for attention - you're partnering with a craftsman committed to perfecting your vision. This boutique approach means we're not the cheapest option, but we're the choice for clients who understand that exceptional quality requires focused dedication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-slate-900">Meet the Team</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">Behind every successful project is a dedicated team of professionals committed to excellence.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="w-full h-96 bg-slate-200 rounded-2xl flex items-center justify-center">
                  <span className="text-slate-500 text-lg">Frank's Photo Placeholder</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Frank - Founder & Lead Builder</h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-4">
                    With over 20 years of hands-on experience in the construction industry, Frank founded Bayside Builders WA with a vision to deliver exceptional craftsmanship and personalized service. His expertise spans luxury residential construction, commercial developments, and specialized agricultural facilities.
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Frank's commitment to quality and attention to detail has earned him a reputation as one of Southwest WA's most respected builders. He personally oversees every project, ensuring that each build meets the highest standards of excellence.
                  </p>
                </div>
                
                <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-slate-700">
                  "Every project is a partnership. We don't just build structures - we bring our clients' visions to life with the care and attention they deserve."
                </blockquote>
                <cite className="text-base text-slate-500">- Frank, Founder</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Going Forward */}
      <section className="relative py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-slate-900">Our Vision Going Forward</h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Bayside Builders WA is committed to becoming Southwest WA's most respected boutique construction company. As we grow, we will maintain our selective approach to projects, ensuring every build receives the attention to detail that has built our reputation.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Our future includes expanding our portfolio of luxury homes, commercial developments, and agricultural buildings while never compromising the personal service and craftsmanship quality that defines us today. We envision contributing to Southwest WA's growth through exceptional construction that enhances both the region's business landscape and residential appeal.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                The company will continue operating as a boutique firm - growing our capabilities and expertise while maintaining the direct client relationships and hands-on approach that sets us apart from volume builders. Success for Bayside Builders means every completed project serves as a testament to what's possible when quality takes precedence over quantity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="relative py-20 bg-slate-50 mb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 text-slate-900">Get In Touch</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Ready to discuss your next project? We'd love to hear from you and learn how we can bring your vision to life.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
