import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { HeroSection } from '@/components/sections/hero-section'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Construction Projects Perth - Our Portfolio | Bayside Builders WA',
  description: 'View our portfolio of 200+ completed construction projects in Perth, WA. Custom homes, renovations, extensions & commercial builds. Licensed builders with proven results.',
  keywords: ['construction projects Perth', 'home construction portfolio Perth', 'renovation projects Perth', 'extension projects Perth', 'commercial construction Perth', 'builder portfolio Western Australia'],
  openGraph: {
    title: 'Construction Projects Perth - Portfolio | Bayside Builders WA',
    description: 'View our portfolio of 200+ completed projects in Perth. Custom homes, renovations, extensions & commercial builds.',
    images: [
      {
        url: '/images/og-projects.jpg',
        width: 1200,
        height: 630,
        alt: 'Bayside Builders WA Construction Projects Portfolio Perth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Projects Perth - Bayside Builders WA Portfolio',
    description: 'View our portfolio of 200+ completed projects in Perth. Quality construction results.',
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
        primaryCta={{
          text: "Start Your Project",
          href: "/contact"
        }}
        secondaryCta={{
          text: "View Services",
          href: "/services"
        }}
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
      </div>
    </div>
  )
}