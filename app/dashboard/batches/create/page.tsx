"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Leaf, Brain, Link2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { verifyHerbQuality } from "@/lib/services/ai-verification-service"
import { writeBatchToLedger } from "@/lib/services/blockchain-service"
import type { AIVerificationResult } from "@/lib/services/ai-verification-service"

const herbs = ["Ashwagandha", "Tulsi", "Brahmi", "Turmeric", "Neem", "Shatavari", "Giloy", "Moringa"]

type Step = "details" | "ai_verify" | "blockchain" | "done"

export default function CreateBatchPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("details")
  const [herbName, setHerbName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [harvestDate, setHarvestDate] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiResult, setAiResult] = useState<AIVerificationResult | null>(null)
  const [blockchainHash, setBlockchainHash] = useState("")

  async function handleSubmitDetails(e: React.FormEvent) {
    e.preventDefault()
    setStep("ai_verify")
    setIsProcessing(true)
    const result = await verifyHerbQuality(herbName, `b_${Date.now()}`)
    setAiResult(result)
    setIsProcessing(false)
  }

  async function handleBlockchain() {
    setStep("blockchain")
    setIsProcessing(true)
    const result = await writeBatchToLedger(`b_${Date.now()}`, { herbName, quantity })
    setBlockchainHash(result.hash)
    setIsProcessing(false)
    setStep("done")
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Create New Batch" description="Register a new herb harvest batch on the platform." />

      {/* Progress Stepper */}
      <div className="flex items-center gap-2">
        {[
          { key: "details", label: "Batch Details", icon: Leaf },
          { key: "ai_verify", label: "AI Verification", icon: Brain },
          { key: "blockchain", label: "Blockchain", icon: Link2 },
          { key: "done", label: "Complete", icon: MapPin },
        ].map((s, i, arr) => {
          const steps: Step[] = ["details", "ai_verify", "blockchain", "done"]
          const currentIdx = steps.indexOf(step)
          const stepIdx = steps.indexOf(s.key as Step)
          const isActive = stepIdx === currentIdx
          const isDone = stepIdx < currentIdx

          return (
            <div key={s.key} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    isDone && "bg-accent text-accent-foreground",
                    isActive && "bg-primary text-primary-foreground",
                    !isDone && !isActive && "bg-muted text-muted-foreground"
                  )}
                >
                  <s.icon className="h-4 w-4" />
                </div>
                <span className={cn("hidden text-sm font-medium sm:inline", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && <div className="h-px w-8 bg-border sm:w-12" />}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="glass max-w-2xl rounded-xl p-8">
        {step === "details" && (
          <form onSubmit={handleSubmitDetails} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Herb Name</Label>
              <div className="flex flex-wrap gap-2">
                {herbs.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHerbName(h)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                      herbName === h
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="quantity" className="text-foreground">Quantity (kg)</Label>
                <Input id="quantity" type="number" placeholder="500" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="text-foreground">Harvest Date</Label>
                <Input id="date" type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} required />
              </div>
            </div>

            {/* GPS Map Placeholder */}
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Farm Location</Label>
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <MapPin className="h-8 w-8" />
                  <p className="text-sm">GPS location will be auto-detected</p>
                  <p className="text-xs">Bhopal, Madhya Pradesh, India</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!herbName || !quantity || !harvestDate}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Verify with AI
            </Button>
          </form>
        )}

        {step === "ai_verify" && (
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-foreground">AI Quality Verification</h3>
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Analyzing {herbName} batch quality...</p>
              </div>
            ) : aiResult ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg bg-accent/10 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quality Score</p>
                    <p className="text-3xl font-bold text-accent">{aiResult.score}%</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-lg font-bold text-accent">
                    {aiResult.grade}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {aiResult.factors.map((f) => (
                    <div key={f.name} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                      <span className="text-sm text-foreground">{f.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{f.score}%</span>
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          f.status === "pass" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
                        )}>
                          {f.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{aiResult.recommendation}</p>

                <Button onClick={handleBlockchain} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Record on Blockchain
                </Button>
              </div>
            ) : null}
          </div>
        )}

        {step === "blockchain" && isProcessing && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Writing batch to blockchain ledger...</p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 animate-pulse-glow">
              <Leaf className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Batch Registered Successfully</h3>
            <p className="text-sm text-muted-foreground">
              Your {herbName} batch has been verified by AI and recorded on the blockchain.
            </p>
            <div className="mt-2 rounded-lg bg-muted/30 px-4 py-2">
              <p className="text-xs text-muted-foreground">Blockchain Hash</p>
              <p className="font-mono text-xs text-foreground">{blockchainHash.slice(0, 42)}...</p>
            </div>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => router.push("/dashboard/batches")} variant="outline" className="bg-transparent">
                View Batches
              </Button>
              <Button onClick={() => { setStep("details"); setHerbName(""); setQuantity(""); setHarvestDate(""); setAiResult(null); }} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
