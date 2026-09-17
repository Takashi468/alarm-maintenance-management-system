"use client"

import { useState } from "react"
import { signIn } from "@/features/auth/actions"

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    const formData = new FormData(event.currentTarget)
    setLoading(true)
    setError(null)

    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-1 block w-full rounded-md border border-border-color bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="mt-1 block w-full rounded-md border border-border-color bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
