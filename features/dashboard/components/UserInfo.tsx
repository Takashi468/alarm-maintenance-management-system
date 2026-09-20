"use client"

import { useProfile, type Profile } from "@/features/auth/profile-context"

const roleStyles: Record<Profile["role"], string> = {
  superadmin: "bg-purple-900/50 text-purple-300 border border-purple-700",
  admin: "bg-red-900/50 text-red-400 border border-red-700",
  technician: "bg-blue-900/50 text-accent-blue border border-blue-700",
  viewer: "bg-gray-800 text-gray-400 border border-gray-600",
}

export default function UserInfo() {
  const profile = useProfile()

  return (
    <div className="rounded-lg border border-border-color bg-bg-secondary p-6">
      <p className="text-sm font-medium text-text-secondary">Signed in as</p>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-base font-semibold text-text-primary">
          {profile.full_name ?? "User"}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleStyles[profile.role] ?? roleStyles.viewer}`}
        >
          {profile.role}
        </span>
      </div>
    </div>
  )
}
