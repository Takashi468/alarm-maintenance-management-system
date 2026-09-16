"use client"

import { useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { MACHINE_STATUSES } from "../constants"

export default function MachineFilterBar({
  initialSearch = "",
  initialStatus = "",
}: {
  initialSearch?: string
  initialStatus?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function apply(nextSearch: string, nextStatus: string) {
    const params = new URLSearchParams()
    if (nextSearch.trim()) params.set("q", nextSearch.trim())
    if (nextStatus) params.set("status", nextStatus)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => apply(value, status), 300)
  }

  function handleStatusChange(value: string) {
    setStatus(value)
    apply(search, value)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={search}
        onChange={(event) => handleSearchChange(event.target.value)}
        placeholder="Search machine ID or name..."
        aria-label="Search machines"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
      />
      <select
        value={status}
        onChange={(event) => handleStatusChange(event.target.value)}
        aria-label="Filter by status"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All statuses</option>
        {MACHINE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
