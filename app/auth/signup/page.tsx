import SignUpForm from '@/components/SignUpForm'
import Navbar from '@/components/Navbar'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:py-16">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-200">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📝</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                नोंदणी करा
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                विक्रेता म्हणून नोंदणी करा
              </p>
            </div>
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  )
}
