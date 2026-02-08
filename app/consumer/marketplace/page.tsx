"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, ShieldCheck, MapPin, Leaf, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockProducts } from "@/lib/mock-data"
import type { Product } from "@/lib/types"

const regions = ["All Regions", "Madhya Pradesh", "Uttarakhand"]
const herbTypes = ["All Herbs", "Ashwagandha", "Tulsi", "Brahmi", "Turmeric", "Neem", "Shatavari"]

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/consumer/product/${product.id}`} className="group block">
      <div className="glass overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image placeholder */}
        <div className="relative flex h-48 items-center justify-center bg-primary/5">
          <Leaf className="h-16 w-16 text-primary/30 transition-transform duration-300 group-hover:scale-110" />
          {product.verified && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
              <span className="rounded-lg bg-background px-4 py-2 text-sm font-semibold text-foreground">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
              {product.herbName}
            </h3>
            <span className="shrink-0 text-sm font-bold text-primary">
              {product.currency === "INR" ? "\u20B9" : "$"}{product.price}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {product.region}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {product.weight}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Grade {product.labGrade}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="font-medium text-foreground">{product.aiQualityScore}%</span>
              <span>AI Score</span>
            </div>
            <span className="text-xs text-muted-foreground">by {product.farmerName}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-48 animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-5 w-12 animate-pulse rounded bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [selectedHerb, setSelectedHerb] = useState("All Herbs")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.herbName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRegion = selectedRegion === "All Regions" || p.region === selectedRegion
      const matchesHerb =
        selectedHerb === "All Herbs" ||
        p.herbName.toLowerCase().includes(selectedHerb.toLowerCase())
      const matchesVerified = !verifiedOnly || p.verified
      return matchesSearch && matchesRegion && matchesHerb && matchesVerified
    })
  }, [searchQuery, selectedRegion, selectedHerb, verifiedOnly])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Marketplace</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover blockchain-verified Ayurvedic herbs from trusted farms
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search herbs, e.g. Tulasi, Ashwagandha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          className="bg-transparent"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {(selectedRegion !== "All Regions" || selectedHerb !== "All Herbs" || verifiedOnly) && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {[selectedRegion !== "All Regions", selectedHerb !== "All Herbs", verifiedOnly].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="animate-fade-in-up rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Herb Type</label>
              <select
                value={selectedHerb}
                onChange={(e) => setSelectedHerb(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {herbTypes.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Verification</label>
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                  verifiedOnly
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                )}
              >
                <ShieldCheck className="h-4 w-4" />
                Verified Only
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-auto text-muted-foreground"
              onClick={() => {
                setSelectedRegion("All Regions")
                setSelectedHerb("All Herbs")
                setVerifiedOnly(false)
              }}
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
      </p>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-lg font-medium text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
