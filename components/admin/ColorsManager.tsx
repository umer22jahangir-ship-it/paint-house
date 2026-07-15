"use client";

import { useEffect, useState, FormEvent } from "react";
import { Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { AdminColorRow } from "@/lib/types";

export function ColorsManager() {
  const [colors, setColors] = useState<AdminColorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: "",
    model: "",
    year: "",
    color_name: "",
    paint_code: "",
    imported_available: true,
    china_available: true,
  });

  function loadColors() {
    setLoading(true);
    fetch("/api/admin/colors")
      .then((r) => r.json())
      .then((d) => setColors(d.colors ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadColors();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({
        company: "",
        model: "",
        year: "",
        color_name: "",
        paint_code: "",
        imported_available: true,
        china_available: true,
      });
      loadColors();
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this color? This cannot be undone.")) return;
    await fetch(`/api/admin/colors?id=${id}`, { method: "DELETE" });
    loadColors();
  }

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Add New Color</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required placeholder="Toyota" />
            <Input label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required placeholder="Corolla" />
            <Input label="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required placeholder="2021" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Color Name" value={form.color_name} onChange={(e) => setForm({ ...form, color_name: e.target.value })} required placeholder="Super White II" />
            <Input label="Paint Code" value={form.paint_code} onChange={(e) => setForm({ ...form, paint_code: e.target.value })} required placeholder="040" />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.imported_available} onChange={(e) => setForm({ ...form, imported_available: e.target.checked })} />
              Imported Available
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.china_available} onChange={(e) => setForm({ ...form, china_available: e.target.checked })} />
              China Available
            </label>
          </div>
          <Button type="submit" disabled={saving}>
            <Plus className="h-4 w-4" />
            {saving ? "Adding..." : "Add Color"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">
          All Colors ({colors.length})
        </h2>
        {loading ? (
          <LoadingSpinner label="Loading colors..." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[var(--color-surface)] text-xs uppercase text-[var(--color-muted)]">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Imported</th>
                  <th className="px-4 py-3">China</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {colors.map((c) => (
                  <tr key={c.color_id} className="bg-[var(--color-card)]">
                    <td className="px-4 py-3">{c.company} {c.model} ({c.year})</td>
                    <td className="px-4 py-3 font-medium">{c.color_name}</td>
                    <td className="px-4 py-3 font-mono text-[var(--color-primary)]">{c.paint_code}</td>
                    <td className="px-4 py-3">{c.imported_available ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">{c.china_available ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(c.color_id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        aria-label="Delete color"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
