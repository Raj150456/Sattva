export interface AIVerificationResult {
  score: number
  grade: string
  confidence: number
  factors: Array<{ name: string; score: number; status: "pass" | "warn" | "fail" }>
  recommendation: string
}

export async function verifyHerbQuality(herbName: string, batchId: string): Promise<AIVerificationResult> {
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1500))

  const score = 85 + Math.random() * 14
  const grade = score >= 95 ? "A+" : score >= 90 ? "A" : score >= 85 ? "B+" : "B"

  return {
    score: Math.round(score * 10) / 10,
    grade,
    confidence: Math.round((90 + Math.random() * 9) * 10) / 10,
    factors: [
      { name: "Visual Analysis", score: Math.round((88 + Math.random() * 11) * 10) / 10, status: "pass" },
      { name: "Chemical Profile", score: Math.round((85 + Math.random() * 14) * 10) / 10, status: "pass" },
      { name: "Contamination Check", score: Math.round((92 + Math.random() * 7) * 10) / 10, status: "pass" },
      { name: "Origin Verification", score: Math.round((87 + Math.random() * 12) * 10) / 10, status: score > 90 ? "pass" : "warn" },
    ],
    recommendation: score >= 90
      ? `${herbName} batch ${batchId} meets premium quality standards. Recommended for immediate processing.`
      : `${herbName} batch ${batchId} meets standard quality. Minor improvements suggested in storage conditions.`,
  }
}

export async function predictShelfLife(herbName: string, qualityScore: number): Promise<{ months: number; conditions: string }> {
  await new Promise((r) => setTimeout(r, 800))
  const months = qualityScore > 90 ? 24 : qualityScore > 85 ? 18 : 12
  return { months, conditions: "Store in cool, dry place. Avoid direct sunlight. Keep sealed." }
}
