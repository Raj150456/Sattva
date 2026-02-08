"use client"

import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { VerifiedBadge } from "@/components/verified-badge"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Settings" description="Manage your account preferences." />

      <div className="glass max-w-2xl rounded-xl p-6">
        <h3 className="font-semibold text-foreground">Profile</h3>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                <VerifiedBadge status={user?.verifiedStatus ? "verified" : "unverified"} size="sm" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Name</Label>
              <Input defaultValue={user?.name} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Email</Label>
              <Input defaultValue={user?.email} />
            </div>
          </div>

          {user?.walletAddress && (
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Wallet Address</Label>
              <Input defaultValue={user.walletAddress} disabled className="font-mono" />
            </div>
          )}

          <Button className="mt-2 w-fit bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
