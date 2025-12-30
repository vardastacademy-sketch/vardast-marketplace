import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Initialize Response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Defensive Env Var Check
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Log warning but do not crash
    console.warn('⚠️ Middleware: Supabase keys missing. Skipping auth.')
    return response
  }

  try {
    // 3. Create Client with Error Handling
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))

            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })

            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // 4. Refresh User Session
    await supabase.auth.getUser()

  } catch (error) {
    console.error('❌ Middleware Error:', error)
    // Return original response if auth fails, keeping the site alive
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
