import { NextResponse } from "next/server"
import { verifyHerbQuality, predictShelfLife } from "@/lib/services/ai-verification-service"

export async function POST(request: Request) {
  const body = await request.json()
  const { herbName, batchId, action } = body

  if (action === "predict-shelf-life") {
    if (!herbName || !body.qualityScore) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const prediction = await predictShelfLife(herbName, body.qualityScore)
    return NextResponse.json(prediction)
  }

  if (!herbName || !batchId) {
    return NextResponse.json({ error: "herbName and batchId are required" }, { status: 400 })
  }

  const result = await verifyHerbQuality(herbName, batchId)
  return NextResponse.json(result)
}
