import Link from "next/link"
import AlarmForm from "@/features/alarm/components/AlarmForm"
import { createAlarm } from "@/features/alarm/actions"
import { requireStaff } from "@/features/alarm/guards"
import { getActiveMachines } from "@/features/alarm/queries"

export const metadata = { title: "Report alarm | AMMS" }

export default async function NewAlarmPage() {
  await requireStaff()

  const machines = await getActiveMachines()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Report alarm</h1>
        <p className="mt-1 text-sm text-text-secondary">Log a new alarm for a machine. It starts in the Open state.</p>
      </div>

      {machines.length === 0 && (
        <div className="max-w-2xl rounded-md border border-yellow-700 bg-yellow-900/30 px-4 py-3 text-sm text-yellow-400">
          No machines are registered yet. An admin must add a machine first —{" "}
          <Link href="/machines/new" className="font-medium underline hover:brightness-110">
            register one here
          </Link>
          .
        </div>
      )}

      <div className="max-w-2xl rounded-lg border border-border-color bg-bg-secondary p-6 shadow-sm">
        <AlarmForm action={createAlarm} machines={machines} />
      </div>

      <Link href="/alarms" className="text-sm font-medium text-accent-blue hover:brightness-110">
        &larr; Back to alarms
      </Link>
    </div>
  )
}
