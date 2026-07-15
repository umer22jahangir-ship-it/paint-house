"use client";

import Image from "next/image";
import { Award, LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { portfolioCategories } from "@/lib/config";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PortfolioItem } from "@/lib/types";

/* Portfolio page is now a client component so language switching works.
   DB items are fetched via an API route to keep server logic separate. */

export default function PortfolioPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">

      {/* Page Header */}
      <div className="mb-12 text-center">
        <span className="mb-3 inline-block rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-600">
          {t("galleryOurWork")}
        </span>
        <h1 className="mb-3 text-3xl font-extrabold text-[var(--color-foreground)] sm:text-4xl">
          {t("galleryTitle")}
        </h1>
        <p className="mx-auto max-w-xl text-[var(--color-muted)]">
          {t("gallerySubtitle")}
        </p>
      </div>

      {/* Static Photo Gallery */}
      <section className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-red-50 p-2.5">
            <LayoutGrid className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-foreground)]">
              {t("galleryShopGallery")}
            </h2>
            <p className="text-sm text-[var(--color-muted)]">{t("galleryShopSub")}</p>
          </div>
        </div>

        {/* Row 1 */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <GalleryCard
            src="/portfolio/2.jpeg"
            title={t("galleryWorkshopTitle")}
            description={t("galleryWorkshopDesc")}
            tag={t("catWorkshop")}
            height={380}
            flex="flex-[3]"
          />
          <GalleryCard
            src="/portfolio/4.jpeg"
            title={t("gallerySignboardTitle")}
            description={t("gallerySignboardDesc")}
            tag={t("catBrands")}
            height={380}
            flex="flex-[2]"
          />
        </div>

        {/* Row 2 */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <GalleryCard
            src="/portfolio/3.jpeg"
            title={t("galleryOverviewTitle")}
            description={t("galleryOverviewDesc")}
            tag={t("catWorkshop")}
            height={340}
            flex="flex-[3]"
          />
          <GalleryCard
            src="/portfolio/1.jpeg"
            title={t("galleryCardTitle")}
            description={t("galleryCardDesc")}
            tag={t("catExpertise")}
            height={340}
            flex="flex-[2]"
          />
        </div>
      </section>
    </div>
  );
}

/* ── GalleryCard ─────────────────────────────────────────── */
function GalleryCard({
  src,
  title,
  description,
  tag,
  height,
  flex = "flex-1",
}: {
  src: string;
  title: string;
  description: string;
  tag: string;
  height: number;
  flex?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gray-200 shadow-md ${flex}`}
      style={{ height }}
    >
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Tag */}
      <div className="absolute left-4 top-4">
        <span className="rounded-full bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm ring-1 ring-white/20">
          {tag}
        </span>
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-base font-bold text-white sm:text-lg">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-white/75 sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

/* ── PortfolioCard (DB items — kept for future use) ─────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PortfolioCard({
  item,
  featured = false,
}: {
  item: PortfolioItem;
  featured?: boolean;
}) {
  return (
    <Card hover className={`overflow-hidden p-0 ${featured ? "ring-2 ring-[var(--color-accent)]/30" : ""}`}>
      <div className="relative aspect-[4/3] bg-[var(--color-surface)]">
        {item.media_type === "image" ? (
          <Image src={item.media_url} alt={item.title} fill className="object-cover" />
        ) : (
          <video
            src={item.media_url}
            controls
            preload="metadata"
            tabIndex={-1}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        {item.title && (
          <h3 className="font-semibold text-[var(--color-foreground)]">{item.title}</h3>
        )}
        {item.description && (
          <p className="mt-1 text-sm text-[var(--color-muted)]">{item.description}</p>
        )}
      </div>
    </Card>
  );
}
