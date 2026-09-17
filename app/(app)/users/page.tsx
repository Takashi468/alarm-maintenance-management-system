import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import UserTable from "@/features/user/components/UserTable"
import { getUsers } from "@/features/user/queries"
import ErrorState from "@/components/ui/ErrorState"

export const metadata = { title: "Users | AMMS" }

export default async function UsersPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") redirect("/dashboard")

  let users: Awaited<ReturnType<typeof getUsers>>
  try {
    users = await getUsers()
  } catch (err) {
    return <ErrorState message={err instanceof Error ? err.message : "Unexpected error"} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <p className="mt-1 text-sm text-text-secondary">{users.length} users registered. Manage the role for each account.</p>
      </div>

      <UserTable users={users} />
    </div>
  )
}
