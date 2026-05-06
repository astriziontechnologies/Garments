"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface DashboardHeaderUser {
  email: string;
  full_name?: string;
  role: string;
}

interface DashboardHeaderProps {
  user: DashboardHeaderUser;
  onMobileMenuToggle?: () => void;
}

function formatPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1 && segments[0] === "dashboard") {
    return "Dashboard";
  }

  const last = segments[segments.length - 1];
  if (!last) return "Dashboard";

  return last
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "SG";
}

function formatRole(role: string): string {
  return role
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const ROLE_BADGE_VARIANTS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700 border-purple-200",
  owner: "bg-blue-100 text-blue-700 border-blue-200",
  inventory_manager: "bg-emerald-100 text-emerald-700 border-emerald-200",
  staff: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function DashboardHeader({
  user,
  onMobileMenuToggle,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = formatPageTitle(pathname);
  const initials = getInitials(user.full_name, user.email);
  const roleBadgeClass =
    ROLE_BADGE_VARIANTS[user.role] ?? ROLE_BADGE_VARIANTS.staff;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      {/* Left: mobile menu toggle + page title */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 text-slate-500 hover:text-slate-900"
          onClick={onMobileMenuToggle}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-lg font-semibold text-slate-900 leading-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: notifications + user menu */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-slate-500 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Notification dot badge */}
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left",
                "hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]">
                  {user.full_name ?? user.email}
                </p>
                <p
                  className={cn(
                    "inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
                    roleBadgeClass
                  )}
                >
                  {formatRole(user.role)}
                </p>
              </div>

              <ChevronDown className="hidden sm:block h-4 w-4 text-slate-400 shrink-0" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
            <DropdownMenuLabel className="pb-1">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.full_name ?? "Admin User"}
              </p>
              <p className="text-xs text-slate-500 font-normal truncate">
                {user.email}
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="h-4 w-4 text-slate-500" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4 text-slate-500" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
