"use client"

import { useEffect, useState, useTransition } from "react"
import { triggerMachineEvent } from "../actions"
import type { SimulatorStatus } from "../constants"
import type { Machine } from "@/features/machine/queries"

const STATUS_TEXT_STYLES: Record<SimulatorStatus, string> = {
  Running: "text-green-400",
  Stop: "text-gray-500",
  Alarm: "text-red-400",
  Maintenance: "text-yellow-400",
}

type ButtonColor = "green" | "red" | "black" | "alarm"

const BUTTON_CONFIG: Record<SimulatorStatus, { label: string; color: ButtonColor }> = {
  Running: { label: "RUN", color: "green" },
  Stop: { label: "STOP", color: "red" },
  Maintenance: { label: "MNT", color: "black" },
  Alarm: { label: "ALARM", color: "alarm" },
}

const LIT_STYLES: Record<ButtonColor, string> = {
  green: "bg-[radial-gradient(circle_at_35%_30%,#86efac,#16a34a_60%,#14532d)] shadow-[0_0_16px_4px_rgba(34,197,94,0.7),inset_0_2px_3px_rgba(255,255,255,0.5)] text-green-950",
  red: "bg-[radial-gradient(circle_at_35%_30%,#fca5a5,#dc2626_60%,#7f1d1d)] shadow-[0_0_16px_4px_rgba(239,68,68,0.7),inset_0_2px_3px_rgba(255,255,255,0.5)] text-red-950",
  black: "bg-[radial-gradient(circle_at_35%_30%,#6b7280,#374151_60%,#111827)] shadow-[0_0_12px_3px_rgba(107,114,128,0.6),inset_0_2px_3px_rgba(255,255,255,0.4)] text-gray-100",
  alarm: "bg-[radial-gradient(circle_at_35%_30%,#fca5a5,#dc2626_55%,#7f1d1d)] shadow-[0_0_22px_6px_rgba(239,68,68,0.85),inset_0_2px_3px_rgba(255,255,255,0.5)] text-red-950 animate-pulse",
}

const UNLIT_STYLES: Record<ButtonColor, string> = {
  green: "bg-[radial-gradient(circle_at_35%_30%,#4b5563,#374151_60%,#1f2937)] text-gray-500",
  red: "bg-[radial-gradient(circle_at_35%_30%,#4b5563,#374151_60%,#1f2937)] text-gray-500",
  black: "bg-[radial-gradient(circle_at_35%_30%,#4b5563,#374151_60%,#1f2937)] text-gray-500",
  alarm: "bg-[radial-gradient(circle_at_35%_30%,#4b5563,#374151_60%,#1f2937)] text-gray-500",
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC"
}

function PanelButton({
  status,
  isCurrent,
  disabled,
  onClick,
  big = false,
}: {
  status: SimulatorStatus
  isCurrent: boolean
  disabled: boolean
  onClick: () => void
  big?: boolean
}) {
  const cfg = BUTTON_CONFIG[status]
  const size = big ? "h-14 w-14" : "h-11 w-11"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isCurrent}
      title={status}
      className={`flex ${size} shrink-0 items-center justify-center rounded-full border-2 border-neutral-600/80 font-mono text-[9px] font-bold tracking-tighter transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#dcd8ca] focus-visible:ring-cyan-500 disabled:cursor-not-allowed ${
        isCurrent ? LIT_STYLES[cfg.color] : `${UNLIT_STYLES[cfg.color]} hover:brightness-125 active:translate-y-px`
      }`}
    >
      {cfg.label}
    </button>
  )
}

export default function MachineCard({ machine }: { machine: Machine }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    setFlash(true)
    const id = setTimeout(() => setFlash(false), 400)
    return () => clearTimeout(id)
  }, [machine.status])

  function trigger(status: SimulatorStatus) {
    if (pending || status === machine.status) return

    setError(null)
    startTransition(async () => {
      const result = await triggerMachineEvent(machine.id, status)
      if (!result) return // success -> server redirected
      setError(result.error ?? null)
    })
  }

  return (
    <div className="relative flex w-full max-w-[300px] flex-col rounded-lg border-2 border-neutral-400/80 bg-[#dcd8ca] p-4 shadow-[0_4px_10px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.6)]">
      {pending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-green-500" />
        </div>
      )}

      {/* mounting screws */}
      <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-neutral-500 shadow-inner" />
      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-neutral-500 shadow-inner" />
      <span className="absolute bottom-2 left-2 h-2 w-2 rounded-full bg-neutral-500 shadow-inner" />
      <span className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-neutral-500 shadow-inner" />

      {/* HMI screen */}
      <div className="rounded border-4 border-neutral-800 bg-[#050f0a] px-3 py-3 font-mono shadow-inner">
        <p className={`truncate text-sm font-semibold ${flash ? "status-flash" : ""} text-green-400`}>
          {machine.machine_id}
        </p>
        <p className="truncate text-[11px] text-green-700">{machine.location}</p>
        <p className={`mt-2 text-lg font-bold uppercase tracking-widest ${STATUS_TEXT_STYLES[machine.status]}`}>
          {machine.status}
        </p>
        <p className="mt-1 text-[10px] text-green-800">
          {machine.last_updated_at ? formatDateTime(machine.last_updated_at) : "—"}
        </p>
      </div>

      {/* control section */}
      <div className="mt-4 flex flex-col gap-3">
        <div>
          <p className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-neutral-600">I/O Test</p>
          <div className="flex justify-center gap-4">
            <PanelButton
              status="Running"
              isCurrent={machine.status === "Running"}
              disabled={pending}
              onClick={() => trigger("Running")}
            />
            <PanelButton
              status="Stop"
              isCurrent={machine.status === "Stop"}
              disabled={pending}
              onClick={() => trigger("Stop")}
            />
          </div>
        </div>

        <div className="border-t border-dashed border-neutral-400/70 pt-3">
          <p className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-neutral-600">Function Test</p>
          <div className="flex items-center justify-center gap-4">
            <PanelButton
              status="Maintenance"
              isCurrent={machine.status === "Maintenance"}
              disabled={pending}
              onClick={() => trigger("Maintenance")}
            />
            <PanelButton
              status="Alarm"
              isCurrent={machine.status === "Alarm"}
              disabled={pending}
              onClick={() => trigger("Alarm")}
              big
            />
          </div>
        </div>
      </div>

      <p className="mt-2 h-4 text-center text-[11px]" aria-live="polite">
        {error ? (
          <span role="alert" className="text-red-600">{error}</span>
        ) : null}
      </p>
    </div>
  )
}
