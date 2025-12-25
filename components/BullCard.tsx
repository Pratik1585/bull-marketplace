import Link from 'next/link'

interface BullCardProps {
  bull: {
    id: string
    name: string
    breed: string
    age: number
    weight: number
    price: number
    district: string
    images: string[]
    status: string
    raceExperience?: string | null
  }
}

export default function BullCard({ bull }: BullCardProps) {
  const mainImage = bull.images && bull.images.length > 0 ? bull.images[0] : null
  
  return (
    <Link href={`/bull/${bull.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer group transform hover:-translate-y-1">
        {/* Square Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage}
              alt={bull.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-6xl sm:text-7xl opacity-60">🐂</span>
            </div>
          )}
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2 z-10">
            {bull.status === 'Active' ? (
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                सक्रिय
              </span>
            ) : (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                विकले
              </span>
            )}
          </div>

          {/* Race Experience Badge */}
          {bull.raceExperience && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                🏆 शर्यत
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-3 sm:p-4">
          {/* Bull Name */}
          <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-1 text-sm sm:text-base group-hover:text-primary-600 transition-colors">
            {bull.name}
          </h3>
          
          {/* District */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-primary-600">📍</span>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              {bull.district}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-500 block mb-0.5">किंमत</span>
              <span className="text-lg sm:text-xl font-bold text-primary-600">
                ₹{bull.price.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-primary-600 group-hover:translate-x-1 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
