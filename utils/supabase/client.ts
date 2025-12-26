import { createMockClient } from './mock'

export function createClient() {
  console.log("Using Mock Supabase Client")
  return createMockClient()
}
