import RoleSelector from "./RoleSelector"
import { updateUserRole } from "../actions"
import EmptyState from "@/components/ui/EmptyState"
import type { ProfileRole } from "../constants"
import type { UserRow } from "../queries"

const ROLE_STYLES: Record<ProfileRole, string> = {
  admin: "bg-purple-100 text-purple-800",
  technician: "bg-blue-100 text-blue-800",
  viewer: "bg-gray-200 text-gray-700",
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-GB", { timeZone: "UTC" }) + " UTC"
}

export default function UserTable({ users }: { users: UserRow[] }) {
  if (users.length === 0) {
    return <EmptyState title="No users found." />
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th scope="col" className="px-4 py-3">Email</th>
            <th scope="col" className="px-4 py-3">Name</th>
            <th scope="col" className="px-4 py-3">Role</th>
            <th scope="col" className="px-4 py-3">Created</th>
            <th scope="col" className="px-4 py-3 text-right">Change role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{user.email ?? "—"}</td>
              <td className="px-4 py-3 text-gray-600">{user.full_name ?? "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    ROLE_STYLES[user.role] ?? "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{formatDate(user.created_at)}</td>
              <td className="px-4 py-3">
                <RoleSelector
                  userId={user.id}
                  userLabel={user.email ?? user.full_name ?? "this user"}
                  role={user.role}
                  onUpdate={updateUserRole.bind(null, user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
