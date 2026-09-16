import Link from "next/link"
import MachineFilterBar from "@/features/machine/components/MachineFilterBar"
import MachineTable from "@/features/machine/components/MachineTable"
import { getMachines } from "@/features/machine/queries"

export const metadata = { title: "Machines | AMMS" }

interface MachinesPageProps {
  searchParams: { q?: string | string[]; status?: string | string[] }
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function MachinesPage({ searchParams }: MachinesPageProps) {
  const machines = await getMachines({
    search: first(searchParams.q),
    status: first(searchParams.status),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Machines</h1>
          <p className="mt-1 text-sm text-gray-600">
            {machines.length} {machines.length === 1 ? "machine" : "machines"} registered
          </p>
        </div>
        <Link
          href="/machines/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Machine
        </Link>
      </div>

      <MachineFilterBar initialSearch={first(searchParams.q) ?? ""} initialStatus={first(searchParams.status) ?? ""} />

      <MachineTable machines={machines} />
    </div>
  )
}
