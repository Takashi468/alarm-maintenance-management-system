import Link from "next/link"
import MaintenanceFilterBar from "@/features/maintenance/components/MaintenanceFilterBar"
import MaintenanceTable from "@/features/maintenance/components/MaintenanceTable"
import { getMaintenanceRecords, getMachineOptions } from "@/features/maintenance/queries"
import ErrorState from "@/components/ui/ErrorState"

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
  const filters = {
    machine_id: first(searchParams.machine_id),
    status: first(searchParams.status),
  }
  const hasFilters = Boolean(filters.machine_id || filters.status)

  let records: Awaited<ReturnType<typeof getMaintenanceRecords>>
  let machines: Awaited<ReturnType<typeof getMachineOptions>>
  try {
    ;[records, machines] = await Promise.all([getMaintenanceRecords(filters), getMachineOptions()])
  } catch (err) {
    return <ErrorState message={err instanceof Error ? err.message : "Unexpected error"} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Maintenance</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {hasFilters
              ? `Showing ${records.length} ${records.length === 1 ? "result" : "results"}`
              : `${records.length} ${records.length === 1 ? "record" : "records"}`}
          </p>
        </div>
        <Link
          href="/maintenance/new"
          className="rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg-primary"
        >
          New Record
        </Link>
      </div>

      <MaintenanceFilterBar machines={machines} initial={filters} />

      <MaintenanceTable records={records} />
    </div>
  )
}
