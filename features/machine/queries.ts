import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"
import { MACHINE_STATUSES, type MachineStatus } from "./constants"

export type Machine = Database["public"]["Tables"]["machines"]["Row"]
export type { MachineStatus }
export { MACHINE_STATUSES }

export interface MachineFilters {
  status?: string
  search?: string
}

export async function getMachines(filters?: MachineFilters): Promise<Machine[]> {
  const supabase = createClient()

  let query = supabase
    .from("machines")
    .select("*")
    .is("deleted_at", null)
    .order("machine_id", { ascending: true })

  if (filters?.status && MACHINE_STATUSES.includes(filters.status as MachineStatus)) {
    query = query.eq("status", filters.status)
  }

  const search = filters?.search?.trim()
  if (search) {
    query = query.or(`machine_id.ilike.%${search}%,machine_name.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function getMachineById(id: string): Promise<Machine | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("machines")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
