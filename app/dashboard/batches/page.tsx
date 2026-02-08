"use client"

import { useState } from "react"
import { Leaf, Search, Filter } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { BatchStatusBadge } from "@/components/batch-status-badge"
import { VerifiedBadge } from "@/components/verified-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockBatches } from "@/lib/mock-data"
import type { BatchStatus } from "@/lib/types"
import Link from "next/link"

const statusFilters: (BatchStatus | "all")[] = ["all", "harvested", "verified", "in_transit", "processing", "lab_tested", "qr_generated", "delivered"]

export default function BatchesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<BatchStatus | "all">("all")

  const filtered = mockBatches.filter((b) => {
    const matchSearch = b.herbName.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search)
    const matchStatus = statusFilter === "all" || b.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Batches" description="Manage and track all your herb batches.">
        <Link href="/dashboard/batches/create">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Create Batch
          </Button>
        </Link>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by herb name or batch ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((batch) => (
          <div
            key={batch.id}
            className="glass group overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{batch.herbName}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{batch.id}</p>
                  </div>
                </div>
                <BatchStatusBadge status={batch.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="text-sm font-medium text-foreground">{batch.quantity} {batch.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quality Score</p>
                  <p className="text-sm font-semibold text-accent">{batch.aiQualityScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Harvest Date</p>
                  <p className="text-sm text-foreground">
                    {new Date(batch.harvestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Blockchain</p>
                  <VerifiedBadge status="verified" size="sm" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <p className="truncate font-mono text-xs text-muted-foreground">{batch.blockchainHash.slice(0, 20)}...</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 py-16">
          <Leaf className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No batches found matching your search.</p>
        </div>
      )}
    </div>
  )
}
