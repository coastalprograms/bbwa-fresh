"use client"

import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

export interface ScrollAnimationOptions {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
  bidirectional?: boolean
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef(null)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  
  const isInView = useInView(ref, {
    amount: options.threshold || 0.1,
    once: options.triggerOnce || false,
    margin: options.rootMargin || "0px 0px -10% 0px"
  })

  // Track if element has been in view for bidirectional animations
  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true)
    }
  }, [isInView, hasBeenInView])

  // For bidirectional animations, return isInView directly
  // For one-way animations, use hasBeenInView to prevent re-triggering
  const shouldAnimate = options.bidirectional ? isInView : (options.triggerOnce ? hasBeenInView : isInView)

  return { ref, isInView: shouldAnimate, rawInView: isInView }
}

// Hook for prefers-reduced-motion
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}