"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { AnimatedSection } from "@/components/ui/animated-components"

interface DiagonalHeroSectionProps {
  title: string
  description?: string
  primaryCta?: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }
  imageUrl: string
  imageAlt: string
  className?: string
  animated?: boolean
  animationVariant?: "fade" | "slideLeft" | "slideRight" | "slideUp" | "simpleFade"
}

export function DiagonalHeroSection({
  title,
  description,
  primaryCta = {
    text: "CALL US",
    href: "tel:+61417927979"
  },
  secondaryCta = {
    text: "SEND US A MESSAGE",
    href: "/contact"
  },
  imageUrl,
  imageAlt,
  className,
  animated = true,
  animationVariant = "slideUp",
}: DiagonalHeroSectionProps) {
  const sectionContent = (
    <section className={`relative h-[350px] bg-white overflow-hidden mb-12 ${className || ''}`}>
      <div className="relative h-full w-full">
        {/* Left Side - Image with Diagonal Cut */}
        <div className="absolute inset-0 w-1/2">
          <div className="relative h-full w-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Diagonal Cut Effect - creates the angled line */}
            <div 
              className="absolute top-0 right-0 w-full h-full bg-white"
              style={{
                clipPath: 'polygon(75% 0, 100% 0, 100% 100%, 85% 100%)',
              }}
            />
          </div>
        </div>

        {/* Right Side - Text and Buttons */}
        <div className="absolute right-0 top-0 w-1/2 h-full flex items-center bg-white px-8 lg:px-12">
          <div className="space-y-6">
            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
              {title}
            </h2>
            
            {/* Description */}
            {description && (
              <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                {description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                asChild
                size="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base font-semibold rounded-lg transition-colors"
              >
                <Link href={primaryCta.href as any}>
                  {primaryCta.text}
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline"
                size="default"
                className="border-primary text-primary hover:bg-primary/10 px-6 py-3 text-base font-semibold rounded-lg transition-colors"
              >
                <Link href={secondaryCta.href as any}>
                  {secondaryCta.text}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  if (!animated) {
    return sectionContent
  }

  return (
    <AnimatedSection 
      variant={animationVariant}
      bidirectional={true}
      delay={0.2}
      className=""
    >
      {sectionContent}
    </AnimatedSection>
  )
}
