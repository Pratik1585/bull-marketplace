'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import BullCard from '@/components/BullCard'
import BullCardSkeleton from '@/components/BullCardSkeleton'
import Navbar from '@/components/Navbar'

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
  status: string
  createdAt: Date
  updatedAt: Date
  owner: {
    name: string | null
    email: string
  }
}

interface HomePageProps {
  session: any
  initialBulls: Bull[]
}

export default function HomeClient({ session, initialBulls }: HomePageProps) {
  const [bulls, setBulls] = useState<Bull[]>(initialBulls)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  // Fetch bulls on mount if none provided
  useEffect(() => {
    if (initialBulls.length === 0) {
      setLoading(true)
      fetch('/api/public/bulls')
        .then(res => res.json())
        .then(data => {
          setBulls(data.slice(0, 20)) // Limit to 20 for performance
        })
        .catch(error => {
          console.error('Failed to fetch bulls:', error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [initialBulls.length])

  // Filter bulls based on search term (memoized for performance)
  const filteredBulls = useMemo(() => {
    if (!searchTerm.trim()) return bulls
    const trimmedSearch = searchTerm.trim().toLowerCase()
    return bulls.filter(bull =>
      bull.name.trim().toLowerCase().includes(trimmedSearch)
    )
  }, [bulls, searchTerm])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section with Notice */}
        <div className="mb-8 animate-fadeIn">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10 flex items-center gap-4 mb-4">
              <img
                src="https://play-lh.googleusercontent.com/b7srEISEhfRCkNEdCsL1L5bNelK5qHnWSKTp-kTq5TflhKq_G5OY9yfnYL7Ood-aGA"
                alt="Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-lg border-2 border-white/20"
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                महाराष्ट्र बैलगाडा शर्यत बाजार
              </h1>
            </div>
            <p className="text-lg sm:text-xl mb-6 opacity-95">
              महाराष्ट्रातील सर्वोत्तम बैलगाडा शर्यत बैल शोधा
            </p>

            {/* Trust-focused Green CTA Button */}
            <div className="flex justify-center">
              <Link
                href="/register-bull"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-center"
                style={{ height: '54px', lineHeight: '1.2' }}
              >
                + तुमचा बैल विक्रीसाठी नोंदवा
              </Link>
            </div>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              विक्रीसाठी उपलब्ध बैल
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-gray-600 text-sm sm:text-base">
                {filteredBulls.length} बैल उपलब्ध आहेत{searchTerm && ` (${bulls.length} पैकी फिल्टर केलेले)`}
              </p>
              {searchLoading && (
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary-600"></div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="बैलाचे नाव शोधा..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchLoading(true)
                  setSearchTerm(e.target.value)
                  // Brief loading state for UX
                  setTimeout(() => setSearchLoading(false), 200)
                }}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bulls Grid - Flipkart Style */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                <BullCardSkeleton />
              </div>
            ))}
          </div>
        ) : filteredBulls.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            {searchTerm ? (
              <>
                <div className="text-7xl sm:text-8xl mb-6">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  "{searchTerm}" साठी कोणतेही बैल आढळले नाहीत
                </h3>
                <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md mx-auto">
                  दुसरे नाव वापरून पुन्हा प्रयत्न करा किंवा शोध फिल्टर हटवा
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg"
                >
                  सर्व बैल पहा
                </button>
              </>
            ) : (
              <>
                <div className="text-7xl sm:text-8xl mb-6">🐂</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  अजून कोणतेही बैल सूचीबद्ध नाहीत
                </h3>
                <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md mx-auto">
                  पहिला बैल नोंदवा आणि बाजाराला सुरुवात करा
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {filteredBulls.map((bull, index) => (
              <div key={bull.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                <BullCard bull={bull} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
