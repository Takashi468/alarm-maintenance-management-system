"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ALARM_STATUSES } from "../constants"
import type { MachineOption } from "../queries"

interface InitialFilters {
  machine_id?: string
  status?: string
  date_from?: string
  date_to?: string
}

export default function AlarmFilterBar({ machines, initial = {} }: { machines: MachineOption[]; initial?: InitialFilters }) {
  const router = useRouter()
  const pathname = usePathname()
  const [machineId, setMachineId] = useState(initial.machine_id ?? "")
  const [status, setStatus] = useState(initial.status ?? "")
  const [dateFrom, setDateFrom] = useState(initial.date_from ?? "")
  const [dateTo, setDateTo] = useState(initial.date_to ?? "")

  function apply(next: { machineId: string; status: string; dateFrom: string; dateTo: string }) {
    const params = new URLSearchParams()
    if (next.machineId) params.set("machine_id", next.machineId)
    if (next.status) params.set("status", next.status)
    if (next.dateFrom) params.set("date_from", next.dateFrom)
    if (next.dateTo) params.set("date_to", next.dateTo)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <select
        value={machineId}
        onChange={(e) => {
          setMachineId(e.target.value)
          apply({ machineId: e.target.value, status, dateFrom, dateTo })
        }}
        aria-label="Filter by machine"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          apply({ machineId, status: e.target.value, dateFrom, dateTo })
        }}
        aria-label="Filter by status"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All statuses</option>
        {ALARM_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <label htmlFor="date_from" className="text-sm text-gray-600">
          From
        </label>
        <input
          id="date_from"
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value)
            apply({ machineId, status, dateFrom: e.target.value, dateTo })
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="date_to" className="text-sm text-gray-600">
          To
        </label>
        <input
          id="date_to"
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value)
            apply({ machineId, status, dateFrom, dateTo: e.target.value })
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {(machineId || status || dateFrom || dateTo) && (
        <button
          type="button"
          onClick={() => {
            setMachineId("")
            setStatus("")
            setDateFrom("")
            setDateTo("")
            apply({ machineId: "", status: "", dateFrom: "", dateTo: "" })
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
