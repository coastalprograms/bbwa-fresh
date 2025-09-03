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
    slug: 'new-home-construction',
    title: 'New Home Construction',
    heroImage: '',
    summary: 'Custom homes built from the ground up with quality craftsmanship and attention to detail',
    description: `
      <p>Building your dream home from the ground up is one of life's most exciting journeys. At Bayside Builders WA, we specialise in creating custom homes that reflect your unique lifestyle, preferences, and budget.</p>
      
      <p>Our new home construction service covers everything from initial design consultation through to the final handover. We work closely with architects, designers, and you to ensure every detail meets your vision while adhering to the highest building standards.</p>
      
      <p>Whether you're looking for a modern family home, a luxury estate, or an energy-efficient sustainable build, our experienced team has the expertise to bring your dream home to life.</p>
    `,
    process: [
      {
        step: 1,
        title: 'Initial Consultation',
        description: 'Meet with our team to discuss your vision, budget, and timeline. We\'ll assess your land and provide initial guidance.'
      },
      {
        step: 2,
        title: 'Design & Planning',
        description: 'Work with architects to create detailed plans, secure permits, and finalise all specifications and materials.'
      },
      {
        step: 3,
        title: 'Site Preparation',
        description: 'Clear and prepare the site, excavate foundations, and set up temporary services and safety measures.'
      },
      {
        step: 4,
        title: 'Foundation & Frame',
        description: 'Pour concrete foundations, erect the frame, and install roofing to create the structural shell.'
      },
      {
        step: 5,
        title: 'Internal Systems',
        description: 'Install plumbing, electrical, and HVAC systems throughout the home, followed by insulation.'
      },
      {
        step: 6,
        title: 'Finishing Touches',
        description: 'Complete internal and external finishes, fixtures, and landscaping for move-in readiness.'
      }
    ],
    gallery: [],
    relatedServices: ['extensions-additions', 'project-management'],
    features: [
      'Custom home design',
      'Foundation to finish construction',
      'Quality materials and craftsmanship',
      'Energy efficient builds',
      'Full project management',
      'Warranty and after-sales support'
    ],
    priceRange: 'From $350,000'
  },
  {
    slug: 'home-renovations',
    title: 'Home Renovations',
    heroImage: '',
    summary: 'Transform your existing space with expert renovation and remodeling services',
    description: `
      <p>Transform your existing home into the space you've always dreamed of with our comprehensive renovation services. Whether you're looking to update a single room or undertake a whole-house renovation, our experienced team can help you achieve stunning results.</p>
      
      <p>We understand that renovating while living in your home can be challenging. That's why we work efficiently to minimise disruption while maintaining the highest standards of workmanship and safety.</p>
      
      <p>From modern kitchen makeovers to luxurious bathroom upgrades, we handle every aspect of your renovation project with attention to detail and respect for your home.</p>
    `,
    process: [
      {
        step: 1,
        title: 'Design Consultation',
        description: 'Assess your current space, understand your needs, and develop renovation concepts that work within your budget.'
      },
      {
        step: 2,
        title: 'Planning & Permits',
        description: 'Create detailed plans, source materials, and obtain any necessary permits for structural changes.'
      },
      {
        step: 3,
        title: 'Preparation',
        description: 'Protect existing areas, remove old fixtures and finishes, and prepare the space for renovation work.'
      },
      {
        step: 4,
        title: 'Structural Work',
        description: 'Complete any structural modifications, electrical and plumbing updates, and install new frameworks.'
      },
      {
        step: 5,
        title: 'Installation',
        description: 'Install new fixtures, finishes, cabinetry, and all decorative elements according to your design.'
      },
      {
        step: 6,
        title: 'Final Details',
        description: 'Complete final touches, clean up thoroughly, and conduct a walkthrough to ensure your satisfaction.'
      }
    ],
    gallery: [],
    relatedServices: ['extensions-additions', 'maintenance-repairs'],
    features: [
      'Kitchen renovations',
      'Bathroom remodeling',
      'Interior upgrades',
      'Structural modifications',
      'Minimal disruption approach',
      'Quality finish guarantee'
    ],
    priceRange: 'From $25,000'
  },
  {
    slug: 'extensions-additions',
    title: 'Extensions & Additions',
    heroImage: '',
    summary: 'Add more space and value to your property with professional extensions',
    description: `
      <p>Running out of space? Rather than moving house, consider extending your current home to create the additional space you need. Our extension and addition services can seamlessly integrate new spaces with your existing home.</p>
      
      <p>From second-story additions to ground-floor extensions, outdoor living spaces to garage conversions, we have the expertise to expand your home while maintaining its character and value.</p>
      
      <p>Our extensions are designed to complement your existing architecture while meeting modern building codes and energy efficiency standards.</p>
    `,
    process: [
      {
        step: 1,
        title: 'Space Assessment',
        description: 'Evaluate your property, understand your space needs, and explore extension possibilities within council requirements.'
      },
      {
        step: 2,
        title: 'Design Development',
        description: 'Create extension designs that complement your existing home and maximise the available space.'
      },
      {
        step: 3,
        title: 'Approvals',
        description: 'Prepare and submit council applications, obtain building permits, and ensure compliance with all regulations.'
      },
      {
        step: 4,
        title: 'Site Setup',
        description: 'Prepare the extension site, protect existing structures, and establish safe working areas.'
      },
      {
        step: 5,
        title: 'Construction',
        description: 'Build the extension structure, connect utilities, and integrate with existing home systems.'
      },
      {
        step: 6,
        title: 'Integration',
        description: 'Complete interior finishes, ensure seamless integration with existing spaces, and final cleanup.'
      }
    ],
    gallery: [],
    relatedServices: ['new-home-construction', 'home-renovations'],
    features: [
      'Second story additions',
      'Room extensions',
      'Outdoor living spaces',
      'Garage conversions',
      'Seamless integration',
      'Value-adding solutions'
    ],
    priceRange: 'From $45,000'
  },
  {
    slug: 'commercial-construction',
    title: 'Commercial Construction',
    heroImage: '',
    summary: 'Professional commercial construction and fit-out services for businesses',
    description: `
      <p>We understand that your commercial space needs to work hard for your business. Our commercial construction services are designed to create functional, attractive, and compliant business environments that support your operations and impress your clients.</p>
      
      <p>From office fit-outs to retail spaces, restaurant build-outs to industrial facilities, we have the expertise to deliver commercial projects on time and on budget.</p>
      
      <p>We work closely with business owners, architects, and designers to ensure your commercial space meets all regulatory requirements while reflecting your brand and supporting your business objectives.</p>
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
    relatedServices: ['project-management', 'maintenance-repairs'],
    features: [
      'Office fit-outs',
      'Retail spaces',
      'Industrial buildings',
      'Restaurant build-outs',
      'Compliance expertise',
      'Minimal business disruption'
    ],
    priceRange: 'Contact for quote'
  },
  {
    slug: 'maintenance-repairs',
    title: 'Maintenance & Repairs',
    heroImage: '',
    summary: 'Ongoing maintenance and repair services to keep your property in top condition',
    description: `
      <p>Regular maintenance is key to protecting your property investment and ensuring your home or business remains safe, functional, and attractive. Our maintenance and repair services cover everything from routine upkeep to emergency repairs.</p>
      
      <p>We offer flexible maintenance programs tailored to your property's needs, helping you avoid costly major repairs through proactive care and prompt attention to minor issues.</p>
      
      <p>Our experienced tradesmen can handle a wide range of maintenance tasks, from general repairs to specialised maintenance requirements.</p>
    `,
    process: [
      {
        step: 1,
        title: 'Property Assessment',
        description: 'Conduct a thorough inspection to identify current issues and potential maintenance needs.'
      },
      {
        step: 2,
        title: 'Maintenance Plan',
        description: 'Develop a customised maintenance schedule that fits your budget and property requirements.'
      },
      {
        step: 3,
        title: 'Priority Repairs',
        description: 'Address any urgent repairs or safety issues immediately to prevent further damage.'
      },
      {
        step: 4,
        title: 'Scheduled Maintenance',
        description: 'Perform regular maintenance tasks according to the agreed schedule to prevent issues.'
      },
      {
        step: 5,
        title: 'Monitoring',
        description: 'Continuously monitor property condition and adjust maintenance plans as needed.'
      },
      {
        step: 6,
        title: 'Documentation',
        description: 'Provide detailed records of all maintenance work for warranty and insurance purposes.'
      }
    ],
    gallery: [],
    relatedServices: ['home-renovations', 'project-management'],
    features: [
      'Emergency repairs',
      'Preventive maintenance',
      'Property inspections',
      'Warranty support',
      'Flexible scheduling',
      'Comprehensive service'
    ],
    priceRange: 'From $150/hour'
  },
  {
    slug: 'project-management',
    title: 'Project Management',
    heroImage: '',
    summary: 'End-to-end project management ensuring timely and budget-conscious delivery',
    description: `
      <p>Managing a construction project involves coordinating multiple trades, suppliers, permits, and timelines. Our professional project management service takes the stress out of construction by handling all aspects of project coordination for you.</p>
      
      <p>Our experienced project managers work as your single point of contact, ensuring clear communication, adherence to schedules, and quality control throughout your project.</p>
      
      <p>Whether you're building, renovating, or extending, our project management service ensures your construction project runs smoothly from start to finish.</p>
    `,
    process: [
      {
        step: 1,
        title: 'Project Planning',
        description: 'Develop comprehensive project plans including timelines, resource allocation, and budget management strategies.'
      },
      {
        step: 2,
        title: 'Team Coordination',
        description: 'Coordinate all trades, suppliers, and specialists to ensure efficient workflow and quality outcomes.'
      },
      {
        step: 3,
        title: 'Progress Monitoring',
        description: 'Monitor project progress against milestones, identify potential issues, and implement corrective actions.'
      },
      {
        step: 4,
        title: 'Quality Control',
        description: 'Conduct regular quality inspections and ensure all work meets building standards and specifications.'
      },
      {
        step: 5,
        title: 'Communication',
        description: 'Provide regular progress updates and maintain clear communication with all stakeholders throughout.'
      },
      {
        step: 6,
        title: 'Project Completion',
        description: 'Oversee final inspections, ensure all documentation is complete, and facilitate smooth project handover.'
      }
    ],
    gallery: [],
    relatedServices: ['new-home-construction', 'commercial-construction'],
    features: [
      'Timeline planning',
      'Budget management',
      'Quality assurance',
      'Permit assistance',
      'Trade coordination',
      'Progress reporting'
    ],
    priceRange: '5-8% of project cost'
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