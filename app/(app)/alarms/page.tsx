import Link from "next/link"
import AlarmFilterBar from "@/features/alarm/components/AlarmFilterBar"
import AlarmTable from "@/features/alarm/components/AlarmTable"
import { getAlarms, getActiveMachines } from "@/features/alarm/queries"

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
  const [alarms, machines] = await Promise.all([
    getAlarms({
      machine_id: first(searchParams.machine_id),
      status: first(searchParams.status),
      date_from: first(searchParams.date_from),
      date_to: first(searchParams.date_to),
    }),
    getActiveMachines(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alarms</h1>
          <p className="mt-1 text-sm text-gray-600">
            {alarms.length} {alarms.length === 1 ? "alarm" : "alarms"} reported
          </p>
        </div>
        <Link
          href="/alarms/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Report Alarm
        </Link>
      </div>

      <AlarmFilterBar
        machines={machines}
        initial={{
          machine_id: first(searchParams.machine_id),
          status: first(searchParams.status),
          date_from: first(searchParams.date_from),
          date_to: first(searchParams.date_to),
        }}
      />

      <AlarmTable alarms={alarms} />
    </div>
  )
}
