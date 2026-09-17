import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SimulatorPanel from "@/features/simulator/components/SimulatorPanel"
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

  if (profile?.role !== "admin") redirect("/dashboard")

  let machines: Awaited<ReturnType<typeof getMachines>>
  try {
    machines = await getMachines()
  } catch (err) {
    return <ErrorState message={err instanceof Error ? err.message : "Unexpected error"} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">PLC Mock Simulator</h1>
        <p className="mt-1 text-sm text-gray-600">Trigger machine events to simulate PLC signals and test alarm workflows.</p>
      </div>

      <div role="status" className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 shadow-sm">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
        </span>
        <p className="font-mono text-sm font-medium text-slate-200">PLC Mock Simulator — จำลองสัญญาณจาก PLC</p>
      </div>

      <SimulatorPanel machines={machines} />
    </div>
  )
}
