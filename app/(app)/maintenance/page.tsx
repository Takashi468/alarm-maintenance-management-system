import Link from "next/link"
import MaintenanceFilterBar from "@/features/maintenance/components/MaintenanceFilterBar"
import MaintenanceTable from "@/features/maintenance/components/MaintenanceTable"
import { getMaintenanceRecords, getMachineOptions } from "@/features/maintenance/queries"

export const metadata = { title: "Maintenance | AMMS" }

interface MaintenancePageProps {
  searchParams: {
    machine_id?: string | string[]
    status?: string | string[]
  }
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function MaintenancePage({ searchParams }: MaintenancePageProps) {
  const [records, machines] = await Promise.all([
    getMaintenanceRecords({
      machine_id: first(searchParams.machine_id),
      status: first(searchParams.status),
    }),
    getMachineOptions(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="mt-1 text-sm text-gray-600">
            {records.length} {records.length === 1 ? "record" : "records"}
          </p>
        </div>
        <Link
          href="/maintenance/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Record
        </Link>
      </div>

      <MaintenanceFilterBar
        machines={machines}
        initial={{
          machine_id: first(searchParams.machine_id),
          status: first(searchParams.status),
        }}
      />

      <MaintenanceTable records={records} />
    </div>
  )
}
