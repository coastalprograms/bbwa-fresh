"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface HeroImage {
  id: string
  url: string
  alt_text: string | null
  sort_order: number
}

interface HeroCarouselProps {
  images: HeroImage[]
  autoSlide?: boolean
  autoSlideInterval?: number
  showControls?: boolean
  showIndicators?: boolean
  className?: string
  children?: React.ReactNode
}

export function HeroCarousel({
  images,
  autoSlide = true,
  autoSlideInterval = 5000,
  showControls = true,
  showIndicators = true,
  className,
  children,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }, [images.length])

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }, [images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-slide functionality
  React.useEffect(() => {
    if (!autoSlide || images.length <= 1) return

    timeoutRef.current = setTimeout(nextSlide, autoSlideInterval)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, autoSlide, autoSlideInterval, nextSlide, images.length])

  // Reset to first slide when images change
  React.useEffect(() => {
    setCurrentIndex(0)
  }, [images.length])

  if (!images || images.length === 0) {
    return (
      <div className={cn(
        "relative h-screen bg-muted flex items-center justify-center",
        className
      )}>
        <p className="text-muted-foreground">No hero images available</p>
        {children}
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden group", className)}>
      {/* Image Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={image.id} className="min-w-full relative">
            <div className="relative h-screen bg-gradient-to-r from-background/20 to-background/10">
              <Image
                src={image.url}
                alt={image.alt_text || `Hero image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            {children}
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      {showControls && images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextSlide}
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}