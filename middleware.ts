import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware is now purely for i18n routing and basic headers
// Auth logic has been moved to Layouts/Server Components to avoid Edge Runtime crashes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locales = ['fa', 'en']
  const defaultLocale = 'fa'

  // 1. Skip if API, static file, or image
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. Check if path has locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // 3. Redirect to default locale if missing
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
