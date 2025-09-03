import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baysidebuilderswa.com.au'
  const currentDate = new Date()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Individual service page routes
  const serviceRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/new-home-construction`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/home-renovations`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/extensions-additions`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/commercial-construction`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/maintenance-repairs`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/project-management`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic project routes from database
  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    
    if (url && anonKey) {
      const supabase = createClient(url, anonKey)
      const { data: projects } = await supabase
        .from('projects')
        .select('slug, updated_at')
        .eq('status', 'published')

      if (projects) {
        projectRoutes = projects.map((project) => ({
          url: `${baseUrl}/projects/${project.slug}`,
          lastModified: project.updated_at ? new Date(project.updated_at) : currentDate,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
    // Continue without project routes if database is unavailable
  }

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes]
}