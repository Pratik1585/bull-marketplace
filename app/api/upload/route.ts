import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    // Ensure content-type is multipart
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files')

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []

    for (const item of files) {
      if (!(item instanceof File)) continue

      const file = item as File

      const allowedImageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ]
      const allowedVideoTypes = [
        'video/mp4',
        'video/webm',
        'video/quicktime',
      ]

      if (
        !allowedImageTypes.includes(file.type) &&
        !allowedVideoTypes.includes(file.type)
      ) {
        continue
      }

      const maxSize = allowedVideoTypes.includes(file.type)
        ? 50 * 1024 * 1024
        : 10 * 1024 * 1024

      if (file.size > maxSize) {
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

      uploadedUrls.push(base64)
    }

    return NextResponse.json(
      { urls: uploadedUrls },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload API Error:', error)
    return NextResponse.json(
      {
        error: 'Upload failed',
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      message: 'Upload API is working',
    },
    { status: 200 }
  )
}
