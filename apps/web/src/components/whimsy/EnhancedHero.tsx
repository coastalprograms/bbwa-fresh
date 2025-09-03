"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRightIcon, 
  CheckIcon, 
  ShieldCheckIcon,
  AwardIcon,
  StarIcon,
  Building2Icon,
  ChevronDownIcon,
  ThermometerIcon,
  SunIcon,
  CloudIcon
} from 'lucide-react'
import Link from 'next/link'
import { useInView } from '@/lib/animation-utils'
import AnimatedCounter from './AnimatedCounter'
import DunsboroughWeatherWidget from './DunsboroughWeatherWidget'
import FloatingSparkles from './FloatingSparkles'
import ConstructionCursor from './ConstructionCursor'

interface EnhancedHeroProps {
  onScrollToNext?: () => void
}

export default function EnhancedHero({ onScrollToNext }: EnhancedHeroProps) {
  const [heroRef, isHeroInView] = useInView(0.1)
  const [typedText, setTypedText] = useState('')
  const [showElements, setShowElements] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState('🏗️')

  const fullText = "Perth's Premier Construction Specialists"
  const constructionEmojis = useMemo(() => ['🏗️', '🔨', '🏠', '⚒️', '🧱'], [])

  // Typewriter effect for hero title
  useEffect(() => {
    if (!isHeroInView) return

    let index = 0
    setShowElements(false)
    
    const typeTimer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeTimer)
        setTimeout(() => setShowElements(true), 300)
      }
    }, 50)

    return () => clearInterval(typeTimer)
  }, [isHeroInView])

  // Cycling construction emojis
  useEffect(() => {
    const emojiTimer = setInterval(() => {
      setCurrentEmoji(constructionEmojis[Math.floor(Math.random() * constructionEmojis.length)])
    }, 2000)

    return () => clearInterval(emojiTimer)
  }, [constructionEmojis])

  return (
    <section 
      ref={heroRef}
      className="relative h-screen overflow-hidden" 
      aria-label="Hero section"
    >
      {/* Enhanced Background with Parallax Effect */}
      <div className="absolute inset-0">
        {/* Construction background with parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")`,
            transform: isHeroInView ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        
        {/* Animated Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-primary/60 animate-perth-wave" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        
        {/* Floating Construction Elements */}
        <div className="absolute top-1/4 left-1/4 text-6xl animate-float opacity-10">
          <span className="animate-tool-bounce">🔨</span>
        </div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-float-delayed opacity-10">
          <span className="animate-wiggle">⚒️</span>
        </div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl animate-float opacity-10">
          <span className="animate-aussie-wave">🏗️</span>
        </div>
      </div>
      
      <div className="container relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-5xl text-center text-white">
          {/* Weather Widget */}
          <div className="flex justify-center mb-6">
            <DunsboroughWeatherWidget />
          </div>
          
          {/* Enhanced Trust Badges with Animations */}
          <div className={`flex flex-wrap items-center justify-center gap-4 mb-6 transition-all duration-1000 ${
            showElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <FloatingSparkles count={2}>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm hover-perth-glow">
                <ShieldCheckIcon className="mr-2 h-3.5 w-3.5 animate-perth-sparkle" />
                Licensed Builder #12345
              </Badge>
            </FloatingSparkles>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm hover-perth-glow">
              <AwardIcon className="mr-2 h-3.5 w-3.5 animate-tool-bounce" />
              Master Builders WA
            </Badge>
            <FloatingSparkles count={1}>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm hover-perth-glow">
                <StarIcon className="mr-2 h-3.5 w-3.5 fill-current animate-perth-sparkle" />
                5-Star Perth Builders
              </Badge>
            </FloatingSparkles>
          </div>
          
          {/* Animated Typewriter Title */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <div className="animate-construction-entrance">
                <span className="inline-flex items-center gap-4">
                  <span className="text-6xl animate-hammer-strike">{currentEmoji}</span>
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {typedText}
                    <span className="animate-ping">|</span>
                  </span>
                </span>
              </div>
            </h1>
          </div>
          
          {/* Enhanced Description with Perth References */}
          <div className={`transition-all duration-1000 delay-500 ${
            showElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-95">
              From Cottesloe to Joondalup, we&apos;ve built quality homes and commercial spaces across Perth for over 15 years. 
              <span className="inline-block animate-aussie-wave"> 🇦🇺 </span>
              Licensed, insured, and committed to exceeding your expectations.
            </p>
          </div>
          
          {/* Animated Statistics */}
          <div className={`grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10 p-6 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-1000 delay-700 ${
            showElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <ConstructionCursor tool="hammer">
              <div className="text-center group hover-construction">
                <div className="text-2xl sm:text-3xl font-bold mb-1">
                  <AnimatedCounter 
                    value={500} 
                    suffix="+" 
                    shouldStart={showElements}
                    className="group-hover:text-yellow-300"
                  />
                </div>
                <div className="text-sm opacity-90">Projects Completed</div>
              </div>
            </ConstructionCursor>
            
            <ConstructionCursor tool="wrench">
              <div className="text-center border-x border-white/20 group hover-construction">
                <div className="text-2xl sm:text-3xl font-bold mb-1">
                  <AnimatedCounter 
                    value={15} 
                    suffix="+" 
                    shouldStart={showElements}
                    duration={1500}
                    className="group-hover:text-yellow-300"
                  />
                </div>
                <div className="text-sm opacity-90">Years Experience</div>
              </div>
            </ConstructionCursor>
            
            <ConstructionCursor tool="drill">
              <div className="text-center group hover-construction">
                <div className="text-2xl sm:text-3xl font-bold mb-1">
                  <AnimatedCounter 
                    value={98} 
                    suffix="%" 
                    shouldStart={showElements}
                    duration={2500}
                    className="group-hover:text-yellow-300"
                  />
                </div>
                <div className="text-sm opacity-90">Client Satisfaction</div>
              </div>
            </ConstructionCursor>
          </div>
          
          {/* Enhanced Action Buttons with Construction Theme */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-1000 ${
            showElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <FloatingSparkles count={3}>
              <Button 
                size="lg" 
                className="group bg-white text-primary hover:bg-white/90 hover-construction relative overflow-hidden" 
                asChild
              >
                <Link href="/contact">
                  <span className="relative z-10">Get Your Free Quote</span>
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Link>
              </Button>
            </FloatingSparkles>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm hover-construction" 
              asChild
            >
              <Link href="/projects">
                <Building2Icon className="mr-2 h-4 w-4 animate-wiggle" />
                View Perth Projects
              </Link>
            </Button>
          </div>
          
          {/* Perth-Specific Features with Animations */}
          <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm opacity-90 stagger-children transition-all duration-1000 delay-1200 ${
            showElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex items-center gap-2 animate-construction-entrance">
              <CheckIcon className="h-4 w-4 text-white animate-perth-sparkle" />
              <span>Free On-Site Consultation</span>
            </div>
            <div className="flex items-center gap-2 animate-construction-entrance">
              <CheckIcon className="h-4 w-4 text-white animate-perth-sparkle" />
              <span>Fully Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 animate-construction-entrance">
              <CheckIcon className="h-4 w-4 text-white animate-perth-sparkle" />
              <span>Perth Local Knowledge 🌅</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Perth Skyline Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent">
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 text-white/30">
          {/* Simple Perth skyline silhouette */}
          <div className="w-3 h-12 bg-current rounded-t"></div>
          <div className="w-2 h-8 bg-current rounded-t"></div>
          <div className="w-4 h-16 bg-current rounded-t"></div>
          <div className="w-2 h-6 bg-current rounded-t"></div>
          <div className="w-3 h-14 bg-current rounded-t"></div>
        </div>
      </div>
      
      {/* Enhanced Scroll Indicator */}
      <ConstructionCursor tool="hammer">
        <button 
          onClick={onScrollToNext}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-all duration-300 group animate-bounce hover-perth-glow"
          aria-label="Scroll to services section"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs opacity-80 group-hover:opacity-100">Scroll to explore</span>
            <ChevronDownIcon className="h-6 w-6 group-hover:scale-125 transition-transform" />
            <span className="text-lg animate-tool-bounce">🔽</span>
          </div>
        </button>
      </ConstructionCursor>
      
      {/* Construction Particles */}
      {showElements && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute text-2xl animate-float opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            >
              {constructionEmojis[i % constructionEmojis.length]}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}