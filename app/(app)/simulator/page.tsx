import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SimulatorPanel from "@/features/simulator/components/SimulatorPanel"
import PlcClock from "@/features/simulator/components/PlcClock"
import { getMachines } from "@/features/machine/queries"
import ErrorState from "@/components/ui/ErrorState"

export const metadata = { title: "Simulator | AMMS" }

export default async function SimulatorPage() {
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

  if (profile?.role !== "admin" && profile?.role !== "superadmin") redirect("/dashboard")

  let machines: Awaited<ReturnType<typeof getMachines>>
  try {
    machines = await getMachines()
  } catch (err) {
    return <ErrorState message={err instanceof Error ? err.message : "Unexpected error"} />
  }

  return (
    <div className="scanlines relative -m-4 overflow-hidden bg-[#050810] font-techmono sm:-m-6 lg:-m-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 bg-[#050810] px-6 py-4">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-widest text-green-400">PLC Control Panel</h1>
          <p className="mt-1 text-xs text-gray-500">Trigger machine events to simulate PLC signals and test alarm workflows.</p>
        </div>
        <PlcClock />
      </div>

      <div className="px-6 py-8">
        <SimulatorPanel machines={machines} />
      </div>
    </div>
  )
}
