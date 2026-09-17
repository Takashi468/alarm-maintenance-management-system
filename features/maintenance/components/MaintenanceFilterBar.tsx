"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { MNT_STATUSES } from "../constants"
import type { MachineOption } from "../queries"

interface InitialFilters {
  machine_id?: string
  status?: string
}

export default function MaintenanceFilterBar({ machines, initial = {} }: { machines: MachineOption[]; initial?: InitialFilters }) {
  const router = useRouter()
  const pathname = usePathname()
  const [machineId, setMachineId] = useState(initial.machine_id ?? "")
  const [status, setStatus] = useState(initial.status ?? "")

  function apply(next: { machineId: string; status: string }) {
    const params = new URLSearchParams()
    if (next.machineId) params.set("machine_id", next.machineId)
    if (next.status) params.set("status", next.status)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const selectClass = "rounded-md border border-border-color bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <select
        value={machineId}
        onChange={(e) => {
          setMachineId(e.target.value)
          apply({ machineId: e.target.value, status })
        }}
        aria-label="Filter by machine"
        className={selectClass}
      >
        <option value="">All machines</option>
        {machines.map((m) => (
          <option key={m.id} value={m.id}>
            {m.machine_id} — {m.machine_name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value)
          apply({ machineId, status: e.target.value })
        }}
        aria-label="Filter by status"
        className={selectClass}
      >
        <option value="">All statuses</option>
        {MNT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {(machineId || status) && (
        <button
          type="button"
          onClick={() => {
            setMachineId("")
            setStatus("")
            apply({ machineId: "", status: "" })
          }}
          className="text-sm font-medium text-accent-blue hover:brightness-110"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
