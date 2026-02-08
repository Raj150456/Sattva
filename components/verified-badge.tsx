"use client"

import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerifiedBadgeProps {
  status: "verified" | "pending" | "rejected" | "unverified"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

const statusConfig = {
  verified: { label: "Verified", bgClass: "bg-accent/10 text-accent", pulseClass: "animate-pulse-glow" },
  pending: { label: "Pending", bgClass: "bg-warning/10 text-warning", pulseClass: "" },
  rejected: { label: "Rejected", bgClass: "bg-destructive/10 text-destructive", pulseClass: "" },
  unverified: { label: "Unverified", bgClass: "bg-muted text-muted-foreground", pulseClass: "" },
}

const sizeConfig = {
  sm: { icon: "h-3 w-3", text: "text-xs", padding: "px-2 py-0.5", container: "h-4 w-4" },
  md: { icon: "h-4 w-4", text: "text-sm", padding: "px-2.5 py-1", container: "h-5 w-5" },
  lg: { icon: "h-5 w-5", text: "text-base", padding: "px-3 py-1.5", container: "h-6 w-6" },
}

export function VerifiedBadge({ status, size = "md", showLabel = true }: VerifiedBadgeProps) {
  const config = statusConfig[status]
  const sizing = sizeConfig[size]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-all",
        config.bgClass,
        sizing.padding,
        sizing.text,
        status === "verified" && "shadow-sm"
      )}
    >
      <ShieldCheck className={cn(sizing.icon, status === "verified" && "animate-pulse")} />
      {showLabel && config.label}
    </span>
  )
}
