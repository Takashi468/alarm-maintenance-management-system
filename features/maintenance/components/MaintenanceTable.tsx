import Link from "next/link"
import StatusBadge from "@/components/ui/StatusBadge"
import EmptyState from "@/components/ui/EmptyState"
import type { MaintenanceWithRelations } from "../queries"

export default function MaintenanceTable({ records }: { records: MaintenanceWithRelations[] }) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No maintenance records found."
        action={
          <Link href="/maintenance/new" className="rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            New record
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
            <th scope="col" className="px-4 py-3">Machine</th>
            <th scope="col" className="px-4 py-3">Problem</th>
            <th scope="col" className="px-4 py-3">Technician</th>
            <th scope="col" className="px-4 py-3">Maintained at</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-bg-tertiary/50">
              <td className="whitespace-nowrap px-4 py-3">
                {record.machines ? (
                  <>
                    <span className="font-medium text-text-primary">{record.machines.machine_name}</span>{" "}
                    <span className="font-mono text-xs text-text-secondary">{record.machines.machine_id}</span>
                  </>
                ) : (
                  <span className="text-text-secondary">Unknown machine</span>
                )}
              </td>
              <td className="max-w-sm px-4 py-3 text-text-secondary">
                <span title={record.problem}>{record.problem.length > 80 ? record.problem.slice(0, 80) + "…" : record.problem}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{record.profiles?.full_name || <span className="text-text-secondary/50">—</span>}</td>
              <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{record.maintained_at}</td>
              <td className="px-4 py-3">
                <StatusBadge status={record.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <Link href={`/maintenance/${record.id}/edit`} className="rounded-md border border-border-color bg-bg-tertiary px-3 py-1.5 text-sm font-medium text-text-primary hover:brightness-110">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
