export type UserRole = "farmer" | "manufacturer" | "consumer"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  walletAddress?: string
  verifiedStatus: boolean
  createdAt: string
  avatar?: string
}

export interface Farm {
  id: string
  farmerId: string
  farmName: string
  geoLocation: { lat: number; lng: number; address: string }
}

export type BatchStatus = "harvested" | "verified" | "in_transit" | "processing" | "lab_tested" | "qr_generated" | "delivered"

export interface Batch {
  id: string
  herbName: string
  quantity: number
  unit: string
  harvestDate: string
  aiQualityScore: number
  blockchainHash: string
  status: BatchStatus
  createdBy: string
  farmId: string
  imageUrl?: string
}

export interface Transfer {
  id: string
  batchId: string
  fromUserId: string
  toUserId: string
  timestamp: string
  fromUserName: string
  toUserName: string
}

export interface LabReport {
  id: string
  batchId: string
  ipfsHash: string
  verificationStatus: "pending" | "verified" | "rejected"
  testDate: string
  results: {
    purity: number
    contaminants: boolean
    activeCompounds: number
    grade: string
  }
}

export interface TransportLog {
  id: string
  batchId: string
  temperature: number
  humidity: number
  timestamp: string
  location: string
}

export interface QRRecord {
  id: string
  batchId: string
  qrCodeURL: string
  generatedAt: string
}

export interface SupplyChainEvent {
  id: string
  batchId: string
  type: "harvest" | "verification" | "transfer" | "lab_test" | "processing" | "qr_generated" | "delivery"
  title: string
  description: string
  timestamp: string
  actor: string
  verified: boolean
}

export interface DashboardStats {
  totalBatches: number
  activeBatches: number
  verifiedBatches: number
  qualityScore: number
  totalTransfers: number
  pendingLabReports: number
}

export interface Product {
  id: string
  herbName: string
  description: string
  price: number
  currency: string
  imageUrl?: string
  batchId: string
  farmId: string
  farmerName: string
  manufacturerName: string
  region: string
  verified: boolean
  aiQualityScore: number
  blockchainHash: string
  labGrade: string
  weight: string
  inStock: boolean
}

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"

export interface Order {
  id: string
  consumerId: string
  productId: string
  productName: string
  quantity: number
  totalPrice: number
  status: OrderStatus
  createdAt: string
  deliveryAddress: string
  batchId: string
}

export interface ConsumerProfile {
  userId: string
  name: string
  email: string
  address: string
  phone: string
  preferences: string[]
  walletAddress?: string
}
