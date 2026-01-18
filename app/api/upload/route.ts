import { NextResponse } from 'next/server'

// TODO: Implement proper cloud storage (AWS S3, Cloudinary, Vercel Blob, etc.)
// For now, this endpoint accepts files and returns them as base64 data URLs
// In production, upload to cloud storage and return URLs

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      // Validate file type
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']

      if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
        continue // Skip invalid files
      }

      // Check file size (50MB for videos, 10MB for images)
      const maxSize = allowedVideoTypes.includes(file.type) ? 50 * 1024 * 1024 : 10 * 1024 * 1024
      if (file.size > maxSize) {
        continue // Skip oversized files
      }

      // Convert to base64 (temporary solution)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
      uploadedUrls.push(base64)
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'File upload endpoint - implement cloud storage integration',
    todo: 'Replace base64 with cloud storage (AWS S3, Cloudinary, etc.)'
  })
}



