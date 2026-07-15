"use client";

import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  const footerLinks = [
    { href: "/paint-finder", label: t("navPaintFinder") },
    { href: "/services", label: t("navServices") },
    { href: "/portfolio", label: t("navPortfolio") },
    { href: "/contact", label: t("navContact") },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo className="mb-4" />
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">
            {t("footerDesc")}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-foreground)]">
            {t("quickLinks")}
          </h3>
          <ul className="flex flex-col gap-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-foreground)]">
            {t("contactInfo")}
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-[var(--color-muted)]">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              <a href={`tel:${siteConfig.phone}`} dir="ltr">{siteConfig.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              <a href={`tel:${(siteConfig as any).phone2}`} dir="ltr">{(siteConfig as any).phone2}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              <a href={`mailto:${siteConfig.email}`} dir="ltr">{siteConfig.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              <span>{t("addressValue")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] px-4 py-4 text-center text-xs text-[var(--color-muted)]">
        {t("copyright")}
        <span className="mx-2">·</span>
        <Link href="/admin/login" className="hover:text-[var(--color-primary)]">
          Admin
        </Link>
      </div>
    </footer>
  );
}
