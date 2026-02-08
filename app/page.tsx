"use client"

import { AuthProvider } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing-page"

export default function Page() {
  return (
    <AuthProvider>
      <LandingPage />
    </AuthProvider>
  )
}
