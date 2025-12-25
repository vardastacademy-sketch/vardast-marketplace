import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sxbsbpdwubgagvitasvt.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YnNicGR3dWJnYWd2aXRhc3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NjU0MDQsImV4cCI6MjA4MjI0MTQwNH0.86lPaVfHmJgNIjyXZF7-TOlHCmPUDB2qF1xPcOnNFwc";

  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  )
}
