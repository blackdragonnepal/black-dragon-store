import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/external')) {
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.EXTERNAL_SECURE_API_KEY

    if (!apiKey || apiKey !== expectedKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access Denied: Missing or invalid x-api-key header.',
        },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/external/:path*',
}
