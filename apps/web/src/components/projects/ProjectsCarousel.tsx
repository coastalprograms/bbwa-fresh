"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/client'

interface Project {
  id: string
  title: string
  slug: string
  description?: string
  hero_image_url?: string
  location?: string
  completion_date?: string
  featured?: boolean
  project_type?: string
}

export function ProjectsCarousel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch featured projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = supabaseBrowser
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'published')
          .eq('featured', true)
          .order('completion_date', { ascending: false })
          .limit(6)

        if (error) {
          console.error('Error fetching featured projects:', error)
          setProjects([])
        } else {
          console.log('Fetched projects:', data)
          setProjects(data || [])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Auto-advance every 2 seconds
  useEffect(() => {
    if (projects.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [projects.length])

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground">No projects available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  const currentProject = projects[currentIndex]
  const isEvenIndex = currentIndex % 2 === 0

  console.log('Projects count:', projects.length, 'Current index:', currentIndex, 'Current project:', currentProject?.title)

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Featured Projects
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Our Latest Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our recent construction projects showcasing quality craftsmanship and attention to detail across the South West.
          </p>
        </div>

        <div className="relative">

          {/* Project Display */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image - Alternates sides */}
            <div className={`order-1 ${isEvenIndex ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group">
                {currentProject.hero_image_url ? (
                  <Image
                    src={currentProject.hero_image_url}
                    alt={`${currentProject.title} - Construction Project by Bayside Builders WA`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                      <p>Image Coming Soon</p>
                    </div>
                  </div>
                )}
                
                {currentProject.featured && (
                  <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Content - Alternates sides */}
            <div className={`order-2 ${isEvenIndex ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {currentProject.project_type && (
                      <Badge variant="secondary">
                        {currentProject.project_type}
                      </Badge>
                    )}
                    {currentProject.completion_date && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(currentProject.completion_date).toLocaleDateString('en-AU', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    {currentProject.title}
                  </h3>
                  
                  {currentProject.description && (
                    <div className="text-muted-foreground mb-4 leading-relaxed space-y-2">
                      {currentProject.description
                        .replace(/\\\\n/g, '\n') // Replace double-escaped \n with actual newlines
                        .replace(/\\n/g, '\n') // Replace single-escaped \n with actual newlines
                        .split('\n')
                        .map((line, index) => {
                          const trimmedLine = line.trim()
                          
                          if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                            return (
                              <h4 key={index} className="text-base font-semibold text-foreground">
                                {trimmedLine.replace(/\*\*/g, '')}
                              </h4>
                            )
                          } else if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*') && !trimmedLine.startsWith('**')) {
                            return (
                              <p key={index} className="text-xs font-medium text-primary">
                                {trimmedLine.replace(/\*/g, '')}
                              </p>
                            )
                          } else if (trimmedLine.startsWith('•')) {
                            return (
                              <div key={index} className="flex items-start gap-1.5">
                                <span className="text-primary mt-0.5 text-xs">•</span>
                                <span className="text-xs">{trimmedLine.substring(1).trim()}</span>
                              </div>
                            )
                          } else if (trimmedLine === '') {
                            return <br key={index} />
                          } else if (trimmedLine) {
                            return (
                              <p key={index} className="text-xs">
                                {trimmedLine}
                              </p>
                            )
                          }
                          return null
                        })
                        .filter(Boolean)}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    {currentProject.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{currentProject.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button asChild size="sm">
                  <Link href={`/projects/${currentProject.slug}`}>
                    View Project Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
