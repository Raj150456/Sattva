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
import { mockUsers } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, role: UserRole) => void
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
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

  const login = useCallback(
    (email: string, role: UserRole) => {
      // Find a mock user with the specified role to simulate login
      const found = mockUsers.find((u) => u.role === role)
      
      const userToLogin = found ? { ...found, email: email } : {
        id: `u_${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
        verifiedStatus: false,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("user", JSON.stringify(userToLogin))
      setUser(userToLogin)
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
