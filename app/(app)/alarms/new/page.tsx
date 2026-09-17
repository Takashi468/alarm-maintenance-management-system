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
        <h1 className="text-2xl font-bold text-gray-900">Report alarm</h1>
        <p className="mt-1 text-sm text-gray-600">Log a new alarm for a machine. It starts in the Open state.</p>
      </div>

      {machines.length === 0 && (
        <div className="max-w-2xl rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No machines are registered yet. An admin must add a machine first —{" "}
          <Link href="/machines/new" className="font-medium underline hover:text-amber-900">
            register one here
          </Link>
          .
        </div>
      )}

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <AlarmForm action={createAlarm} machines={machines} />
      </div>

      <Link href="/alarms" className="text-sm font-medium text-blue-600 hover:text-blue-800">
        &larr; Back to alarms
      </Link>
    </div>
  )
}
