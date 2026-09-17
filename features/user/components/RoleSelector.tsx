"use client"

import { useState, useTransition } from "react"
import type { UserActionResult } from "../actions"
import { PROFILE_ROLES, type ProfileRole } from "../constants"

export default function RoleSelector({
  userId,
  userLabel,
  role,
  onUpdate,
}: {
  userId: string
  userLabel: string
  role: ProfileRole
  onUpdate: (role: ProfileRole) => Promise<UserActionResult>
}) {
  const [selected, setSelected] = useState<ProfileRole>(role)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function submit() {
    if (pending || selected === role) return

    startTransition(async () => {
      const result = await onUpdate(selected)
      if (!result) return // success -> server redirected
      setError(result.error ?? null)
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-end gap-2">
        <select
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value as ProfileRole)
            if (error) setError(null)
          }}
          disabled={pending}
          aria-label={`Role for ${userLabel}`}
          className="rounded-md border border-border-color bg-bg-tertiary text-sm text-text-primary focus:border-accent-blue focus:ring-accent-blue disabled:opacity-60"
        >
          {PROFILE_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={submit}
          disabled={pending || selected === role}
          className="rounded-md border border-border-color bg-bg-tertiary px-3 py-1.5 text-sm font-medium text-text-primary hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Update"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-right text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
