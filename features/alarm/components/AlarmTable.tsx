import Link from "next/link"
import AlarmStatusModal from "./AlarmStatusModal"
import { closeAlarm, updateAlarmStatus } from "../actions"
import StatusBadge from "@/components/ui/StatusBadge"
import EmptyState from "@/components/ui/EmptyState"
import type { AlarmWithRelations } from "../queries"

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC"
}

export default function AlarmTable({ alarms }: { alarms: AlarmWithRelations[] }) {
  if (alarms.length === 0) {
    return (
      <EmptyState
        title="No alarms found."
        action={
          <Link href="/alarms/new" className="rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            Report alarm
          </Link>
        }
      />
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
            <th scope="col" className="px-4 py-3">Description</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Cause</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {alarms.map((alarm) => (
            <tr key={alarm.id} className="hover:bg-bg-tertiary/50">
              <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{formatDateTime(alarm.occurred_at)}</td>
              <td className="px-4 py-3">
                {alarm.machines ? (
                  <>
                    <span className="font-medium text-text-primary">{alarm.machines.machine_name}</span>{" "}
                    <span className="font-mono text-xs text-text-secondary">{alarm.machines.machine_id}</span>
                  </>
                ) : (
                  <span className="text-text-secondary">Unknown machine</span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-text-primary">{alarm.alarm_code}</td>
              <td className="max-w-xs px-4 py-3 text-text-secondary">
                <span title={alarm.description}>{alarm.description.length > 80 ? alarm.description.slice(0, 80) + "…" : alarm.description}</span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={alarm.status} />
              </td>
              <td className="max-w-xs px-4 py-3 text-text-secondary">
                {alarm.cause ? (
                  <>
                    <span title={alarm.cause}>{alarm.cause.length > 60 ? alarm.cause.slice(0, 60) + "…" : alarm.cause}</span>
                    {alarm.profiles?.full_name && <span className="ml-1 text-xs text-text-secondary/70">by {alarm.profiles.full_name}</span>}
                  </>
                ) : (
                  <span className="text-text-secondary/50">—</span>
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
