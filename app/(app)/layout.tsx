import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileProvider, type Profile } from "@/features/auth/profile-context"

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

  return (
    <ProfileProvider profile={resolvedProfile}>
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </ProfileProvider>
  )
}
