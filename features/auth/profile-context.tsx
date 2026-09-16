"use client"

import { createContext, useContext } from "react"
import type { Database } from "@/types/database"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

const ProfileContext = createContext<Profile | null>(null)

export function ProfileProvider({
  profile,
  children,
}: {
  profile: Profile
  children: React.ReactNode
}) {
  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>
}

export function useProfile(): Profile {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
