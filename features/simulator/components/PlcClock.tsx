"use client"

import { useEffect, useState } from "react"

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

export default function PlcClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : "--:--:--"
  const date = now
    ? `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    : "----:--:--"

  return (
    <div className="text-right font-mono text-green-400" suppressHydrationWarning>
      <p className="text-lg font-bold tabular-nums leading-tight">{time}</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  )
}
