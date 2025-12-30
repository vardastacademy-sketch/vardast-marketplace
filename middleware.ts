import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const locales = ['fa', 'en']
  const hasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  )

  if (hasLocale) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/fa${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
