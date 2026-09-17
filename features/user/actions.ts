"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { PROFILE_ROLES, type ProfileRole } from "./constants"

export type UserActionResult = { error?: string } | null

async function requireAdmin() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") redirect("/dashboard")
}

export async function updateUserRole(userId: string, role: ProfileRole): Promise<UserActionResult> {
  await requireAdmin()

  if (!PROFILE_ROLES.includes(role)) return { error: "Select a valid role." }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select()
    .maybeSingle()

  if (error) return { error: error.message }

  if (!data) {
    return { error: "User not found." }
  }

  redirect("/users")
}
