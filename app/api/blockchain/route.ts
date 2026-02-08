import { NextResponse } from "next/server"
import { writeBatchToLedger, verifyOnChain, getTransactionHistory } from "@/lib/services/blockchain-service"

export async function POST(request: Request) {
  const body = await request.json()
  const { action, batchId, data, hash } = body

  switch (action) {
    case "write": {
      if (!batchId) {
        return NextResponse.json({ error: "Batch ID is required" }, { status: 400 })
      }
      const result = await writeBatchToLedger(batchId, data || {})
      return NextResponse.json(result)
    }

    case "verify": {
      if (!hash) {
        return NextResponse.json({ error: "Hash is required" }, { status: 400 })
      }
      const verification = await verifyOnChain(hash)
      return NextResponse.json(verification)
    }

    case "history": {
      if (!batchId) {
        return NextResponse.json({ error: "Batch ID is required" }, { status: 400 })
      }
      const history = await getTransactionHistory(batchId)
      return NextResponse.json({ history })
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  }
}
