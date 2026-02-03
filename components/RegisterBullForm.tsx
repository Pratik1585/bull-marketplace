'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MediaUpload from './MediaUpload'

export default function RegisterBullForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    price: '',
    district: '',
    taluka: '',
    village: '',
    description: '',
    phone: '',
    whatsapp: '',
    raceExperience: '',
  })

  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (images.length === 0) {
      setError('कृपया कमीत कमी 1 फोटो अपलोड करा')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/public/bulls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          breed: formData.breed,
          age: Number(formData.age),
          price: Number(formData.price),
          district: formData.district,
          taluka: formData.taluka || undefined,
          village: formData.village || undefined,
          description: formData.description || undefined,
          phone: formData.phone,
          whatsapp: formData.whatsapp || undefined,
          raceExperience: formData.raceExperience || undefined,
          images,
          videos,
        }),
      })

      // 🔐 SAFE RESPONSE HANDLING (FIX)
      const contentType = response.headers.get('content-type')

      if (!response.ok) {
        let message = 'बैल नोंदवताना त्रुटी आली'

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          message = data?.error || message
        } else {
          const text = await response.text()
          console.error('Non-JSON error:', text)
          message = 'मोबाइलवर डेटा मोठा असल्यामुळे विनंती अयशस्वी झाली'
        }

        throw new Error(message)
      }

      setSuccess(true)
      setTimeout(() => router.push('/'), 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'एक त्रुटी आली')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-300 text-red-700 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      <MediaUpload
        images={images}
        videos={videos}
        onImagesChange={setImages}
        onVideosChange={setVideos}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg disabled:opacity-50"
      >
        {loading ? 'नोंदवत आहे...' : '✅ बैल नोंदवा'}
      </button>
    </form>
  )
}
