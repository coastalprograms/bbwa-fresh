"use client"

import * as React from "react"
import { HeroCarousel } from "@/components/ui/hero-carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, PhoneIcon } from "lucide-react"
import Link from "next/link"
import { supabaseBrowser } from "@/lib/supabase/client"

interface HeroImage {
  id: string
  url: string
  alt_text: string | null
  sort_order: number
}

interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  badge?: string
  primaryCta?: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }
  showCarousel?: boolean
  className?: string
}

export function HeroSection({
  title,
  subtitle,
  description,
  badge,
  primaryCta = {
    text: "Get Free Quote",
    href: "/contact"
  },
  secondaryCta = {
    text: "View Projects",
    href: "/projects"
  },
  showCarousel = true,
  className,
}: HeroSectionProps) {
  const [heroImages, setHeroImages] = React.useState<HeroImage[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchHeroImages() {
      try {
        const { data, error } = await supabaseBrowser
          .from('hero_images')
          .select('*')
          .order('sort_order', { ascending: true })

        if (error) {
          console.error('Error fetching hero images:', error)
          return
        }

        setHeroImages(data || [])
      } catch (error) {
        console.error('Error fetching hero images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (showCarousel) {
      fetchHeroImages()
    } else {
      setIsLoading(false)
    }
  }, [showCarousel])

  const heroContent = (
    <div className="text-center space-y-6 z-10 relative">
      {badge && (
        <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
          {badge}
        </Badge>
      )}
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <h2 className="text-xl md:text-2xl text-white/90 font-medium">
            {subtitle}
          </h2>
        )}
        
        {description && (
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link href={primaryCta.href as any}>
            {primaryCta.text}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        
        <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm" asChild>
          <Link href={secondaryCta.href as any}>
            {secondaryCta.text}
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <PhoneIcon className="h-4 w-4" />
          <span>Free Consultation</span>
        </div>
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>Licensed & Insured</span>
        </div>
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>Local Perth Builders</span>
        </div>
      </div>
    </div>
  )

  if (showCarousel && !isLoading && heroImages.length > 0) {
    return (
      <HeroCarousel
        images={heroImages}
        className={className}
        autoSlide={true}
        autoSlideInterval={6000}
        showControls={true}
        showIndicators={true}
      >
        {heroContent}
      </HeroCarousel>
    )
  }

  // Fallback hero without carousel
  return (
    <section className={`relative h-screen bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      <div className="container relative z-10">
        {heroContent}
      </div>
    </section>
  )
}