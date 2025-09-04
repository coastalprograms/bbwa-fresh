"use client"

import * as React from "react"
import { HeroCarousel } from "@/components/ui/hero-carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, PhoneIcon } from "lucide-react"
import Link from "next/link"
import { supabaseBrowser } from "@/lib/supabase/client"
import { AnimatedHeroText, AnimatedSection } from "@/components/ui/animated-components"

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
    <div className="text-center space-y-8 z-10 relative">
      {badge && (
        <AnimatedSection variant="bidirectional" bidirectional={true} delay={0.1}>
          <Badge variant="outline" className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
            {badge}
          </Badge>
        </AnimatedSection>
      )}
      
      <div className="space-y-6">
        {/* Main Title with Blueprint Reveal Animation */}
        <AnimatedHeroText
          text={title}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
          variant="blueprint"
          element="h1"
          splitBy="word"
        />
        
        {subtitle && (
          <AnimatedHeroText
            text={subtitle}
            className="text-2xl md:text-3xl font-semibold text-white/90 max-w-4xl mx-auto"
            variant="construction"
            element="h2"
            splitBy="word"
          />
        )}
        
        {description && (
          <AnimatedHeroText
            text={description}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            variant="foundation"
            element="p"
            splitBy="word"
          />
        )}
      </div>
      
      {/* CTA Buttons with Staggered Animation */}
      <AnimatedSection 
        variant="bidirectional" 
        bidirectional={true} 
        delay={1.2}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
      >
        <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8" asChild>
          <Link href={primaryCta.href}>
            {primaryCta.text}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8" asChild>
          <Link href={secondaryCta.href}>
            {secondaryCta.text}
          </Link>
        </Button>
      </AnimatedSection>
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
        showIndicators={false}
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