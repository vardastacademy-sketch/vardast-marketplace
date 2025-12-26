import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sxbsbpdwubgagvitasvt.supabase.co";
  // Updated key provided by user
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_gIbbqSy_Lyn81h8N9-qOjg_vaS84mh1";

  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  )
}
