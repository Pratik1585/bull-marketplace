import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bullSchema = z.object({
  name: z.string().min(1),
  breed: z.string().min(1),
  age: z.number().int().positive(),
  weight: z.number().positive(),
  price: z.number().positive(),
  district: z.string().min(1),
  taluka: z.string().optional(),
  village: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().min(10),
  whatsapp: z.string().optional(),
  images: z.array(z.string()).min(1),
  videoUrl: z.string().url().optional().or(z.literal('')),
  raceExperience: z.string().optional(),
})

export async function GET() {
  try {
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

    return NextResponse.json(bulls)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bulls' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = bullSchema.parse({
      ...body,
      videoUrl: body.videoUrl || undefined,
    })

    const bull = await prisma.bull.create({
      data: {
        ...data,
        ownerId: session.user.id,
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
    })

    return NextResponse.json(bull, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create bull' },
      { status: 500 }
    )
  }
}
