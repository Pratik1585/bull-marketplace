import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import HomeClient from './HomeClient'

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Get only Active bulls, ordered by newest first
  const bulls = await prisma.bull.findMany({
    where: {
      status: {
        equals: 'Active',
      }
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

  return <HomeClient session={session} initialBulls={bulls} />
}