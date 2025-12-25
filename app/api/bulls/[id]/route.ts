import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const bull = await prisma.bull.findUnique({
      where: { id: params.id },
    })

    if (!bull) {
      return NextResponse.json(
        { error: 'Bull not found' },
        { status: 404 }
      )
    }

    if (bull.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const updatedBull = await prisma.bull.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updatedBull)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update bull' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bull = await prisma.bull.findUnique({
      where: { id: params.id },
    })

    if (!bull) {
      return NextResponse.json(
        { error: 'Bull not found' },
        { status: 404 }
      )
    }

    if (bull.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.bull.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete bull' },
      { status: 500 }
    )
  }
}

