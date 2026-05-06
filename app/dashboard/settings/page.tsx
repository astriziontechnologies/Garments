"use client";

import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  owner: "Owner",
  inventory_manager: "Inventory Manager",
  staff: "Staff",
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileFetching, setProfileFetching] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const getClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
  };

  useEffect(() => {
    async function loadProfile() {
      setProfileFetching(true);
      try {
        const client = getClient();
        if (!client) {
          setProfileFetching(false);
          return;
        }

        const { data: { user } } = await client.auth.getUser();
        if (!user) {
          setProfileFetching(false);
          return;
        }

        const { data: profileData } = await client
          .from("profiles")
          .select("id, email, full_name, role")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData as Profile);
          setFullName(profileData.full_name ?? "");
        }
      } catch {
        // ignore
      } finally {
        setProfileFetching(false);
      }
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setProfileLoading(true);

    try {
      const client = getClient();
      if (!client) {
        toast.error("Supabase is not configured");
        return;
      }

      const { error } = await client
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", profile.id);

      if (error) throw error;
      setProfile((p) => (p ? { ...p, full_name: fullName } : p));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const client = getClient();
      if (!client) {
        toast.error("Supabase is not configured");
        return;
      }

      const { error } = await client.auth.updateUser({ password: newPassword });

      if (error) throw error;

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password";
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account preferences and security
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full max-w-xs">
          <TabsTrigger value="profile" className="flex-1">
            <User className="h-4 w-4 mr-1.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1">
            <Lock className="h-4 w-4 mr-1.5" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              {profileFetching ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-10 w-full bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email ?? ""}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address cannot be changed here. Contact a super admin.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={roleLabels[profile?.role ?? ""] ?? (profile?.role ?? "")}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Role is assigned by a super admin and cannot be self-modified.
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={profileLoading || !profile}>
                      <Save className="h-4 w-4" />
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Security Tab ── */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current_password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Note: Supabase does not verify the current password on client-side updates. This field is for UX confirmation only.
                  </p>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showNew ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      passwordLoading ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword
                    }
                  >
                    <Lock className="h-4 w-4" />
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
