import { MACHINE_STATUSES, type MachineStatus } from "./queries"

export type MachineFieldKey =
  | "machine_id"
  | "machine_name"
  | "machine_type"
  | "location"
  | "status"

const FIELD_LABELS: Record<Exclude<MachineFieldKey, "status">, string> = {
  machine_id: "Machine ID",
  machine_name: "Machine name",
  machine_type: "Machine type",
  location: "Location",
}

export function parseMachineFields(
  formData: FormData
): { values?: Record<Exclude<MachineFieldKey, "status">, string> & { status: MachineStatus }; fieldErrors: Partial<Record<MachineFieldKey, string>> } {
  const fieldErrors: Partial<Record<MachineFieldKey, string>> = {}

  const machine_id = typeof formData.get("machine_id") === "string" ? (formData.get("machine_id") as string).trim() : ""
  const machine_name = typeof formData.get("machine_name") === "string" ? (formData.get("machine_name") as string).trim() : ""
  const machine_type = typeof formData.get("machine_type") === "string" ? (formData.get("machine_type") as string).trim() : ""
  const location = typeof formData.get("location") === "string" ? (formData.get("location") as string).trim() : ""

  if (!machine_id) fieldErrors.machine_id = `${FIELD_LABELS.machine_id} is required.`
  if (!machine_name) fieldErrors.machine_name = `${FIELD_LABELS.machine_name} is required.`
  if (!machine_type) fieldErrors.machine_type = `${FIELD_LABELS.machine_type} is required.`
  if (!location) fieldErrors.location = `${FIELD_LABELS.location} is required.`

  const statusRaw = typeof formData.get("status") === "string" ? (formData.get("status") as string) : ""
  if (!MACHINE_STATUSES.includes(statusRaw as MachineStatus)) {
    fieldErrors.status = "Select a valid status."
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  return {
    values: { machine_id, machine_name, machine_type, location, status: statusRaw as MachineStatus },
    fieldErrors,
  }
}
