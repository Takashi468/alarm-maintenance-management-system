"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/features/auth/actions"

export interface NavItem {
  href: string
  label: string
}

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  technician: "bg-blue-100 text-blue-800",
  viewer: "bg-gray-200 text-gray-700",
}

export default function Nav({ items, name, role }: { items: NavItem[]; name?: string | null; role: string }) {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-base font-bold tracking-tight text-gray-900">
          AMMS
        </Link>

        <nav aria-label="Main navigation" className="-mx-1 flex flex-1 items-center gap-1 overflow-x-auto">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ${
                  active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden max-w-[12rem] truncate text-sm text-gray-600 sm:inline">{name ?? "—"}</span>
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[role] ?? "bg-gray-100 text-gray-800"}`}>
            {role}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
