"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

function seededRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return function () {
    hash = (hash * 16807) % 2147483647
    return (hash & 2147483647) / 2147483647
  }
}

export default function QRPlaceholder({ batchId }: { batchId: string }) {
  const pattern = useMemo(() => {
    const rng = seededRandom(batchId)
    return Array.from({ length: 25 }, () => rng() > 0.4)
  }, [batchId])

  return (
    <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-primary/20 bg-background">
      <div className="grid grid-cols-5 gap-0.5">
        {pattern.map((filled, i) => (
          <div
            key={i}
            className={cn("h-4 w-4 rounded-sm", filled ? "bg-foreground" : "bg-transparent")}
          />
        ))}
      </div>
    </div>
  )
}
