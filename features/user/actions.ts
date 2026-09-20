"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { PROFILE_ROLES, type ProfileRole } from "./constants"

export type UserActionResult = { error?: string } | null

async function getActor() {
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

  const role = (profile?.role ?? "viewer") as ProfileRole
  if (role !== "admin" && role !== "superadmin") redirect("/dashboard")

  return { id: user.id, role }
}

export async function updateUserRole(userId: string, role: ProfileRole): Promise<UserActionResult> {
  const actor = await getActor()

  if (!PROFILE_ROLES.includes(role)) return { error: "Select a valid role." }

  if (userId === actor.id) return { error: "You cannot change your own role." }

  const admin = createAdminClient()

  const { data: target, error: fetchError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  if (fetchError) return { error: fetchError.message }
  if (!target) return { error: "User not found." }

  const targetRole = target.role as ProfileRole

  if (actor.role === "admin" && (targetRole === "admin" || targetRole === "superadmin")) {
    return { error: "Only a superadmin can change an admin or superadmin account." }
  }

  if (role === "superadmin" && actor.role !== "superadmin") {
    return { error: "Only a superadmin can assign the superadmin role." }
  }

  const { error } = await admin.from("profiles").update({ role }).eq("id", userId)

  if (error) return { error: error.message }

  redirect("/users")
}
