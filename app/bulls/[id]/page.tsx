import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div>
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              {bull.images && bull.images.length > 0 ? (
                <img
                  src={bull.images[0]}
                  alt={bull.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-9xl">🐂</span>
              )}
            </div>
            {bull.images && bull.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {bull.images.slice(1, 5).map((image, idx) => (
                  <div key={idx} className="h-20 bg-gray-200 rounded overflow-hidden">
                    <img
                      src={image}
                      alt={`${bull.name} ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{bull.name}</h1>
            <div className="text-3xl font-bold text-primary-600 mb-6">
              ${bull.price.toLocaleString()}
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="font-semibold text-gray-700">Breed:</span>
                <span className="ml-2 text-gray-900">{bull.breed}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Age:</span>
                <span className="ml-2 text-gray-900">{bull.age} years</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Weight:</span>
                <span className="ml-2 text-gray-900">{bull.weight} kg</span>
              </div>
              {bull.location && (
                <div>
                  <span className="font-semibold text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-900">{bull.location}</span>
                </div>
              )}
              <div>
                <span className="font-semibold text-gray-700">Listed by:</span>
                <span className="ml-2 text-gray-900">
                  {bull.owner.name || bull.owner.email}
                </span>
              </div>
              {bull.contactInfo && (
                <div>
                  <span className="font-semibold text-gray-700">Contact:</span>
                  <span className="ml-2 text-gray-900">{bull.contactInfo}</span>
                </div>
              )}
            </div>

            {bull.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700">{bull.description}</p>
              </div>
            )}
          </div>
        </div>

        {(bull.healthInfo || bull.pedigree || bull.vaccination) && (
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bull.healthInfo && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Health Information</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{bull.healthInfo}</p>
                </div>
              )}
              {bull.pedigree && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pedigree</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{bull.pedigree}</p>
                </div>
              )}
              {bull.vaccination && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vaccination Records</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{bull.vaccination}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

