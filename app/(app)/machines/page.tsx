import Link from "next/link"
import MachineFilterBar from "@/features/machine/components/MachineFilterBar"
import MachineTable from "@/features/machine/components/MachineTable"
import { getMachines } from "@/features/machine/queries"
import ErrorState from "@/components/ui/ErrorState"

export const metadata = { title: "Machines | AMMS" }

interface MachinesPageProps {
  searchParams: { q?: string | string[]; status?: string | string[] }
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function MachinesPage({ searchParams }: MachinesPageProps) {
  const q = first(searchParams.q) ?? ""
  const status = first(searchParams.status) ?? ""
  const hasFilters = Boolean(q || status)

  let machines: Awaited<ReturnType<typeof getMachines>>
  try {
    machines = await getMachines({ search: q, status })
  } catch (err) {
    return <ErrorState message={err instanceof Error ? err.message : "Unexpected error"} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Machines</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {hasFilters
              ? `Showing ${machines.length} ${machines.length === 1 ? "result" : "results"}`
              : `${machines.length} ${machines.length === 1 ? "machine" : "machines"} registered`}
          </p>
        </div>
        <Link
          href="/machines/new"
          className="rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg-primary"
        >
          New Machine
        </Link>
      </div>

      <MachineFilterBar initialSearch={q} initialStatus={status} />

      <MachineTable machines={machines} />
    </div>
  )
}
