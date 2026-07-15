"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Languages } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { WhatsAppButton } from "./WhatsAppButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t("navHome") },
    { href: "/paint-finder", label: t("navPaintFinder") },
    { href: "/services", label: t("navServices") },
    { href: "/portfolio", label: t("navPortfolio") },
    { href: "/contact", label: t("navContact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              scroll={true}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            <span className="uppercase font-semibold">Languages: {lang}</span>
          </button>
          <ThemeToggle />
          <WhatsAppButton label={t("btnWhatsApp")} className="!px-4 !py-2" />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            className="rounded-lg p-2 text-[var(--color-foreground)] uppercase text-xs font-bold"
            aria-label="Toggle language"
          >
            LANG: {lang}
          </button>
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-[var(--color-foreground)]"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--color-border)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                scroll={true}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3">
              <WhatsAppButton label="Chat on WhatsApp" className="w-full" />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
