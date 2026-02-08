"use client"

import React from "react"

import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
  className?: string
  glowing?: boolean
}

export function StatCard({ title, value, subtitle, icon, trend, className, glowing }: StatCardProps) {
  return (
    <div
      className={cn(
        "glass group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        glowing && "animate-pulse-glow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              <span className={cn("font-medium", trend.value >= 0 ? "text-accent" : "text-destructive")}>
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
    </div>
  )
}
