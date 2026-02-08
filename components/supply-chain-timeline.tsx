"use client"

import React from "react"

import {
  Sprout,
  Brain,
  ArrowRightLeft,
  FlaskConical,
  Factory,
  QrCode,
  PackageCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SupplyChainEvent } from "@/lib/types"
import { VerifiedBadge } from "./verified-badge"

const eventIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  harvest: Sprout,
  verification: Brain,
  transfer: ArrowRightLeft,
  lab_test: FlaskConical,
  processing: Factory,
  qr_generated: QrCode,
  delivery: PackageCheck,
}

interface SupplyChainTimelineProps {
  events: SupplyChainEvent[]
  animated?: boolean
}

export function SupplyChainTimeline({ events, animated = true }: SupplyChainTimelineProps) {
  return (
    <div className="relative flex flex-col gap-0">
      {events.map((event, index) => {
        const Icon = eventIcons[event.type] || Sprout
        const isLast = index === events.length - 1

        return (
          <div
            key={event.id}
            className={cn("relative flex gap-4 pb-8", animated && "animate-fade-in-up")}
            style={animated ? { animationDelay: `${index * 150}ms`, animationFillMode: "backwards" } : undefined}
          >
            {/* Line */}
            {!isLast && (
              <div className="absolute left-[19px] top-10 h-[calc(100%-24px)] w-[2px] bg-border" />
            )}

            {/* Icon node */}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                event.verified
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                {event.verified && <VerifiedBadge status="verified" size="sm" showLabel={false} />}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{new Date(event.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span>by {event.actor}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
