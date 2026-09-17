"use client"

import { useState, useTransition } from "react"
import { triggerMachineEvent } from "../actions"
import { SIMULATOR_STATUSES, type SimulatorStatus } from "../constants"
import StatusBadge from "@/components/ui/StatusBadge"
import type { Machine } from "@/features/machine/queries"

const BUTTON_STYLES: Record<SimulatorStatus, string> = {
  Running: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/25 focus:ring-emerald-400",
  Stop: "border-slate-500/60 bg-slate-500/10 text-slate-300 hover:bg-slate-500/25 focus:ring-slate-400",
  Alarm: "border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/25 focus:ring-red-400",
  Maintenance: "border-amber-400/50 bg-amber-400/10 text-amber-300 hover:bg-amber-400/25 focus:ring-amber-300",
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC"
}

export default function MachineCard({ machine }: { machine: Machine }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function trigger(status: SimulatorStatus) {
    if (pending || status === machine.status) return

    setError(null)
    startTransition(async () => {
      const result = await triggerMachineEvent(machine.id, status)
      if (!result) return // success -> server redirected
      setError(result.error ?? null)
    })
  }

  const buttons = SIMULATOR_STATUSES.filter((s) => s !== machine.status)

  return (
    <div className="flex flex-col rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-xs uppercase tracking-wider text-slate-400">{machine.machine_id}</p>
          <h2 className="mt-1 truncate text-lg font-semibold text-white">{machine.machine_name}</h2>
          <p className="truncate text-sm text-slate-400">{machine.location}</p>
        </div>
        <StatusBadge
          status={machine.status}
          tone="solid"
          className={`shrink-0 px-3 py-1 font-bold uppercase tracking-wide${machine.status === "Alarm" ? " animate-pulse" : ""}`}
        />
      </div>

      <div className="mt-4 grid flex-1 grid-cols-3 gap-2">
        {buttons.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => trigger(status)}
            disabled={pending}
            className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-40 ${BUTTON_STYLES[status]}`}
          >
            {status}
          </button>
        ))}
      </div>

      <p className="mt-3 h-5 text-sm" aria-live="polite">
        {pending ? (
          <span className="font-mono text-xs text-slate-400">Sending signal...</span>
        ) : error ? (
          <span role="alert" className="text-red-300">{error}</span>
        ) : null}
      </p>

      <p className="mt-2 border-t border-slate-800 pt-3 font-mono text-xs text-slate-500">
        Last updated: {machine.last_updated_at ? formatDateTime(machine.last_updated_at) : "—"}
      </p>
    </div>
  )
}
