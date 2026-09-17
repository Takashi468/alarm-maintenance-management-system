import { signOut } from "@/features/auth/actions"
import UserInfo from "@/features/dashboard/components/UserInfo"
import MachineStatusGrid from "@/features/dashboard/components/MachineStatusGrid"
import RecentAlarmTable from "@/features/dashboard/components/RecentAlarmTable"
import MaintenanceSummary from "@/features/dashboard/components/MaintenanceSummary"
import { getDashboardSummary, getRecentAlarms } from "@/features/dashboard/queries"

export const metadata = { title: "Dashboard | AMMS" }

export default async function DashboardPage() {
  const [summary, recentAlarms] = await Promise.all([getDashboardSummary(), getRecentAlarms(5)])

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

      <UserInfo />

      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </form>
    </div>
  )
}
