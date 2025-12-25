import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AddBullForm from '@/components/AddBullForm'

export default async function SellerAddBullPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/seller/add')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            नवीन बैल जोडा
          </h1>
          <p className="text-gray-600 mb-6">
            तुमचा बैल विक्रीसाठी सूचीबद्ध करा
          </p>
          <AddBullForm />
        </div>
      </div>
    </div>
  )
}

