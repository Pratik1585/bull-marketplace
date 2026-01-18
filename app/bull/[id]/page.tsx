import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InstagramCarousel from '@/components/InstagramCarousel'
import Navbar from '@/components/Navbar'

export default async function BullDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const bull = await prisma.bull.findUnique({
    where: { id: params.id },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!bull) {
    notFound()
  }

  const whatsappNumber = bull.whatsapp || bull.phone
  const whatsappMessage = encodeURIComponent(
    `नमस्कार, मला ${bull.name} बैलाबद्दल अधिक माहिती हवी आहे.`
  )
  const whatsappUrl = `https://wa.me/91${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Image and Video Gallery */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6">
            <InstagramCarousel
              images={bull.images}
              videos={bull.videos}
              bullName={bull.name}
            />
          </div>

          {/* Product Details */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Title and Price */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {bull.name}
                </h1>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                  bull.status === 'Active' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                }`}>
                  {bull.status === 'Active' ? 'सक्रिय' : 'विकले'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">किंमत</span>
                  <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    ₹{bull.price.toLocaleString('en-IN')}
                  </span>
                </div>
                {bull.raceExperience && (
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                    <span>🏆</span>
                    <span>{bull.raceExperience}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location and Bull Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 sm:p-6 border border-blue-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  स्थान माहिती
                </h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold min-w-[80px]">जिल्हा:</span>
                    <span className="text-gray-800">{bull.district}</span>
                  </div>
                  {bull.taluka && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold min-w-[80px]">तालुका:</span>
                      <span className="text-gray-800">{bull.taluka}</span>
                    </div>
                  )}
                  {bull.village && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold min-w-[80px]">गाव:</span>
                      <span className="text-gray-800">{bull.village}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 sm:p-6 border border-green-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🐂</span>
                  बैल माहिती
                </h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold min-w-[80px]">जात:</span>
                    <span className="text-gray-800">{bull.breed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold min-w-[80px]">वय:</span>
                    <span className="text-gray-800">{bull.age} वर्षे</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold min-w-[80px]">वजन:</span>
                    <span className="text-gray-800">{bull.weight} किलो</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {bull.description && (
              <div className="mb-8 bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  वर्णन
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {bull.description}
                </p>
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 sm:p-8 border-2 border-primary-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">📞</span>
                संपर्क करा
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${bull.phone}`}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center flex items-center justify-center gap-2"
                >
                  <span className="text-xl">📞</span>
                  <span>फोन करा: {bull.phone}</span>
                </a>
                {bull.whatsapp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">💬</span>
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
