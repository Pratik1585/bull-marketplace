'use client'

import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  videos: string[]
  bullName: string
}

export default function ImageGallery({ images, videos, bullName }: ImageGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(
    images.length > 0 ? images[0] : videos.length > 0 ? videos[0] : null
  )
  const [mediaType, setMediaType] = useState<'image' | 'video'>(
    images.length > 0 ? 'image' : videos.length > 0 ? 'video' : 'image'
  )

  const allMedia = [
    ...images.map(img => ({ url: img, type: 'image' as const })),
    ...videos.map(url => ({ url, type: 'video' as const }))
  ]

  const handleThumbnailClick = (url: string, type: 'image' | 'video') => {
    setSelectedMedia(url)
    setMediaType(type)
  }

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

  if (allMedia.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-9xl">🐂</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Display - Square */}
      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
        {mediaType === 'image' && selectedMedia ? (
          <img
            src={selectedMedia}
            alt={bullName}
            className="w-full h-full object-cover"
          />
        ) : selectedMedia && isYouTubeUrl(selectedMedia) ? (
          <iframe
            src={getYouTubeEmbedUrl(selectedMedia)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : selectedMedia ? (
          <video
            src={selectedMedia}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-9xl">🐂</span>
          </div>
        )}
      </div>

      {/* Thumbnail Strip - Horizontal Scroll */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(media.url, media.type)}
              className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                selectedMedia === media.url
                  ? 'border-primary-600 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={`${bullName} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl">▶️</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

