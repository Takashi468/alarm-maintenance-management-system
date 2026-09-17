"use client"

import { useState, useTransition } from "react"
import type { AlarmActionResult, AlarmFieldKey } from "../actions"
import type { MachineOption } from "../queries"

type FormFieldKey = Exclude<AlarmFieldKey, "cause">

const FIELD_LABELS: Record<Exclude<FormFieldKey, "machine_id">, string> = {
  alarm_code: "Alarm code",
  description: "Description",
  occurred_at: "Occurred at",
}

function nowLocalInputValue(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AlarmForm({
  action,
  machines,
}: {
  action: (formData: FormData) => Promise<AlarmActionResult>
  machines: MachineOption[]
}) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormFieldKey, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const form = event.currentTarget
    const formData = new FormData(form)

    const errors: Partial<Record<FormFieldKey, string>> = {}
    if (!formData.get("machine_id")) errors.machine_id = "Select a machine."
    if (asString(formData.get("alarm_code")) === "") errors.alarm_code = `${FIELD_LABELS.alarm_code} is required.`
    if (asString(formData.get("description")) === "") errors.description = `${FIELD_LABELS.description} is required.`

    const occurredRaw = asString(formData.get("occurred_at"))
    if (!occurredRaw || Number.isNaN(Date.parse(occurredRaw))) {
      errors.occurred_at = "Provide a valid date and time."
    } else {
      // convert the local datetime-local value to an absolute ISO timestamp in the browser's timezone
      formData.set("occurred_at", new Date(occurredRaw).toISOString())
    }

    setFieldErrors(errors)
    setFormError(null)

    if (Object.keys(errors).length > 0) return

    startTransition(async () => {
      const result = await action(formData)
      if (!result) return
      setFormError(result.error ?? null)
      setFieldErrors((result.fieldErrors ?? {}) as Partial<Record<FormFieldKey, string>>)
    })
  }

  function errorFor(key: FormFieldKey) {
    return fieldErrors[key] ? (
      <p role="alert" className="mt-1 text-sm text-red-400">
        {fieldErrors[key]}
      </p>
    ) : null
  }

  const inputClass = (key: FormFieldKey) =>
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

      <div>
        <label htmlFor="machine_id" className="block text-sm font-medium text-text-primary">
          Machine *
        </label>
        <select id="machine_id" name="machine_id" required defaultValue="" className={inputClass("machine_id")}>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="alarm_code" className="block text-sm font-medium text-text-primary">
            Alarm code *
          </label>
          <input
            id="alarm_code"
            name="alarm_code"
            type="text"
            required
            defaultValue=""
            placeholder="e.g. E-4501"
            className={`${inputClass("alarm_code")} font-mono`}
          />
          {errorFor("alarm_code")}
        </div>

        <div>
          <label htmlFor="occurred_at" className="block text-sm font-medium text-text-primary">
            Occurred at *
          </label>
          <input id="occurred_at" name="occurred_at" type="datetime-local" required defaultValue={nowLocalInputValue()} className={inputClass("occurred_at")} />
          {errorFor("occurred_at")}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue=""
          placeholder="What happened? e.g. Spindle overheating during cut"
          className={inputClass("description")}
        />
        {errorFor("description")}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg-secondary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Saving..." : "Report alarm"}
      </button>
    </form>
  )
}

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : ""
}
