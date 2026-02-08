import { NextResponse } from "next/server"
import { mockBatches, mockSupplyChainEvents, mockLabReports, mockTransportLogs, mockFarms } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const batchId = searchParams.get("batchId")

  if (!batchId) {
    return NextResponse.json({ error: "Batch ID is required" }, { status: 400 })
  }

  const batch = mockBatches.find((b) => b.id === batchId)

  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 })
  }

  const events = mockSupplyChainEvents.filter((e) => e.batchId === batchId)
  const lab = mockLabReports.find((l) => l.batchId === batchId)
  const transportLogs = mockTransportLogs.filter((t) => t.batchId === batchId)
  const farm = mockFarms.find((f) => f.id === batch.farmId)

  return NextResponse.json({
    batch,
    events,
    lab,
    transportLogs,
    farm,
    verified: true,
    verifiedAt: new Date().toISOString(),
  })
}
