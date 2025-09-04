"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { useScrollAnimation, useReducedMotion } from "@/hooks/useScrollAnimation"
import { 
  materialStackVariants,
  heroVariants,
  toolAssemblyVariants,
  textRevealVariants,
  imageRevealVariants,
  sectionFadeInVariants,
  testimonialRiseVariants,
  bidirectionalFadeVariants,
  blueprintTextVariants,
  constructionBuildVariants,
  foundationRiseVariants,
  heroTextContainerVariants
} from "@/lib/animations"
import { forwardRef, ReactNode } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerChildren?: boolean
  variant?: "fade" | "hero" | "text" | "image" | "testimonial" | "bidirectional"
  bidirectional?: boolean
}

export const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  ({ children, className, delay = 0, staggerChildren = false, variant = "fade", bidirectional = false }, ref) => {
    const { ref: scrollRef, isInView } = useScrollAnimation({
      threshold: variant === "hero" ? 0.05 : 0.1,
      triggerOnce: !bidirectional && variant !== "testimonial" && variant !== "bidirectional",
      rootMargin: variant === "hero" ? "0px 0px 0% 0px" : "0px 0px -10% 0px",
      bidirectional
    })
    const prefersReducedMotion = useReducedMotion()

    const getVariants = () => {
      switch (variant) {
        case "hero":
          return heroVariants
        case "text":
          return textRevealVariants
        case "image":
          return imageRevealVariants
        case "testimonial":
          return testimonialRiseVariants
        case "bidirectional":
          return bidirectionalFadeVariants
        default:
          return sectionFadeInVariants
      }
    }

    if (prefersReducedMotion) {
      return (
        <div ref={ref || scrollRef} className={className}>
          {children}
        </div>
      )
    }

    return (
      <motion.div
        ref={ref || scrollRef}
        className={`${className} scroll-animated ${bidirectional ? 'bidirectional-animate' : ''}`}
        variants={getVariants()}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedSection.displayName = "AnimatedSection"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  index?: number
  stacked?: boolean
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, index = 0, stacked = false }, ref) => {
    const { ref: scrollRef, isInView } = useScrollAnimation({
      threshold: 0.15,
      triggerOnce: false, // Allow re-triggering for bi-directional scroll
      rootMargin: "0px 0px -20% 0px",
      bidirectional: true
    })
    const prefersReducedMotion = useReducedMotion()

    if (prefersReducedMotion) {
      return (
        <div ref={ref || scrollRef} className={className}>
          {children}
        </div>
      )
    }

    return (
      <motion.div
        ref={ref || scrollRef}
        className={`${className} scroll-animated ${stacked ? 'material-stack construction-card' : 'bidirectional-animate'}`}
        variants={stacked ? materialStackVariants : sectionFadeInVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={index}
        style={{ perspective: stacked ? 1000 : undefined }}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedCard.displayName = "AnimatedCard"

interface AnimatedIconProps {
  children: ReactNode
  className?: string
  index?: number
}

export const AnimatedIcon = forwardRef<HTMLDivElement, AnimatedIconProps>(
  ({ children, className, index = 0 }, ref) => {
    const { ref: scrollRef, isInView } = useScrollAnimation({
      threshold: 0.3,
      triggerOnce: false, // Allow re-triggering for tool assembly effect
      rootMargin: "0px 0px -15% 0px",
      bidirectional: true
    })
    const prefersReducedMotion = useReducedMotion()

    if (prefersReducedMotion) {
      return (
        <div ref={ref || scrollRef} className={className}>
          {children}
        </div>
      )
    }

    return (
      <motion.div
        ref={ref || scrollRef}
        className={`${className} scroll-animated bidirectional-animate`}
        variants={toolAssemblyVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={index}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedIcon.displayName = "AnimatedIcon"

interface AnimatedTextProps {
  children: ReactNode
  className?: string
  delay?: number
}

export const AnimatedText = forwardRef<HTMLDivElement, AnimatedTextProps>(
  ({ children, className, delay = 0 }, ref) => {
    const { ref: scrollRef, isInView } = useScrollAnimation({
      threshold: 0.2,
      triggerOnce: false,
      bidirectional: true
    })
    const prefersReducedMotion = useReducedMotion()

    if (prefersReducedMotion) {
      return (
        <div ref={ref || scrollRef} className={className}>
          {children}
        </div>
      )
    }

    return (
      <motion.div
        ref={ref || scrollRef}
        className={`${className} scroll-animated bidirectional-animate`}
        variants={textRevealVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedText.displayName = "AnimatedText"

interface AnimatedHeroTextProps {
  text: string
  className?: string
  variant?: "blueprint" | "construction" | "foundation"
  element?: "h1" | "h2" | "p"
  splitBy?: "word" | "line"
}

export const AnimatedHeroText = forwardRef<HTMLElement, AnimatedHeroTextProps>(
  ({ text, className, variant = "blueprint", element = "h1", splitBy = "word" }, ref) => {
    const { ref: scrollRef, isInView } = useScrollAnimation({
      threshold: 0.1,
      triggerOnce: false,
      rootMargin: "0px 0px -5% 0px",
      bidirectional: true
    })
    const prefersReducedMotion = useReducedMotion()

    const getVariants = () => {
      switch (variant) {
        case "blueprint":
          return blueprintTextVariants
        case "construction":
          return constructionBuildVariants
        case "foundation":
          return foundationRiseVariants
        default:
          return blueprintTextVariants
      }
    }

    const splitText = (text: string) => {
      if (splitBy === "line") {
        return text.split('\n').filter(line => line.trim().length > 0)
      }
      return text.split(' ').filter(word => word.trim().length > 0)
    }

    const textParts = splitText(text)
    const Component = motion[element as keyof typeof motion] as any

    if (prefersReducedMotion) {
      const StaticComponent = element as any
      return (
        <StaticComponent ref={ref || scrollRef} className={className}>
          {text}
        </StaticComponent>
      )
    }

    return (
      <Component
        ref={ref || scrollRef}
        className={`${className} scroll-animated bidirectional-animate overflow-hidden`}
        variants={heroTextContainerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {textParts.map((part, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={getVariants()}
            custom={index}
            style={{
              marginRight: splitBy === "word" ? "0.25em" : "0",
              display: splitBy === "line" ? "block" : "inline-block"
            }}
          >
            {part}
          </motion.span>
        ))}
      </Component>
    )
  }
)

AnimatedHeroText.displayName = "AnimatedHeroText"