"use client"

import { useProfile, type Profile } from "@/features/auth/profile-context"

const roleStyles: Record<Profile["role"], string> = {
  admin: "bg-purple-100 text-purple-800",
  technician: "bg-blue-100 text-blue-800",
  viewer: "bg-gray-100 text-gray-800",
}

export default function UserInfo() {
  const profile = useProfile()

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">Signed in as</p>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-base font-semibold text-gray-900">
          {profile.full_name ?? "User"}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[profile.role] ?? roleStyles.viewer}`}
        >
          {profile.role}
        </span>
      </div>
    </div>
  )
}
