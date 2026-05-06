"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Users,
  BarChart3,
  Tag,
  Star,
  UserCog,
  Settings,
  Scissors,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    section: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "CATALOG",
    items: [
      { label: "Products", href: "/dashboard/products", icon: Package },
      { label: "Inventory", href: "/dashboard/inventory", icon: Boxes },
    ],
  },
  {
    section: "CRM",
    items: [
      { label: "Customers", href: "/dashboard/customers", icon: Users },
    ],
  },
  {
    section: "ANALYTICS",
    items: [
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    section: "MARKETING",
    items: [
      { label: "Coupons", href: "/dashboard/coupons", icon: Tag },
      { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { label: "Users", href: "/dashboard/users", icon: UserCog },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

interface DashboardSidebarProps {
  role: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function DashboardSidebar({
  role,
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    onMobileClose?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  }

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <aside
      className={cn(
        "flex h-full flex-col bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-slate-800 px-4 shrink-0",
          collapsed ? "justify-center" : "justify-between gap-3"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 overflow-hidden",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
            <Scissors
              className="h-4 w-4 text-primary-foreground"
              strokeWidth={1.5}
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight truncate">
                Sri Garments
              </p>
              <p className="text-[10px] text-slate-400 truncate capitalize">
                {role.replace(/_/g, " ")}
              </p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {onMobileClose && !collapsed && (
          <button
            onClick={onMobileClose}
            className="lg:hidden rounded-md p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6 scrollbar-thin">
        {NAV_SECTIONS.map(({ section, items }) => (
          <div key={section}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                {section}
              </p>
            )}
            {collapsed && (
              <Separator className="my-1 bg-slate-800" />
            )}
            <ul className="space-y-0.5">
              {items.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      title={collapsed ? label : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-primary-foreground" : "text-slate-400"
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate">{label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="shrink-0 border-t border-slate-800 p-2 space-y-1">
        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "hidden lg:flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all duration-150",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>

        {/* Sign out button */}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          disabled={signingOut}
          title={collapsed ? "Sign out" : undefined}
          className={cn(
            "w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-slate-400 hover:bg-destructive/10 hover:text-destructive transition-all duration-150",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <span>{signingOut ? "Signing out..." : "Sign out"}</span>
          )}
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-all duration-300",
          mobileOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onMobileClose}
        />
        {/* Sidebar panel */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
