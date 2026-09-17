import Link from "next/link"
import AlarmStatusModal from "./AlarmStatusModal"
import { closeAlarm, updateAlarmStatus } from "../actions"
import type { AlarmStatus } from "../constants"
import type { AlarmWithRelations } from "../queries"

const STATUS_STYLES: Record<AlarmStatus, string> = {
  Open: "bg-red-100 text-red-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Closed: "bg-gray-100 text-gray-700",
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC"
}

export default function AlarmTable({ alarms }: { alarms: AlarmWithRelations[] }) {
  if (alarms.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">No alarms found.</p>
        <Link
          href="/alarms/new"
          className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Report alarm
        </Link>
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
            <th scope="col" className="px-4 py-3">Description</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Cause</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {alarms.map((alarm) => (
            <tr key={alarm.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDateTime(alarm.occurred_at)}</td>
              <td className="px-4 py-3">
                {alarm.machines ? (
                  <>
                    <span className="font-medium text-gray-900">{alarm.machines.machine_name}</span>{" "}
                    <span className="font-mono text-xs text-gray-500">{alarm.machines.machine_id}</span>
                  </>
                ) : (
                  <span className="text-gray-400">Unknown machine</span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-900">{alarm.alarm_code}</td>
              <td className="max-w-xs px-4 py-3 text-gray-600">
                <span title={alarm.description}>{alarm.description.length > 80 ? alarm.description.slice(0, 80) + "…" : alarm.description}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[alarm.status]}`}>
                  {alarm.status}
                </span>
              </td>
              <td className="max-w-xs px-4 py-3 text-gray-600">
                {alarm.cause ? (
                  <>
                    <span title={alarm.cause}>{alarm.cause.length > 60 ? alarm.cause.slice(0, 60) + "…" : alarm.cause}</span>
                    {alarm.profiles?.full_name && <span className="ml-1 text-xs text-gray-400">by {alarm.profiles.full_name}</span>}
                  </>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <AlarmStatusModal
                  alarmId={alarm.id}
                  status={alarm.status}
                  onStart={updateAlarmStatus.bind(null, alarm.id, "In Progress")}
                  onCloseAlarm={closeAlarm.bind(null, alarm.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
