import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // ۱. ایجاد یک ریسپانس اولیه
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // ۲. ساخت کلاینت سوپابیس
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // ست کردن کوکی روی ریکوئست (برای سرور)
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          
          // آپدیت کردن ریسپانس برای ست کردن کوکی روی مرورگر
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

  // ۳. رفرش کردن سشن کاربر (بسیار مهم)
  // این خط چک می‌کند که توکن کاربر معتبر است یا نه
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    // این پترن باعث می‌شود میدل‌ور روی فایل‌های استاتیک و عکس‌ها اجرا نشود
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
