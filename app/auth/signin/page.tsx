import { Suspense } from 'react'
import SignInForm from '@/components/SignInForm'
import Navbar from '@/components/Navbar'

function SignInFormWrapper() {
  return <SignInForm />
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:py-16">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-200">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔐</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                लॉगिन करा
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                तुमच्या खात्यात प्रवेश करा
              </p>
            </div>
            <Suspense fallback={<div className="text-center py-8">लोड होत आहे...</div>}>
              <SignInFormWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
