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
          <Link href="/machines/new" className="rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            Add machine
          </Link>
        }
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-color bg-bg-secondary">
      <table className="min-w-full divide-y divide-border-color text-sm">
        <thead className="bg-bg-tertiary text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <tr>
            <th scope="col" className="px-4 py-3">Machine ID</th>
            <th scope="col" className="px-4 py-3">Name</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Location</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {machines.map((machine) => (
            <tr key={machine.id} className="hover:bg-bg-tertiary/50">
              <td className="px-4 py-3 font-mono text-xs font-medium text-text-primary">{machine.machine_id}</td>
              <td className="px-4 py-3 text-text-primary">{machine.machine_name}</td>
              <td className="px-4 py-3 text-text-secondary">{machine.machine_type}</td>
              <td className="px-4 py-3 text-text-secondary">{machine.location}</td>
              <td className="px-4 py-3">
                <StatusBadge status={machine.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/machines/${machine.id}/edit`}
                    className="rounded-md border border-border-color bg-bg-tertiary px-3 py-1.5 text-sm font-medium text-text-primary hover:brightness-110"
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
