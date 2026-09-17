import MachineStatusGrid from "@/features/dashboard/components/MachineStatusGrid"
import RecentAlarmTable from "@/features/dashboard/components/RecentAlarmTable"
import MaintenanceSummary from "@/features/dashboard/components/MaintenanceSummary"
import { getDashboardSummary, getRecentAlarms } from "@/features/dashboard/queries"
import ErrorState from "@/components/ui/ErrorState"

export const metadata = { title: "Dashboard | AMMS" }

export default async function DashboardPage() {
  let summary: Awaited<ReturnType<typeof getDashboardSummary>>
  let recentAlarms: Awaited<ReturnType<typeof getRecentAlarms>>
  try {
    ;[summary, recentAlarms] = await Promise.all([getDashboardSummary(), getRecentAlarms(5)])
  } catch (err) {
    return <ErrorState message={err instanceof Error ? err.message : "Unexpected error"} />
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Plant overview at a glance.</p>
      </div>

      <MachineStatusGrid summary={summary} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section aria-label="Recent alarms" className="space-y-3 lg:col-span-2">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-gray-900">Recent open alarms</h2>
            <p className="whitespace-nowrap text-sm text-gray-500">
              {summary.open_alarms} Open · {summary.in_progress_alarms} In Progress
            </p>
          </div>
          <RecentAlarmTable alarms={recentAlarms} />
        </section>

        <MaintenanceSummary pending={summary.pending_maintenance} inProgress={summary.in_progress_maintenance} />
      </div>
    </div>
  )
}
