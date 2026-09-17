import SummaryCard from "./SummaryCard"
import type { DashboardSummary } from "../queries"

function RunningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  )
}

function AlarmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function MaintenanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export default function MachineStatusGrid({ summary }: { summary: DashboardSummary }) {
  return (
    <section aria-label="Machine status">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-text-primary">Machine status</h2>
        <p className="text-sm text-text-secondary">
          {summary.total_machines} registered machine{summary.total_machines === 1 ? "" : "s"}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Running" value={summary.running} tone="green" icon={<RunningIcon />} />
        <SummaryCard label="Stop" value={summary.stop} tone="gray" icon={<StopIcon />} />
        <SummaryCard label="Alarm" value={summary.alarm} tone="red" icon={<AlarmIcon />} />
        <SummaryCard label="Maintenance" value={summary.maintenance} tone="yellow" icon={<MaintenanceIcon />} />
      </div>
    </section>
  )
}
