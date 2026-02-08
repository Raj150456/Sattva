import { NextResponse } from "next/server"
import { mockBatches } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  let batches = [...mockBatches]

  if (status && status !== "all") {
    batches = batches.filter((b) => b.status === status)
  }

  if (search) {
    const q = search.toLowerCase()
    batches = batches.filter(
      (b) => b.herbName.toLowerCase().includes(q) || b.id.includes(q)
    )
  }

  return NextResponse.json({ batches, total: batches.length })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { herbName, quantity, harvestDate, farmId } = body

  if (!herbName || !quantity || !harvestDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Simulate creating a batch
  const newBatch = {
    id: `b_${Date.now()}`,
    herbName,
    quantity: Number(quantity),
    unit: "kg",
    harvestDate,
    aiQualityScore: 0,
    blockchainHash: "",
    status: "harvested" as const,
    createdBy: "u1",
    farmId: farmId || "f1",
  }

  return NextResponse.json({ batch: newBatch }, { status: 201 })
}
