"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/machines": "Machines",
  "/alarms": "Alarms",
  "/maintenance": "Maintenance",
  "/users": "Users",
  "/simulator": "PLC Simulator",
}

function pageTitle(pathname: string): string {
  const match = Object.keys(TITLES).find((href) => pathname === href || pathname.startsWith(href + "/"))
  return match ? TITLES[match] : "AMMS"
}

function formatClock(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export default function Header() {
  const pathname = usePathname()
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-color bg-bg-secondary px-6">
      <h1 className="text-base font-semibold text-text-primary">{pageTitle(pathname)}</h1>
      <span className="font-mono text-sm tabular-nums text-text-secondary" suppressHydrationWarning>
        {now ? formatClock(now) : "--:--:--"}
      </span>
    </header>
  )
}
