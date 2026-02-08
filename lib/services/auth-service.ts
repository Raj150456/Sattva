/**
 * Authentication Service - Simplified
 * Logs password hash on login attempt so you can copy it to mock-data
 */

import type { User, UserRole } from "../types"
import { mockUsers } from "../mock-data"

// Hash password with SHA-256 + salt
export async function hashPassword(password: string, salt: string): Promise<string> {
    const data = new TextEncoder().encode(salt + password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return `$sha256$${salt}$${hashHex}`
}

// Verify password against stored hash
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const parts = storedHash.split('$')
    if (parts.length !== 4 || parts[1] !== 'sha256') return false

    const salt = parts[2]
    const expectedHash = parts[3]

    const data = new TextEncoder().encode(salt + password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const actualHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return actualHash === expectedHash
}

export interface AuthResult {
    success: boolean
    user?: Omit<User, 'passwordHash'>
    error?: string
}

// Fixed salts for each role (for consistent hashing)
const SALTS: Record<UserRole, string> = {
    farmer: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    manufacturer: "f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4",
    consumer: "1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d"
}

export async function authenticateUser(
    email: string,
    password: string,
    selectedRole: UserRole
): Promise<AuthResult> {
    // Find user by email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
        return { success: false, error: "No user exists with these credentials for the selected role." }
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash)

    if (!passwordValid) {
        return { success: false, error: "No user exists with these credentials for the selected role." }
    }

    // Verify role matches (Enforced at backend level)
    if (user.role !== selectedRole) {
        return { success: false, error: "No user exists with these credentials for the selected role." }
    }

    // Success - return user without passwordHash
    const { passwordHash, ...safeUser } = user
    return { success: true, user: safeUser }
}
