'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Bull {
  id: string
  name: string
  breed: string
  age: number
  weight: number
  price: number
  district: string
  taluka?: string | null
  village?: string | null
  description?: string | null
  phone: string
  whatsapp?: string | null
  images: string[]
  videos: string[]
  raceExperience?: string | null
}

interface EditBullFormProps {
  bull: Bull
}

export default function EditBullForm({ bull }: EditBullFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: bull.name,
    breed: bull.breed,
    age: bull.age.toString(),
    weight: bull.weight.toString(),
    price: bull.price.toString(),
    district: bull.district,
    taluka: bull.taluka || '',
    village: bull.village || '',
    description: bull.description || '',
    phone: bull.phone,
    whatsapp: bull.whatsapp || '',
    images: bull.images.join(', '),
    videos: bull.videos || [],
    raceExperience: bull.raceExperience || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const imagesArray = formData.images
        ? formData.images.split(',').map((url) => url.trim()).filter(Boolean)
        : []

      if (imagesArray.length === 0) {
        setError('कृपया किमान एक फोटो URL जोडा')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/bulls/${bull.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          breed: formData.breed,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          price: parseFloat(formData.price),
          district: formData.district,
          taluka: formData.taluka || undefined,
          village: formData.village || undefined,
          description: formData.description || undefined,
          phone: formData.phone,
          whatsapp: formData.whatsapp || undefined,
          images: imagesArray,
          videos: formData.videos,
          raceExperience: formData.raceExperience || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'बैल अपडेट करताना त्रुटी आली')
      }

      router.push('/seller/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'एक त्रुटी आली')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const maharashtraDistricts = [
    'अहमदनगर', 'अकोला', 'अमरावती', 'औरंगाबाद', 'बीड', 'भंडारा', 'बुलढाणा',
    'चंद्रपूर', 'धुळे', 'गडचिरोली', 'गोंदिया', 'हिंगोली', 'जालना', 'जालगाव',
    'कोल्हापूर', 'लातूर', 'मुंबई', 'नागपूर', 'नांदेड', 'नंदुरबार', 'नाशिक',
    'उस्मानाबाद', 'पालघर', 'परभणी', 'पुणे', 'रायगड', 'रत्नागिरी', 'सांगली',
    'सातारा', 'सिंधुदुर्ग', 'सोलापूर', 'ठाणे', 'वर्धा', 'वाशिम', 'यवतमाळ'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">मूलभूत माहिती</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              बैलाचे नाव *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
              जात *
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              required
              value={formData.breed}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              वजन (किलो) *
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              required
              min="1"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              किंमत (रुपये) *
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="raceExperience" className="block text-sm font-medium text-gray-700 mb-2">
              शर्यत अनुभव
            </label>
            <input
              type="text"
              id="raceExperience"
              name="raceExperience"
              value={formData.raceExperience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">स्थान माहिती</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
              जिल्हा *
            </label>
            <select
              id="district"
              name="district"
              required
              value={formData.district}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">जिल्हा निवडा</option>
              {maharashtraDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="taluka" className="block text-sm font-medium text-gray-700 mb-2">
              तालुका
            </label>
            <input
              type="text"
              id="taluka"
              name="taluka"
              value={formData.taluka}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-2">
              गाव
            </label>
            <input
              type="text"
              id="village"
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">संपर्क माहिती</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              फोन नंबर *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp नंबर
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">फोटो आणि व्हिडिओ</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
              फोटो URL (कमा-वेगळे) *
            </label>
            <input
              type="text"
              id="images"
              name="images"
              required
              value={formData.images}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="videos" className="block text-sm font-medium text-gray-700 mb-2">
              व्हिडिओ URLs (YouTube किंवा MP4)
            </label>
            <textarea
              id="videos"
              name="videos"
              rows={3}
              value={formData.videos.join('\n')}
              onChange={(e) => {
                const videos = e.target.value.split('\n').map(url => url.trim()).filter(Boolean)
                setFormData({ ...formData, videos })
              }}
              placeholder={`https://youtube.com/watch?v=...\nhttps://example.com/video.mp4\nhttps://example.com/video2.mp4`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          वर्णन
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          रद्द करा
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'अपडेट होत आहे...' : 'अपडेट करा'}
        </button>
      </div>
    </form>
  )
}

