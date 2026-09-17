"use server"

import { redirect } from "next/navigation"
import { ALARM_STATUSES, type AlarmStatus } from "./constants"
import { requireStaff } from "./guards"

export type AlarmFieldKey = "machine_id" | "alarm_code" | "description" | "occurred_at" | "cause"

export type AlarmActionResult =
  | { error?: string; fieldErrors?: Partial<Record<AlarmFieldKey, string>> }
  | null

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : ""
}

export async function createAlarm(formData: FormData): Promise<AlarmActionResult> {
  const { supabase, userId } = await requireStaff()

  const fieldErrors: Partial<Record<AlarmFieldKey, string>> = {}

  const machine_id = asString(formData.get("machine_id"))
  const alarm_code = asString(formData.get("alarm_code"))
  const description = asString(formData.get("description"))
  const occurred_at = asString(formData.get("occurred_at"))

  if (!machine_id) fieldErrors.machine_id = "Select a machine."
  if (!alarm_code) fieldErrors.alarm_code = "Alarm code is required."
  if (!description) fieldErrors.description = "Description is required."
  if (!occurred_at || Number.isNaN(Date.parse(occurred_at))) {
    fieldErrors.occurred_at = "Provide a valid date and time."
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const { data, error } = await supabase
    .from("alarms")
    .insert({ machine_id, alarm_code, description, occurred_at, created_by: userId })
    .select()
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: "You don't have permission to create alarms." }

  redirect("/alarms")
}

export async function updateAlarmStatus(id: string, status: AlarmStatus): Promise<AlarmActionResult> {
  const { supabase } = await requireStaff()

  if (!ALARM_STATUSES.includes(status)) return { error: "Unknown alarm status." }

  const { data: current, error: fetchError } = await supabase
    .from("alarms")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (fetchError) return { error: fetchError.message }
  if (!current) return { error: "Alarm not found." }

  if (current.status !== "Open" || status !== "In Progress") {
    return {
      error:
        current.status === "Closed"
          ? "Closed alarms cannot be changed."
          : "Alarms can only move from Open to In Progress. Use Close once work is done.",
    }
  }

  const { data, error } = await supabase
    .from("alarms")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: "You don't have permission to update this alarm." }

  redirect("/alarms")
}

export async function closeAlarm(id: string, cause: string): Promise<AlarmActionResult> {
  const { supabase, userId } = await requireStaff()

  const trimmed = typeof cause === "string" ? cause.trim() : ""
  if (!trimmed) return { fieldErrors: { cause: "Cause is required to close an alarm." } }

  const { data: current, error: fetchError } = await supabase
    .from("alarms")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (fetchError) return { error: fetchError.message }
  if (!current) return { error: "Alarm not found." }

  if (current.status === "Closed") return { error: "This alarm is already closed and cannot be changed." }
  if (current.status !== "In Progress") {
    return { error: "Move the alarm to In Progress before closing it." }
  }

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("alarms")
    .update({ status: "Closed", cause: trimmed, closed_by: userId, closed_at: now })
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: "You don't have permission to close this alarm." }

  redirect("/alarms")
}
