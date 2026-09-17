"use client"

import { useState, useTransition } from "react"
import type { MaintenanceActionResult, MaintenanceFieldKey } from "../actions"
import { MNT_STATUSES } from "../constants"
import type { AlarmOption, MachineOption, TechnicianOption } from "../queries"

export interface MaintenanceInitial {
  machine_id: string
  alarm_id: string | null
  technician_id: string | null
  problem: string
  action_taken: string | null
  maintained_at: string
  status: (typeof MNT_STATUSES)[number]
}

function todayLocal(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function MaintenanceForm({
  action,
  machines,
  alarms,
  technicians,
  initial = null,
}: {
  action: (formData: FormData) => Promise<MaintenanceActionResult>
  machines: MachineOption[]
  alarms: AlarmOption[]
  technicians: TechnicianOption[]
  initial?: MaintenanceInitial | null
}) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<MaintenanceFieldKey, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const form = event.currentTarget
    const formData = new FormData(form)

    const errors: Partial<Record<MaintenanceFieldKey, string>> = {}
    if (!formData.get("machine_id")) errors.machine_id = "Select a machine."
    if (asString(formData.get("problem")) === "") errors.problem = "Problem is required."
    if (!/^\d{4}-\d{2}-\d{2}$/.test(asString(formData.get("maintained_at")))) {
      errors.maintained_at = "Provide the maintenance date (YYYY-MM-DD)."
    }

    const status = asString(formData.get("status"))
    if (!MNT_STATUSES.includes(status as (typeof MNT_STATUSES)[number])) errors.status = "Select a valid status."
    if (status === "Done" && asString(formData.get("action_taken")) === "") {
      errors.action_taken = "Action taken is required when the record is Done."
    }

    setFieldErrors(errors)
    setFormError(null)

    if (Object.keys(errors).length > 0) return

    startTransition(async () => {
      const result = await action(formData)
      if (!result) return
      setFormError(result.error ?? null)
      setFieldErrors(result.fieldErrors ?? {})
    })
  }

  function errorFor(key: MaintenanceFieldKey) {
    return fieldErrors[key] ? (
      <p role="alert" className="mt-1 text-sm text-red-400">
        {fieldErrors[key]}
      </p>
    ) : null
  }

  const inputClass = (key: MaintenanceFieldKey) =>
    `mt-1 block w-full rounded-md border bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 ${
      fieldErrors[key]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-border-color focus:border-accent-blue focus:ring-accent-blue"
    }`

  const statusValue = initial?.status ?? "Pending"

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <p role="alert" className="rounded-md border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-400">
          {formError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="machine_id" className="block text-sm font-medium text-text-primary">
            Machine *
          </label>
          <select id="machine_id" name="machine_id" required defaultValue={initial?.machine_id ?? ""} className={inputClass("machine_id")}>
            <option value="" disabled>
              Select a machine...
            </option>
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.machine_id} — {m.machine_name}
              </option>
            ))}
          </select>
          {errorFor("machine_id")}
        </div>

        <div>
          <label htmlFor="alarm_id" className="block text-sm font-medium text-text-primary">
            Related alarm
          </label>
          <select id="alarm_id" name="alarm_id" defaultValue={initial?.alarm_id ?? ""} className={inputClass("alarm_id")}>
            <option value="">— none —</option>
            {alarms.map((a) => (
              <option key={a.id} value={a.id}>
                {a.alarm_code}
                {a.machines ? ` (${a.machines.machine_id})` : ""} — {a.description.slice(0, 40)}
              </option>
            ))}
          </select>
          {alarms.length === 0 && <p className="mt-1 text-xs text-text-secondary">No Open or In Progress alarms available.</p>}
          {errorFor("alarm_id")}
        </div>

        <div>
          <label htmlFor="technician_id" className="block text-sm font-medium text-text-primary">
            Technician
          </label>
          <select id="technician_id" name="technician_id" defaultValue={initial?.technician_id ?? ""} className={inputClass("technician_id")}>
            <option value="">— unassigned —</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name || "Technician"}
              </option>
            ))}
          </select>
          {errorFor("technician_id")}
        </div>

        <div>
          <label htmlFor="maintained_at" className="block text-sm font-medium text-text-primary">
            Maintained at *
          </label>
          <input
            id="maintained_at"
            name="maintained_at"
            type="date"
            required
            defaultValue={initial?.maintained_at ?? todayLocal()}
            className={inputClass("maintained_at")}
          />
          {errorFor("maintained_at")}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-primary">
            Status *
          </label>
          <select id="status" name="status" required defaultValue={statusValue} className={inputClass("status")}>
            {MNT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errorFor("status")}
        </div>
      </div>

      <div>
        <label htmlFor="problem" className="block text-sm font-medium text-text-primary">
          Problem *
        </label>
        <textarea
          id="problem"
          name="problem"
          required
          rows={3}
          defaultValue={initial?.problem ?? ""}
          placeholder="What was the problem? e.g. Vibration on spindle during high-speed cut"
          className={inputClass("problem")}
        />
        {errorFor("problem")}
      </div>

      <div>
        <label htmlFor="action_taken" className="block text-sm font-medium text-text-primary">
          Action taken {!fieldErrors.action_taken && statusValue === "Done" ? "*" : ""}
        </label>
        <textarea
          id="action_taken"
          name="action_taken"
          rows={3}
          defaultValue={initial?.action_taken ?? ""}
          placeholder="What was done? e.g. Rebalanced spindle, replaced bearing"
          className={inputClass("action_taken")}
        />
        {errorFor("action_taken")}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg-secondary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Saving..." : initial ? "Save changes" : "Create record"}
      </button>
    </form>
  )
}

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : ""
}
