"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, Mail, Lock, Wallet, ArrowRight, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: "farmer", label: "Farmer / Collector", description: "Grow, harvest, and register herb batches" },
  { value: "manufacturer", label: "Manufacturer / Regulator", description: "Process, verify, and distribute products" },
  { value: "consumer", label: "Consumer", description: "Verify and trace product authenticity" },
]

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(email, password, selectedRole)

      if (result.success) {
        // Redirect based on role
        if (selectedRole === "consumer") {
          router.push("/consumer/marketplace")
        } else {
          router.push("/dashboard")
        }
      } else {
        // Display the error message from the auth service
        setError(result.error || "Login failed. Please try again.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 items-center justify-center bg-primary p-12 lg:flex">
        <div className="max-w-md">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/10">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-primary-foreground text-balance">
            Authentic Ayurveda, Verified on Chain
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-primary-foreground/70">
            Join thousands of farmers, manufacturers, and conscious consumers
            building trust in the Ayurvedic supply chain.
          </p>
          <div className="mt-12 flex flex-col gap-4">
            {[
              "Blockchain-verified herb traceability",
              "AI-powered quality assessment",
              "Real-time supply chain visibility",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-primary-foreground/80">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
                  <ArrowRight className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold text-foreground">Sattva</span>
          </Link>

          <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your Sattva account</p>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Login Failed</p>
                <p className="mt-1 text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-6">
            {/* Role Selection */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">I am a</Label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.value)
                      setError(null) // Clear error when changing role
                    }}
                    className={cn(
                      "flex flex-col items-start rounded-lg border p-3 text-left transition-all",
                      selectedRole === role.value
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{role.label}</span>
                    <span className="text-xs text-muted-foreground">{role.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null) // Clear error when typing
                  }}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(null) // Clear error when typing
                  }}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Wallet Connect placeholder */}
            <div className="relative flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button type="button" variant="outline" className="w-full bg-transparent" disabled>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet (Coming Soon)
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>


        </div>
      </div>
    </div>
  )
}
