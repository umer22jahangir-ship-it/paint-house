"use client";

import { useState } from "react";
import { Bot, X, Minimize2 } from "lucide-react";
import { ChatAssistant } from "@/components/chat/ChatAssistant";

export function FloatingChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-4 z-50 sm:left-6">
      {open && (
        <div className="mb-4 w-[calc(100vw-2rem)] max-w-[380px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl sm:w-[380px]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-primary)] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-semibold">AI Paint Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 hover:bg-white/10"
              aria-label="Minimize chat"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[420px]">
            <ChatAssistant embedded />
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-5 text-white shadow-lg transition-transform hover:scale-105"
          aria-label="Open AI Paint Assistant"
        >
          <Bot className="h-6 w-6" />
          <span className="hidden text-sm font-semibold sm:inline">AI Assistant</span>
        </button>
      )}

      {open && (
        <button
          onClick={() => setOpen(false)}
          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-md border border-[var(--color-border)] sm:hidden"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
