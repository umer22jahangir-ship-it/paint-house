"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Trash2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { portfolioCategories } from "@/lib/config";
import type { PortfolioItem } from "@/lib/types";

export function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    media_type: "image" as "image" | "video",
    media_url: "",
    category: "expertise",
    sort_order: "0",
  });

  function loadItems() {
    setLoading(true);
    fetch("/api/admin/portfolio")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      setForm((f) => ({
        ...f,
        media_url: data.url,
        media_type: file.type.startsWith("video") ? "video" : "image",
      }));
    }
    setUploading(false);
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!form.media_url) return;
    setSaving(true);
    const res = await fetch("/api/admin/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({
        title: "",
        description: "",
        media_type: "image",
        media_url: "",
        category: "expertise",
        sort_order: "0",
      });
      loadItems();
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this portfolio item?")) return;
    await fetch(`/api/admin/portfolio?id=${id}`, { method: "DELETE" });
    loadItems();
  }

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Add Portfolio Item</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Full Respray — Honda Civic (optional)" />
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={portfolioCategories.map((c) => ({ value: c.value, label: c.label }))}
            />
          </div>
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Expert panel matching and blending... (optional)" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Media Type"
              value={form.media_type}
              onChange={(e) => setForm({ ...form, media_type: e.target.value as "image" | "video" })}
              options={[
                { value: "image", label: "Image" },
                { value: "video", label: "Video" },
              ]}
            />
            <Input label="Sort Order (optional)" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} placeholder="0" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Upload File <span className="text-red-500">*</span>
              <span className="ml-1 text-xs font-normal text-[var(--color-muted)]">(required)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 text-sm text-[var(--color-muted)] hover:border-[var(--color-primary)]">
              <Upload className="h-5 w-5" />
              {uploading ? "Uploading..." : "Click to upload image or video"}
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          <Input
            label="Or paste media URL"
            value={form.media_url}
            onChange={(e) => setForm({ ...form, media_url: e.target.value })}
            placeholder="https://... or /uploads/portfolio/..."
          />

          {form.media_url && form.media_type === "image" && (
            <div className="relative aspect-video max-w-xs overflow-hidden rounded-lg">
              <Image src={form.media_url} alt="Preview" fill className="object-cover" />
            </div>
          )}

          <Button type="submit" disabled={saving || !form.media_url}>
            <Plus className="h-4 w-4" />
            {saving ? "Adding..." : "Add to Portfolio"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Portfolio Items ({items.length})</h2>
        {loading ? (
          <LoadingSpinner label="Loading portfolio..." />
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">No items yet. Add photos and videos above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden p-0">
                <div className="relative aspect-video bg-[var(--color-surface)]">
                  {item.media_type === "image" ? (
                    <Image src={item.media_url} alt={item.title} fill className="object-cover" />
                  ) : (
                    <video src={item.media_url} controls className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium uppercase text-[var(--color-accent)]">
                    {portfolioCategories.find((c) => c.value === item.category)?.label ?? item.category}
                  </p>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-xs text-[var(--color-muted)] line-clamp-2">{item.description}</p>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="mt-3 flex items-center gap-1 text-xs text-red-500 hover:underline"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
