"use server"

import { redirect } from "next/navigation"
import { requireAdmin } from "./guards"
import { parseMachineFields, type MachineFieldKey } from "./validation"

export type { MachineFieldKey }

export type MachineActionResult =
  | { error?: string; fieldErrors?: Partial<Record<MachineFieldKey, string>> }
  | null

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
