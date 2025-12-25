import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditBullForm from '@/components/EditBullForm'

export default async function EditBullPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const bull = await prisma.bull.findUnique({
    where: { id: params.id },
  })

  if (!bull) {
    redirect('/seller/dashboard')
  }

  if (bull.ownerId !== session.user.id) {
    redirect('/seller/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            बैल संपादन करा
          </h1>
          <p className="text-gray-600 mb-6">
            बैलाची माहिती अपडेट करा
          </p>
          <EditBullForm bull={bull} />
        </div>
      </div>
    </div>
  )
}

