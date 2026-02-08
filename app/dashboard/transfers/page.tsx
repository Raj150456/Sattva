"use client"

import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { mockTransfers, mockBatches } from "@/lib/mock-data"

export default function TransfersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Transfers" description="Track ownership transfers across the supply chain." />

      <div className="flex flex-col gap-4">
        {mockTransfers.map((transfer) => {
          const batch = mockBatches.find((b) => b.id === transfer.batchId)
          return (
            <div key={transfer.id} className="glass flex items-center gap-6 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{batch?.herbName || "Unknown Herb"}</p>
                <p className="text-xs text-muted-foreground font-mono">{transfer.batchId}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{transfer.fromUserName}</p>
                  <p className="text-xs text-muted-foreground">Sender</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{transfer.toUserName}</p>
                  <p className="text-xs text-muted-foreground">Receiver</p>
                </div>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-sm text-foreground">
                  {new Date(transfer.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transfer.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
