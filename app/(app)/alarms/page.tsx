import Link from "next/link"
import AlarmFilterBar from "@/features/alarm/components/AlarmFilterBar"
import AlarmTable from "@/features/alarm/components/AlarmTable"
import { getAlarms, getActiveMachines } from "@/features/alarm/queries"
import ErrorState from "@/components/ui/ErrorState"

export const metadata = { title: "Alarms | AMMS" }

interface AlarmsPageProps {
  searchParams: {
    machine_id?: string | string[]
    status?: string | string[]
    date_from?: string | string[]
    date_to?: string | string[]
  }
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function AlarmsPage({ searchParams }: AlarmsPageProps) {
  const filters = {
    machine_id: first(searchParams.machine_id),
    status: first(searchParams.status),
    date_from: first(searchParams.date_from),
    date_to: first(searchParams.date_to),
  }
  const hasFilters = Boolean(filters.machine_id || filters.status || filters.date_from || filters.date_to)

  let alarms: Awaited<ReturnType<typeof getAlarms>>
  let machines: Awaited<ReturnType<typeof getActiveMachines>>
  try {
    ;[alarms, machines] = await Promise.all([getAlarms(filters), getActiveMachines()])
  } catch (err) {
    return <ErrorState message={err instanceof Error ? err.message : "Unexpected error"} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Alarms</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {hasFilters
              ? `Showing ${alarms.length} ${alarms.length === 1 ? "result" : "results"}`
              : `${alarms.length} ${alarms.length === 1 ? "alarm" : "alarms"} reported`}
          </p>
        </div>
        <Link
          href="/alarms/new"
          className="rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg-primary"
        >
          Report Alarm
        </Link>
      </div>

      <AlarmFilterBar machines={machines} initial={filters} />

      <AlarmTable alarms={alarms} />
    </div>
  )
}
