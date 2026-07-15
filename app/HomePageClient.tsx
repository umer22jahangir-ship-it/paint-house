"use client";

import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Highlights } from "@/components/home/Highlights";
import { Reviews } from "@/components/home/Reviews";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function HomePageClient() {
  const { t } = useLanguage();

  return (
    <>
      <Hero />
      <Intro />
      <Highlights />
      <Reviews />

      <section className="bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-[var(--color-foreground)]">
              AI Paint Assistant
            </h2>
            <p className="mx-auto max-w-xl text-[var(--color-muted)]">
              Have questions about paint matching? Chat with our assistant for
              instant guidance.
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <ChatAssistant />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="mb-3 text-3xl font-bold text-[var(--color-foreground)]">
          Ready to Find Your Paint?
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-[var(--color-muted)]">
          Search our database by car make, model, and year — then contact us on
          WhatsApp for expert color matching.
        </p>
        <Button href="/paint-finder" size="lg">
          {t("navPaintFinder")}
        </Button>
      </section>
    </>
  );
}
