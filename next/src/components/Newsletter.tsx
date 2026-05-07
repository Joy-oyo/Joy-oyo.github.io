"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMsg("Please enter a valid email address.");
      return;
    }
    setState("loading");
    // Simulated submission — wire up to your API/Resend/Mailchimp later
    await new Promise((r) => setTimeout(r, 900));
    setState("success");
    setMsg("Thanks! I'll be in touch soon.");
    setEmail("");
  }

  return (
    <section
      id="newsletter"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-klein-dark via-klein to-klein-light px-5 py-24 text-white"
    >
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-xl rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,29,107,0.4)] md:p-10"
      >
        <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">
          Newsletter
        </span>
        <h3 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Stay Connected
        </h3>
        <p className="mt-2 text-white/75">
          Drop your email — I&apos;ll send occasional notes on new work, never spam.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state !== "idle") setState("idle");
            }}
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-white placeholder-white/50 backdrop-blur transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-klein-dark transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(255,215,0,0.4)] disabled:opacity-60"
          >
            {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
            {state === "loading" ? "Sending…" : "Subscribe"}
          </button>
        </form>

        {state === "success" && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
            <CheckCircle2 className="h-4 w-4" /> {msg}
          </div>
        )}
        {state === "error" && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
            <AlertCircle className="h-4 w-4" /> {msg}
          </div>
        )}
      </motion.div>
    </section>
  );
}
