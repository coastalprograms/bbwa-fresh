"use client"
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

// Using remote placeholders until local images are added under /public/images/home
const images = [
  { src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8f?q=80&w=1600&auto=format&fit=crop', alt: 'Renovated kitchen with island bench' },
  { src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop', alt: 'Modern bathroom with tiled shower' },
  { src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop', alt: 'Outdoor decking area at sunset' },
]

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused])

  function prev() { setIndex((i) => (i - 1 + images.length) % images.length) }
  function next() { setIndex((i) => (i + 1) % images.length) }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === ' ') {
      e.preventDefault()
      setPaused((p) => !p)
    }
  }

  return (
    <div
      role="region"
      aria-label="Project image carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
      {images.map((img, i) => (
        <div key={img.src} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}>
          <Image src={img.src} alt={img.alt} fill priority={i === 0} className="object-cover" sizes="(max-width: 1024px) 100vw, 1024px" />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        <button aria-label="Previous slide" onClick={prev} className="rounded bg-white/80 px-3 py-1 text-sm text-black shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white">Prev</button>
        <button aria-pressed={paused} aria-label="Pause or resume carousel" onClick={() => setPaused((p) => !p)} className="rounded bg-white/80 px-3 py-1 text-sm text-black shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button aria-label="Next slide" onClick={next} className="rounded bg-white/80 px-3 py-1 text-sm text-black shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white">Next</button>
      </div>
    </div>
  )
}
