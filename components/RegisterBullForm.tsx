'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterBullForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [images, setImages] = useState<File[]>([])

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ✅ FRONTEND IMAGE COMPRESSION (Mobile fix)
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string

        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          const MAX_WIDTH = 1200
          const scale = MAX_WIDTH / img.width

          canvas.width = MAX_WIDTH
          canvas.height = img.height * scale

          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

          canvas.toBlob(
            (blob) => {
              if (!blob) return
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
              })
              resolve(compressedFile)
            },
            'image/jpeg',
            0.7
          )
        }
      }
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const compressedFiles: File[] = []

    for (const file of Array.from(files)) {
      const compressed = await compressImage(file)
      compressedFiles.push(compressed)
    }

    setImages(compressedFiles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (images.length === 0) {
      setError('कृपया किमान 1 फोटो अपलोड करा')
      return
    }

    setLoading(true)

    try {
      const fd = new FormData()
      images.forEach(f => fd.append('files', f))

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      })

      if (!uploadRes.ok) {
        const text = await uploadRes.text()
        throw new Error(text || 'फोटो अपलोड अयशस्वी')
      }

      const uploadJson = await uploadRes.json()
      const imageUrls: string[] = uploadJson.urls || []

      if (imageUrls.length === 0) {
        throw new Error('फोटो अपलोड अयशस्वी')
      }

      const res = await fetch('/api/public/bulls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          images: imageUrls,
          videos: [],
          weight: 0,
        }),
      })

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Invalid input')
      }

      setSuccess(true)
      setTimeout(() => router.push('/'), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'त्रुटी आली')
    } finally {
      setLoading(false)
    }
  }

  const districts = [
    'अहमदनगर','अकोला','अमरावती','औरंगाबाद','बीड','भंडारा','बुलढाणा',
    'चंद्रपूर','धुळे','गडचिरोली','गोंदिया','हिंगोली','जालना','जालगाव',
    'कोल्हापूर','लातूर','मुंबई','नागपूर','नांदेड','नंदुरबार','नाशिक',
    'उस्मानाबाद','पालघर','परभणी','पुणे','रायगड','रत्नागिरी','सांगली',
    'सातारा','सिंधुदुर्ग','सोलापूर','ठाणे','वर्धा','वाशिम','यवतमाळ'
  ]

  return (
    <div className="space-y-8">
      {success ? (
        <div className="text-center py-16">
          <div className="bg-green-50 border border-green-300 p-8 rounded-xl">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold">अभिनंदन!</h2>
            <p className="mt-2">तुमचा बैल यशस्वीरित्या नोंदवला गेला</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* तुझा उरलेला UI EXACT SAME आहे */}
