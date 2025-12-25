import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import BullCard from '@/components/BullCard'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  // Get only Active bulls, ordered by newest first
  const bulls = await prisma.bull.findMany({
    where: {
      status: 'Active'
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

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
            <p className="text-lg sm:text-xl mb-4 opacity-95">
              महाराष्ट्रातील सर्वोत्तम बैलगाडा शर्यत बैल शोधा
            </p>
            
            {/* Login Notice */}
            {!session && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/30 mt-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl sm:text-3xl flex-shrink-0">ℹ️</div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg sm:text-xl mb-1">
                      नवीन बैल जोडण्यासाठी लॉगिन करा
                    </p>
                    <p className="text-sm sm:text-base opacity-90 mb-3">
                      तुमचा बैल विक्रीसाठी सूचीबद्ध करण्यासाठी कृपया प्रथम लॉगिन किंवा नोंदणी करा.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/auth/signin?callbackUrl=/seller/add"
                        className="bg-white text-primary-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        लॉगिन करा
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="bg-primary-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-900 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        नवीन खाते तयार करा
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              विक्रीसाठी उपलब्ध बैल
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {bulls.length} बैल उपलब्ध आहेत
            </p>
          </div>
        </div>

        {/* Bulls Grid - Flipkart Style */}
        {bulls.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-7xl sm:text-8xl mb-6">🐂</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              अजून कोणतेही बैल सूचीबद्ध नाहीत
            </h3>
            <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md mx-auto">
              पहिला बैल जोडा आणि तुमच्या व्यवसायाला सुरुवात करा
            </p>
            {!session && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-md mx-auto">
                <p className="text-blue-800 font-medium text-sm sm:text-base">
                  💡 नोंद: नवीन बैल जोडण्यासाठी प्रथम लॉगिन करा
                </p>
              </div>
            )}
            <Link
              href={session ? "/seller/add" : "/auth/signin?callbackUrl=/seller/add"}
              className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg"
            >
              {session ? "नवीन बैल जोडा" : "लॉगिन करा आणि बैल जोडा"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {bulls.map((bull, index) => (
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
