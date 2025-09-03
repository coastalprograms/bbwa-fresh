'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X, ImageIcon } from 'lucide-react'

interface ServiceImageGalleryProps {
  images: string[]
}

export function ServiceImageGallery({ images }: ServiceImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!images || images.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-lg flex items-center justify-center"
          >
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Images coming soon</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Dialog key={index} open={isOpen && currentImageIndex === index} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  setCurrentImageIndex(index)
                  setIsOpen(true)
                }}
              >
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-full p-2">
                    <ImageIcon className="h-5 w-5 text-gray-700" />
                  </div>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-0 border-0">
              <div className="relative bg-black">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="relative aspect-video">
                  <Image
                    src={images[currentImageIndex]}
                    alt={`Gallery image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </div>

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-3 py-1">
                    <span className="text-white text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </span>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {images.length > 6 && (
        <div className="text-center mt-4">
          <Button variant="outline" size="sm">
            View All Images ({images.length})
          </Button>
        </div>
      )}
    </>
  )
}