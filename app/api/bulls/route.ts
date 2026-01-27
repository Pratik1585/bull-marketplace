import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 300

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
  videos: z.array(z.string()).optional().default([]),
  raceExperience: z.string().optional(),
})

/* ---------------- GET ---------------- */
export async function GET() {
  try {
    const bulls = await prisma.bull.findMany({
      where: { status: 'Active' },
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bulls, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('GET /api/bulls error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bulls' },
      { status: 500 }
    )
  }
}

/* ---------------- POST ---------------- */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const data = bullSchema.parse(body)

    const bull = await prisma.bull.create({
      data: {
        ...data,
        ownerId: session.user.id,
        status: 'Active',
      },
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(
      { success: true, bull },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/bulls error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create bull' },
      { status: 500 }
    )
  }
}
