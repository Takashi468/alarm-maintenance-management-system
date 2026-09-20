import type { Database } from "@/types/database"

export type ProfileRole = Database["public"]["Enums"]["profile_role"]

export const PROFILE_ROLES: readonly ProfileRole[] = [
  "superadmin",
  "admin",
  "technician",
  "viewer",
] as const
