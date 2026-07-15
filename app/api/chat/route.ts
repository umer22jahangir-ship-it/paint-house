import { NextRequest, NextResponse } from "next/server";
import { getAssistantReply, getWhatsAppLinkFromChat } from "@/lib/chat-assistant";
import { siteConfig } from "@/lib/config";

// Point this at your Ollama server. "http://localhost:11434" only works
// when the Next.js app itself runs on the same machine as Ollama — for a
// real deployment (Vercel/Railway) Ollama must be hosted somewhere
// publicly reachable, and its URL put here via env var.
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1";

const SYSTEM_PROMPT = `You are the AI Paint Assistant for ${siteConfig.name}, a car paint matching shop.
Help customers with: paint matching, imported vs China paint options, how the color-matching
process works, finding paint codes, pricing guidance, and connecting them to the shop.
Never guarantee an exact factory color match without physical inspection.
Keep replies short (under 120 words), friendly, and use **bold** for key terms.
If you don't know something specific (like live stock or exact pricing), tell the customer
to WhatsApp the shop at ${siteConfig.phone}.`;

async function getOllamaReply(message: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("Ollama request failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const reply: string | undefined = data?.message?.content;
    return reply?.trim() || null;
  } catch (error) {
    console.error("Ollama unreachable:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Try the real AI model first; if it's unreachable or errors out,
    // fall back to the rule-based assistant so the chat never breaks.
    const aiReply = await getOllamaReply(message);
    const reply = aiReply ?? getAssistantReply(message);

    return NextResponse.json({
      reply,
      whatsappLink: getWhatsAppLinkFromChat(),
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return NextResponse.json({ error: "Assistant unavailable" }, { status: 500 });
  }
}
