import { signOut } from "@/features/auth/actions"
import UserInfo from "@/features/dashboard/components/UserInfo"

export const metadata = { title: "Dashboard | AMMS" }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome back.</p>
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
