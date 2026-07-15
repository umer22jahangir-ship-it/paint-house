import type { Metadata } from "next";
import { ColorsManager } from "@/components/admin/ColorsManager";

export const metadata: Metadata = {
  title: "Manage Colors",
};

export default function AdminColorsPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Paint Colors</h1>
      <p className="mb-8 text-[var(--color-muted)]">
        Add or remove car paint colors from the database.
      </p>
      <ColorsManager />
    </div>
  );
}
