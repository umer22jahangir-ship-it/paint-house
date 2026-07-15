"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
    model: "",
    year: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Submission failed.");
        return;
      }

      setStatus("success");
      setForm({ name: "", phone: "", company: "", model: "", year: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try WhatsApp instead.");
    }
  }

  if (status === "success") {
    return (
      <Card className="text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
        <h3 className="mb-2 text-lg font-semibold">Message Sent!</h3>
        <p className="text-sm text-[var(--color-muted)]">
          Thank you for reaching out. We&apos;ll contact you shortly.
        </p>
        <Button className="mt-4" onClick={() => setStatus("idle")}>
          Send Another Message
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="John Doe"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            placeholder="+92 300 1234567"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Car Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Toyota"
          />
          <Input
            label="Car Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            placeholder="Corolla"
          />
          <Input
            label="Car Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            placeholder="2021"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            placeholder="Tell us about your paint needs..."
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-500">{errorMsg}</p>
        )}

        <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
          {status === "loading" ? (
            <>
              <LoadingSpinner size="sm" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
