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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setImages(Array.from(e.target.files))
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

        {/* मूलभूत माहिती */}
        <section className="bg-blue-50 border rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">📋 मूलभूत माहिती</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="बैलाचे नाव *">
              <input name="name" required value={formData.name} onChange={handleChange} />
            </Field>

            <Field label="जात *">
              <input name="breed" required value={formData.breed} onChange={handleChange} />
            </Field>

            <Field label="वय (वर्षे) *">
              <input type="number" name="age" required value={formData.age} onChange={handleChange} />
            </Field>

            <Field label="अपेक्षित किंमत (₹) *">
              <input type="number" name="price" required value={formData.price} onChange={handleChange} />
            </Field>

            <Field label="शर्यत अनुभव">
              <input name="raceExperience" value={formData.raceExperience} onChange={handleChange} />
            </Field>
          </div>
        </section>

        {/* फोटो */}
        <section className="bg-yellow-50 border rounded-xl p-6">
          <h2 className="font-bold mb-2">📸 बैलाचे फोटो *</h2>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          <p className="text-xs text-gray-600 mt-1">किमान 1 फोटो आवश्यक</p>
        </section>

        {/* स्थान */}
        <section className="bg-green-50 border rounded-xl p-6">
          <h2 className="font-bold mb-4">📍 स्थान माहिती</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <Field label="जिल्हा *">
              <select name="district" required value={formData.district} onChange={handleChange}>
                <option value="">जिल्हा निवडा</option>
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>

            <Field label="तालुका">
              <input name="taluka" value={formData.taluka} onChange={handleChange} />
            </Field>

            <Field label="गाव">
              <input name="village" value={formData.village} onChange={handleChange} />
            </Field>
          </div>
        </section>

        {/* संपर्क */}
        <section className="bg-purple-50 border rounded-xl p-6">
          <h2 className="font-bold mb-4">📞 संपर्क माहिती</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="फोन नंबर *">
              <input name="phone" required value={formData.phone} onChange={handleChange} />
            </Field>

            <Field label="WhatsApp नंबर">
              <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
            </Field>
          </div>
        </section>

        {/* वर्णन */}
        <Field label="✍️ बैलाचे वर्णन">
          <textarea rows={4} name="description" value={formData.description} onChange={handleChange} />
        </Field>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.push('/')} className="px-6 py-3 border rounded-xl">
            रद्द करा
          </button>
          <button type="submit" disabled={loading} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold">
            {loading ? 'नोंदवत आहे…' : '✅ बैल नोंदवा'}
          </button>
        </div>

      </form>
      )}
    </div>
  )
}

/* 🔹 Reusable Field Wrapper */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="rounded-xl border px-3 py-2 bg-white">
        {children}
      </div>
    </div>
  )
}
