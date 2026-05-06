"use client";

import { useState } from "react";
import { UserPlus, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

type UserRole = "super_admin" | "owner" | "inventory_manager" | "staff";

const roleConfig: Record<string, { label: string; color: string }> = {
  super_admin: { label: "Super Admin", color: "bg-red-100 text-red-700 border-red-200" },
  owner: { label: "Owner", color: "bg-blue-100 text-blue-700 border-blue-200" },
  inventory_manager: {
    label: "Inventory Manager",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  staff: { label: "Staff", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

interface UsersClientProps {
  initialProfiles: Profile[];
  currentUserId: string | null;
}

export function UsersClient({ initialProfiles, currentUserId }: UsersClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("staff");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleActive = async (profile: Profile) => {
    if (profile.id === currentUserId) {
      toast.error("You cannot deactivate your own account");
      return;
    }
    setTogglingId(profile.id);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) throw new Error("Supabase not configured");

      const client = createClient(supabaseUrl, supabaseKey);
      const { error } = await client
        .from("profiles")
        .update({ is_active: !profile.is_active })
        .eq("id", profile.id);

      if (error) throw error;

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profile.id ? { ...p, is_active: !profile.is_active } : p
        )
      );
      toast.success(
        !profile.is_active ? "User activated" : "User deactivated"
      );
    } catch (err) {
      toast.error("Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast.error("Email is required");
      return;
    }
    setInviteLoading(true);
    try {
      // NOTE: In production, use Supabase Admin API to invite user
      // For now, we show a success toast as a placeholder
      toast.success(
        `Invitation workflow: send invite to ${inviteEmail} with role "${inviteRole}". Wire up Supabase auth.admin.inviteUserByEmail() on the server.`
      );
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("staff");
    } catch {
      toast.error("Failed to send invite");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8 opacity-40" />
                      <p className="text-sm">No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile) => {
                  const rc = roleConfig[profile.role] ?? {
                    label: profile.role,
                    color: "bg-gray-100 text-gray-600 border-gray-200",
                  };
                  const isCurrentUser = profile.id === currentUserId;

                  return (
                    <TableRow key={profile.id} className={isCurrentUser ? "bg-muted/30" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-primary uppercase">
                              {(profile.full_name ?? profile.email).charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {profile.full_name ?? "—"}
                              {isCurrentUser && (
                                <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">{profile.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${rc.color}`}
                        >
                          <Shield className="h-3 w-3" />
                          {rc.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            profile.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {profile.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(profile.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={profile.is_active}
                          onCheckedChange={() => handleToggleActive(profile)}
                          disabled={isCurrentUser || togglingId === profile.id}
                          title={
                            isCurrentUser
                              ? "Cannot deactivate your own account"
                              : undefined
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invite User Dialog */}
      <Dialog
        open={inviteOpen}
        onOpenChange={(open) => {
          setInviteOpen(open);
          if (!open) { setInviteEmail(""); setInviteRole("staff"); }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="invite_email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="invite_email"
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v: UserRole) => setInviteRole(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={inviteLoading} className="flex-1">
                {inviteLoading ? "Sending..." : "Send Invite"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
