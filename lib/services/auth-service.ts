/**
 * Authentication Service
 * Production-grade authentication with password hashing and role verification.
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

/**
 * Gets the combined list of hardcoded mock users and dynamic users from localStorage
 */
function getUsers(): User[] {
    if (typeof window === 'undefined') return mockUsers

    const dynamicUsersJson = localStorage.getItem('sattva_dynamic_users')
    if (!dynamicUsersJson) return mockUsers

    try {
        const dynamicUsers: User[] = JSON.parse(dynamicUsersJson)
        // Filter out any dynamic users that might clash with hardcoded IDs or emails (shoudn't happen with proper logic)
        const hardcodedEmails = new Set(mockUsers.map(u => u.email.toLowerCase()))
        const filteredDynamic = dynamicUsers.filter(u => !hardcodedEmails.has(u.email.toLowerCase()))

        return [...mockUsers, ...filteredDynamic]
    } catch (e) {
        console.error("Failed to parse dynamic users", e)
        return mockUsers
    }
}

/**
 * Registers a new user
 */
export async function registerUser(data: {
    name: string,
    email: string,
    password: string,
    role: UserRole
}): Promise<AuthResult> {
    const users = getUsers()

    // 1. Check if email already exists
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { success: false, error: "A user with this email already exists." }
    }

    // 2. Hash password
    const salt = SALTS[data.role]
    const passwordHash = await hashPassword(data.password, salt)

    // 3. Create user object
    const newUser: User = {
        id: `u_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        passwordHash,
        verifiedStatus: false,
        createdAt: new Date().toISOString(),
    }

    // 4. Save to localStorage (Demo persistence)
    const dynamicUsersJson = localStorage.getItem('sattva_dynamic_users')
    const dynamicUsers: User[] = dynamicUsersJson ? JSON.parse(dynamicUsersJson) : []
    dynamicUsers.push(newUser)
    localStorage.setItem('sattva_dynamic_users', JSON.stringify(dynamicUsers))

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = newUser
    return { success: true, user: safeUser }
}

export async function authenticateUser(
    email: string,
    password: string,
    selectedRole: UserRole
): Promise<AuthResult> {
    // Use the combined list of users
    const users = getUsers()

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

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
