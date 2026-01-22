'use client'

import { useState, useEffect, useRef } from 'react'

interface MediaItem {
  url: string
  type: 'image' | 'video'
}

interface InstagramCarouselProps {
  images: string[]
  videos: string[]
  bullName: string
}

export default function InstagramCarousel({ images, videos, bullName }: InstagramCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Combine media: photos first, then videos
  const allMedia: MediaItem[] = [
    ...images.map(url => ({ url, type: 'image' as const })),
    ...videos.map(url => ({ url, type: 'video' as const }))
  ]

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < allMedia.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : allMedia.length - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex < allMedia.length - 1 ? currentIndex + 1 : 0)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  if (allMedia.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-6xl sm:text-7xl">🐂</span>
      </div>
    )
  }

  const currentMedia = allMedia[currentIndex]
  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  }

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <div
        ref={carouselRef}
        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Media Display */}
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.url}
            alt={`${bullName} - Photo ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : isYouTubeUrl(currentMedia.url) ? (
          <iframe
            src={getYouTubeEmbedUrl(currentMedia.url)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${bullName} - Video ${currentIndex + 1}`}
          />
        ) : (
          <video
            src={currentMedia.url}
            controls
            className="w-full h-full object-contain"
            poster="/video-placeholder.jpg"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        )}

        {/* Navigation Arrows - Desktop */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center"
              aria-label="Previous media"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center"
              aria-label="Next media"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Media Counter */}
        {allMedia.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {allMedia.length}
          </div>
        )}

        {/* Media Type Indicator */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          {currentMedia.type === 'image' ? (
            <>
              <span>📸</span>
              <span>फोटो</span>
            </>
          ) : (
            <>
              <span>🎥</span>
              <span>व्हिडिओ</span>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? 'border-primary-500 ring-2 ring-primary-200 scale-105'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-lg sm:text-xl">▶️</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Swipe Hint for Mobile */}
      <div className="sm:hidden text-center text-xs text-gray-500">
        👈 👉 स्वाइप करून पहा
      </div>
    </div>
  )
}







