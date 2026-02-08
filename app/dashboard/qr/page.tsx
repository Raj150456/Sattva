"use client"

import { useState, useMemo } from "react"
import { QrCode, Download, ExternalLink, Leaf } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { VerifiedBadge } from "@/components/verified-badge"
import { mockBatches, mockQRRecords } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"
import QRPlaceholder from "@/components/qr-placeholder" // Declaring the QRPlaceholder component

export default function QRPage() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [generatedQRs, setGeneratedQRs] = useState<Set<string>>(
    new Set(mockQRRecords.map((q) => q.batchId))
  )

  const eligibleBatches = mockBatches.filter(
    (b) => b.status === "lab_tested" || b.status === "qr_generated" || b.status === "delivered"
  )

  async function handleGenerateQR(batchId: string) {
    setGenerating(batchId)
    await new Promise((r) => setTimeout(r, 1500))
    setGeneratedQRs((prev) => new Set([...prev, batchId]))
    setGenerating(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="QR Code Generation" description="Generate verification QR codes for verified batches." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eligibleBatches.map((batch) => {
          const hasQR = generatedQRs.has(batch.id)
          const isGenerating = generating === batch.id

          return (
            <div key={batch.id} className="glass overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{batch.herbName}</p>
                      <p className="text-xs text-muted-foreground">{batch.quantity} {batch.unit}</p>
                    </div>
                  </div>
                  <VerifiedBadge status="verified" size="sm" />
                </div>

                <div className="mt-4">
                  {hasQR ? (
                    <div className="flex flex-col items-center gap-3 rounded-lg bg-muted/30 p-4">
                      {/* QR Code visual representation */}
                      <QRPlaceholder batchId={batch.id} />
                      <p className="text-xs text-muted-foreground">sattva.io/verify/{batch.id}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-transparent text-xs">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                        <Link href={`/verify?batch=${batch.id}`}>
                          <Button size="sm" variant="outline" className="bg-transparent text-xs">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Preview
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border py-6">
                      {isGenerating ? (
                        <>
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <p className="text-xs text-muted-foreground">Generating QR code...</p>
                        </>
                      ) : (
                        <>
                          <QrCode className="h-8 w-8 text-muted-foreground/40" />
                          <Button
                            size="sm"
                            onClick={() => handleGenerateQR(batch.id)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Generate QR Code
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
