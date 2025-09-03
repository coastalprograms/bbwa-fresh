"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRightIcon, CheckIcon, StarIcon, BuildingIcon, HomeIcon, WrenchIcon } from 'lucide-react'
import Link from 'next/link'
import { useMouseParallax } from '@/lib/animation-utils'
import ConstructionCursor from './ConstructionCursor'
import FloatingSparkles from './FloatingSparkles'

interface InteractiveServiceCardProps {
  service: {
    slug: string
    title: string
    summary: string
    features: string[]
    priceRange?: string
    icon?: React.ComponentType<any>
  }
  index: number
}

export default function InteractiveServiceCard({ service, index }: InteractiveServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [parallaxRef, parallaxPosition] = useMouseParallax(5)

  const getServiceIcon = () => {
    if (service.icon) {
      const Icon = service.icon
      return <Icon className="h-16 w-16 text-primary/60" />
    }
    
    // Default icons based on service type
    if (service.slug.includes('home')) return <HomeIcon className="h-16 w-16 text-primary/60" />
    if (service.slug.includes('commercial')) return <BuildingIcon className="h-16 w-16 text-primary/60" />
    return <WrenchIcon className="h-16 w-16 text-primary/60" />
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLDivElement
    const rect = target.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    
    setMousePosition({ x, y })
  }

  const getConstructionTool = () => {
    const tools = ['hammer', 'wrench', 'screwdriver', 'drill', 'saw'] as const
    return tools[index % tools.length]
  }

  return (
    <ConstructionCursor tool={getConstructionTool()}>
      <Card 
        ref={parallaxRef as React.RefObject<HTMLDivElement>}
        className={`group relative overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl ${
          isHovered ? 'scale-105 -translate-y-4' : 'hover:-translate-y-2'
        }`}
        style={{
          transform: `translate(${parallaxPosition.x}px, ${parallaxPosition.y}px) ${isHovered ? 'scale(1.05) translateY(-16px)' : ''}`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setMousePosition({ x: 0, y: 0 })
        }}
        onMouseMove={handleMouseMove}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Animated Background Gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Sparkle Effect on Hover */}
        {isHovered && (
          <FloatingSparkles count={5} color="#7c3aed">
            <div className="absolute inset-0" />
          </FloatingSparkles>
        )}

        {/* Mouse Follow Gradient */}
        {isHovered && (
          <div
            className="absolute w-32 h-32 bg-gradient-radial from-primary/20 to-transparent rounded-full transition-all duration-200 pointer-events-none"
            style={{
              left: `${mousePosition.x + 50}%`,
              top: `${mousePosition.y + 50}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}

        <CardHeader className="relative z-10">
          {/* Animated Service Icon */}
          <div 
            className={`w-full h-48 mb-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'scale-110 rotate-6' : ''
            }`}
          >
            {getServiceIcon()}
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg bg-primary/10 text-primary transition-all duration-300 ${
              isHovered ? 'bg-primary text-primary-foreground scale-110 rotate-12' : ''
            }`}>
              {getServiceIcon()}
            </div>
            <CardTitle className={`transition-all duration-300 ${
              isHovered ? 'text-primary scale-105' : ''
            }`}>
              {service.title}
            </CardTitle>
          </div>
          
          <CardDescription className="leading-relaxed">
            {service.summary}
          </CardDescription>
          
          {/* Price Range Badge with Animation */}
          {service.priceRange && (
            <div className="absolute top-4 right-4">
              <Badge 
                variant="secondary" 
                className={`bg-white/90 text-primary transition-all duration-300 ${
                  isHovered ? 'scale-110 bg-primary text-white shadow-lg' : ''
                }`}
              >
                {service.priceRange}
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="relative z-10">
          {/* Features List with Staggered Animation */}
          <ul className="space-y-3 mb-6">
            {service.features.slice(0, isExpanded ? service.features.length : 3).map((feature, featureIndex) => (
              <li 
                key={featureIndex} 
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isHovered ? 'translate-x-2' : ''
                }`}
                style={{ 
                  transitionDelay: `${featureIndex * 50}ms`,
                  animationDelay: `${featureIndex * 100}ms`
                }}
              >
                <div className={`transition-all duration-300 ${
                  isHovered ? 'scale-125 rotate-180' : ''
                }`}>
                  <CheckIcon className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
                <span className={`text-sm transition-all duration-300 ${
                  isHovered ? 'text-primary font-medium' : ''
                }`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* Expandable Content */}
          {isExpanded && service.features.length > 3 && (
            <div className="mb-4 p-3 bg-primary/5 rounded-lg animate-slide-in-from-top">
              <p className="text-sm text-muted-foreground italic">
                ✨ Perth local expertise with {service.features.length} specialized features to ensure your project exceeds expectations!
              </p>
            </div>
          )}

          {/* Perth Local Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
              <StarIcon className="h-3 w-3 mr-1 fill-current" />
              Perth Local Experts
            </Badge>
            <Badge variant="outline" className="text-xs">
              🏆 15+ Years Experience
            </Badge>
          </div>

          {/* Action Buttons with Enhanced Hover Effects */}
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className={`flex-1 group/btn relative overflow-hidden transition-all duration-300 ${
                isHovered ? 'bg-primary/10 text-primary border-primary/20' : ''
              }`} 
              asChild
            >
              <Link href={`/services/${service.slug}` as any}>
                <span className="relative z-10">Learn More</span>
                <ArrowRightIcon className={`ml-2 h-4 w-4 transition-all duration-300 ${
                  isHovered ? 'translate-x-2 scale-110' : 'group-hover/btn:translate-x-1'
                }`} />
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 transition-transform duration-500 ${
                  isHovered ? 'translate-x-0' : '-translate-x-full'
                }`} />
              </Link>
            </Button>
            
            <Button 
              size="sm" 
              className={`px-3 relative overflow-hidden group transition-all duration-300 ${
                isHovered ? 'scale-110 shadow-lg bg-primary/90' : ''
              }`} 
              asChild
            >
              <Link href="/contact">
                <span className="relative z-10">Quote</span>
                {/* Ripple Effect */}
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300" />
              </Link>
            </Button>
          </div>

          {/* Construction Progress Indicator */}
          {isHovered && (
            <div className="mt-4 animate-slide-in-from-bottom">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>📋 Planning</span>
                <span>🏗️ Building</span>
                <span>✅ Complete</span>
              </div>
              <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </CardContent>

        {/* Border Glow Effect */}
        <div className={`absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </Card>
    </ConstructionCursor>
  )
}