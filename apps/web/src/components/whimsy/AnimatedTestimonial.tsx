"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarIcon, CheckIcon, QuoteIcon } from 'lucide-react'
import FloatingSparkles from './FloatingSparkles'

interface TestimonialProps {
  testimonial: {
    name: string
    location: string
    quote: string
    avatar: string
  }
  index: number
}

export default function AnimatedTestimonial({ testimonial, index }: TestimonialProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className={`h-full border-none shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-500 ease-out group relative overflow-hidden ${
        isHovered ? 'scale-105 shadow-2xl bg-white/95' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Background Elements */}
      {isHovered && (
        <FloatingSparkles count={3} color="#7c3aed">
          <div className="absolute inset-0" />
        </FloatingSparkles>
      )}

      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 transition-all duration-500 ${
        isHovered ? 'opacity-100 scale-110' : 'opacity-0'
      }`} />

      <CardContent className="p-8 relative z-10">
        {/* Star Rating with Animation */}
        <div className="flex items-center gap-1 mb-6" aria-label="5 star rating">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative">
              <StarIcon 
                className={`h-5 w-5 fill-primary text-primary transition-all duration-300 ${
                  isHovered ? 'scale-125' : ''
                }`}
                style={{ 
                  transitionDelay: `${i * 50}ms`,
                  animationDelay: `${i * 100}ms`
                }}
                aria-hidden="true" 
              />
              {isHovered && (
                <div 
                  className="absolute inset-0 animate-ping"
                  style={{ 
                    animationDelay: `${i * 100}ms`,
                    animationDuration: '1s'
                  }}
                >
                  <StarIcon className="h-5 w-5 fill-primary/30 text-primary/30" />
                </div>
              )}
            </div>
          ))}
          <Badge 
            variant="outline"
            className={`ml-2 text-sm transition-all duration-300 ${
              isHovered ? 'bg-primary text-white border-primary scale-105' : 'text-muted-foreground'
            }`}
          >
            Verified Perth Client
          </Badge>
        </div>

        {/* Animated Quote */}
        <div className="relative mb-6">
          <QuoteIcon className={`absolute -top-2 -left-2 h-6 w-6 text-primary/20 transition-all duration-300 ${
            isHovered ? 'scale-125 text-primary/40' : ''
          }`} />
          
          <blockquote className={`text-gray-800 text-base leading-relaxed italic pl-4 transition-all duration-300 ${
            isHovered ? 'text-primary/90 pl-6' : ''
          }`}>
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          
          <QuoteIcon className={`absolute -bottom-2 -right-2 h-6 w-6 text-primary/20 rotate-180 transition-all duration-300 ${
            isHovered ? 'scale-125 text-primary/40' : ''
          }`} />
        </div>

        {/* Client Information with Enhanced Animation */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Avatar with Hover Effects */}
            <div className={`relative transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}>
              <Image 
                src={testimonial.avatar} 
                alt={`${testimonial.name} profile`}
                width={64}
                height={64}
                className={`w-16 h-16 rounded-full object-cover ring-2 transition-all duration-300 ${
                  isHovered ? 'ring-primary ring-4 shadow-lg' : 'ring-primary/20'
                }`}
              />
              
              {/* Verification Badge */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center transition-all duration-300 ${
                isHovered ? 'scale-125 bg-primary shadow-lg' : ''
              }`}>
                <CheckIcon className="w-3 h-3 text-white" />
              </div>

              {/* Ripple Effect on Hover */}
              {isHovered && (
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              )}
            </div>
          </div>

          <div className="flex-1">
            {/* Name with Animation */}
            <div className={`font-semibold text-base transition-all duration-300 ${
              isHovered ? 'text-primary scale-105 translate-x-1' : ''
            }`}>
              {testimonial.name}
            </div>
            
            {/* Location with Perth Highlight */}
            <div className={`text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
              isHovered ? 'text-primary scale-105 translate-x-1' : 'text-primary'
            }`}>
              <span>📍</span>
              <span>{testimonial.location}, Perth WA</span>
            </div>
            
            {/* Verification Status */}
            <div className={`text-xs mt-1 flex items-center gap-1 transition-all duration-300 ${
              isHovered ? 'text-primary/80 scale-105 translate-x-1' : 'text-muted-foreground'
            }`}>
              <CheckIcon className="w-3 h-3 text-green-500" />
              <span>Verified Client</span>
              {isHovered && (
                <Badge variant="outline" className="ml-1 text-2xs bg-green-50 text-green-600 border-green-200 animate-pulse">
                  Active Project
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Perth Local Indicators */}
        {isHovered && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg animate-slide-in-from-bottom">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>🏗️</span>
                <span>Project completed in {new Date().getFullYear() - 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-primary font-medium">🌟 Perth Local</span>
              </div>
            </div>
          </div>
        )}

        {/* Animated Border */}
        <div className={`absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </CardContent>
    </Card>
  )
}