import type { RecentAlarm } from "../queries"

const STATUS_STYLES: Record<RecentAlarm["status"], string> = {
  Open: "bg-red-900/50 text-red-400 border border-red-700",
  "In Progress": "bg-orange-900/50 text-orange-400 border border-orange-700",
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC"
}

export default function RecentAlarmTable({ alarms }: { alarms: RecentAlarm[] }) {
  if (alarms.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border-color bg-bg-secondary p-10 text-center">
        <p className="text-sm text-text-secondary">No Open or In Progress alarms.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-color bg-bg-secondary">
      <table className="min-w-full divide-y divide-border-color text-sm">
        <thead className="bg-bg-tertiary text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <tr>
            <th scope="col" className="px-4 py-3">Occurred</th>
            <th scope="col" className="px-4 py-3">Machine</th>
            <th scope="col" className="px-4 py-3">Code</th>
            <th scope="col" className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {alarms.map((alarm) => (
            <tr key={alarm.id} className="hover:bg-bg-tertiary/50">
              <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{formatDateTime(alarm.occurred_at)}</td>
              <td className="px-4 py-3 font-medium text-text-primary">{alarm.machine_name ?? "Unknown machine"}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-text-primary">{alarm.alarm_code}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[alarm.status]}`}>
                  {alarm.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
