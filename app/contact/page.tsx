"use client";

import { Phone, MapPin, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: Phone,
      label: t("phone1"),
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone}`,
    },
    {
      icon: Phone,
      label: t("phone2"),
      value: siteConfig.phone2,
      href: `tel:${siteConfig.phone2}`,
    },
    {
      icon: Mail,
      label: t("emailTitle"),
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      icon: MapPin,
      label: t("addressTitle"),
      value: t("addressValue") || siteConfig.address,
    },
    {
      icon: Clock,
      label: t("hoursTitle"),
      value: t("hoursValue") || "Mon - Sat: 10:00 AM - 9:00 PM",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold text-[var(--color-foreground)] sm:text-4xl">
          {t("contactTitle")}
        </h1>
        <p className="mx-auto max-w-2xl text-[var(--color-muted)]">
          {t("contactSubtitle")}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-3">
        <WhatsAppButton
          label="WhatsApp: 0300-4814446"
          className="!px-8 !py-3.5 !text-base"
        />
        <WhatsAppButton
          message=""
          label="WhatsApp: 0333-4814446"
          className="!px-8 !py-3.5 !text-base"
          phone={siteConfig.whatsapp2}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item) => (
              <Card key={item.label}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                    <item.icon className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="break-all text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="break-words text-sm font-medium text-[var(--color-foreground)]">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden p-0">
            <iframe
              src={siteConfig.mapsEmbedUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Business location on Google Maps"
              className="w-full"
            />
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-[var(--color-foreground)]">
            {t("sendMessageTitle")}
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
