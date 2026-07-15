"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Bot, User, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { ChatMessage } from "@/lib/types";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I'm your AI Paint Assistant at Aftab Malik Paint House. Ask me about paint matching, imported vs China paint, or how to find your car's paint code. I cannot guarantee an exact color match — contact us on WhatsApp for the best advice!",
};

interface ChatAssistantProps {
  embedded?: boolean;
}

export function ChatAssistant({ embedded = false }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Sorry, I couldn't process that." },
      ]);
      if (data.whatsappLink) setWhatsappLink(data.whatsappLink);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again or contact us on WhatsApp.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const wrapperClass = embedded
    ? "flex h-full flex-col overflow-hidden"
    : "flex h-[500px] flex-col overflow-hidden p-0";

  const inner = (
    <>
      {!embedded && (
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-primary)] px-5 py-4 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">AI Paint Assistant</p>
            <p className="text-xs text-white/70">Ask about paint matching</p>
          </div>
        </div>
      )}

      <div ref={messagesRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                msg.role === "user"
                  ? "bg-[var(--color-accent)]"
                  : "bg-[var(--color-primary)]/10"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4 text-[var(--color-primary)]" />
              ) : (
                <Bot className="h-4 w-4 text-[var(--color-primary)]" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface)] text-[var(--color-foreground)]"
              }`}
            >
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-2" : ""}>
                  {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                </p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
              <Bot className="h-4 w-4 text-[var(--color-primary)]" />
            </div>
            <div className="rounded-2xl bg-[var(--color-surface)] px-4 py-3">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}

      </div>

      {whatsappLink && (
        <div className="border-t border-[var(--color-border)] px-4 py-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/10 py-2 text-xs font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/20"
          >
            <MessageCircle className="h-4 w-4" />
            Continue on WhatsApp
          </a>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-[var(--color-border)] p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about paint matching..."
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </>
  );

  if (embedded) return <div className={wrapperClass}>{inner}</div>;
  return <Card className={wrapperClass}>{inner}</Card>;
}
