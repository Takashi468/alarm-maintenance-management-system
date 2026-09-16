"use client"

import { useTransition } from "react"
import type { MachineActionResult } from "../actions"

export default function DeleteMachineButton({
  action,
  machineId,
}: {
  action: () => Promise<MachineActionResult>
  machineId: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Delete machine "${machineId}"? This cannot be undone.`)) {
          return
        }
        startTransition(async () => {
          await action()
        })
      }}
      className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  )
}
