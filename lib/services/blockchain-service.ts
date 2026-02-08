function generateHash(): string {
  const chars = "0123456789abcdef"
  let hash = "0x"
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

export async function writeBatchToLedger(batchId: string, data: Record<string, unknown>): Promise<{ hash: string; timestamp: string; blockNumber: number }> {
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000))
  return {
    hash: generateHash(),
    timestamp: new Date().toISOString(),
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
  }
}

export async function verifyOnChain(hash: string): Promise<{ verified: boolean; confirmations: number; timestamp: string }> {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 500))
  return {
    verified: true,
    confirmations: Math.floor(Math.random() * 50) + 12,
    timestamp: new Date().toISOString(),
  }
}

export async function getTransactionHistory(batchId: string): Promise<Array<{ hash: string; type: string; timestamp: string; blockNumber: number }>> {
  await new Promise((r) => setTimeout(r, 600))
  return [
    { hash: generateHash(), type: "BATCH_CREATED", timestamp: "2025-09-15T06:00:00Z", blockNumber: 15234567 },
    { hash: generateHash(), type: "QUALITY_VERIFIED", timestamp: "2025-09-16T10:00:00Z", blockNumber: 15234890 },
    { hash: generateHash(), type: "OWNERSHIP_TRANSFER", timestamp: "2025-09-20T14:00:00Z", blockNumber: 15235123 },
    { hash: generateHash(), type: "LAB_REPORT_ADDED", timestamp: "2025-09-25T16:00:00Z", blockNumber: 15236001 },
  ]
}
