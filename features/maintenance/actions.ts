"use server"

import { redirect } from "next/navigation"
import { MNT_STATUSES, type MntStatus } from "./constants"
import { requireStaff } from "./guards"

export type MaintenanceFieldKey =
  | "machine_id"
  | "alarm_id"
  | "technician_id"
  | "problem"
  | "action_taken"
  | "maintained_at"
  | "status"

export type MaintenanceActionResult =
  | { error?: string; fieldErrors?: Partial<Record<MaintenanceFieldKey, string>> }
  | null

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : ""
}

interface ParsedFields {
  machine_id: string
  alarm_id: string | null
  technician_id: string | null
  problem: string
  action_taken: string | null
  maintained_at: string
  status: MntStatus | null
  fieldErrors: Partial<Record<MaintenanceFieldKey, string>>
}

function parseFields(formData: FormData): ParsedFields {
  const fieldErrors: Partial<Record<MaintenanceFieldKey, string>> = {}

  const machine_id = asString(formData.get("machine_id"))
  const alarm_id = asString(formData.get("alarm_id")) || null
  const technician_id = asString(formData.get("technician_id")) || null
  const problem = asString(formData.get("problem"))
  const action_taken = asString(formData.get("action_taken")) || null
  const maintained_at = asString(formData.get("maintained_at"))

  if (!machine_id) fieldErrors.machine_id = "Select a machine."
  if (!problem) fieldErrors.problem = "Problem is required."
  if (!DATE_RE.test(maintained_at)) fieldErrors.maintained_at = "Provide the maintenance date (YYYY-MM-DD)."

  const statusRaw = asString(formData.get("status"))
  const status: MntStatus | null = (MNT_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as MntStatus)
    : null
  if (!status) fieldErrors.status = "Select a valid status."

  if (status === "Done" && !action_taken) {
    fieldErrors.action_taken = "Action taken is required when the record is Done."
  }

  return { machine_id, alarm_id, technician_id, problem, action_taken, maintained_at, status, fieldErrors }
}

export async function createMaintenance(formData: FormData): Promise<MaintenanceActionResult> {
  const { supabase } = await requireStaff()

  const fields = parseFields(formData)
  if (Object.keys(fields.fieldErrors).length > 0 || !fields.status) return { fieldErrors: fields.fieldErrors }

  const { data, error } = await supabase
    .from("maintenance_records")
    .insert({
      machine_id: fields.machine_id,
      alarm_id: fields.alarm_id,
      technician_id: fields.technician_id,
      problem: fields.problem,
      action_taken: fields.action_taken,
      maintained_at: fields.maintained_at,
      status: fields.status,
    })
    .select()
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: "You don't have permission to create maintenance records." }

  redirect("/maintenance")
}

export async function updateMaintenance(id: string, formData: FormData): Promise<MaintenanceActionResult> {
  const { supabase } = await requireStaff()

  const fields = parseFields(formData)
  if (Object.keys(fields.fieldErrors).length > 0 || !fields.status) return { fieldErrors: fields.fieldErrors }

  const { data: current, error: fetchError } = await supabase
    .from("maintenance_records")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (fetchError) return { error: fetchError.message }
  if (!current) return { error: "Maintenance record not found." }

  const from = current.status as MntStatus
  const to = fields.status

  if (from !== to) {
    const allowedNext: Record<MntStatus, readonly MntStatus[]> = {
      Pending: ["In Progress"],
      "In Progress": ["Done"],
      Done: [],
    }

    if (!allowedNext[from].includes(to)) {
      return {
        error:
          from === "Pending" && to === "Done"
            ? "Move the record to In Progress before marking it Done."
            : `Cannot change status from ${from} to ${to}. Records only move Pending → In Progress → Done.`,
      }
    }
  }

  const { data, error } = await supabase
    .from("maintenance_records")
    .update({
      machine_id: fields.machine_id,
      alarm_id: fields.alarm_id,
      technician_id: fields.technician_id,
      problem: fields.problem,
      action_taken: fields.action_taken,
      maintained_at: fields.maintained_at,
      status: to,
    })
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: "You don't have permission to update this record." }

  redirect("/maintenance")
}
