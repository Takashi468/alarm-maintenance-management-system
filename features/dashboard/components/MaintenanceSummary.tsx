import SummaryCard from "./SummaryCard"

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

function ProgressIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

interface MaintenanceSummaryProps {
  pending: number
  inProgress: number
}

export default function MaintenanceSummary({ pending, inProgress }: MaintenanceSummaryProps) {
  return (
    <section aria-label="Maintenance backlog">
      <h2 className="mb-3 text-base font-semibold text-text-primary">Maintenance backlog</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <SummaryCard label="Pending" value={pending} tone="yellow" icon={<ClockIcon />} />
        <SummaryCard label="In Progress" value={inProgress} tone="blue" icon={<ProgressIcon />} />
      </div>
    </section>
  )
}
