import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileProvider, type Profile } from "@/features/auth/profile-context"
import Nav from "@/components/ui/Nav"

type AppRole = "admin" | "technician" | "viewer"

const NAV_ITEMS: { href: string; label: string; roles: readonly AppRole[] }[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "technician", "viewer"] },
  { href: "/machines", label: "Machines", roles: ["admin"] },
  { href: "/alarms", label: "Alarms", roles: ["admin", "technician"] },
  { href: "/maintenance", label: "Maintenance", roles: ["admin", "technician"] },
  { href: "/users", label: "Users", roles: ["admin"] },
  { href: "/simulator", label: "Simulator", roles: ["admin"] },
]

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  const resolvedProfile: Profile = profile ?? {
    id: user.id,
    full_name: null,
    role: "viewer",
    created_at: new Date().toISOString(),
  }

  const items = NAV_ITEMS.filter((item) => item.roles.includes(resolvedProfile.role)).map(
    ({ href, label }) => ({ href, label }),
  )

  return (
    <ProfileProvider profile={resolvedProfile}>
      <div className="min-h-screen bg-gray-50">
        <Nav items={items} name={resolvedProfile.full_name} role={resolvedProfile.role} />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </ProfileProvider>
  )
}
