'use client'

import { useState, useRef, useCallback } from 'react'

interface MediaUploadProps {
  images: string[]
  videos: string[]
  onImagesChange: (images: string[]) => void
  onVideosChange: (videos: string[]) => void
  maxImages?: number
  maxVideos?: number
}

interface MediaFile {
  file: File
  preview: string
  type: 'image' | 'video'
}

export default function MediaUpload({
  images,
  videos,
  onImagesChange,
  onVideosChange,
  maxImages = 10,
  maxVideos = 5
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Accepted file types
  const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const acceptedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'] // mov files

  const validateFile = (file: File): { isValid: boolean; type: 'image' | 'video' | null; error?: string } => {
    const isImage = acceptedImageTypes.includes(file.type)
    const isVideo = acceptedVideoTypes.includes(file.type)

    if (!isImage && !isVideo) {
      return {
        isValid: false,
        type: null,
        error: 'केवल JPG, PNG, WebP फोटो आणि MP4, WebM, MOV व्हिडिओ स्वीकारले जातात'
      }
    }

    // Check file size (max 50MB for videos, 10MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        isValid: false,
        type: null,
        error: `${isVideo ? 'व्हिडिओ' : 'फोटो'} खूप मोठा आहे (कमाल ${isVideo ? '50MB' : '10MB'})`
      }
    }

    return { isValid: true, type: isImage ? 'image' : 'video' }
  }

  const processFiles = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages: string[] = [...images]
    const newVideos: string[] = [...videos]
    const newMediaFiles: MediaFile[] = [...mediaFiles]

    const filePromises = Array.from(files).map(async (file) => {
      const validation = validateFile(file)
      if (!validation.isValid) {
        alert(validation.error)
        return null
      }

      return new Promise<MediaFile | null>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            resolve({
              file,
              preview: result,
              type: validation.type!
            })
          } else {
            resolve(null)
          }
        }
        reader.onerror = () => resolve(null)

        if (validation.type === 'image') {
          reader.readAsDataURL(file)
        } else {
          // For videos, we'll just use a generic preview and filename
          resolve({
            file,
            preview: file.name,
            type: 'video'
          })
        }
      })
    })

    try {
      const results = await Promise.all(filePromises)
      const validFiles = results.filter((result): result is MediaFile => result !== null)

      for (const mediaFile of validFiles) {
        if (mediaFile.type === 'image' && newImages.length < maxImages) {
          newImages.push(mediaFile.preview)
        } else if (mediaFile.type === 'video' && newVideos.length < maxVideos) {
          newVideos.push(mediaFile.preview)
        }
        newMediaFiles.push(mediaFile)
      }

      onImagesChange(newImages)
      onVideosChange(newVideos)
      setMediaFiles(newMediaFiles)
    } catch (error) {
      console.error('Error processing files:', error)
    } finally {
      setUploading(false)
    }
  }, [images, videos, onImagesChange, onVideosChange, mediaFiles, maxImages, maxVideos])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index)
    onVideosChange(newVideos)
  }

  const hasMinimumPhotos = images.length >= 1
  const canUploadMore = images.length < maxImages || videos.length < maxVideos

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {canUploadMore && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="text-5xl">📸🎥</div>
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                फोटो आणि व्हिडिओ अपलोड करा
              </p>
              <p className="text-sm text-gray-500 mb-4">
                गॅलरीमधून निवडा किंवा येथे ड्रॅग करा
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'अपलोड होत आहे...' : 'गॅलरीमधून निवडा'}
            </button>
            <div className="text-xs text-gray-400 space-y-1">
              <p>फोटो: JPG, PNG, WebP (कमाल 10MB प्रत्येक)</p>
              <p>व्हिडिओ: MP4, WebM, MOV (कमाल 50MB प्रत्येक)</p>
              <p className="font-semibold text-red-500">* कमीत कमी 1 फोटो आवश्यक आहे</p>
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-semibold text-gray-700">
              अपलोड केलेले फोटो ({images.length}/{maxImages})
            </p>
            {images.length >= 1 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                ✅ आवश्यकता पूर्ण
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-400 transition-all"
              >
                <img
                  src={image}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                  title="हटवा"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">फोटो {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Preview List */}
      {videos.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            अपलोड केलेले व्हिडिओ ({videos.length}/{maxVideos})
          </p>
          <div className="space-y-3">
            {videos.map((video, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">▶️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    व्हिडिओ {index + 1}
                  </p>
                  <p className="text-xs text-gray-500">MP4/WebM/MOV</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="हटवा"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Message */}
      {images.length === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            <p className="text-sm font-medium text-red-700">
              कृपया कमीत कमी 1 फोटो अपलोड करा
            </p>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-sm text-gray-600">फायली प्रोसेस करत आहे...</span>
        </div>
      )}
    </div>
  )
}










