import { NextResponse } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
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

      if (!allowedImageTypes.includes(file.type)) {
        continue
      }

      const buffer = Buffer.from(await file.arrayBuffer())

      // 🔥 AUTO COMPRESS (NO SIZE LIMIT)
      const compressed = await sharp(buffer)
        .resize({ width: 1200 }) // limit width only
        .jpeg({ quality: 70 })
        .toBuffer()

      const base64 = `data:image/jpeg;base64,${compressed.toString(
        'base64'
      )}`

      uploadedUrls.push(base64)
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid images uploaded' },
        { status: 400 }
      )
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
