"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ArrowRightLeft,
  ShieldCheck,
  BarChart3,
  QrCode,
  Settings,
  ChevronLeft,
  Leaf,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["farmer", "manufacturer"] },
  { label: "Batches", href: "/dashboard/batches", icon: Package, roles: ["farmer", "manufacturer"] },
  { label: "Create Batch", href: "/dashboard/batches/create", icon: PlusCircle, roles: ["farmer"] },
  { label: "Transfers", href: "/dashboard/transfers", icon: ArrowRightLeft, roles: ["farmer", "manufacturer"] },
  { label: "Verification", href: "/dashboard/verification", icon: ShieldCheck, roles: ["manufacturer"] },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["farmer", "manufacturer"] },
  { label: "QR Verify", href: "/dashboard/qr", icon: QrCode, roles: ["manufacturer"] },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["farmer", "manufacturer"] },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredItems = navItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
          <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span
          className={cn(
            "overflow-hidden font-serif text-lg font-semibold tracking-wide transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          Sattva
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed && "ml-0"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" role="navigation" aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                  <span
                    className={cn(
                      "overflow-hidden whitespace-nowrap transition-all duration-300",
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div
            className={cn(
              "flex-1 overflow-hidden transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className={cn(
              "shrink-0 rounded-md p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed && "hidden"
            )}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
