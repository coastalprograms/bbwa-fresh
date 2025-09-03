"use client"

import React, { useEffect, useState } from 'react'
import { createSparkles } from '@/lib/animation-utils'

interface FloatingSparklesProps {
  count?: number
  color?: string
  children: React.ReactNode
}

interface Sparkle {
  id: number
  size: number
  delay: number
  duration: number
  x: number
  y: number
}

export default function FloatingSparkles({ 
  count = 3, 
  color = '#7c3aed',
  children 
}: FloatingSparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    setSparkles(createSparkles(count))
    
    // Refresh sparkles periodically
    const interval = setInterval(() => {
      setSparkles(createSparkles(count))
    }, 3000)

    return () => clearInterval(interval)
  }, [count])

  return (
    <div className="relative inline-block">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: color,
            borderRadius: '50%',
            animationDelay: `${sparkle.delay}ms`,
            animationDuration: `${sparkle.duration}ms`,
            zIndex: 10
          }}
        />
      ))}
      {children}
    </div>
  )
}