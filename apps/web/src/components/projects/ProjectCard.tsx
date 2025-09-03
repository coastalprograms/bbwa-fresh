import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    slug: string
    description?: string
    hero_image_url?: string
    location?: string
    completion_date?: string
    featured?: boolean
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          {project.hero_image_url ? (
            <Image
              src={project.hero_image_url}
              alt={`${project.title} - Construction Project by Bayside Builders WA`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No image available
            </div>
          )}
          {project.featured && (
            <Badge className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {project.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {project.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{project.location}</span>
              </div>
            )}
            {project.completion_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(project.completion_date).toLocaleDateString('en-AU', { 
                  month: 'short', 
                  year: 'numeric' 
                })}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
