/**
 * Animation utilities for enhanced user experience
 * Provides reusable animation hooks and utilities for whimsical interactions
 */

import { useEffect, useRef, useState } from 'react'

// Intersection Observer hook for scroll animations
export function useInView(threshold: number = 0.1) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isInView] as const
}

// Animated counter hook for statistics
export function useAnimatedCounter(
  targetValue: number,
  duration: number = 2000,
  shouldStart: boolean = true
) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp

      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      
      setCount(Math.floor(targetValue * easeOutCubic))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [targetValue, duration, shouldStart])

  return count
}

// Staggered animation utility
export function getStaggerDelay(index: number, baseDelay: number = 100) {
  return index * baseDelay
}

// Mouse parallax effect
export function useMouseParallax(strength: number = 20) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX - centerX) / window.innerWidth) * strength
      const y = ((e.clientY - centerY) / window.innerHeight) * strength
      
      setPosition({ x, y })
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [strength])

  return [ref, position] as const
}

// Floating animation utilities
export const floatingAnimation = {
  initial: { y: 0 },
  animate: { 
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Construction-themed cursor utilities
export function setConstructionCursor(element: HTMLElement, tool: string = 'hammer') {
  const cursors = {
    hammer: '🔨',
    wrench: '🔧',
    screwdriver: '🪛',
    drill: '🪚',
    saw: '⚒️'
  }
  
  element.style.cursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewport='0 0 24 24' style='fill:black;font-size:16px;'><text y='20'>${cursors[tool as keyof typeof cursors] || cursors.hammer}</text></svg>") 12 12, auto`
}

// Perth weather integration utility
export async function getPerthWeather() {
  try {
    // In a real implementation, you'd use a weather API
    // This is a mock for demonstration
    const mockWeather = {
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      condition: ['sunny', 'partly-cloudy', 'cloudy'][Math.floor(Math.random() * 3)],
      icon: '☀️'
    }
    
    return mockWeather
  } catch (error) {
    return null
  }
}

// Building progress animation
export function createBuildingProgress(steps: string[], currentStep: number = 0) {
  return steps.map((step, index) => ({
    step,
    isComplete: index < currentStep,
    isCurrent: index === currentStep,
    delay: index * 200
  }))
}

// Sparkle effect utility
export function createSparkles(count: number = 3) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2000,
    duration: 1000 + Math.random() * 1000,
    x: Math.random() * 100,
    y: Math.random() * 100
  }))
}

// Celebration confetti effect
export function triggerConfetti() {
  // Simple confetti effect that can be enhanced with a library later
  const colors = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
  const confettiCount = 50
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      top: -10px;
      left: ${Math.random() * 100}%;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall 3s linear forwards;
    `
    
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 3000)
  }
}

// Add CSS animation for confetti if not exists
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes confetti-fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `
  
  if (!document.head.querySelector('style[data-confetti]')) {
    style.setAttribute('data-confetti', 'true')
    document.head.appendChild(style)
  }
}