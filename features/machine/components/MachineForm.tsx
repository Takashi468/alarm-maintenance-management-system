"use client"

import { useState, useTransition } from "react"
import type { MachineActionResult, MachineFieldKey } from "../actions"
import { MACHINE_STATUSES } from "../constants"

type InitialValues = Partial<Record<MachineFieldKey, string>>

const FIELD_LABELS: Record<Exclude<MachineFieldKey, "status">, string> = {
  machine_id: "Machine ID",
  machine_name: "Machine name",
  machine_type: "Machine type",
  location: "Location",
}

export default function MachineForm({
  action,
  initial = {},
}: {
  action: (formData: FormData) => Promise<MachineActionResult>
  initial?: InitialValues
}) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<MachineFieldKey, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const formData = new FormData(event.currentTarget)

    const errors: Partial<Record<MachineFieldKey, string>> = {}
    for (const key of ["machine_id", "machine_name", "machine_type", "location"] as const) {
      const value = formData.get(key)
      if (typeof value !== "string" || value.trim() === "") {
        errors[key] = `${FIELD_LABELS[key]} is required.`
      }
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

  function errorFor(key: MachineFieldKey) {
    return fieldErrors[key] ? (
      <p role="alert" className="mt-1 text-sm text-red-400">
        {fieldErrors[key]}
      </p>
    ) : null
  }

  const inputClass = (key: MachineFieldKey) =>
    `mt-1 block w-full rounded-md border bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 ${
      fieldErrors[key]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-border-color focus:border-accent-blue focus:ring-accent-blue"
    }`

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
            Machine ID *
          </label>
          <input
            id="machine_id"
            name="machine_id"
            type="text"
            required
            minLength={2}
            maxLength={20}
            defaultValue={initial.machine_id ?? ""}
            placeholder="e.g. CNC-01"
            className={`${inputClass("machine_id")} font-mono`}
          />
          {errorFor("machine_id")}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-primary">
            Status *
          </label>
          <select id="status" name="status" required defaultValue={initial.status ?? "Running"} className={inputClass("status")}>
            {MACHINE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errorFor("status")}
        </div>

        <div>
          <label htmlFor="machine_name" className="block text-sm font-medium text-text-primary">
            Machine name *
          </label>
          <input
            id="machine_name"
            name="machine_name"
            type="text"
            required
            defaultValue={initial.machine_name ?? ""}
            placeholder="e.g. Haas VF-2"
            className={inputClass("machine_name")}
          />
          {errorFor("machine_name")}
        </div>

        <div>
          <label htmlFor="machine_type" className="block text-sm font-medium text-text-primary">
            Machine type *
          </label>
          <input
            id="machine_type"
            name="machine_type"
            type="text"
            required
            defaultValue={initial.machine_type ?? ""}
            placeholder="e.g. CNC mill"
            className={inputClass("machine_type")}
          />
          {errorFor("machine_type")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="location" className="block text-sm font-medium text-text-primary">
            Location *
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            defaultValue={initial.location ?? ""}
            placeholder="e.g. Building A, Bay 3"
            className={inputClass("location")}
          />
          {errorFor("location")}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg-secondary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Saving..." : "Save machine"}
      </button>
    </form>
  )
}
