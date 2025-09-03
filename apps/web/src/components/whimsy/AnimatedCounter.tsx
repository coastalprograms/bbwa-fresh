"use client"

import React from 'react'
import { useAnimatedCounter } from '@/lib/animation-utils'

interface AnimatedCounterProps {
  value: number
  duration?: number
  shouldStart?: boolean
  suffix?: string
  prefix?: string
  className?: string
}

export default function AnimatedCounter({ 
  value, 
  duration = 2000, 
  shouldStart = true, 
  suffix = '', 
  prefix = '',
  className = ''
}: AnimatedCounterProps) {
  const count = useAnimatedCounter(value, duration, shouldStart)

  return (
    <span className={`font-bold tabular-nums ${className}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}