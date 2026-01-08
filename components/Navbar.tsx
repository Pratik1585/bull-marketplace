'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <img
              src="https://play-lh.googleusercontent.com/b7srEISEhfRCkNEdCsL1L5bNelK5qHnWSKTp-kTq5TflhKq_G5OY9yfnYL7Ood-aGA"
              alt="महाराष्ट्र बैलगाडा शर्यत बाजार"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow"
            />
            <div className="hidden sm:block">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                महाराष्ट्र बैलगाडा शर्यत बाजार
              </div>
              <div className="text-xs text-gray-500">महाराष्ट्राचा विश्वासार्ह बाजार</div>
            </div>
            <div className="sm:hidden text-lg font-bold text-primary-600">
              बैल बाजार
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {status === 'loading' ? (
              <div className="text-gray-500 text-sm">लोड होत आहे...</div>
            ) : session ? (
              <>
                <Link
                  href="/seller/dashboard"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  माझे बैल
                </Link>
                <Link
                  href="/seller/add"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + नवीन बैल जोडा
                </Link>
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  <span className="text-gray-700 text-sm font-medium">
                    {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-primary-600 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    बाहेर पडा
                  </button>
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2 animate-fadeIn">
            {status === 'loading' ? (
              <div className="text-gray-500 text-sm px-4">लोड होत आहे...</div>
            ) : session ? (
              <>
                <Link
                  href="/seller/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                  माझे बैल
                </Link>
                <Link
                  href="/seller/add"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mx-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 rounded-lg font-semibold text-center"
                >
                  + नवीन बैल जोडा
                </Link>
                <div className="px-4 py-2 border-t border-gray-200 mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    {session.user?.name || session.user?.email}
                  </p>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    बाहेर पडा
                  </button>
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
