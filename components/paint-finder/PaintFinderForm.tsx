"use client";

import { useState, useEffect, FormEvent } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { buildPaintInquiryMessage } from "@/lib/whatsapp";
import type { PaintMatchResult } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
const FALLBACK_COMPANIES = [
  "Toyota", "Honda", "Suzuki", "Hyundai", "Kia", "Changan", "MG", "Nissan", 
  "Daihatsu", "Mitsubishi", "Mazda", "Proton", "DFSK", "Chery", "Haval", "Peugeot", "BMW", "Mercedes-Benz", "Jaecoo"
];

function getFallbackModels(company: string): string[] {
  const defaults: Record<string, string[]> = {
    Toyota: ["Corolla", "Yaris", "Vitz", "Aqua", "Prius", "Hilux", "Fortuner", "Prado", "Passo"],
    Honda: ["Civic", "City", "Vezel", "BR-V", "HR-V", "Accord"],
    Suzuki: ["Alto", "Cultus", "Wagon R", "Swift", "Mehran", "Bolan"],
    Hyundai: ["Elantra", "Tucson", "Sonata", "Santa Fe"],
    Kia: ["Sportage", "Picanto", "Sorento", "Carnival"],
    Nissan: ["Dayz", "Juke", "Sunny", "Note"],
    MG: ["HS", "ZS", "ZS EV"],
    Changan: ["Alsvin", "Karvaan", "Oshan X7"],
    Daihatsu: ["Mira", "Cuore", "Tanto", "Move", "Cast"],
    Mitsubishi: ["Ek Wagon", "Lancer", "Pajero", "Outlander"],
    Mazda: ["Flair", "Carol", "Axela", "Mazda 3", "CX-5"],
    Proton: ["Saga", "X70"],
    DFSK: ["Glory 580", "Glory 500", "K01"],
    Chery: ["Tiggo 8 Pro", "Tiggo 4 Pro"],
    Haval: ["H6", "Jolion"],
    Peugeot: ["2008"],
    BMW: ["3 Series", "5 Series", "X1", "X5"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLA"],
    Jaecoo: ["J7", "J8"],
  };
  return defaults[company] ?? [];
}

type Status = "idle" | "loading" | "success" | "error" | "empty";

export function PaintFinderForm() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const staticYears = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => String(currentYear - i));
  staticYears.push("Other");

  const [companies, setCompanies] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const [company, setCompany] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<PaintMatchResult[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [customCompany, setCustomCompany] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customYear, setCustomYear] = useState("");

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data) => {
        let fetched = data.companies ?? [];
        if (fetched.length === 0) {
          fetched = [...FALLBACK_COMPANIES];
        }
        if (!fetched.includes("Other")) fetched.push("Other");
        setCompanies(fetched);
      })
      .catch(() => {
        const fallback = [...FALLBACK_COMPANIES, "Other"];
        setCompanies(fallback);
      });
  }, []);

  function handleCompanyChange(value: string) {
    setCompany(value);
    setModel(value === "Other" ? "Other" : "");
    setModels(value === "Other" ? ["Other"] : []);
    setStatus("idle");
    setResults([]);
    if (value !== "Other") {
      setCustomCompany("");
      setCustomModel("");
    }

    if (!value || value === "Other") return;

    fetch(`/api/models?company=${encodeURIComponent(value)}`)
      .then((r) => r.json())
      .then((data) => {
        let fetched = data.models ?? [];
        if (fetched.length === 0) {
          fetched = getFallbackModels(value);
        }
        if (!fetched.includes("Other")) fetched.push("Other");
        setModels(fetched);
      })
      .catch(() => {
        const fallback = [...getFallbackModels(value), "Other"];
        setModels(fallback);
      });
  }

  function handleModelChange(value: string) {
    setModel(value);
    setStatus("idle");
    setResults([]);
    if (value !== "Other") {
      setCustomModel("");
    }
  }

  function handleYearChange(value: string) {
    setYear(value);
    setStatus("idle");
    setResults([]);
    if (value !== "Other") {
      setCustomYear("");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!company || !model || !year) return;

    const finalCompany = company === "Other" ? customCompany : company;
    const finalModel = model === "Other" ? customModel : model;
    const finalYear = year === "Other" ? customYear : year;

    if (!finalCompany || !finalModel || !finalYear) {
      setStatus("error");
      setErrorMsg(t("errCustomFields"));
      return;
    }

    setStatus("loading");
    setResults([]);
    setErrorMsg("");

    try {
      const res = await fetch(
        `/api/paint-search?company=${encodeURIComponent(finalCompany)}&model=${encodeURIComponent(finalModel)}&year=${encodeURIComponent(finalYear)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Search failed. Please try again.");
        return;
      }

      if (!data.results?.length) {
        setStatus("empty");
        return;
      }

      setResults(data.results);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  const finalCompanyMsg = company === "Other" ? customCompany : company;
  const finalModelMsg = model === "Other" ? customModel : model;
  const finalYearMsg = year === "Other" ? customYear : year;

  const whatsappMessage = buildPaintInquiryMessage(finalCompanyMsg, finalModelMsg, finalYearMsg);

  return (
    <div className="space-y-8">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Select
                label={t("lblCompany")}
                placeholder={t("phCompany")}
                options={companies.map((c) => ({ value: c, label: c }))}
                value={company}
                onChange={(e) => handleCompanyChange(e.target.value)}
                required
              />
              {company === "Other" && (
                <input
                  type="text"
                  placeholder={t("phCustomCompany")}
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  required
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Select
                label={t("lblModel")}
                placeholder={t("phModel")}
                options={models.map((m) => ({ value: m, label: m }))}
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                disabled={!company}
                required
              />
              {model === "Other" && (
                <input
                  type="text"
                  placeholder={t("phCustomModel")}
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  required
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Select
                label={t("lblYear")}
                placeholder={t("phYear")}
                options={staticYears.map((y) => ({
                  value: y,
                  label: y,
                }))}
                value={year}
                onChange={(e) => handleYearChange(e.target.value)}
                required
              />
              {year === "Other" && (
                <input
                  type="number"
                  placeholder={t("phCustomYear")}
                  value={customYear}
                  onChange={(e) => setCustomYear(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  required
                />
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!company || !model || !year || status === "loading"}
            className="w-full sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <LoadingSpinner size="sm" />
                {t("btnSearching")}
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                {t("btnFindMatches")}
              </>
            )}
          </Button>
        </form>
      </Card>

      {status === "loading" && (
        <div className="py-12">
          <LoadingSpinner size="lg" label={t("btnSearching")} />
        </div>
      )}

      {status === "error" && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
        </Card>
      )}

      {status === "empty" && (
        <Card>
          <p className="text-[var(--color-muted)]">
            {t("txtEmpty")}
          </p>
          <div className="mt-4">
            <WhatsAppButton message={whatsappMessage} />
          </div>
        </Card>
      )}

      {status === "success" && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
              {results.length} {t("txtMatchesFound")}
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              {finalCompanyMsg} {finalModelMsg} · {finalYearMsg}
            </p>
          </div>

          <p className="text-xs text-[var(--color-muted)]">
            {t("txtIndicative")}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((result) => (
              <Card key={`${result.paint_code}-${result.color_name}`} hover>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-[var(--color-foreground)]">
                      {result.color_name}
                    </h4>
                    <p className="text-sm text-[var(--color-muted)]">
                      {t("lblCode")}{" "}
                      <span className="font-mono font-medium text-[var(--color-primary)]">
                        {result.paint_code}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-3 text-sm">
                  <AvailabilityBadge
                    label={t("lblImported")}
                    available={result.imported_available}
                    t={t}
                  />
                  <AvailabilityBadge
                    label={t("lblChina")}
                    available={result.china_available}
                    t={t}
                  />
                </div>

                <WhatsAppButton
                  message={buildPaintInquiryMessage(
                    finalCompanyMsg,
                    finalModelMsg,
                    finalYearMsg,
                    result.color_name,
                    result.paint_code
                  )}
                  label={t("btnInquire")}
                  className="w-full justify-center !text-xs"
                />
              </Card>
            ))}
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
            <p className="mb-3 text-sm text-[var(--color-muted)]">
              {t("txtNeedHelp")}
            </p>
            <WhatsAppButton message={whatsappMessage} label={t("btnContactUs")} />
          </div>
        </div>
      )}
    </div>
  );
}

function AvailabilityBadge({
  label,
  available,
  t
}: {
  label: string;
  available: boolean;
  t: any;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
        available
          ? "bg-green-600 text-white dark:bg-green-500"
          : "bg-red-500 text-white dark:bg-red-600"
      }`}
    >
      {available ? (
        <CheckCircle className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {label}: {available ? t("lblAvailable") : t("lblUnavailable")}
    </span>
  );
}
