"use client"

import { Package, ShieldCheck, ArrowRightLeft, TrendingUp, Leaf, FlaskConical } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { BatchStatusBadge } from "@/components/batch-status-badge"
import { SupplyChainTimeline } from "@/components/supply-chain-timeline"
import { mockFarmerStats, mockBatches, mockSupplyChainEvents } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { monthlyBatchData } from "@/lib/mock-data"

function RecentBatchesTable() {
  const recentBatches = mockBatches.slice(0, 5)

  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="border-b border-border px-6 py-4">
        <h3 className="font-semibold text-foreground">Recent Batches</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Herb</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentBatches.map((batch) => (
              <tr key={batch.id} className="border-b border-border/50 transition-colors hover:bg-muted/20">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Leaf className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{batch.herbName}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  {batch.quantity} {batch.unit}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-semibold text-accent">{batch.aiQualityScore}%</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <BatchStatusBadge status={batch.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  {new Date(batch.harvestDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BatchChart() {
  return (
    <div className="glass rounded-xl p-6">
      <h3 className="mb-4 font-semibold text-foreground">Monthly Batch Activity</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={monthlyBatchData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 20% 88%)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} />
          <Tooltip
            contentStyle={{
              background: "hsl(40 30% 97%)",
              border: "1px solid hsl(35 20% 88%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="batches" fill="hsl(152 45% 28%)" radius={[4, 4, 0, 0]} name="Total" />
          <Bar dataKey="verified" fill="hsl(142 35% 40%)" radius={[4, 4, 0, 0]} name="Verified" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const stats = mockFarmerStats
  const recentEvents = mockSupplyChainEvents.slice(0, 4)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
        description="Here is an overview of your herb batches and supply chain activity."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Batches"
          value={stats.totalBatches}
          icon={<Package className="h-5 w-5" />}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Verified Batches"
          value={stats.verifiedBatches}
          icon={<ShieldCheck className="h-5 w-5" />}
          trend={{ value: 8, label: "vs last month" }}
          glowing
        />
        <StatCard
          title="Quality Score"
          value={`${stats.qualityScore}%`}
          subtitle="AI-powered assessment"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 2.3, label: "improvement" }}
        />
        <StatCard
          title="Transfers"
          value={stats.totalTransfers}
          icon={<ArrowRightLeft className="h-5 w-5" />}
          trend={{ value: 5, label: "vs last month" }}
        />
      </div>

      {/* Charts and Timeline */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BatchChart />
        </div>
        <div className="glass rounded-xl p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-foreground">Latest Activity</h3>
          <SupplyChainTimeline events={recentEvents} animated />
        </div>
      </div>

      {/* Recent Batches Table */}
      <RecentBatchesTable />
    </div>
  )
}
