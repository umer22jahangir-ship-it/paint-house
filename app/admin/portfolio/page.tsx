import type { Metadata } from "next";
import { PortfolioManager } from "@/components/admin/PortfolioManager";

export const metadata: Metadata = {
  title: "Manage Portfolio",
};

export default function AdminPortfolioPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Portfolio</h1>
      <p className="mb-8 text-[var(--color-muted)]">
        Upload images and videos to showcase workshop expertise on the public portfolio page.
      </p>
      <PortfolioManager />
    </div>
  );
}
