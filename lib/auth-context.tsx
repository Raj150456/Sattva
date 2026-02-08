"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "./types"
import { authenticateUser, type AuthResult } from "./services/auth-service"

// User data stored in localStorage (without passwordHash for security)
type SafeUser = Omit<User, 'passwordHash'>

interface AuthContextType {
  user: SafeUser | null
  login: (email: string, password: string, role: UserRole) => Promise<AuthResult>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Secure login function that validates:
   * 1. Email exists in database
   * 2. Password is correct
   * 3. Selected role matches user's actual role
   */
  const login = useCallback(
    async (email: string, password: string, role: UserRole): Promise<AuthResult> => {
      const result = await authenticateUser(email, password, role)

      if (result.success && result.user) {
        localStorage.setItem("user", JSON.stringify(result.user))
        setUser(result.user)
      }

      return result
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
