"use client";

import {
  Cpu,
  Globe,
  Factory,
  FlaskConical,
  MessageSquare,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ServicesPage() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Cpu,
      title: t("service1Title"),
      description: t("service1Desc"),
      features: [t("service1Feature1"), t("service1Feature2"), t("service1Feature3")],
    },
    {
      icon: Globe,
      title: t("service2Title"),
      description: t("service2Desc"),
      features: [t("service2Feature1"), t("service2Feature2"), t("service2Feature3")],
    },
    {
      icon: Factory,
      title: t("service3Title"),
      description: t("service3Desc"),
      features: [t("service3Feature1"), t("service3Feature2"), t("service3Feature3")],
    },
    {
      icon: FlaskConical,
      title: t("service4Title"),
      description: t("service4Desc"),
      features: [t("service4Feature1"), t("service4Feature2"), t("service4Feature3")],
    },
    {
      icon: MessageSquare,
      title: t("service5Title"),
      description: t("service5Desc"),
      features: [t("service5Feature1"), t("service5Feature2"), t("service5Feature3")],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold text-[var(--color-foreground)] sm:text-4xl">
          {t("servicesTitle")}
        </h1>
        <p className="mx-auto max-w-2xl text-[var(--color-muted)]">
          {t("servicesSubtitle")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {services.map((service) => (
          <Card key={service.title} hover>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
                <service.icon className="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
                {service.title}
              </h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[var(--color-muted)]">
              {service.description}
            </p>
            <ul className="space-y-1.5">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-[var(--color-foreground)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-center text-white shadow-lg sm:p-12">
        <h2 className="mb-3 text-2xl font-bold">{t("quoteTitle")}</h2>
        <p className="mb-6 text-white/80">{t("quoteDesc")}</p>
        <WhatsAppButton label={t("quoteButton")} className="!text-base" />
      </div>
    </div>
  );
}
