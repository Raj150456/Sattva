"use client"

import { PageHeader } from "@/components/page-header"
import { monthlyBatchData, herbDistribution, mockManufacturerStats } from "@/lib/mock-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from "recharts"

const COLORS = [
  "hsl(152 45% 28%)",
  "hsl(142 35% 40%)",
  "hsl(35 40% 55%)",
  "hsl(170 30% 45%)",
  "hsl(25 50% 50%)",
]

const activityData = [
  { day: "Mon", scans: 120, verifications: 45 },
  { day: "Tue", scans: 150, verifications: 60 },
  { day: "Wed", scans: 180, verifications: 72 },
  { day: "Thu", scans: 140, verifications: 55 },
  { day: "Fri", scans: 200, verifications: 80 },
  { day: "Sat", scans: 90, verifications: 35 },
  { day: "Sun", scans: 70, verifications: 28 },
]

const qualityTrend = [
  { month: "Jun", score: 88.2 },
  { month: "Jul", score: 89.5 },
  { month: "Aug", score: 91.0 },
  { month: "Sep", score: 92.3 },
  { month: "Oct", score: 94.1 },
  { month: "Nov", score: 95.4 },
]

const tooltipStyle = {
  background: "hsl(40 30% 97%)",
  border: "1px solid hsl(35 20% 88%)",
  borderRadius: "8px",
  fontSize: "12px",
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Analytics" description="Platform insights and supply chain metrics." />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Batches", value: "89", change: "+12%" },
          { label: "Verified Rate", value: "95.4%", change: "+2.1%" },
          { label: "Active Farms", value: "34", change: "+5" },
          { label: "QR Scans (Week)", value: "1,240", change: "+18%" },
        ].map((m) => (
          <div key={m.label} className="glass rounded-xl p-5">
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{m.value}</p>
            <p className="mt-1 text-xs font-medium text-accent">{m.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Batch Activity */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-4 font-semibold text-foreground">Monthly Batch Activity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyBatchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 20% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="batches" fill="hsl(152 45% 28%)" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="verified" fill="hsl(142 35% 40%)" radius={[4, 4, 0, 0]} name="Verified" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Herb Distribution */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-4 font-semibold text-foreground">Herb Distribution</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie
                  data={herbDistribution}
                  dataKey="percentage"
                  nameKey="herb"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {herbDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {herbDistribution.map((item, i) => (
                <div key={item.herb} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-sm text-foreground">{item.herb}</span>
                  <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quality Trend */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-4 font-semibold text-foreground">Quality Score Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={qualityTrend}>
              <defs>
                <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 35% 40%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 35% 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 20% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} />
              <YAxis domain={[85, 100]} tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="score" stroke="hsl(142 35% 40%)" fill="url(#qualityGradient)" strokeWidth={2} name="Quality Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-4 font-semibold text-foreground">Weekly Scan Activity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 20% 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(150 10% 45%)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="scans" stroke="hsl(152 45% 28%)" strokeWidth={2} dot={{ r: 4 }} name="QR Scans" />
              <Line type="monotone" dataKey="verifications" stroke="hsl(142 35% 40%)" strokeWidth={2} dot={{ r: 4 }} name="Verifications" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
