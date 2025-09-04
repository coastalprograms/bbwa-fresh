export interface ProcessStep {
  step: number
  title: string
  description: string
}

export interface Service {
  slug: string
  title: string
  heroImage: string
  summary: string
  description: string
  process: ProcessStep[]
  gallery: string[]
  relatedServices: string[]
  features: string[]
  priceRange?: string
}

export const servicesData: Service[] = [
  {
    slug: 'custom-luxury-homes',
    title: 'Custom Luxury Homes',
    heroImage: '',
    summary: 'Bespoke luxury homes designed and built to your exact specifications with premium finishes',
    description: `
      <p>Create your dream luxury home with our custom construction service. We specialise in building high-end residential properties that combine exceptional design with superior craftsmanship and premium materials.</p>
      
      <p>From architectural masterpieces to contemporary coastal retreats, our luxury home construction covers every detail from initial concept through to final handover. We work with leading architects and designers to bring your vision to life.</p>
      
      <p>Whether you're building a waterfront estate, a hillside retreat, or a modern family compound, our experienced team delivers luxury homes that exceed expectations in every way.</p>
    `,
    process: [
      {
        step: 1,
        title: 'Luxury Consultation',
        description: 'Meet with our design team to discuss your vision, lifestyle needs, and luxury requirements. We\'ll assess your site and explore premium design options.'
      },
      {
        step: 2,
        title: 'Architectural Design',
        description: 'Collaborate with renowned architects to create stunning custom designs that maximise your site\'s potential and reflect your personal style.'
      },
      {
        step: 3,
        title: 'Premium Planning',
        description: 'Develop detailed specifications, select luxury materials, and secure all necessary permits with attention to every detail.'
      },
      {
        step: 4,
        title: 'Foundation & Structure',
        description: 'Build robust foundations and erect the structural frame using premium materials and advanced construction techniques.'
      },
      {
        step: 5,
        title: 'Luxury Finishes',
        description: 'Install high-end fixtures, premium finishes, smart home systems, and all luxury amenities to your exact specifications.'
      },
      {
        step: 6,
        title: 'Final Presentation',
        description: 'Complete final touches, conduct thorough quality inspections, and present your completed luxury home ready for occupancy.'
      }
    ],
    gallery: [],
    relatedServices: ['commercial-construction', 'project-management'],
    features: [
      'Bespoke architectural design',
      'Premium materials and finishes',
      'Smart home integration',
      'Luxury amenities',
      'Energy efficient construction',
      'Comprehensive warranty'
    ],
    priceRange: 'From $800,000'
  },
  {
    slug: 'commercial-construction',
    title: 'Commercial Construction',
    heroImage: '',
    summary: 'Professional commercial buildings and fit-outs for businesses across the South West',
    description: `
      <p>We understand that your commercial space needs to work hard for your business. Our commercial construction services are designed to create functional, attractive, and compliant business environments that support your operations and impress your clients.</p>
      
      <p>From office buildings to retail spaces, restaurants to industrial facilities, we have the expertise to deliver commercial projects on time and on budget while meeting all regulatory requirements.</p>
      
      <p>We work closely with business owners, architects, and designers to ensure your commercial space meets all building codes while reflecting your brand and supporting your business objectives.</p>
    `,
    process: [
      {
        step: 1,
        title: 'Business Consultation',
        description: 'Understand your business needs, operational requirements, and budget parameters for the commercial project.'
      },
      {
        step: 2,
        title: 'Design & Compliance',
        description: 'Develop designs that meet commercial building codes, accessibility requirements, and industry regulations.'
      },
      {
        step: 3,
        title: 'Permit & Approvals',
        description: 'Handle all commercial building permits, council approvals, and compliance certifications required.'
      },
      {
        step: 4,
        title: 'Construction',
        description: 'Execute the build with minimal disruption to surrounding businesses and strict adherence to safety protocols.'
      },
      {
        step: 5,
        title: 'Systems Installation',
        description: 'Install specialised commercial systems including fire safety, security, and business-specific requirements.'
      },
      {
        step: 6,
        title: 'Handover',
        description: 'Complete final inspections, provide compliance certificates, and hand over your ready-to-operate commercial space.'
      }
    ],
    gallery: [],
    relatedServices: ['custom-luxury-homes', 'agricultural-farming'],
    features: [
      'Office buildings',
      'Retail spaces',
      'Industrial facilities',
      'Restaurant build-outs',
      'Compliance expertise',
      'Minimal business disruption'
    ],
    priceRange: 'Contact for quote'
  },
  {
    slug: 'agricultural-farming',
    title: 'Agricultural & Farming Structures',
    heroImage: '',
    summary: 'Specialised agricultural buildings, sheds, and farming infrastructure for rural properties',
    description: `
      <p>Support your agricultural operations with our specialised farming and rural construction services. We build everything from machinery sheds and hay storage to livestock facilities and farm workshops.</p>
      
      <p>Our agricultural construction expertise covers a wide range of rural buildings designed to withstand the elements while providing practical, functional spaces for your farming operations.</p>
      
      <p>From small equipment sheds to large machinery storage facilities, we understand the unique requirements of rural construction and deliver buildings that work hard for your farm.</p>
    `,
    process: [
      {
        step: 1,
        title: 'Farm Assessment',
        description: 'Visit your property to understand your agricultural needs, assess site conditions, and determine the best building solutions.'
      },
      {
        step: 2,
        title: 'Design & Planning',
        description: 'Create functional designs that meet your specific farming requirements while complying with rural building regulations.'
      },
      {
        step: 3,
        title: 'Permits & Approvals',
        description: 'Handle all necessary rural building permits and ensure compliance with agricultural building standards.'
      },
      {
        step: 4,
        title: 'Site Preparation',
        description: 'Prepare the building site, ensuring proper drainage and access for construction equipment and future use.'
      },
      {
        step: 5,
        title: 'Construction',
        description: 'Build your agricultural structure using materials and techniques suited to rural conditions and farming operations.'
      },
      {
        step: 6,
        title: 'Handover',
        description: 'Complete final inspections and hand over your new agricultural building ready for immediate use.'
      }
    ],
    gallery: [],
    relatedServices: ['commercial-construction', 'project-management'],
    features: [
      'Machinery sheds',
      'Hay storage facilities',
      'Livestock shelters',
      'Farm workshops',
      'Equipment storage',
      'Rural building expertise'
    ],
    priceRange: 'From $15,000'
  }
]

export function getServiceBySlug(slug: string): Service | null {
  return servicesData.find(service => service.slug === slug) || null
}

export function getRelatedServices(currentSlug: string, limit = 3): Service[] {
  const currentService = getServiceBySlug(currentSlug)
  if (!currentService) return []
  
  // First try to get services that are in the related array
  let related = servicesData.filter(service => 
    currentService.relatedServices.includes(service.slug)
  )
  
  // If we need more, add other services
  if (related.length < limit) {
    const additionalServices = servicesData.filter(service => 
      service.slug !== currentSlug && 
      !currentService.relatedServices.includes(service.slug)
    )
    related = [...related, ...additionalServices]
  }
  
  return related.slice(0, limit)
}