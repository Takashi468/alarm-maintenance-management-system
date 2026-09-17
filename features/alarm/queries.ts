import { createClient } from "@/lib/supabase/server"
import type { AlarmStatus } from "./constants"

export interface MachineOption {
  id: string
  machine_id: string
  machine_name: string
}

export interface AlarmWithRelations {
  id: string
  machine_id: string
  alarm_code: string
  description: string
  cause: string | null
  occurred_at: string
  status: AlarmStatus
  created_by: string | null
  closed_by: string | null
  closed_at: string | null
  machines?: { machine_id: string; machine_name: string } | null
  profiles?: { full_name: string | null } | null
}

export interface AlarmFilters {
  machine_id?: string
  status?: string
  date_from?: string
  date_to?: string
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function getActiveMachines(): Promise<MachineOption[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("machines")
    .select("id, machine_id, machine_name")
    .is("deleted_at", null)
    .order("machine_id", { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    machine_id: row.machine_id as string,
    machine_name: row.machine_name as string,
  }))
}

export async function getAlarms(filters?: AlarmFilters): Promise<AlarmWithRelations[]> {
  const supabase = createClient()

  let query = supabase
    .from("alarms")
    .select("*, machines!inner(machine_id, machine_name), profiles!closed_by(full_name)")
    .is("machines.deleted_at", null)
    .order("occurred_at", { ascending: false })

  if (filters?.machine_id) {
    query = query.eq("machine_id", filters.machine_id)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.date_from && DATE_RE.test(filters.date_from)) {
    query = query.gte("occurred_at", `${filters.date_from}T00:00:00+00:00`)
  }

  if (filters?.date_to && DATE_RE.test(filters.date_to)) {
    query = query.lte("occurred_at", `${filters.date_to}T23:59:59.999+00:00`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return (data ?? []) as unknown as AlarmWithRelations[]
}

export async function getAlarmById(id: string): Promise<AlarmWithRelations | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("alarms")
    .select("*, machines(machine_id, machine_name), profiles!closed_by(full_name)")
    .eq("id", id)
    .maybeSingle()

  if (error) throw new Error(error.message)

  return (data as unknown as AlarmWithRelations | null) ?? null
}
