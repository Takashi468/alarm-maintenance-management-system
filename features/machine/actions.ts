"use server"

import { redirect } from "next/navigation"
import { MACHINE_STATUSES, type MachineStatus } from "./queries"
import { requireAdmin } from "./guards"

export type MachineFieldKey =
  | "machine_id"
  | "machine_name"
  | "machine_type"
  | "location"
  | "status"

export type MachineActionResult =
  | { error?: string; fieldErrors?: Partial<Record<MachineFieldKey, string>> }
  | null

const FIELD_LABELS: Record<Exclude<MachineFieldKey, "status">, string> = {
  machine_id: "Machine ID",
  machine_name: "Machine name",
  machine_type: "Machine type",
  location: "Location",
}

function parseMachineFields(
  formData: FormData
): { values?: Record<Exclude<MachineFieldKey, "status">, string> & { status: MachineStatus }; fieldErrors: Partial<Record<MachineFieldKey, string>> } {
  const fieldErrors: Partial<Record<MachineFieldKey, string>> = {}

  const machine_id = typeof formData.get("machine_id") === "string" ? (formData.get("machine_id") as string).trim() : ""
  const machine_name = typeof formData.get("machine_name") === "string" ? (formData.get("machine_name") as string).trim() : ""
  const machine_type = typeof formData.get("machine_type") === "string" ? (formData.get("machine_type") as string).trim() : ""
  const location = typeof formData.get("location") === "string" ? (formData.get("location") as string).trim() : ""

  if (!machine_id) fieldErrors.machine_id = `${FIELD_LABELS.machine_id} is required.`
  if (!machine_name) fieldErrors.machine_name = `${FIELD_LABELS.machine_name} is required.`
  if (!machine_type) fieldErrors.machine_type = `${FIELD_LABELS.machine_type} is required.`
  if (!location) fieldErrors.location = `${FIELD_LABELS.location} is required.`

  const statusRaw = typeof formData.get("status") === "string" ? (formData.get("status") as string) : ""
  if (!MACHINE_STATUSES.includes(statusRaw as MachineStatus)) {
    fieldErrors.status = "Select a valid status."
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  return {
    values: { machine_id, machine_name, machine_type, location, status: statusRaw as MachineStatus },
    fieldErrors,
  }
}

export async function createMachine(formData: FormData): Promise<MachineActionResult> {
  const supabase = await requireAdmin()

  const parsed = parseMachineFields(formData)
  if (!parsed.values) return { fieldErrors: parsed.fieldErrors }

  const { data, error } = await supabase
    .from("machines")
    .insert(parsed.values)
    .select()
    .maybeSingle()

  if (error) {
    if (error.code === "23505") {
      return { fieldErrors: { machine_id: "Machine ID already exists." } }
    }
    return { error: error.message }
  }

  if (!data) {
    return { error: "You don't have permission to create machines." }
  }

  redirect("/machines")
}

export async function updateMachine(id: string, formData: FormData): Promise<MachineActionResult> {
  const supabase = await requireAdmin()

  const parsed = parseMachineFields(formData)
  if (!parsed.values) return { fieldErrors: parsed.fieldErrors }

  const { data, error } = await supabase
    .from("machines")
    .update({ ...parsed.values, last_updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .maybeSingle()

  if (error) {
    if (error.code === "23505") {
      return { fieldErrors: { machine_id: "Machine ID already exists." } }
    }
    return { error: error.message }
  }

  if (!data) {
    return { error: "Machine not found or you don't have permission to update it." }
  }

  redirect("/machines")
}

export async function deleteMachine(id: string): Promise<MachineActionResult> {
  const supabase = await requireAdmin()

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("machines")
    .update({ deleted_at: now, last_updated_at: now })
    .eq("id", id)
    .is("deleted_at", null)
    .select()

  if (error) return { error: error.message }

  if (!data || data.length === 0) {
    return { error: "Machine not found or you don't have permission to delete it." }
  }

  redirect("/machines")
}
