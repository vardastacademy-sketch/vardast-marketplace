import { createMockClient } from './mock'

export async function createClient() {
  console.log("Using Mock Supabase Server Client")
  return createMockClient()
}
