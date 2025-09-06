import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { HeroSection } from '@/components/sections/hero-section'
import { DiagonalHeroSection } from '@/components/sections/diagonal-hero-section'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Construction Projects South West - Our Portfolio | Bayside Builders WA',
  description: 'View our portfolio of 200+ completed construction projects in the South West, WA. Custom homes, renovations, extensions & commercial builds. Licensed builders with proven results.',
  keywords: ['construction projects South West', 'home construction portfolio South West', 'renovation projects South West', 'extension projects South West', 'commercial construction South West', 'builder portfolio Western Australia'],
  openGraph: {
    title: 'Construction Projects South West - Portfolio | Bayside Builders WA',
    description: 'View our portfolio of 200+ completed projects in the South West. Custom homes, renovations, extensions & commercial builds.',
    images: [
      {
        url: '/images/og-projects.jpg',
        width: 1200,
        height: 630,
        alt: 'Bayside Builders WA Construction Projects Portfolio South West',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Projects South West - Bayside Builders WA Portfolio',
    description: 'View our portfolio of 200+ completed projects in the South West. Quality construction results.',
    images: ['/images/twitter-projects.jpg'],
  },
}

// ISR revalidation - refresh every hour
export const revalidate = 3600

async function getProjects() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('completion_date', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects || []
}

async function getFAQs() {
  const supabase = await createClient()
  const { data: faqs, error } = await supabase
    .from('project_faqs')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }

  return faqs || []
}

export default async function ProjectsPage() {
  const [projects, faqs] = await Promise.all([getProjects(), getFAQs()])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection
        title="Our Featured Projects"
        subtitle="Quality Construction Portfolio"
        description="Explore our diverse portfolio of completed projects across Western Australia. From custom homes to commercial builds, see the quality and craftsmanship we deliver."
        badge="200+ Projects Completed"
        showCarousel={true}
      />

      <div className="container mx-auto py-16 px-4">

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {faqs.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

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
      />
      </div>
    </div>
  )
}