'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)

    // For now, convert to data URLs (base64)
    // In production, upload to cloud storage and get URLs
    const newImages: string[] = []
    
    for (let i = 0; i < Math.min(files.length, maxImages - images.length); i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            newImages.push(result)
            if (newImages.length === Math.min(files.length, maxImages - images.length)) {
              onImagesChange([...images, ...newImages])
              setUploading(false)
            }
          }
        }
        reader.readAsDataURL(file)
      }
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
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
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
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div className="space-y-3">
            <div className="text-5xl">📸</div>
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                फोटो अपलोड करा
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
            <p className="text-xs text-gray-400">
              किमान 1, कमाल {maxImages} फोटो (JPG, PNG)
            </p>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            अपलोड केलेले फोटो ({images.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-400 transition-all"
              >
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
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

      {/* URL Input Fallback */}
      <div className="border-t border-gray-200 pt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          किंवा फोटो URL जोडा (पर्यायी)
        </label>
        <input
          type="text"
          placeholder="https://example.com/photo.jpg, https://example.com/photo2.jpg"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
          onChange={(e) => {
            const urls = e.target.value.split(',').map(url => url.trim()).filter(Boolean)
            if (urls.length > 0) {
              onImagesChange([...images, ...urls])
            }
          }}
        />
        <p className="mt-1 text-xs text-gray-500">
          एकापेक्षा जास्त URL साठी कॉमा वापरा
        </p>
      </div>
    </div>
  )
}

