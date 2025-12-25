import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase Environment Variables in Client Component");
    // Return a dummy client or let it crash with a better error in console
    // Returning standard client might crash internally if url is empty string, but usually checking logs is enough.
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  )
}
