"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SIMULATOR_STATUSES, type SimulatorStatus } from "./constants"

export type SimulatorActionResult = { error?: string } | null

const ALARM_PRESETS = [
  { code: "ALM-001", description: "Motor overload detected" },
  { code: "ALM-002", description: "Temperature sensor out of range" },
  { code: "ALM-003", description: "Pressure too high" },
  { code: "ALM-004", description: "Emergency stop activated" },
  { code: "ALM-005", description: "Vibration abnormal" },
] as const

export async function triggerMachineEvent(
  machineId: string,
  newStatus: SimulatorStatus
): Promise<SimulatorActionResult> {
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

  if (!SIMULATOR_STATUSES.includes(newStatus)) return { error: "Unknown machine status." }

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("machines")
    .update({ status: newStatus, last_updated_at: now })
    .eq("id", machineId)
    .is("deleted_at", null)
    .select()
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: "Machine not found." }

  if (newStatus === "Alarm") {
    const { data: openAlarms, error: checkError } = await supabase
      .from("alarms")
      .select("id")
      .eq("machine_id", machineId)
      .eq("status", "Open")
      .limit(1)

    if (checkError) return { error: checkError.message }

    if (!openAlarms || openAlarms.length === 0) {
      const preset = ALARM_PRESETS[Math.floor(Math.random() * ALARM_PRESETS.length)]

      const { error: insertError } = await supabase.from("alarms").insert({
        machine_id: machineId,
        alarm_code: preset.code,
        description: preset.description,
        status: "Open",
        occurred_at: now,
        created_by: user.id,
      })

      if (insertError) return { error: insertError.message }
    }
  }

  revalidatePath("/simulator")
  revalidatePath("/dashboard")
  revalidatePath("/alarms")

  redirect("/simulator")
}
