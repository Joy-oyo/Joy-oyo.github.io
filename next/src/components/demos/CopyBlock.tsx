"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CopyBlock — a monospace code panel with a copy button, used for the BibTeX
 * entry. Falls back to a visible failure state rather than pretending it
 * worked, since the Clipboard API is gated on a secure context.
 */
export default function CopyBlock({
  code,
  label = "BibTeX",
}: {
  code: string;
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  const message =
    state === "copied" ? "Copied" : state === "failed" ? "Select manually" : "Copy";

  return (
    <div className="glass-card glass-sheen relative isolate overflow-hidden rounded-[1.5rem]">
      <div className="flex items-center justify-between gap-4 border-b border-ink-50/10 px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-50/40">
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="glass-chip glass-sheen glass-lift rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink-50/70 outline-none transition-colors hover:text-ink-50 focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
        >
          {message}
        </button>
      </div>

      {/* aria-live keeps the outcome available to screen readers. */}
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "BibTeX copied to clipboard" : ""}
      </span>

      <pre className="no-scrollbar overflow-x-auto px-5 py-5 font-mono text-[11.5px] leading-[1.75] text-ink-50/65 md:text-xs">
        <code>{code}</code>
      </pre>
    </div>
  );
}
