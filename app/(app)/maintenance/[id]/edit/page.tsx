import Link from "next/link"
import { redirect } from "next/navigation"
import MaintenanceForm from "@/features/maintenance/components/MaintenanceForm"
import { updateMaintenance } from "@/features/maintenance/actions"
import { requireStaff } from "@/features/maintenance/guards"
import { getMachineOptions, getMaintenanceById, getOpenAlarmOptions, getTechnicianOptions } from "@/features/maintenance/queries"

export const metadata = { title: "Edit maintenance record | AMMS" }

interface EditMaintenancePageProps {
  params: { id: string }
}

export default async function EditMaintenancePage({ params }: EditMaintenancePageProps) {
  await requireStaff()

  const record = await getMaintenanceById(params.id)
  if (!record) redirect("/maintenance")

  const [machines, alarms, technicians] = await Promise.all([
    getMachineOptions(),
    getOpenAlarmOptions(record.alarm_id ?? undefined),
    getTechnicianOptions(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Edit maintenance record</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Status is currently{" "}
          <span className="font-medium">{record.status}</span>. Records only move Pending → In Progress → Done.
        </p>
      </div>

      <div className="max-w-2xl rounded-lg border border-border-color bg-bg-secondary p-6 shadow-sm">
        <MaintenanceForm
          action={updateMaintenance.bind(null, record.id)}
          machines={machines}
          alarms={alarms}
          technicians={technicians}
          initial={{
            machine_id: record.machine_id,
            alarm_id: record.alarm_id,
            technician_id: record.technician_id,
            problem: record.problem,
            action_taken: record.action_taken,
            maintained_at: record.maintained_at,
            status: record.status,
          }}
        />
      </div>

      <Link href="/maintenance" className="text-sm font-medium text-accent-blue hover:brightness-110">
        &larr; Back to maintenance
      </Link>
    </div>
  )
}
