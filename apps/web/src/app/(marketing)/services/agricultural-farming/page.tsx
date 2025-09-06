import { Metadata } from 'next'
import { getServiceBySlug } from '@/lib/services-data'
import { HeroSection } from '@/components/sections/hero-section'
import { DiagonalHeroSection } from '@/components/sections/diagonal-hero-section'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Agricultural & Farming Construction - Rural Building Services | Bayside Builders WA',
  description: 'Specialised farming and rural construction services for agricultural operations. Machinery sheds, hay storage, livestock facilities in South West WA.',
  keywords: ['agricultural construction South West', 'farming buildings South West', 'rural construction South West', 'machinery sheds South West', 'livestock facilities South West'],
  openGraph: {
    title: 'Agricultural & Farming Construction - Rural Building | Bayside Builders WA',
    description: 'Specialised farming and rural construction services for agricultural operations.',
    images: ['/images/twitter-agricultural.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agricultural & Farming Construction - Rural Building | Bayside Builders WA',
    description: 'Specialised farming and rural construction services for agricultural operations.',
    images: ['/images/twitter-agricultural.jpg'],
  },
}

export default function AgriculturalFarmingPage() {
  const service = getServiceBySlug('agricultural-farming')
  
  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection
        title={service.title}
        description={service.summary}
        showCarousel={false}
      />

      {/* Service Details */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Our Process</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From farm assessment to final handover, we ensure every agricultural building meets your specific farming requirements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {service.process.map((step, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <DiagonalHeroSection
        title="Ready to Build Your Agricultural Facility?"
        description="Contact us today to discuss your farming requirements and let our experts design the perfect agricultural building for your operation."
        primaryCta={{
          text: "CALL US",
          href: "tel:+61417927979"
        }}
        secondaryCta={{
          text: "SEND US A MESSAGE",
          href: "/contact"
        }}
        imageUrl="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        imageAlt="Agricultural machinery shed and farming facilities"
      />
    </div>
  )
}
