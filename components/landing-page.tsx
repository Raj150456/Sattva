"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Leaf,
  ShieldCheck,
  Link2,
  QrCode,
  Brain,
  ArrowRight,
  MapPin,
  FlaskConical,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Link2,
    title: "Blockchain Ledger",
    description: "Every herb batch is immutably recorded on a distributed ledger, creating an unbreakable chain of trust from farm to consumer.",
  },
  {
    icon: Brain,
    title: "AI Verification",
    description: "Advanced machine learning algorithms analyze herb quality, authenticity, and purity with 94%+ accuracy in real-time.",
  },
  {
    icon: QrCode,
    title: "QR Traceability",
    description: "Scan any product QR code to instantly view the complete supply chain journey, lab results, and blockchain verification.",
  },
  {
    icon: MapPin,
    title: "Geo-Tagged Origins",
    description: "Every batch is GPS-tagged at harvest, ensuring complete transparency about where your herbs are grown.",
  },
  {
    icon: FlaskConical,
    title: "Lab Verified",
    description: "Independent lab testing results are stored on IPFS and verified on-chain, guaranteeing product purity and safety.",
  },
  {
    icon: Truck,
    title: "Transport Monitoring",
    description: "Real-time temperature and humidity tracking throughout the supply chain ensures optimal herb preservation.",
  },
]

const stats = [
  { value: "12,400+", label: "Batches Tracked" },
  { value: "98.7%", label: "Verification Rate" },
  { value: "340+", label: "Partner Farms" },
  { value: "2.1M", label: "QR Scans" },
]

export function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full">
        <div className="glass mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">Sattva</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
            <a href="#stats" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Impact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/verify">
              <Button variant="ghost" size="sm" className="text-foreground">Verify Product</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4" />
              Blockchain-Verified Ayurveda
            </div>
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              Trust Every Herb,{" "}
              <span className="text-primary">From Soil to Soul</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Sattva brings unprecedented transparency to the Ayurvedic supply chain. 
              Track every herb from harvest to your hands with blockchain verification, 
              AI quality analysis, and real-time traceability.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button size="lg" variant="outline" className="bg-transparent px-8">
                  <QrCode className="mr-2 h-4 w-4" />
                  Verify a Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Platform Features</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Complete Supply Chain Transparency
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every layer of the Ayurvedic supply chain, verified and visible.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={cn(
                  "glass group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default",
                  hoveredFeature === i && "shadow-lg -translate-y-1"
                )}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-card/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">How It Works</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
              From Farm to Verification in Six Steps
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { step: "01", title: "Harvest & Tag", desc: "Farmer harvests herbs and creates a geo-tagged digital batch record on the platform." },
              { step: "02", title: "AI Quality Check", desc: "Our AI engine analyzes the batch for quality, purity, and authenticity scoring." },
              { step: "03", title: "Blockchain Record", desc: "Batch data is hashed and recorded on the blockchain for immutable verification." },
              { step: "04", title: "Lab Testing", desc: "Independent labs test the batch and upload results, stored on IPFS." },
              { step: "05", title: "QR Generation", desc: "A unique QR code is generated linking to the full supply chain history." },
              { step: "06", title: "Consumer Verify", desc: "Consumers scan the QR to view the complete verified journey of their product." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center sm:px-16">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative">
              <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
                Join the Future of Ayurvedic Trust
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80 leading-relaxed">
                Whether you are a farmer, manufacturer, or conscious consumer, 
                Sattva empowers you with verified transparency.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/login">
                  <Button size="lg" className="bg-background px-8 text-foreground hover:bg-background/90">
                    Start as a Farmer
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10">
                    Join as Manufacturer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold text-foreground">Sattva</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Blockchain-powered Ayurvedic herb traceability platform.
          </p>
        </div>
      </footer>
    </div>
  )
}
