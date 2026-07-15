"use client";

import { PaintFinderForm } from "@/components/paint-finder/PaintFinderForm";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PaintFinderPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold text-[var(--color-foreground)] sm:text-4xl">
          {t("pfTitle")}
        </h1>
        <p className="mx-auto max-w-2xl text-[var(--color-muted)]">
          {t("pfDescription")}
        </p>
      </div>

      <PaintFinderForm />

      <div className="mt-16">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
            {t("pfHelpTitle")}
          </h2>
        </div>
        <div className="mx-auto max-w-2xl">
          <ChatAssistant />
        </div>
      </div>
    </div>
  );
}
