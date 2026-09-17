import type { RecentAlarm } from "../queries"

const STATUS_STYLES: Record<RecentAlarm["status"], string> = {
  Open: "bg-red-100 text-red-800",
  "In Progress": "bg-blue-100 text-blue-800",
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC"
}

export default function RecentAlarmTable({ alarms }: { alarms: RecentAlarm[] }) {
  if (alarms.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">No Open or In Progress alarms.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th scope="col" className="px-4 py-3">Occurred</th>
            <th scope="col" className="px-4 py-3">Machine</th>
            <th scope="col" className="px-4 py-3">Code</th>
            <th scope="col" className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {alarms.map((alarm) => (
            <tr key={alarm.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDateTime(alarm.occurred_at)}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{alarm.machine_name ?? "Unknown machine"}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-900">{alarm.alarm_code}</td>
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
