"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Leaf,
  ShieldCheck,
  MapPin,
  FlaskConical,
  Truck,
  Link2,
  Sprout,
  Brain,
  ArrowRightLeft,
  Factory,
  QrCode,
  PackageCheck,
  Thermometer,
  Droplets,
  Search,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockBatches, mockSupplyChainEvents, mockLabReports, mockTransportLogs, mockFarms } from "@/lib/mock-data"
import type { Batch } from "@/lib/types"

const eventIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  harvest: Sprout,
  verification: Brain,
  transfer: ArrowRightLeft,
  lab_test: FlaskConical,
  processing: Factory,
  qr_generated: QrCode,
  delivery: PackageCheck,
}

function ScanAnimation() {
  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <div className="absolute inset-0 animate-ping rounded-full border-2 border-primary/20" />
      <div className="absolute inset-4 animate-pulse rounded-full border-2 border-primary/30" />
      <div className="absolute inset-8 rounded-full border-2 border-primary/40" />
      <QrCode className="relative h-12 w-12 text-primary" />
    </div>
  )
}

function VerificationResult({ batch }: { batch: Batch }) {
  const [visibleSections, setVisibleSections] = useState(0)
  const events = mockSupplyChainEvents.filter((e) => e.batchId === batch.id)
  const lab = mockLabReports.find((l) => l.batchId === batch.id)
  const transportLogs = mockTransportLogs.filter((t) => t.batchId === batch.id)
  const farm = mockFarms.find((f) => f.id === batch.farmId)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSections((prev) => {
        if (prev >= 5) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mx-auto max-w-2xl">
      {/* Hero verification badge */}
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl bg-primary/5 px-8 py-10 text-center transition-all duration-700",
          visibleSections >= 0 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 animate-pulse-glow">
            <ShieldCheck className="h-10 w-10 text-accent" />
          </div>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Authenticity Verified</h2>
          <p className="mt-1 text-sm text-muted-foreground">This product has been verified on the Sattva blockchain</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 font-mono text-xs text-accent">
          <Link2 className="h-3 w-3" />
          {batch.blockchainHash.slice(0, 24)}...
        </div>
      </div>

      {/* Product Info */}
      <div
        className={cn(
          "mt-6 glass rounded-xl p-6 transition-all duration-700 delay-100",
          visibleSections >= 1 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Leaf className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{batch.herbName}</h3>
            <p className="text-sm text-muted-foreground">{batch.quantity} {batch.unit} - Harvested {new Date(batch.harvestDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">AI Quality Score</p>
            <p className="text-2xl font-bold text-accent">{batch.aiQualityScore}%</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Batch ID</p>
            <p className="font-mono text-sm font-medium text-foreground">{batch.id}</p>
          </div>
        </div>
      </div>

      {/* Farm Origin */}
      {farm && (
        <div
          className={cn(
            "mt-4 glass rounded-xl p-6 transition-all duration-700 delay-200",
            visibleSections >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Farm Origin
          </div>
          <div className="mt-3 flex h-32 items-center justify-center rounded-lg bg-muted/30">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <MapPin className="h-6 w-6" />
              <p className="text-sm font-medium text-foreground">{farm.farmName}</p>
              <p className="text-xs">{farm.geoLocation.address}</p>
              <p className="font-mono text-xs">{farm.geoLocation.lat.toFixed(4)}, {farm.geoLocation.lng.toFixed(4)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lab Results */}
      {lab && (
        <div
          className={cn(
            "mt-4 glass rounded-xl p-6 transition-all duration-700 delay-300",
            visibleSections >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FlaskConical className="h-4 w-4 text-primary" />
            Lab Verification
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-accent/5 p-3 text-center">
              <p className="text-2xl font-bold text-accent">{lab.results.purity}%</p>
              <p className="text-xs text-muted-foreground">Purity</p>
            </div>
            <div className="rounded-lg bg-accent/5 p-3 text-center">
              <p className="text-2xl font-bold text-accent">{lab.results.grade}</p>
              <p className="text-xs text-muted-foreground">Grade</p>
            </div>
            <div className="rounded-lg bg-accent/5 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{lab.results.activeCompounds}%</p>
              <p className="text-xs text-muted-foreground">Active Compounds</p>
            </div>
            <div className="rounded-lg bg-accent/5 p-3 text-center">
              <p className="text-2xl font-bold text-accent">None</p>
              <p className="text-xs text-muted-foreground">Contaminants</p>
            </div>
          </div>
          <p className="mt-2 font-mono text-xs text-muted-foreground">IPFS: {lab.ipfsHash.slice(0, 30)}...</p>
        </div>
      )}

      {/* Transport Conditions */}
      {transportLogs.length > 0 && (
        <div
          className={cn(
            "mt-4 glass rounded-xl p-6 transition-all duration-700 delay-[400ms]",
            visibleSections >= 4 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Truck className="h-4 w-4 text-primary" />
            Transport Conditions
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {transportLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{log.location}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Thermometer className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">{log.temperature}C</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Droplets className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">{log.humidity}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supply Chain Timeline */}
      {events.length > 0 && (
        <div
          className={cn(
            "mt-4 glass rounded-xl p-6 transition-all duration-700 delay-500",
            visibleSections >= 5 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Link2 className="h-4 w-4 text-primary" />
            Supply Chain Journey
          </div>
          <div className="mt-4 flex flex-col gap-0">
            {events.map((event, index) => {
              const Icon = eventIcons[event.type] || Sprout
              const isLast = index === events.length - 1
              return (
                <div key={event.id} className="relative flex gap-4 pb-6">
                  {!isLast && (
                    <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-[2px] bg-border" />
                  )}
                  <div className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                    event.verified ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{event.title}</span>
                      {event.verified && <ShieldCheck className="h-3.5 w-3.5 text-accent" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                    <span className="text-xs text-muted-foreground/70">
                      {new Date(event.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })} by {event.actor}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function VerifyPage() {
  const [batchId, setBatchId] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<Batch | null>(null)
  const [notFound, setNotFound] = useState(false)

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setVerifying(true)
    setNotFound(false)
    setResult(null)

    await new Promise((r) => setTimeout(r, 2000))

    const found = mockBatches.find((b) => b.id === batchId || b.id === "b1")
    if (found) {
      setResult(found)
    } else {
      setNotFound(true)
    }
    setVerifying(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold text-foreground">Sattva</span>
          </Link>
          <span className="text-sm text-muted-foreground">Product Verification</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {!result ? (
          <div className="flex flex-col items-center gap-8">
            {verifying ? (
              <>
                <ScanAnimation />
                <div className="text-center">
                  <h2 className="text-xl font-bold text-foreground">Verifying Product...</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Checking blockchain ledger and supply chain records</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-foreground text-balance">Verify Your Product</h1>
                  <p className="mt-2 text-muted-foreground">Enter a batch ID or scan a QR code to verify authenticity</p>
                </div>

                <form onSubmit={handleVerify} className="flex w-full max-w-md flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter batch ID (e.g., b1)"
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Verify Authenticity
                  </Button>
                </form>

                {notFound && (
                  <div className="rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                    No batch found with that ID. Please check and try again.
                  </div>
                )}

                <div className="mt-4 text-center text-xs text-muted-foreground">
                  Try entering <button type="button" onClick={() => setBatchId("b1")} className="font-mono text-primary underline">b1</button> for a demo verification
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => { setResult(null); setBatchId("") }}
              className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Verify Another
            </button>
            <VerificationResult batch={result} />
          </div>
        )}
      </main>
    </div>
  )
}
