import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mark route as dynamic to prevent build-time data collection
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
