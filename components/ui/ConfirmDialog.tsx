"use client"

import { useState, useTransition } from "react"

function isNextRedirect(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest?: unknown }).digest === "string" &&
    ((err as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
      (err as { digest: string }).digest.startsWith("NEXT_HYDRATION"))
  )
}

export default function ConfirmDialog({
  label,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
}: {
  label: string
  title: string
  message?: string
  confirmLabel?: string
  onConfirm: () => Promise<unknown>
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function close() {
    if (!pending) {
      setOpen(false)
      setError(null)
    }
  }

  function confirm() {
    startTransition(async () => {
      try {
        const result = await onConfirm()
        if (result && typeof result === "object" && "error" in result) {
          setError((result as { error?: string }).error ?? "Something went wrong")
          return
        }
        setOpen(false)
        setError(null)
      } catch (err) {
        if (isNextRedirect(err)) throw err
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null)
          setOpen(true)
        }}
        className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
      >
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50" onClick={close} aria-hidden="true"></div>
          <div role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 id="confirm-dialog-title" className="text-base font-semibold text-gray-900">{title}</h2>
            {message ? <p className="mt-2 text-sm text-gray-600">{message}</p> : null}
            {error ? (
              <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                disabled={pending}
                autoFocus
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={pending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Working..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
