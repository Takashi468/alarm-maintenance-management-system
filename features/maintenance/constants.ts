import type { Database } from "@/types/database"

export type MntStatus = Database["public"]["Enums"]["mnt_status"]

export const MNT_STATUSES: readonly MntStatus[] = ["Pending", "In Progress", "Done"] as const
