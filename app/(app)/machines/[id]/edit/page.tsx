import Link from "next/link"
import { redirect } from "next/navigation"
import MachineForm from "@/features/machine/components/MachineForm"
import { updateMachine } from "@/features/machine/actions"
import { requireAdmin } from "@/features/machine/guards"
import { getMachineById } from "@/features/machine/queries"

export const metadata = { title: "Edit machine | AMMS" }

interface EditMachinePageProps {
  params: { id: string }
}

export default async function EditMachinePage({ params }: EditMachinePageProps) {
  await requireAdmin()

  const machine = await getMachineById(params.id)
  if (!machine) redirect("/machines")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit machine</h1>
        <p className="mt-1 text-sm text-gray-600">
          Updating <span className="font-mono font-medium">{machine.machine_id}</span> — {machine.machine_name}
        </p>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <MachineForm
          action={updateMachine.bind(null, machine.id)}
          initial={{
            machine_id: machine.machine_id,
            machine_name: machine.machine_name,
            machine_type: machine.machine_type ?? "",
            location: machine.location ?? "",
            status: machine.status,
          }}
        />
      </div>

      <Link href="/machines" className="text-sm font-medium text-blue-600 hover:text-blue-800">
        &larr; Back to machines
      </Link>
    </div>
  )
}
