import type { MachineStatus } from "@/features/machine/constants"
import type { AlarmStatus } from "@/features/alarm/constants"
import type { MntStatus } from "@/features/maintenance/constants"

export type BadgeStatus = MachineStatus | AlarmStatus | MntStatus

const STYLES: Record<BadgeStatus, { soft: string; solid: string }> = {
  Running: { soft: "bg-green-100 text-green-800", solid: "bg-emerald-400 text-emerald-950" },
  Stop: { soft: "bg-gray-200 text-gray-700", solid: "bg-slate-400 text-slate-950" },
  Maintenance: { soft: "bg-amber-100 text-amber-800", solid: "bg-amber-400 text-amber-950" },
  Alarm: { soft: "bg-red-100 text-red-800", solid: "bg-red-500 text-white" },
  Open: { soft: "bg-red-100 text-red-800", solid: "bg-red-500 text-white" },
  "In Progress": { soft: "bg-blue-100 text-blue-800", solid: "bg-blue-500 text-white" },
  Closed: { soft: "bg-gray-100 text-gray-700", solid: "bg-slate-400 text-slate-950" },
  Pending: { soft: "bg-amber-100 text-amber-800", solid: "bg-amber-400 text-amber-950" },
  Done: { soft: "bg-green-100 text-green-800", solid: "bg-emerald-400 text-emerald-950" },
}

export default function StatusBadge({
  status,
  tone = "soft",
  className,
}: {
  status: BadgeStatus
  tone?: "soft" | "solid"
  className?: string
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status][tone]}${className ? ` ${className}` : ""}`}
    >
      {status}
    </span>
  )
}
