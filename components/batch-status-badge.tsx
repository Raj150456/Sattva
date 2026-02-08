"use client"

import { cn } from "@/lib/utils"
import type { BatchStatus } from "@/lib/types"

const statusStyles: Record<BatchStatus, { label: string; className: string }> = {
  harvested: { label: "Harvested", className: "bg-secondary text-secondary-foreground" },
  verified: { label: "AI Verified", className: "bg-accent/10 text-accent" },
  in_transit: { label: "In Transit", className: "bg-chart-4/10 text-chart-4" },
  processing: { label: "Processing", className: "bg-warning/10 text-warning" },
  lab_tested: { label: "Lab Tested", className: "bg-chart-1/10 text-chart-1" },
  qr_generated: { label: "QR Generated", className: "bg-primary/10 text-primary" },
  delivered: { label: "Delivered", className: "bg-success/10 text-success" },
}

export function BatchStatusBadge({ status }: { status: BatchStatus }) {
  const config = statusStyles[status]
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", config.className)}>
      {config.label}
    </span>
  )
}
