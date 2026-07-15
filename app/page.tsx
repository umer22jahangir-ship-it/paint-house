import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Car Paint Color Matching`,
  description: siteConfig.description,
};

export default function HomePage() {
  return <HomePageClient />;
}

