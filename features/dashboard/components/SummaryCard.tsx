import type { ReactNode } from "react"

const TONES = {
  green: { border: "border-green-800", iconBg: "bg-green-900/50 text-green-400", value: "text-green-400" },
  gray: { border: "border-border-color", iconBg: "bg-bg-tertiary text-gray-400", value: "text-text-primary" },
  red: { border: "border-red-800", iconBg: "bg-red-900/50 text-red-400", value: "text-red-400" },
  yellow: { border: "border-yellow-800", iconBg: "bg-yellow-900/50 text-yellow-400", value: "text-yellow-400" },
  blue: { border: "border-blue-800", iconBg: "bg-blue-900/50 text-accent-blue", value: "text-accent-blue" },
} as const

export type SummaryTone = keyof typeof TONES

interface SummaryCardProps {
  label: string
  value: number | string
  icon?: ReactNode
  tone?: SummaryTone
}

export default function SummaryCard({ label, value, icon, tone = "gray" }: SummaryCardProps) {
  const t = TONES[tone]

  return (
    <div className={`rounded-lg border bg-bg-secondary p-5 ${t.border}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        {icon ? (
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${t.iconBg}`}>{icon}</span>
        ) : null}
      </div>
      <p className={`mt-2 font-mono text-3xl font-bold tabular-nums ${t.value}`}>{value}</p>
    </div>
  )
}
