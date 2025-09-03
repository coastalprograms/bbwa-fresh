"use client"

import React, { useEffect, useRef } from 'react'

interface ConstructionCursorProps {
  children: React.ReactNode
  tool?: 'hammer' | 'wrench' | 'screwdriver' | 'drill' | 'saw'
}

export default function ConstructionCursor({ children, tool = 'hammer' }: ConstructionCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const element = containerRef.current
    const cursors = {
      hammer: '🔨',
      wrench: '🔧', 
      screwdriver: '🪛',
      drill: '🪚',
      saw: '⚒️'
    }

    const cursorEmoji = cursors[tool]
    
    // Create a more elaborate cursor with better styling
    element.style.cursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' style='font-size:20px;'><text x='6' y='24' fill='%23333'>${cursorEmoji}</text></svg>") 16 16, auto`

    const handleMouseEnter = () => {
      element.style.cursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' style='font-size:22px;'><text x='5' y='24' fill='%235a0fc8'>${cursorEmoji}</text></svg>") 16 16, auto`
    }

    const handleMouseLeave = () => {
      element.style.cursor = 'default'
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.style.cursor = 'default'
    }
  }, [tool])

  return (
    <div ref={containerRef} className="construction-cursor">
      {children}
    </div>
  )
}