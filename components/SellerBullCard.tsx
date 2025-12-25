'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SellerBullCardProps {
  bull: {
    id: string
    name: string
    price: number
    district: string
    images: string[]
    status: string
  }
}

export default function SellerBullCard({ bull }: SellerBullCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMarkAsSold = async () => {
    if (!confirm('तुम्हाला खात्री आहे की हा बैल विकला गेला आहे?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/bulls/${bull.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Sold' }),
      })

      if (!response.ok) {
        throw new Error('त्रुटी आली')
      }

      router.refresh()
    } catch (err) {
      setError('त्रुटी आली')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('तुम्हाला खात्री आहे की तुम्हाला हा बैल हटवायचा आहे?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/bulls/${bull.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('त्रुटी आली')
      }

      router.refresh()
    } catch (err) {
      setError('त्रुटी आली')
    } finally {
      setLoading(false)
    }
  }

  const mainImage = bull.images && bull.images.length > 0 ? bull.images[0] : null

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="relative aspect-square bg-gray-100">
        {mainImage ? (
          <img
            src={mainImage}
            alt={bull.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🐂</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          {bull.status === 'Active' ? (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              सक्रिय
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              विकले
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{bull.name}</h3>
        <p className="text-sm text-gray-600 mb-2">📍 {bull.district}</p>
        <p className="text-lg font-bold text-primary-600 mb-4">
          ₹{bull.price.toLocaleString('en-IN')}
        </p>

        {error && (
          <div className="mb-2 text-xs text-red-600">{error}</div>
        )}

        <div className="flex flex-col gap-2">
          <Link
            href={`/bull/${bull.id}`}
            className="text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            पहा
          </Link>
          {bull.status === 'Active' && (
            <>
              <Link
                href={`/seller/edit/${bull.id}`}
                className="text-center text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                संपादन करा
              </Link>
              <button
                onClick={handleMarkAsSold}
                disabled={loading}
                className="text-sm bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'प्रक्रिया...' : 'विकले म्हणून चिन्हांकित करा'}
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'हटवत आहे...' : 'हटवा'}
          </button>
        </div>
      </div>
    </div>
  )
}

