"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { FloatingChatWidget } from "@/components/chat/FloatingChatWidget";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingChatWidget />
      <WhatsAppButton variant="floating" />
    </>
  );
}
