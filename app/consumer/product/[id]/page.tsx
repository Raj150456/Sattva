"use client"

import React from "react"

import { useState, use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Leaf,
  FlaskConical,
  Truck,
  User,
  ShoppingCart,
  ExternalLink,
  Clock,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockProducts, mockSupplyChainEvents, mockLabReports, mockBatches, mockFarms } from "@/lib/mock-data"
import { SupplyChainTimeline } from "@/components/supply-chain-timeline"
import { VerifiedBadge } from "@/components/verified-badge"

type TabKey = "overview" | "supply-chain" | "farmers" | "lab-reports"

const productTabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Overview", icon: Leaf },
  { key: "supply-chain", label: "Supply Chain", icon: Truck },
  { key: "farmers", label: "Farmers", icon: User },
  { key: "lab-reports", label: "Lab Reports", icon: FlaskConical },
]

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const [showCheckout, setShowCheckout] = useState(false)

  const product = mockProducts.find((p) => p.id === id)
  if (!product) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-lg font-medium text-foreground">Product not found</p>
        <Link href="/consumer/marketplace">
          <Button variant="outline" className="bg-transparent">Back to Marketplace</Button>
        </Link>
      </div>
    )
  }

  const batch = mockBatches.find((b) => b.id === product.batchId)
  const farm = mockFarms.find((f) => f.id === product.farmId)
  const events = mockSupplyChainEvents.filter((e) => e.batchId === product.batchId)
  const labReport = mockLabReports.find((r) => r.batchId === product.batchId)

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <Link
        href="/consumer/marketplace"
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      {/* Hero Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image */}
        <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-primary/5 lg:h-96">
          <Leaf className="h-28 w-28 text-primary/20" />
          {product.verified && (
            <div className="absolute left-4 top-4">
              <VerifiedBadge size="lg" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{product.weight}</Badge>
              <Badge variant="secondary">Grade {product.labGrade}</Badge>
              {product.verified && (
                <Badge className="bg-primary text-primary-foreground">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Blockchain Verified
                </Badge>
              )}
            </div>
            <h1 className="mt-3 font-serif text-2xl font-bold text-foreground sm:text-3xl text-balance">
              {product.herbName}
            </h1>
            <p className="mt-2 leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {farm?.geoLocation.address || product.region}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Farmer: <span className="font-medium text-foreground">{product.farmerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              Manufacturer: <span className="font-medium text-foreground">{product.manufacturerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-warning text-warning" />
              AI Quality Score: <span className="font-medium text-foreground">{product.aiQualityScore}%</span>
            </div>
          </div>

          {/* Price + Buy */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-serif text-3xl font-bold text-foreground">
                {product.currency === "INR" ? "\u20B9" : "$"}{product.price}
              </p>
            </div>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!product.inStock}
              onClick={() => setShowCheckout(true)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.inStock ? "Buy Now" : "Out of Stock"}
            </Button>
          </div>

          {/* Blockchain hash */}
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-xs text-muted-foreground">Blockchain Hash:</span>
            <code className="truncate font-mono text-xs text-foreground/70">{product.blockchainHash}</code>
            <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1" aria-label="Product details tabs">
          {productTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up">
        {activeTab === "overview" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Batch ID</p>
              <p className="font-mono text-sm text-foreground">{product.batchId}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Harvest Date</p>
              <p className="text-sm text-foreground">
                {batch ? new Date(batch.harvestDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Batch Quantity</p>
              <p className="text-sm text-foreground">{batch ? `${batch.quantity} ${batch.unit}` : "N/A"}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Status</p>
              <Badge variant="secondary" className="w-fit capitalize">{batch?.status.replace("_", " ") || "N/A"}</Badge>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Farm</p>
              <p className="text-sm text-foreground">{farm?.farmName || "N/A"}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Lab Grade</p>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-bold text-primary">
                  {product.labGrade}
                </span>
                {labReport?.verificationStatus === "verified" && (
                  <ShieldCheck className="h-4 w-4 text-accent" />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "supply-chain" && (
          <div>
            {events.length > 0 ? (
              <SupplyChainTimeline events={events} />
            ) : (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Clock className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Supply chain events will appear here as the batch progresses</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "farmers" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-foreground">{product.farmerName}</h3>
                <p className="text-sm text-muted-foreground">Primary Grower</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {farm?.geoLocation.address || product.region}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <ShieldCheck className="h-3 w-3 text-accent" />
                  <span className="text-accent">Verified Farmer</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <Truck className="h-7 w-7 text-accent" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-foreground">{product.manufacturerName}</h3>
                <p className="text-sm text-muted-foreground">Manufacturer & Distributor</p>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <ShieldCheck className="h-3 w-3 text-accent" />
                  <span className="text-accent">Verified Manufacturer</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "lab-reports" && (
          <div>
            {labReport ? (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Lab Report #{labReport.id}</h3>
                  <Badge className={cn(
                    labReport.verificationStatus === "verified"
                      ? "bg-primary text-primary-foreground"
                      : "bg-warning text-warning-foreground"
                  )}>
                    {labReport.verificationStatus === "verified" ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Test Date: {new Date(labReport.testDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Purity</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{labReport.results.purity}%</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Contaminants</p>
                    <p className="mt-1 text-2xl font-bold text-accent">{labReport.results.contaminants ? "Detected" : "None"}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Active Compounds</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{labReport.results.activeCompounds}%</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p className="mt-1 text-2xl font-bold text-primary">{labReport.results.grade}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-xs text-muted-foreground">IPFS Hash:</span>
                  <code className="truncate font-mono text-xs text-foreground/70">{labReport.ipfsHash}</code>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <FlaskConical className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Lab report pending for this product</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal product={product} onClose={() => setShowCheckout(false)} />
      )}
    </div>
  )
}

function CheckoutModal({ product, onClose }: { product: typeof mockProducts[0]; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState("42 MG Road, Bangalore, Karnataka 560001")
  const [isOrdering, setIsOrdering] = useState(false)
  const [ordered, setOrdered] = useState(false)

  async function handleOrder() {
    setIsOrdering(true)
    await new Promise((r) => setTimeout(r, 1200))
    setIsOrdering(false)
    setOrdered(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-fade-in-up mx-4 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {ordered ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Order Placed!</h3>
            <p className="text-sm text-muted-foreground">Your order has been confirmed. Track it in the Orders tab.</p>
            <div className="flex gap-3">
              <Link href="/consumer/orders">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">View Orders</Button>
              </Link>
              <Button variant="outline" className="bg-transparent" onClick={onClose}>Continue Shopping</Button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-foreground">Checkout</h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.herbName}</p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">
                  {product.currency === "INR" ? "\u20B9" : "$"}{product.price * quantity}
                </span>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>Cancel</Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleOrder}
                  disabled={isOrdering}
                >
                  {isOrdering ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Processing...
                    </span>
                  ) : (
                    "Confirm Order"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
