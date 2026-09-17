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
        <h1 className="text-2xl font-bold text-text-primary">New maintenance record</h1>
        <p className="mt-1 text-sm text-text-secondary">Log a maintenance activity. Records start as Pending and move to In Progress, then Done.</p>
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
        <MaintenanceForm action={createMaintenance} machines={machines} alarms={alarms} technicians={technicians} />
      </div>

      <Link href="/maintenance" className="text-sm font-medium text-accent-blue hover:brightness-110">
        &larr; Back to maintenance
      </Link>
    </div>
  )
}
