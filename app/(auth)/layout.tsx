import type { Metadata } from "next";
import { Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Auth | Sri Garments",
  description: "Sign in to your Sri Garments admin account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Brand header */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
          <Scissors className="h-7 w-7 text-primary-foreground" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sri Garments
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Premium Quality Garments
          </p>
        </div>
      </div>

      {/* Card container */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer */}
      <p className="mt-8 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Sri Garments. All rights reserved.
      </p>
    </div>
  );
}
