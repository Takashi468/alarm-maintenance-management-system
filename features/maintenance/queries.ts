import { createClient } from "@/lib/supabase/server"
import type { MntStatus } from "./constants"

export interface MaintenanceWithRelations {
  id: string
  machine_id: string
  alarm_id: string | null
  technician_id: string | null
  problem: string
  action_taken: string | null
  maintained_at: string
  status: MntStatus
  created_at: string
  machines?: { machine_id: string; machine_name: string } | null
  profiles?: { full_name: string | null } | null
}

export interface MaintenanceFilters {
  machine_id?: string
  status?: string
}

const SELECT = "*, machines(machine_id, machine_name), profiles!technician_id(full_name)"

export async function getMaintenanceRecords(filters?: MaintenanceFilters): Promise<MaintenanceWithRelations[]> {
  const supabase = createClient()

  let query = supabase.from("maintenance_records").select(SELECT).order("created_at", { ascending: false })

  if (filters?.machine_id) {
    query = query.eq("machine_id", filters.machine_id)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return (data ?? []) as unknown as MaintenanceWithRelations[]
}

export async function getMaintenanceById(id: string): Promise<MaintenanceWithRelations | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("maintenance_records").select(SELECT).eq("id", id).maybeSingle()

  if (error) throw new Error(error.message)

  return (data as unknown as MaintenanceWithRelations | null) ?? null
}

export interface MachineOption {
  id: string
  machine_id: string
  machine_name: string
}

export interface TechnicianOption {
  id: string
  full_name: string | null
}

export interface AlarmOption {
  id: string
  alarm_code: string
  description: string
  status: string
  machines?: { machine_id: string } | null
}

export async function getMachineOptions(): Promise<MachineOption[]> {
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

export async function getTechnicianOptions(): Promise<TechnicianOption[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "technician")
    .order("full_name", { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({ id: row.id as string, full_name: (row.full_name as string | null) ?? null }))
}

export async function getOpenAlarmOptions(includeId?: string): Promise<AlarmOption[]> {
  const supabase = createClient()

  let query = supabase
    .from("alarms")
    .select("id, alarm_code, description, status, machines(machine_id)")
    .order("occurred_at", { ascending: false })
    .limit(100)

  if (includeId) {
    // keep the record's linked alarm selectable even after it was closed
    query = query.or(`status.in.(Open,In Progress),id.eq.${includeId}`)
  } else {
    query = query.in("status", ["Open", "In Progress"])
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return (data ?? []) as unknown as AlarmOption[]
}
