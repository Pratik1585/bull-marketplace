'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

export default function RegisterBullForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
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
    videoUrl: '',
    raceExperience: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (uploadedImages.length === 0) {
        setError('कृपया किमान एक फोटो जोडा')
        setLoading(false)
        return
      }

      const response = await fetch('/api/public/bulls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          breed: formData.breed,
          age: parseInt(formData.age),
          price: parseFloat(formData.price),
          district: formData.district,
          taluka: formData.taluka || undefined,
          village: formData.village || undefined,
          description: formData.description || undefined,
          phone: formData.phone,
          whatsapp: formData.whatsapp || undefined,
          images: uploadedImages,
          videoUrl: formData.videoUrl || undefined,
          raceExperience: formData.raceExperience || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'बैल नोंदवताना त्रुटी आली')
      }

      // Show success message and redirect after delay
      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000) // Redirect after 3 seconds
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
    <div className="space-y-8">
      {success ? (
        <div className="text-center py-16">
          <div className="bg-green-50 border-2 border-green-300 text-green-800 rounded-xl p-8 animate-fadeIn">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">अभिनंदन!</h2>
            <p className="text-lg">तुमचा बैल विक्रीच्या यादीमध्ये जोडला गेला</p>
            <p className="text-sm text-green-600 mt-2">कृपया थांबा... मुख्यपृष्ठावर पुनर्निर्देशन होत आहे</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 text-red-700 rounded-xl flex items-center gap-2 animate-fadeIn">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

      {/* Basic Information */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-gray-200">
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
              placeholder="उदा: राजा, विजय"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
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
              placeholder="उदा: गिर, हरियाणा"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
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
              placeholder="उदा: 3"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              अपेक्षित किंमत (रुपये) *
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
              placeholder="उदा: 50000"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="raceExperience" className="block text-sm font-medium text-gray-700 mb-2">
              शर्यत अनुभव
            </label>
            <input
              type="text"
              id="raceExperience"
              name="raceExperience"
              value={formData.raceExperience}
              onChange={handleChange}
              placeholder="उदा: 5 शर्यती जिंकल्या, चॅम्पियन"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
            />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📍</span>
          स्थान माहिती
        </h2>
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
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
              placeholder="उदा: पुणे"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
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
              placeholder="उदा: शिवाजीनगर"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📞</span>
          संपर्क माहिती
        </h2>
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
              placeholder="10 अंकी नंबर"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
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
              placeholder="10 अंकी नंबर (पर्यायी)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📸</span>
          फोटो आणि व्हिडिओ
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              बैलाच्या फोटो *
            </label>
            <ImageUpload
              images={uploadedImages}
              onImagesChange={setUploadedImages}
              maxImages={10}
            />
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <span>💡</span>
              किमान 1 आणि कमाल 10 फोटो अपलोड करा
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label htmlFor="videoUrl" className="block text-sm font-semibold text-gray-700 mb-2">
              व्हिडिओ URL (YouTube किंवा MP4)
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=... किंवा https://example.com/video.mp4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <span>💡</span>
              YouTube लिंक किंवा थेट MP4 व्हिडिओ URL (पर्यायी)
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-6 border border-gray-200">
        <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-xl">✍️</span>
          बैलाचे वर्णन
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={formData.description}
          onChange={handleChange}
          placeholder="बैलाच्या वैशिष्ट्यांबद्दल सविस्तर माहिती लिहा..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white resize-none"
        />
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <span>💡</span>
          जितकी जास्त माहिती द्याल, तितका तुमचा बैल जलद विकला जाईल
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t-2 border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-8 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
        >
          रद्द करा
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold text-lg"
        >
          {loading ? 'नोंदवत आहे...' : '✅ बैल नोंदवा'}
        </button>
      </div>
    </form>
      )}
    </div>
  )
}

