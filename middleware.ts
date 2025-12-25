import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    // Check for environment variables, fallback to hardcoded values (Debugging)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sxbsbpdwubgagvitasvt.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YnNicGR3dWJnYWd2aXRhc3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NjU0MDQsImV4cCI6MjA4MjI0MTQwNH0.86lPaVfHmJgNIjyXZF7-TOlHCmPUDB2qF1xPcOnNFwc";

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase environment variables are missing in middleware.");
      return supabaseResponse;
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
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

    // IMPORTANT: DO NOT REMOVE auth.getUser()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (
      !user &&
      !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/auth')
    ) {
      // no user, potentially respond by redirecting the user to the login page
    }

    return supabaseResponse
  } catch (e) {
    // Catch all errors to ensure the app never crashes with 500 in Middleware
    console.error("Middleware error:", e);
    return NextResponse.next({
      request,
    });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
