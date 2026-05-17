"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Profile</CardTitle>
            <CardDescription className="text-muted-foreground">
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Name</Label>
              <Input
                id="name"
                defaultValue={user?.name || ""}
                className="bg-input border-border text-foreground max-w-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                className="bg-input border-border text-foreground max-w-md"
              />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Change your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-foreground">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                className="bg-input border-border text-foreground max-w-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-foreground">New Password</Label>
              <Input
                id="new-password"
                type="password"
                className="bg-input border-border text-foreground max-w-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-foreground">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                className="bg-input border-border text-foreground max-w-md"
              />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Update Password
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription className="text-muted-foreground">
              Irreversible actions for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
