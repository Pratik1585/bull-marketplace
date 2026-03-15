'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterBullForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)
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

  const maharashtraDistricts = [
    'अहमदनगर', 'अकोला', 'अमरावती', 'औरंगाबाद', 'बीड', 'भंडारा', 'बुलढाणा',
    'चंद्रपूर', 'धुळे', 'गडचिरोली', 'गोंदिया', 'हिंगोली', 'जालना', 'जालगाव',
    'कोल्हापूर', 'लातूर', 'मुंबई', 'नागपूर', 'नांदेड', 'नंदुरबार', 'नाशिक',
    'उस्मानाबाद', 'पालघर', 'परभणी', 'पुणे', 'रायगड', 'रत्नागिरी', 'सांगली',
    'सातारा', 'सिंधुदुर्ग', 'सोलापूर', 'ठाणे', 'वर्धा', 'वाशिम', 'यवतमाळ'
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ✅ Image compression — mobile-friendly with iterative quality reduction
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onerror = () => reject(new Error('Failed to read file'))

      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string

        img.onerror = () => reject(new Error('Failed to load image'))

        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          const MAX_WIDTH = 1024
          const MAX_HEIGHT = 1024
          const MAX_FILE_SIZE = 500 * 1024 // 500KB target

          let width = img.width
          let height = img.height

          // Only downscale, never upscale
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
            width = Math.round(width * ratio)
            height = Math.round(height * ratio)
          }

          canvas.width = width
          canvas.height = height
          ctx?.drawImage(img, 0, 0, width, height)

          // Iterative quality reduction to meet file size target
          const tryCompress = (quality: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(file) // fallback to original if compression fails
                  return
                }
                // If still too large and quality can go lower, try again
                if (blob.size > MAX_FILE_SIZE && quality > 0.3) {
                  tryCompress(quality - 0.1)
                } else {
                  resolve(new File([blob], file.name, { type: 'image/jpeg' }))
                }
              },
              'image/jpeg',
              quality
            )
          }

          tryCompress(0.7)
        }
      }
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setCompressing(true)
    setError('')

    try {
      const compressed: File[] = []
      for (const file of Array.from(files)) {
        const c = await compressImage(file)
        compressed.push(c)
      }
      setImages(compressed)
    } catch {
      setError('फोटो कॉम्प्रेस करता आला नाही, कृपया पुन्हा प्रयत्न करा')
    } finally {
      setCompressing(false)
    }
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

      if (!uploadRes.ok) throw new Error('फोटो अपलोड अयशस्वी')

      const uploadJson = await uploadRes.json()
      const imageUrls: string[] = uploadJson.urls || []

      const res = await fetch('/api/public/bulls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          price: Number(formData.price),
          images: imageUrls,
          videos: [],
          weight: 0,
        }),
      })

      if (!res.ok) throw new Error('नोंदणी अयशस्वी')

      setSuccess(true)
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (err) {
      setError('त्रुटी आली')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white text-gray-900'

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
        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl flex items-center gap-2 animate-fadeIn">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* ─── Section 1: मूलभूत माहिती (Basic Info) ─── */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-white rounded-xl p-6 border border-amber-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              मूलभूत माहिती
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  बैलाचे नाव *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="breed" className="block text-sm font-semibold text-gray-700 mb-2">
                  जात *
                </label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  required
                  value={formData.breed}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                  वय (वर्षे) *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="1"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  अपेक्षित किंमत (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-1">
                <label htmlFor="raceExperience" className="block text-sm font-semibold text-gray-700 mb-2">
                  शर्यत अनुभव
                </label>
                <input
                  type="text"
                  id="raceExperience"
                  name="raceExperience"
                  value={formData.raceExperience}
                  onChange={handleChange}
                  placeholder="उदा: 5 शर्यती जिंकल्या"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ─── Section 2: बैलाचे फोटो (Bull Photos) ─── */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-white rounded-xl p-6 border border-amber-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📸</span>
              बैलाचे फोटो *
            </h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-white file:text-gray-700 hover:file:bg-gray-50 cursor-pointer"
            />
            <p className="mt-2 text-xs text-gray-500">किमान 1 फोटो आवश्यक (फोटो आपोआप कॉम्प्रेस होतील)</p>
            {compressing && (
              <p className="mt-1 text-xs text-blue-600 font-medium animate-pulse">
                ⏳ फोटो कॉम्प्रेस होत आहेत...
              </p>
            )}
            {!compressing && images.length > 0 && (
              <p className="mt-1 text-xs text-green-600 font-medium">
                ✅ {images.length} फोटो निवडले आणि कॉम्प्रेस झाले
              </p>
            )}
          </div>

          {/* ─── Section 3: स्थान माहिती (Location Info) ─── */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📍</span>
              स्थान माहिती
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="district" className="block text-sm font-semibold text-gray-700 mb-2">
                  जिल्हा *
                </label>
                <select
                  id="district"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">जिल्हा निवडा ✓</option>
                  {maharashtraDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="taluka" className="block text-sm font-semibold text-gray-700 mb-2">
                  तालुका
                </label>
                <input
                  type="text"
                  id="taluka"
                  name="taluka"
                  value={formData.taluka}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="village" className="block text-sm font-semibold text-gray-700 mb-2">
                  गाव
                </label>
                <input
                  type="text"
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ─── Section 4: संपर्क माहिती (Contact Info) ─── */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📞</span>
              संपर्क माहिती
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  फोन नंबर *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp नंबर
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ─── Section 5: बैलाचे वर्णन (Description) ─── */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-xl">✍️</span>
              बैलाचे वर्णन
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="बैलाबद्दल अधिक माहिती..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white resize-y text-gray-900"
            />
          </div>

          {/* ─── Action Buttons ─── */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
            >
              रद्द करा
            </button>
            <button
              type="submit"
              disabled={loading || compressing}
              className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                'नोंदवत आहे…'
              ) : compressing ? (
                'फोटो कॉम्प्रेस होत आहेत…'
              ) : (
                <>
                  <span>✅</span> बैल नोंदवा
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
