import type { Database } from "@/types/database"

export type MachineStatus = Database["public"]["Enums"]["machine_status"]

export const MACHINE_STATUSES: readonly MachineStatus[] = [
  "Running",
  "Stop",
  "Maintenance",
  "Alarm",
] as const
