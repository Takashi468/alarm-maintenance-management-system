import Link from "next/link"
import DeleteMachineButton from "./DeleteMachineButton"
import { deleteMachine } from "../actions"
import StatusBadge from "@/components/ui/StatusBadge"
import EmptyState from "@/components/ui/EmptyState"
import type { Machine } from "../queries"

export default function MachineTable({ machines }: { machines: Machine[] }) {
  if (machines.length === 0) {
    return (
      <EmptyState
        title="No machines found."
        action={
          <Link href="/machines/new" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Add machine
          </Link>
        }
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th scope="col" className="px-4 py-3">Machine ID</th>
            <th scope="col" className="px-4 py-3">Name</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Location</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {machines.map((machine) => (
            <tr key={machine.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">{machine.machine_id}</td>
              <td className="px-4 py-3 text-gray-900">{machine.machine_name}</td>
              <td className="px-4 py-3 text-gray-600">{machine.machine_type}</td>
              <td className="px-4 py-3 text-gray-600">{machine.location}</td>
              <td className="px-4 py-3">
                <StatusBadge status={machine.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/machines/${machine.id}/edit`}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <DeleteMachineButton action={deleteMachine.bind(null, machine.id)} machineId={machine.machine_id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
