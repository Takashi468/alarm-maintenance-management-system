import { createAdminClient } from "@/lib/supabase/admin"
import type { ProfileRole } from "./constants"

export interface UserRow {
  id: string
  email: string | null
  full_name: string | null
  role: ProfileRole
  created_at: string
}

const PAGE_SIZE = 1000
const MAX_PAGES = 10

// auth.users lives in the auth schema (not exposed via PostgREST), so emails are
// fetched through the GoTrue Admin API with the service-role key — server only.
export async function getUsers(): Promise<UserRow[]> {
  const admin = createAdminClient()

  const emailById = new Map<string, string | null>()
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: PAGE_SIZE })
    if (error) throw new Error(error.message)

    for (const u of data.users) emailById.set(u.id, u.email ?? null)
    if (data.users.length < PAGE_SIZE) break
  }

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, full_name, role, created_at")
  if (error) throw new Error(error.message)

  return (profiles ?? [])
    .map((p) => ({
      id: p.id,
      email: emailById.get(p.id) ?? null,
      full_name: p.full_name,
      role: p.role,
      created_at: p.created_at,
    }))
    .sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""))
}
