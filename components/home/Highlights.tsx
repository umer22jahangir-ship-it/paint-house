"use client";

import { Cpu, Globe, Factory } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const highlights: {
  icon: typeof Cpu;
  title: TranslationKey;
  description: TranslationKey;
}[] = [
  {
    icon: Cpu,
    title: "highlightComputerTitle",
    description: "highlightComputerDesc",
  },
  {
    icon: Globe,
    title: "highlightImportedTitle",
    description: "highlightImportedDesc",
  },
  {
    icon: Factory,
    title: "highlightChinaTitle",
    description: "highlightChinaDesc",
  },
];

export function Highlights() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-3 text-3xl font-bold text-[var(--color-foreground)]">
          {t("whyTitle")}
        </h2>
        <p className="mx-auto max-w-xl text-[var(--color-muted)]">
          {t("whySubtitle")}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} hover className="text-center sm:text-left">
            <div className="mb-4 inline-flex rounded-xl bg-[var(--color-primary)]/10 p-3">
              <item.icon className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[var(--color-foreground)]">
              {t(item.title)}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">
              {t(item.description)}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
