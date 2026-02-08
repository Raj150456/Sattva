"use client"

import { useState } from "react"
import { ShieldCheck, Upload, FileCheck, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { VerifiedBadge } from "@/components/verified-badge"
import { mockBatches, mockLabReports } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function VerificationPage() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)

  const pendingBatches = mockBatches.filter(
    (b) => b.status === "verified" || b.status === "in_transit" || b.status === "lab_tested"
  )

  async function handleUploadLabReport() {
    setUploading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setUploading(false)
    setUploadDone(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Verification Center" description="Verify batches and upload lab reports." />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Batch List */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pending Batches</h3>
          {pendingBatches.map((batch) => (
            <button
              key={batch.id}
              onClick={() => { setSelectedBatch(batch.id); setUploadDone(false) }}
              className={cn(
                "glass flex items-center gap-4 rounded-xl p-4 text-left transition-all",
                selectedBatch === batch.id ? "ring-2 ring-primary" : "hover:shadow-md"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{batch.herbName}</p>
                <p className="text-xs text-muted-foreground">Score: {batch.aiQualityScore}%</p>
              </div>
              <VerifiedBadge
                status={batch.status === "lab_tested" ? "verified" : "pending"}
                size="sm"
              />
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selectedBatch ? (
            <div className="glass rounded-xl p-6">
              {(() => {
                const batch = mockBatches.find((b) => b.id === selectedBatch)
                const lab = mockLabReports.find((l) => l.batchId === selectedBatch)

                if (!batch) return null

                return (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{batch.herbName}</h3>
                        <p className="font-mono text-xs text-muted-foreground">{batch.id}</p>
                      </div>
                      <VerifiedBadge status={lab ? "verified" : "pending"} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">AI Quality</p>
                        <p className="text-xl font-bold text-accent">{batch.aiQualityScore}%</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="text-xl font-bold text-foreground">{batch.quantity} {batch.unit}</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Blockchain</p>
                        <p className="truncate font-mono text-xs text-foreground">{batch.blockchainHash.slice(0, 18)}...</p>
                      </div>
                    </div>

                    {lab ? (
                      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                        <div className="flex items-center gap-2 text-accent">
                          <FileCheck className="h-5 w-5" />
                          <span className="font-semibold">Lab Report Verified</span>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Purity</span>
                            <span className="font-medium text-foreground">{lab.results.purity}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Active Compounds</span>
                            <span className="font-medium text-foreground">{lab.results.activeCompounds}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Contaminants</span>
                            <span className="font-medium text-accent">None Detected</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Grade</span>
                            <span className="font-bold text-accent">{lab.results.grade}</span>
                          </div>
                        </div>
                        <p className="mt-2 font-mono text-xs text-muted-foreground">IPFS: {lab.ipfsHash.slice(0, 24)}...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border py-8">
                        {uploadDone ? (
                          <>
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                              <FileCheck className="h-7 w-7 text-accent" />
                            </div>
                            <p className="text-sm font-medium text-foreground">Lab report uploaded successfully</p>
                          </>
                        ) : uploading ? (
                          <>
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <p className="text-sm text-muted-foreground">Uploading to IPFS...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground">No lab report uploaded yet</p>
                            <Button onClick={handleUploadLabReport} className="bg-primary text-primary-foreground hover:bg-primary/90">
                              Upload Lab Report
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-xl bg-muted/20 py-24">
              <ShieldCheck className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">Select a batch to view verification details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
