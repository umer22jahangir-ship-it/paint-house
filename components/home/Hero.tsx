import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LogoMark } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-hero-from)] via-white to-[var(--color-hero-to)]">
      <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              {t("heroTitlePrefix")}
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[var(--color-foreground)] sm:text-5xl">
              {siteConfig.shortName}{" "}
              <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                {t("heroTitleHighlight")}
              </span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-[var(--color-muted)]">
              {t("heroSubtitleStart")}{" "}
              <strong className="font-bold text-[var(--color-foreground)]">
                {t("heroSubtitleImported")}
              </strong>{" "}
              {t("heroSubtitleMiddle")}{" "}
              <strong className="font-bold text-[var(--color-foreground)]">
                {t("heroSubtitleChina")}
              </strong>{" "}
              {t("heroSubtitleEnd")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button href="/paint-finder" size="lg" className="w-full sm:w-auto">
                <Search className="h-5 w-5" />
                {t("btnFindPaint")}
              </Button>
              <WhatsAppButton
                label={t("btnContactUs")}
                className="!px-7 !py-3.5 !text-base w-full sm:w-auto justify-center"
              />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end lg:-translate-x-12">
            <div className="relative">
              <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-red-200/30 via-blue-200/30 to-purple-200/30 blur-2xl" />
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-blue-100 sm:h-56 sm:w-56 overflow-hidden">
                <LogoMark size={150} className="sm:hidden" />
                <LogoMark size={180} className="hidden sm:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-[var(--color-border)] bg-white/70 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-[var(--color-border)] px-4 sm:px-6">
          {[
            { value: "500+", label: t("statPaintCodes") },
            { value: "10+", label: t("statCarBrands") },
            { value: "100%", label: t("statColorMatch") },
          ].map((stat) => (
            <div key={stat.label} className="py-6 text-center">
              <p className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)] sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
