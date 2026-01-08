import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import HomeClient from './HomeClient'

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Get only Active bulls, ordered by newest first (limit to 20 for performance)
  const bulls = await prisma.bull.findMany({
    where: {
      status: 'Active',
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
    take: 20, // Limit to 20 bulls for better performance
  })

  return <HomeClient session={session} initialBulls={bulls} />
}