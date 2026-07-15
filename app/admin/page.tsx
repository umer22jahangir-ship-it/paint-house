import type { Metadata } from "next";
import Link from "next/link";
import { Palette, ImageIcon, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-[var(--color-foreground)]">Dashboard</h1>
      <p className="mb-8 text-[var(--color-muted)]">
        Welcome to {siteConfig.name} admin panel.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link href="/admin/colors">
          <Card hover className="flex items-start gap-4">
            <div className="rounded-xl bg-[var(--color-primary)]/10 p-3">
              <Palette className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--color-foreground)]">Paint Colors</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Add or delete car paint colors, codes, and availability.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]">
                Manage <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Card>
        </Link>

        <Link href="/admin/portfolio">
          <Card hover className="flex items-start gap-4">
            <div className="rounded-xl bg-[var(--color-primary)]/10 p-3">
              <ImageIcon className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--color-foreground)]">Portfolio</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Upload images and videos to showcase workshop expertise.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]">
                Manage <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
