"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/features/auth/actions"

export interface NavItem {
  href: string
  label: string
}

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-red-900/50 text-red-400 border border-red-700",
  technician: "bg-blue-900/50 text-accent-blue border border-blue-700",
  viewer: "bg-gray-800 text-gray-400 border border-gray-600",
}

const ICONS: Record<string, React.ReactNode> = {
  "/dashboard": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  "/machines": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  "/alarms": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  "/maintenance": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      <path d="M9 9l3 3" />
    </svg>
  ),
  "/users": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  "/simulator": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h.01" />
      <path d="M9 13h.01" />
      <path d="M13 9h4" />
      <path d="M13 13h4" />
      <path d="M9 17h8" />
    </svg>
  ),
}

function FactoryLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent-blue">
      <path d="M2 20V10l6 4V10l6 4V6l6 4v10z" />
      <path d="M2 20h20" />
    </svg>
  )
}

export default function Nav({ items, name, role }: { items: NavItem[]; name?: string | null; role: string }) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border-color bg-bg-secondary">
      <div className="flex h-14 items-center gap-2 border-b border-border-color px-4">
        <FactoryLogo />
        <span className="text-base font-bold tracking-wide text-text-primary">AMMS</span>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-accent-blue bg-accent-blue/20 text-accent-blue"
                  : "border-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
              }`}
            >
              {ICONS[item.href]}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border-color p-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="min-w-0 truncate text-sm text-text-primary">{name ?? "—"}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_STYLES[role] ?? "bg-gray-800 text-gray-400 border border-gray-600"}`}>
            {role}
          </span>
        </div>
        <form action={signOut} className="mt-2">
          <button
            type="submit"
            className="w-full rounded-md border border-border-color bg-bg-tertiary px-3 py-1.5 text-sm font-medium text-text-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-bg-secondary"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
