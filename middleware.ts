import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Hardcoded fallback values to ensure Edge Runtime has access to keys
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sxbsbpdwubgagvitasvt.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YnNicGR3dWJnYWd2aXRhc3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NjU0MDQsImV4cCI6MjA4MjI0MTQwNH0.86lPaVfHmJgNIjyXZF7-TOlHCmPUDB2qF1xPcOnNFwc";

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // I18n Logic integrated here to keep everything in one Edge-compatible file
    const locales = ['fa', 'en']
    const defaultLocale = 'fa'
    const { pathname } = request.nextUrl

    // 1. Skip if API, static file, or image
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return supabaseResponse
    }

    // 2. Check if path has locale
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) {
      return supabaseResponse
    }

    // 3. Redirect to default locale if missing
    // We reuse the cookies from supabaseResponse to ensure session is preserved
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`
    const redirectResponse = NextResponse.redirect(request.nextUrl)

    // Copy cookies
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })

    return redirectResponse

  } catch (e) {
    // If Supabase client fails (e.g. invalid URL), we still want the app to function
    // just without auth state, so we proceed with a basic response
    console.error("Middleware Supabase Error:", e)
    return NextResponse.next({ request })
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
