"use client"

import MachineCard from "./MachineCard"
import EmptyState from "@/components/ui/EmptyState"
import type { Machine } from "@/features/machine/queries"

export default function SimulatorPanel({ machines }: { machines: Machine[] }) {
  if (machines.length === 0) {
    return <EmptyState title="No machines registered." description="Add a machine first to simulate events." />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {machines.map((machine) => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  )
}
