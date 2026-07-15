import { siteConfig } from "./config";

export function buildWhatsAppUrl(message?: string, phone?: string): string {
  const number = phone ?? siteConfig.whatsapp;
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildPaintInquiryMessage(
  company: string,
  model: string,
  year: string,
  colorName?: string,
  paintCode?: string
): string {
  let msg = `Hi! I'm looking for paint for my ${company} ${model} (${year}).`;
  if (colorName && paintCode) {
    msg += ` I'm interested in ${colorName} (Code: ${paintCode}).`;
  }
  msg += " Can you help me with color matching?";
  return msg;
}
