import type { SupabaseClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function requireStaff(): Promise<{ supabase: SupabaseClient; userId: string }> {
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

  if (profile?.role !== "admin" && profile?.role !== "technician") redirect("/alarms")

  return { supabase, userId: user.id }
}
