import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. ایجاد ریسپانس اولیه
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // 2. دریافت متغیرهای محیطی
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // اگر متغیرها نبودند، ادامه نده (جلوگیری از کرش)
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase Env Vars are missing in Middleware!')
      return response
    }

    // 3. ساخت کلاینت سوپابیس
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
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

    // 4. رفرش کردن سشن کاربر
    await supabase.auth.getUser()

  } catch (e) {
    // اگر هر خطایی پیش آمد، لاگ بگیر ولی نگذار سایت دان شود
    console.error('Middleware execution failed:', e)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}