"use client"

import { useState, useTransition } from "react"
import type { AlarmActionResult } from "../actions"
import type { AlarmStatus } from "../constants"

export default function AlarmStatusModal({
  alarmId,
  status,
  onStart,
  onCloseAlarm,
}: {
  alarmId: string
  status: AlarmStatus
  onStart: () => Promise<AlarmActionResult>
  onCloseAlarm: (cause: string) => Promise<AlarmActionResult>
}) {
  const [open, setOpen] = useState(false)
  const [cause, setCause] = useState("")
  const [causeError, setCauseError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (status === "Closed") return null

  const target: AlarmStatus = status === "Open" ? "In Progress" : "Closed"
  const needsCause = target === "Closed"

  function resetAndClose() {
    setOpen(false)
    setCause("")
    setCauseError(null)
    setFormError(null)
  }

  function confirm() {
    if (pending) return

    if (needsCause && cause.trim() === "") {
      setCauseError("Cause is required to close an alarm.")
      return
    }

    startTransition(async () => {
      const result = needsCause ? await onCloseAlarm(cause) : await onStart()
      if (!result) return // success -> server redirected, component unmounts
      setFormError(result.error ?? null)
      setCauseError(result.fieldErrors?.cause ?? (needsCause && cause.trim() === "" ? "Cause is required to close an alarm." : null))
    })
  }

  const buttonLabel = status === "Open" ? "In Progress" : "Close..."

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFormError(null)
          setCauseError(null)
          setOpen(true)
        }}
        className={`rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          status === "Open"
            ? "border-blue-200 bg-white text-blue-700 hover:bg-blue-50 focus:ring-blue-500"
            : "border-green-200 bg-white text-green-700 hover:bg-green-50 focus:ring-green-500"
        }`}
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !pending && resetAndClose()}>
          <div role="dialog" aria-modal="true" data-alarm-id={alarmId} className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-gray-900">
              {status === "Open" ? "Move to In Progress?" : "Close alarm?"}
            </h2>

            {formError && (
              <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </p>
            )}

            {status === "Open" ? (
              <p className="mt-3 text-sm text-gray-600">
                Mark this alarm as In Progress to start working on it. You can close it with a cause once the work is done.
              </p>
            ) : (
              <div className="mt-3">
                <label htmlFor="close-cause" className="block text-sm font-medium text-gray-700">
                  Cause *
                </label>
                <textarea
                  id="close-cause"
                  rows={4}
                  value={cause}
                  onChange={(e) => {
                    setCause(e.target.value)
                    if (causeError) setCauseError(null)
                  }}
                  placeholder="What was the root cause? e.g. Worn drive belt replaced"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                    causeError ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {causeError && (
                  <p role="alert" className="mt-1 text-sm text-red-600">
                    {causeError}
                  </p>
                )}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetAndClose}
                disabled={pending}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={pending}
                className={`rounded-md px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${
                  status === "Open" ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                }`}
              >
                {pending ? "Saving..." : status === "Open" ? "Confirm" : "Close alarm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
