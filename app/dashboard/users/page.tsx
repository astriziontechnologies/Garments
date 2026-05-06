import { Suspense } from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import { UsersClient } from "./UsersClient";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

async function fetchProfiles(): Promise<{ profiles: Profile[]; currentUserId: string | null }> {
  try {
    const supabase = await createClient();

    const [profilesResult, userResult] = await Promise.allSettled([
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true }),
      supabase.auth.getUser(),
    ]);

    const profiles =
      profilesResult.status === "fulfilled"
        ? ((profilesResult.value.data ?? []) as Profile[])
        : [];

    const currentUserId =
      userResult.status === "fulfilled"
        ? (userResult.value.data.user?.id ?? null)
        : null;

    return { profiles, currentUserId };
  } catch {
    return { profiles: [], currentUserId: null };
  }
}

function UsersSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

async function UsersContent() {
  const { profiles, currentUserId } = await fetchProfiles();
  return <UsersClient initialProfiles={profiles} currentUserId={currentUserId} />;
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage admin users and their permissions
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Users className="h-4 w-4" />
          <span>User Management</span>
        </div>
      </div>

      <Suspense fallback={<UsersSkeleton />}>
        <UsersContent />
      </Suspense>
    </div>
  );
}
