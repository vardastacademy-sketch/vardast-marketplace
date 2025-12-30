import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

const locales = ['fa', 'en']
const defaultLocale = 'fa'

function getLocale(request: NextRequest) {
  // Simple logic: default to 'fa'
  return defaultLocale
}

export async function middleware(request: NextRequest) {
  try {
    // 1. Update Supabase Session (Auth)
    // We await this, but if it fails, we catch it below to prevent 500 error
    const response = await updateSession(request)

    // 2. Handle i18n
    const { pathname } = request.nextUrl

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    // Avoid redirecting for API, static files, etc.
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return response
    }

    if (pathnameHasLocale) return response

    // Redirect if there is no locale
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`

    // Return the response with the redirect, preserving cookies from updateSession
    // Note: NextResponse.redirect creates a NEW response, so we need to copy cookies if we want to persist session
    const redirectResponse = NextResponse.redirect(request.nextUrl)

    // Copy cookies from the Supabase response to the redirect response
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })

    return redirectResponse

  } catch (e) {
    console.error("Middleware Error:", e);
    // In case of error, just pass the request through to avoid 500
    // We might lose auth session refresh here, but the site will load.
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
