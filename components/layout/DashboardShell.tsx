"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

interface DashboardShellProps {
  user: {
    email: string;
    full_name?: string;
    role: string;
  };
  role: string;
  children: React.ReactNode;
}

export default function DashboardShell({
  user,
  role,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <DashboardSidebar
        role={role}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="sticky top-0 z-10">
          <DashboardHeader
            user={user}
            onMobileMenuToggle={() => setMobileOpen((prev) => !prev)}
          />
        </div>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </>
  );
}
