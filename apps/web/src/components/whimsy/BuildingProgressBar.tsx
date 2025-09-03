"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, Loader2Icon } from 'lucide-react'

interface BuildingProgressBarProps {
  steps: string[]
  currentStep?: number
  animated?: boolean
  showLabels?: boolean
  className?: string
}

export default function BuildingProgressBar({ 
  steps, 
  currentStep = 0, 
  animated = true,
  showLabels = true,
  className = ''
}: BuildingProgressBarProps) {
  const [animatedStep, setAnimatedStep] = useState(0)

  useEffect(() => {
    if (!animated) {
      setAnimatedStep(currentStep)
      return
    }

    // Animate step by step
    let currentAnimatedStep = 0
    const interval = setInterval(() => {
      if (currentAnimatedStep <= currentStep) {
        setAnimatedStep(currentAnimatedStep)
        currentAnimatedStep++
      } else {
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [currentStep, animated])

  const progressPercentage = ((animatedStep + 1) / steps.length) * 100

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="absolute top-0 w-full flex justify-between transform -translate-y-1">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                index <= animatedStep
                  ? 'bg-primary border-primary text-white scale-110' 
                  : 'bg-background border-muted'
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {index < animatedStep ? (
                <CheckIcon className="w-2.5 h-2.5" />
              ) : index === animatedStep ? (
                <Loader2Icon className="w-2.5 h-2.5 animate-spin" />
              ) : (
                <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Labels */}
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground mt-6">
          {steps.map((step, index) => (
            <Badge
              key={index}
              variant={index <= animatedStep ? "default" : "outline"}
              className={`text-xs transition-all duration-300 ${
                index <= animatedStep 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'opacity-60'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {step}
            </Badge>
          ))}
        </div>
      )}

      {/* Construction Emoji Trail */}
      <div className="flex justify-center gap-2 text-2xl mt-2">
        {['🏗️', '🔨', '🏠'].map((emoji, index) => (
          <span 
            key={index}
            className={`transition-all duration-300 ${
              animatedStep >= (index + 1) * Math.floor(steps.length / 3)
                ? 'opacity-100 scale-100 animate-bounce' 
                : 'opacity-30 scale-75'
            }`}
            style={{ 
              transitionDelay: `${index * 200}ms`,
              animationDelay: `${index * 100}ms`
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  )
}