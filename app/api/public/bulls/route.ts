import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Enable caching for better performance
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 300 // Cache for 5 minutes

const publicBullSchema = z.object({
  name: z.string().min(1),
  breed: z.string().min(1),
  age: z.number().int().positive(),
  price: z.number().positive(),
  district: z.string().min(1),
  taluka: z.string().optional(),
  village: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().min(10),
  whatsapp: z.string().optional(),
  raceExperience: z.string().optional(),
  images: z.array(z.string()).min(1, 'कमीत कमी 1 फोटो आवश्यक आहे'),
  videos: z.array(z.string()).optional().default([]),
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

    return NextResponse.json(bulls, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bulls' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // No authentication required for public bull registration
    const body = await request.json()
    const data = publicBullSchema.parse(body)

    // Find or create a public user for public registrations
    let publicUser = await prisma.user.findFirst({
      where: {
        email: 'public@bullmarket.com'
      }
    })

    if (!publicUser) {
      publicUser = await prisma.user.create({
        data: {
          email: 'public@bullmarket.com',
          name: 'Public User',
          password: 'public_registration_only', // This user can't actually login
        }
      })
    }

    const bull = await prisma.bull.create({
      data: {
        name: data.name,
        breed: data.breed,
        age: data.age,
        price: data.price,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        description: data.description,
        phone: data.phone,
        whatsapp: data.whatsapp,
        raceExperience: data.raceExperience,
        images: data.images,
        videos: data.videos,
        weight: 0, // Default weight for public registrations (since weight is not collected)
        ownerId: publicUser.id,
        status: 'Active', // Public registrations are active by default
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
    console.error('Failed to create bull:', error)
    return NextResponse.json(
      { error: 'Failed to create bull', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
