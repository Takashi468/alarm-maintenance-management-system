import type { MachineStatus } from "@/features/machine/constants"
import type { AlarmStatus } from "@/features/alarm/constants"
import type { MntStatus } from "@/features/maintenance/constants"

export type BadgeStatus = MachineStatus | AlarmStatus | MntStatus

const STYLES: Record<BadgeStatus, { soft: string; solid: string }> = {
  Running: {
    soft: "bg-green-900/50 text-green-400 border border-green-700",
    solid: "bg-accent-green text-green-950",
  },
  Stop: {
    soft: "bg-gray-800 text-gray-400 border border-gray-600",
    solid: "bg-accent-gray text-gray-950",
  },
  Maintenance: {
    soft: "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
    solid: "bg-accent-yellow text-yellow-950",
  },
  Alarm: {
    soft: "bg-red-900/50 text-red-400 border border-red-700",
    solid: "bg-accent-red text-white",
  },
  Open: {
    soft: "bg-red-900/50 text-red-400 border border-red-700",
    solid: "bg-accent-red text-white",
  },
  "In Progress": {
    soft: "bg-orange-900/50 text-orange-400 border border-orange-700",
    solid: "bg-accent-orange text-white",
  },
  Closed: {
    soft: "bg-gray-800 text-gray-500 border border-gray-600",
    solid: "bg-accent-gray text-gray-950",
  },
  Pending: {
    soft: "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
    solid: "bg-accent-yellow text-yellow-950",
  },
  Done: {
    soft: "bg-green-900/50 text-green-400 border border-green-700",
    solid: "bg-accent-green text-green-950",
  },
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
