"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Intro() {
  const { t } = useLanguage();

  return (
    <section className="bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-3xl font-bold text-[var(--color-foreground)]">
            {t("introTitle")}
          </h2>
          <p className="mb-4 text-[var(--color-muted)] leading-relaxed">
            {t("introPara1")}
          </p>
          <p className="mb-6 text-[var(--color-muted)] leading-relaxed">
            {t("introPara2")}
          </p>
          <Button href="/paint-finder">
            Start Paint Search
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Professional Brand Partnership Card */}
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/60 bg-white shadow-xl">

          {/* Top accent strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-400" />

          <div className="px-8 py-8">
            {/* Header label */}
            <div className="mb-7 flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4 text-red-600" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                {t("introCollab")}
              </span>
            </div>

            {/* Logos side by side */}
            <div className="flex items-center justify-center gap-0">
              {/* DuPont */}
              <div className="flex flex-1 flex-col items-center gap-3 px-4 py-4">
                <div className="flex h-24 w-full max-w-[140px] items-center justify-center rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
                  <Image
                    src="/dupont-logo.png"
                    alt="DuPont"
                    width={130}
                    height={80}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Automotive Paints
                </span>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center self-stretch py-6">
                <div className="h-full w-px bg-gray-200" />
              </div>

              {/* Axalta */}
              <div className="flex flex-1 flex-col items-center gap-3 px-4 py-4">
                <div className="flex h-24 w-full max-w-[140px] items-center justify-center rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
                  <Image
                    src="/axalta-logo.png"
                    alt="Axalta"
                    width={130}
                    height={80}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Coating Systems
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-gray-100 pt-5 text-center">
              <p className="text-sm font-semibold text-gray-800">
                {t("introDealerQuality")}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {t("introMatching")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
