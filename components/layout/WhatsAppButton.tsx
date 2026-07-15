import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";

interface WhatsAppButtonProps {
  message?: string;
  label?: string;
  variant?: "floating" | "inline";
  className?: string;
  phone?: string;
}

export function WhatsAppButton({
  message,
  label = "Chat on WhatsApp",
  variant = "inline",
  className = "",
  phone,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppUrl(message, phone);

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#1da851] ${className}`}
        aria-label={`Contact ${siteConfig.name} on WhatsApp`}
      >
        <MessageCircle className="h-7 w-7" fill="white" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1da851] ${className}`}
    >
      <MessageCircle className="h-5 w-5" fill="white" />
      {label}
    </a>
  );
}
