import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardShell from "@/components/layout/DashboardShell";
import type { UserRole } from "@/types/database";

interface ProfileRow {
  role: UserRole;
  full_name: string | null;
  email: string;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Verify authenticated session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Fetch user profile (role, full_name, email)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single<ProfileRow>();

  if (profileError || !profile) {
    // Profile not ready yet — sign out and redirect
    redirect("/login");
  }

  const dashboardUser = {
    email: profile.email,
    full_name: profile.full_name ?? undefined,
    role: profile.role,
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar — DashboardShell handles mobile open/close state */}
      <DashboardShell user={dashboardUser} role={profile.role}>
        {children}
      </DashboardShell>
    </div>
  );
}
