import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // ۱. ساخت ریسپانس اولیه
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // ۲. چک کردن دستی متغیرهای محیطی برای جلوگیری از کرش
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase Env Variables are missing in Middleware!')
      // اگر متغیرها نبودند، فقط ریسپانس معمولی را برمی‌گرداند تا سایت بالا بیاید
      return response 
    }

    // ۳. تلاش برای ساخت کلاینت و رفرش سشن
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

    await supabase.auth.getUser()

  } catch (e) {
    // ۴. اگر هر خطایی رخ داد، آن را در کنسول سرور چاپ کن ولی سایت را متوقف نکن
    console.error('Middleware Error:', e)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
