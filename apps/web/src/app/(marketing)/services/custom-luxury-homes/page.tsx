import { Metadata } from 'next'
import { getServiceBySlug } from '@/lib/services-data'
import { HeroSection } from '@/components/sections/hero-section'
import { DiagonalHeroSection } from '@/components/sections/diagonal-hero-section'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Custom Luxury Homes - Premium Home Construction | Bayside Builders WA',
  description: 'Bespoke luxury homes designed and built to your exact specifications with premium finishes. Expert custom home construction in South West WA.',
  keywords: ['custom luxury homes South West', 'luxury home construction South West', 'bespoke homes South West', 'premium home builders South West', 'custom home design South West'],
  openGraph: {
    title: 'Custom Luxury Homes - Premium Construction | Bayside Builders WA',
    description: 'Bespoke luxury homes designed and built to your exact specifications with premium finishes.',
    images: ['/images/twitter-custom-homes.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Luxury Homes - Premium Construction | Bayside Builders WA',
    description: 'Bespoke luxury homes designed and built to your exact specifications with premium finishes.',
    images: ['/images/twitter-custom-homes.jpg'],
  },
}

export default function CustomLuxuryHomesPage() {
  const service = getServiceBySlug('custom-luxury-homes')
  
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
              From initial consultation to final handover, we ensure every step of your luxury home construction is handled with precision and care.
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
        title="Ready to Build Your Luxury Home?"
        description="Contact us today to discuss your vision and let our experts bring your dream home to life."
        primaryCta={{
          text: "CALL US",
          href: "tel:+61417927979"
        }}
        secondaryCta={{
          text: "SEND US A MESSAGE",
          href: "/contact"
        }}
        imageUrl="https://dslerptraitfgcmxkhkq.supabase.co/storage/v1/object/public/media/hero_images/Mewett%20Road%20-%20Bayside%20Builders%20Med-Res%2013.jpg"
        imageAlt="Luxury custom home interior"
      />
    </div>
  )
}
