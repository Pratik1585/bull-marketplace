import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SellerBullCard from '@/components/SellerBullCard'

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const bulls = await prisma.bull.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            माझे बैल
          </h1>
          <p className="text-gray-600">
            तुमच्या सर्व बैलांची व्यवस्थापना करा
          </p>
        </div>

        {bulls.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🐂</div>
            <p className="text-gray-600 text-lg mb-4">
              तुम्ही अजून कोणतेही बैल जोडलेले नाहीत.
            </p>
            <a
              href="/seller/add"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              पहिला बैल जोडा
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bulls.map((bull) => (
              <SellerBullCard key={bull.id} bull={bull} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

