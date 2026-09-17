import type { Database } from "@/types/database"

export type AlarmStatus = Database["public"]["Enums"]["alarm_status"]

export const ALARM_STATUSES: readonly AlarmStatus[] = ["Open", "In Progress", "Closed"] as const
