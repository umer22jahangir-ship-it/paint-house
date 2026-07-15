/** Site-wide configuration — update these values for your business */
export const siteConfig = {
  name: "Aftab Malik Paint House",
  shortName: "Aftab Malik",
  tagline: "Precision Car Paint Color Matching",
  description:
    "Expert computerized car paint color matching with imported and China paint options. Find your vehicle's paint code and contact us on WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+92 300-4814446",
  phone2: "+92 333-4814446",
  whatsapp: "923004814446",
  whatsapp2: "923334814446",
  email: "malikaftab16@gmail.com",
  address: "Shop #43, Super Auto Market, Chowk Chauburji, Lahore",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.0!2d74.3050311!3d31.553591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391903540b255a8f%3A0x3bc63f61b7f7d0e6!2sChuburji%20Auto%20Market!5e0!3m2!1sen!2s",
  social: {
    whatsapp: "https://wa.me/923004814446",
    whatsapp2: "https://wa.me/923334814446",
  },
  brand: {
    primary: "#3b82f6",
    primaryDark: "#2563eb",
    accent: "#06b6d4",
    accentLight: "#bae6fd",
  },
} as const;

export const portfolioCategories = [
  { value: "workshop", label: "Workshop" },
  { value: "machine", label: "Color Matching Machine" },
  { value: "samples", label: "Paint Samples" },
  { value: "before_after", label: "Before & After" },
  { value: "brands", label: "Paint Brands" },
  { value: "expertise", label: "Our Expertise" },
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number]["value"];
