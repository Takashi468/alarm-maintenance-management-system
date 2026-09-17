import type { ReactNode } from "react"

const TONES = {
  green: { border: "border-green-200", iconBg: "bg-green-100 text-green-700", value: "text-green-700" },
  gray: { border: "border-gray-300", iconBg: "bg-gray-100 text-gray-600", value: "text-gray-700" },
  red: { border: "border-red-200", iconBg: "bg-red-100 text-red-700", value: "text-red-700" },
  yellow: { border: "border-yellow-300", iconBg: "bg-yellow-100 text-yellow-800", value: "text-yellow-700" },
  blue: { border: "border-blue-200", iconBg: "bg-blue-100 text-blue-700", value: "text-blue-700" },
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
    <div className={`rounded-lg border bg-white p-5 shadow-sm ${t.border}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon ? (
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${t.iconBg}`}>{icon}</span>
        ) : null}
      </div>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${t.value}`}>{value}</p>
    </div>
  )
}
