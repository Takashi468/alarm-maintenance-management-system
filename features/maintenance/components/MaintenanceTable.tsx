import Link from "next/link"
import type { MntStatus } from "../constants"
import type { MaintenanceWithRelations } from "../queries"

const STATUS_STYLES: Record<MntStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Done: "bg-green-100 text-green-800",
}

export default function MaintenanceTable({ records }: { records: MaintenanceWithRelations[] }) {
  if (records.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">No maintenance records found.</p>
        <Link
          href="/maintenance/new"
          className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          New record
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th scope="col" className="px-4 py-3">Machine</th>
            <th scope="col" className="px-4 py-3">Problem</th>
            <th scope="col" className="px-4 py-3">Technician</th>
            <th scope="col" className="px-4 py-3">Maintained at</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3">
                {record.machines ? (
                  <>
                    <span className="font-medium text-gray-900">{record.machines.machine_name}</span>{" "}
                    <span className="font-mono text-xs text-gray-500">{record.machines.machine_id}</span>
                  </>
                ) : (
                  <span className="text-gray-400">Unknown machine</span>
                )}
              </td>
              <td className="max-w-sm px-4 py-3 text-gray-600">
                <span title={record.problem}>{record.problem.length > 80 ? record.problem.slice(0, 80) + "…" : record.problem}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{record.profiles?.full_name || <span className="text-gray-300">—</span>}</td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">{record.maintained_at}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[record.status]}`}>
                  {record.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <Link href={`/maintenance/${record.id}/edit`} className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
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
