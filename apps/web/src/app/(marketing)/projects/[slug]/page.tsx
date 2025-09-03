import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Calendar, ArrowLeft, Phone } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('title, description, hero_image_url')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | Bob Builder Works Australia`,
    description: project.description || `View details about our ${project.title} project`,
    openGraph: {
      title: project.title,
      description: project.description || undefined,
      images: project.hero_image_url ? [project.hero_image_url] : undefined,
    },
  }
}

export async function generateStaticParams() {
  // For static generation, we use a simple client with anon key
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  
  if (!url || !anonKey) {
    console.warn('Supabase env vars not configured, skipping static params generation')
    return []
  }
  
  const supabase = createSupabaseClient(url, anonKey)
  const { data: projects } = await supabase
    .from('projects')
    .select('slug')
    .eq('status', 'published')

  return projects?.map((project) => ({
    slug: project.slug,
  })) || []
}

async function getProject(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    return null
  }

  return data
}

async function getRelatedProjects(currentSlug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('id, title, slug, hero_image_url, location')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .limit(3)

  return data || []
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  const relatedProjects = await getRelatedProjects(params.slug)

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-muted">
        {project.hero_image_url ? (
          <Image
            src={project.hero_image_url}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-start gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
              {project.featured && (
                <Badge variant="secondary" className="mt-2">
                  Featured Project
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.completion_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Completed {new Date(project.completion_date).toLocaleDateString('en-AU', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Gallery */}
              {project.gallery_images && Array.isArray(project.gallery_images) && project.gallery_images.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Project Gallery</h2>
                  <ProjectGallery images={project.gallery_images} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Interested in a Similar Project?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Let&apos;s discuss how we can bring your vision to life.
                  </p>
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link href="/contact">
                        <Phone className="h-4 w-4 mr-2" />
                        Get a Quote
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/services">
                        View Our Services
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">More Projects</h3>
                  <div className="space-y-3">
                    {relatedProjects.map((related) => (
                      <Link
                        key={related.id}
                        href={`/projects/${related.slug}`}
                        className="block group"
                      >
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                          <div className="flex gap-3 p-3">
                            <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded">
                              {related.hero_image_url ? (
                                <Image
                                  src={related.hero_image_url}
                                  alt={related.title}
                                  fill
                                  className="object-cover rounded"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                                {related.title}
                              </h4>
                              {related.location && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {related.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Back to Projects */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Projects
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
