import RoleSelector from "./RoleSelector"
import { updateUserRole } from "../actions"
import EmptyState from "@/components/ui/EmptyState"
import type { ProfileRole } from "../constants"
import type { UserRow } from "../queries"

const ROLE_STYLES: Record<ProfileRole, string> = {
  admin: "bg-red-900/50 text-red-400 border border-red-700",
  technician: "bg-blue-900/50 text-accent-blue border border-blue-700",
  viewer: "bg-gray-800 text-gray-400 border border-gray-600",
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
    <div className="overflow-x-auto rounded-lg border border-border-color bg-bg-secondary">
      <table className="min-w-full divide-y divide-border-color text-sm">
        <thead className="bg-bg-tertiary text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <tr>
            <th scope="col" className="px-4 py-3">Email</th>
            <th scope="col" className="px-4 py-3">Name</th>
            <th scope="col" className="px-4 py-3">Role</th>
            <th scope="col" className="px-4 py-3">Created</th>
            <th scope="col" className="px-4 py-3 text-right">Change role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-bg-tertiary/50">
              <td className="px-4 py-3 font-medium text-text-primary">{user.email ?? "—"}</td>
              <td className="px-4 py-3 text-text-secondary">{user.full_name ?? "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    ROLE_STYLES[user.role] ?? "bg-gray-800 text-gray-400 border border-gray-600"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-text-secondary">{formatDate(user.created_at)}</td>
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
