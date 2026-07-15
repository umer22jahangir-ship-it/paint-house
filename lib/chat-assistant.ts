import { siteConfig } from "./config";
import { buildWhatsAppUrl } from "./whatsapp";

/**
 * Rule-based paint assistant — designed to be swapped for a real LLM later.
 * Never guarantees exact color matching per business requirements.
 */
export function getAssistantReply(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  if (!msg) {
    return "Please type a question about car paint matching, and I'll do my best to help!";
  }

  if (
    msg.includes("imported") &&
    (msg.includes("china") || msg.includes("chinese") || msg.includes("vs") || msg.includes("difference"))
  ) {
    return `Great question! Here's the difference:

**Imported Paint** — Premium OEM-grade paints sourced from international brands. Higher durability, better color accuracy, and longer-lasting finish. Ideal for visible panels and full resprays.

**China Paint** — Cost-effective alternative that still delivers good results for repairs and touch-ups. Suitable for budget-conscious customers.

We offer both options and can help you choose based on your needs and budget. We cannot guarantee an exact factory match without physical inspection — contact us on WhatsApp for a personalized recommendation!`;
  }

  if (msg.includes("imported")) {
    return `We stock **imported paint** from premium international brands. These paints offer superior color fidelity and durability. Availability varies by color — use our Paint Finder tool or message us on WhatsApp at ${siteConfig.phone} with your vehicle details for current stock.`;
  }

  if (msg.includes("china") || msg.includes("chinese")) {
    return `Our **China paint** options provide an affordable solution for body shop repairs and panel resprays. While not identical to OEM imported paints, they deliver reliable results. Use the Paint Finder to check availability, or WhatsApp us for advice on whether China paint suits your project.`;
  }

  if (
    msg.includes("guarantee") ||
    msg.includes("exact match") ||
    msg.includes("perfect match")
  ) {
    return `We want to be upfront: **we cannot guarantee an exact color match** without seeing your vehicle in person. Factors like sun fading, previous repaints, and batch variations all affect the final result. Our computerized color matching system gives you the best possible starting point, but we always recommend a physical color check. WhatsApp us to schedule a consultation!`;
  }

  if (
    msg.includes("price") ||
    msg.includes("cost") ||
    msg.includes("how much")
  ) {
    return `Pricing depends on the paint type (imported vs China), quantity needed, and your vehicle's color code. For an accurate quote, please contact us on WhatsApp at ${siteConfig.phone} with your car make, model, year, and paint code if you have it.`;
  }

  if (
    msg.includes("how") &&
    (msg.includes("work") || msg.includes("process") || msg.includes("match"))
  ) {
    return `Our color matching process:

1. **You provide** your car company, model, and year (use our Paint Finder tool!)
2. **We look up** factory paint codes from our database
3. **Computerized matching** — our spectrophotometer analyzes your panel
4. **Custom mixing** — we blend to the closest possible match
5. **Test spray** — we verify before full application

For the most accurate result, bring your vehicle to our workshop. WhatsApp us to book!`;
  }

  if (
    msg.includes("toyota") ||
    msg.includes("honda") ||
    msg.includes("suzuki") ||
    msg.includes("hyundai") ||
    msg.includes("kia") ||
    msg.includes("corolla") ||
    msg.includes("civic") ||
    msg.includes("swift")
  ) {
    return `We have paint data for many popular brands including Toyota, Honda, Suzuki, Hyundai, and Kia. Head to our **Paint Finder** page, enter your vehicle details, and we'll show possible color matches with paint codes and availability.

Remember, database results are a starting point — we cannot guarantee an exact match without physical inspection. WhatsApp us with your results for expert advice!`;
  }

  if (
    msg.includes("contact") ||
    msg.includes("whatsapp") ||
    msg.includes("phone") ||
    msg.includes("call") ||
    msg.includes("reach")
  ) {
    return `You can reach us easily:

📱 **WhatsApp:** ${siteConfig.phone}
📞 **Phone:** ${siteConfig.phone}
📍 **Address:** ${siteConfig.address}

The fastest way to get help is WhatsApp — we typically respond within minutes during business hours!`;
  }

  if (
    msg.includes("hello") ||
    msg.includes("hi") ||
    msg.includes("hey") ||
    msg.includes("salam")
  ) {
    return `Hello! Welcome to ${siteConfig.name}. I'm your AI Paint Assistant — I can help with:

• Finding paint codes for your vehicle
• Explaining imported vs China paint options
• Understanding our color matching process
• Connecting you with our team

What would you like to know? For the best results, also try our **Paint Finder** tool!`;
  }

  if (msg.includes("paint code") || msg.includes("color code")) {
    return `A **paint code** is the manufacturer's identifier for your car's factory color (e.g., Toyota "040" for Super White II, Honda "NH-731P" for Crystal Black Pearl). You can find it on the door jamb sticker or owner's manual.

Use our **Paint Finder** with your car details to see possible codes, then WhatsApp us to confirm availability and get a color match quote.`;
  }

  if (msg.includes("service") || msg.includes("offer")) {
    return `We offer:

• **Computerized Color Matching** — spectrophotometer-based precision
• **Imported Paint Supply** — premium international brands
• **China Paint Supply** — quality budget-friendly options
• **Custom Paint Mixing** — tailored to your color code
• **Paint Consultation** — expert advice before you buy

Visit our Services page for details, or WhatsApp us for a free consultation!`;
  }

  return `Thanks for your question! For specific paint matching advice, I recommend:

1. Use our **Paint Finder** tool with your car company, model, and year
2. **WhatsApp us** at ${siteConfig.phone} with your results

Our team can provide personalized guidance. Please note we cannot guarantee an exact color match without seeing your vehicle in person.

Is there anything else I can help with — imported vs China paint, our process, or pricing?`;
}

export function getWhatsAppLinkFromChat(): string {
  return buildWhatsAppUrl(
    `Hi! I was chatting with the ${siteConfig.name} assistant and would like to speak with someone about paint matching.`
  );
}
