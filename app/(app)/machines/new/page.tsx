import Link from "next/link"
import MachineForm from "@/features/machine/components/MachineForm"
import { createMachine } from "@/features/machine/actions"
import { requireAdmin } from "@/features/machine/guards"

export const metadata = { title: "New machine | AMMS" }

export default async function NewMachinePage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New machine</h1>
        <p className="mt-1 text-sm text-gray-600">Register a new machine in the system.</p>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <MachineForm action={createMachine} />
      </div>

      <Link href="/machines" className="text-sm font-medium text-blue-600 hover:text-blue-800">
        &larr; Back to machines
      </Link>
    </div>
  )
}
