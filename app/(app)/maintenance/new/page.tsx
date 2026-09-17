import Link from "next/link"
import MaintenanceForm from "@/features/maintenance/components/MaintenanceForm"
import { createMaintenance } from "@/features/maintenance/actions"
import { requireStaff } from "@/features/maintenance/guards"
import { getMachineOptions, getOpenAlarmOptions, getTechnicianOptions } from "@/features/maintenance/queries"

export const metadata = { title: "New maintenance record | AMMS" }

export default async function NewMaintenancePage() {
  await requireStaff()

  const [machines, alarms, technicians] = await Promise.all([getMachineOptions(), getOpenAlarmOptions(), getTechnicianOptions()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New maintenance record</h1>
        <p className="mt-1 text-sm text-gray-600">Log a maintenance activity. Records start as Pending and move to In Progress, then Done.</p>
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
        <MaintenanceForm action={createMaintenance} machines={machines} alarms={alarms} technicians={technicians} />
      </div>

      <Link href="/maintenance" className="text-sm font-medium text-blue-600 hover:text-blue-800">
        &larr; Back to maintenance
      </Link>
    </div>
  )
}
