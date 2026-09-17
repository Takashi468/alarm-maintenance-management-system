"use client"

import MachineCard from "./MachineCard"
import EmptyState from "@/components/ui/EmptyState"
import type { Machine } from "@/features/machine/queries"

export default function SimulatorPanel({ machines }: { machines: Machine[] }) {
  if (machines.length === 0) {
    return <EmptyState title="No machines registered." description="Add a machine first to simulate events." />
  }

  const counts = {
    Running: machines.filter((m) => m.status === "Running").length,
    Stop: machines.filter((m) => m.status === "Stop").length,
    Alarm: machines.filter((m) => m.status === "Alarm").length,
    Maintenance: machines.filter((m) => m.status === "Maintenance").length,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-800 px-2 py-4 font-mono text-xs">
        <span className="flex items-center gap-2 font-bold uppercase tracking-widest text-green-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          System Status: Online
        </span>

        <span className={`font-bold uppercase tracking-widest ${counts.Alarm > 0 ? "animate-pulse text-red-400" : "text-gray-600"}`}>
          Active Alarms: {counts.Alarm}
        </span>

        <span className="flex flex-wrap items-center gap-4 text-gray-400">
          <span className="text-green-400">Running: {counts.Running}</span>
          <span className="text-gray-500">Stop: {counts.Stop}</span>
          <span className="text-red-400">Alarm: {counts.Alarm}</span>
          <span className="text-yellow-400">Maintenance: {counts.Maintenance}</span>
        </span>
      </div>
    </div>
  )
}
