"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Palette,
  ImageIcon,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/colors", label: "Paint Colors", icon: Palette },
  { href: "/admin/portfolio", label: "Portfolio", icon: ImageIcon },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [checking, setChecking] = useState(!isLogin);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (isLogin) return;
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) router.replace("/admin/login");
        else setAuthed(true);
      })
      .finally(() => setChecking(false));
  }, [isLogin, router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  if (isLogin) return <>{children}</>;

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--color-muted)]">Loading admin...</p>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--color-border)] bg-gradient-to-b from-sky-50 to-blue-50 md:flex md:flex-col">
        <div className="border-b border-[var(--color-border)] bg-white/80 p-5">
          <Logo />
          <p className="mt-2 text-xs font-semibold text-[var(--color-primary)]">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-[var(--color-border)] p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
          >
            <ExternalLink className="h-4 w-4" />
            View Website
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 md:hidden">
          <Logo showWordmark={false} />
          <button onClick={logout} className="text-sm text-red-500">Logout</button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
                pathname === item.href
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
