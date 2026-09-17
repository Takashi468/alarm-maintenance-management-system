import { createClient } from "@/lib/supabase/server"
import type { MachineStatus } from "@/features/machine/constants"

export interface DashboardSummary {
  total_machines: number
  running: number
  stop: number
  alarm: number
  maintenance: number
  open_alarms: number
  in_progress_alarms: number
  pending_maintenance: number
  in_progress_maintenance: number
}

async function countMachines(status?: MachineStatus): Promise<number> {
  const supabase = createClient()

  let query = supabase.from("machines").select("*", { count: "exact", head: true }).is("deleted_at", null)

  if (status) {
    query = query.eq("status", status)
  }

  const { count, error } = await query

  if (error) throw new Error(error.message)

  return count ?? 0
}

async function countAlarms(status: string): Promise<number> {
  const supabase = createClient()

  const { count, error } = await supabase
    .from("alarms")
    .select("*, machines!inner(deleted_at)", { count: "exact", head: true })
    .is("machines.deleted_at", null)
    .eq("status", status)

  if (error) throw new Error(error.message)

  return count ?? 0
}

async function countMaintenance(status: string): Promise<number> {
  const supabase = createClient()

  const { count, error } = await supabase
    .from("maintenance_records")
    .select("*, machines!inner(deleted_at)", { count: "exact", head: true })
    .is("machines.deleted_at", null)
    .eq("status", status)

  if (error) throw new Error(error.message)

  return count ?? 0
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [
    total_machines,
    running,
    stop,
    alarm,
    maintenance,
    open_alarms,
    in_progress_alarms,
    pending_maintenance,
    in_progress_maintenance,
  ] = await Promise.all([
    countMachines(),
    countMachines("Running"),
    countMachines("Stop"),
    countMachines("Alarm"),
    countMachines("Maintenance"),
    countAlarms("Open"),
    countAlarms("In Progress"),
    countMaintenance("Pending"),
    countMaintenance("In Progress"),
  ])

  return {
    total_machines,
    running,
    stop,
    alarm,
    maintenance,
    open_alarms,
    in_progress_alarms,
    pending_maintenance,
    in_progress_maintenance,
  }
}

export interface RecentAlarm {
  id: string
  alarm_code: string
  occurred_at: string
  status: "Open" | "In Progress"
  machine_name: string | null
}

export async function getRecentAlarms(limit = 5): Promise<RecentAlarm[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("alarms")
    .select("id, alarm_code, occurred_at, status, machines!inner(machine_id, machine_name)")
    .is("machines.deleted_at", null)
    .in("status", ["Open", "In Progress"])
    .order("occurred_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    alarm_code: row.alarm_code as string,
    occurred_at: row.occurred_at as string,
    status: row.status as "Open" | "In Progress",
    machine_name: ((row.machines as { machine_name?: string } | null)?.machine_name) ?? null,
  }))
}
