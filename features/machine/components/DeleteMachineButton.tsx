"use client"

import ConfirmDialog from "@/components/ui/ConfirmDialog"
import type { MachineActionResult } from "../actions"

export default function DeleteMachineButton({
  action,
  machineId,
}: {
  action: () => Promise<MachineActionResult>
  machineId: string
}) {
  return (
    <ConfirmDialog
      label="Delete"
      title={`Delete machine "${machineId}"?`}
      message="This cannot be undone."
      confirmLabel="Delete"
      onConfirm={action}
    />
  )
}
