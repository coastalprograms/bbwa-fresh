"use client"

import React, { useState, useEffect } from 'react'
import { SunIcon, CloudIcon, CloudRainIcon, ThermometerIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface WeatherData {
  temperature: number
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy'
  icon: string
}

export default function DunsboroughWeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [showWeather, setShowWeather] = useState(false)

  useEffect(() => {
    // Mock weather data for Dunsborough - in real app would use weather API
    const mockWeather: WeatherData = {
      temperature: Math.floor(Math.random() * 10) + 18, // 18-28°C typical Dunsborough coastal range
      condition: ['sunny', 'partly-cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)] as WeatherData['condition'],
      icon: '☀️'
    }
    
    // Simulate API delay
    setTimeout(() => {
      setWeather(mockWeather)
      setTimeout(() => setShowWeather(true), 500)
    }, 1000)
  }, [])

  if (!weather || !showWeather) return null

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <SunIcon className="h-4 w-4 text-yellow-500" />
      case 'partly-cloudy':
        return <CloudIcon className="h-4 w-4 text-blue-500" />
      case 'cloudy':
        return <CloudIcon className="h-4 w-4 text-gray-500" />
      case 'rainy':
        return <CloudRainIcon className="h-4 w-4 text-blue-600" />
      default:
        return <SunIcon className="h-4 w-4 text-yellow-500" />
    }
  }

  const getWeatherMessage = () => {
    if (weather.temperature > 25) {
      return "Perfect coastal building weather!"
    } else if (weather.condition === 'rainy') {
      return "Great time for indoor renovations!"
    } else {
      return "Ideal conditions for coastal construction!"
    }
  }

  return (
    <div className="animate-slide-in-from-right">
      <Badge 
        variant="outline" 
        className="bg-white/90 backdrop-blur-sm text-primary border-primary/20 hover:bg-primary/5 transition-all duration-300 cursor-help"
        title={getWeatherMessage()}
      >
        {getWeatherIcon()}
        <ThermometerIcon className="h-3 w-3 ml-1 mr-1" />
        <span className="font-medium">{weather.temperature}°C Dunsborough</span>
      </Badge>
    </div>
  )
}