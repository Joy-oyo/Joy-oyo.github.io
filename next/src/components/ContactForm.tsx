"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Stage = "idle" | "sending" | "code" | "verifying" | "done" | "error";

export default function ContactForm() {
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const reduceMotion = useReducedMotion();

  // "error" keeps whichever step the user was on, so we track that separately.
  const [step, setStep] = useState<"email" | "code">("email");

  const busy = stage === "sending" || stage === "verifying";
  const isError = stage === "error";

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email || busy) return;
    setStage("sending");
    setMessage("");
    try {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      setMessage("Verification code sent — check your inbox.");
      setStep("code");
      setStage("code");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6 || busy) return;
    setStage("verifying");
    setMessage("");
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setMessage("You're in. Thanks for subscribing!");
      setStage("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    }
  }

  function restart() {
    setStep("email");
    setStage("idle");
    setCode("");
    setMessage("");
  }

  const fieldClass =
    "glass-chip w-full rounded-xl px-4 py-3.5 text-ink-50 outline-none transition-colors placeholder:text-ink-50/30 focus-visible:border-klein focus-visible:ring-2 focus-visible:ring-klein/60";
  const submitClass =
    "mt-2 w-full rounded-full bg-ink-50 py-3.5 text-xs font-medium uppercase tracking-[0.3em] text-ink-950 transition-all hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-45 outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  const transition = reduceMotion ? { duration: 0.15 } : { duration: 0.35 };
  const enter = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
      };

  return (
    <div className="glass-strong glass-sheen relative isolate overflow-hidden rounded-[2rem] p-8 md:p-10">
      {/* Step indicator — tells people how long this will take. */}
      {stage !== "done" && (
        <div className="mb-7 flex items-center gap-3" aria-hidden>
          {(["email", "code"] as const).map((s, i) => {
            const active = step === s;
            const complete = step === "code" && s === "email";
            return (
              <div key={s} className="flex flex-1 items-center gap-3">
                <span
                  className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                    active || complete ? "bg-klein" : "bg-ink-50/12"
                  }`}
                />
                <span
                  className={`font-mono text-[10px] ${
                    active ? "text-ink-50/70" : "text-ink-50/30"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        {stage === "done" ? (
          <motion.div
            key="done"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transition}
            className="py-8 text-center"
          >
            <div
              aria-hidden
              className="glass-chip mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-emerald-300"
            >
              ✓
            </div>
            <p className="text-ink-50/85">{message}</p>
          </motion.div>
        ) : step === "email" ? (
          <motion.form
            key="email"
            {...enter}
            transition={transition}
            onSubmit={sendCode}
            noValidate
            className="space-y-4"
          >
            <label
              htmlFor="contact-email"
              className="block text-xs uppercase tracking-[0.3em] text-ink-50/55"
            >
              Your email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-describedby="contact-email-hint"
              aria-invalid={isError || undefined}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@somewhere.com"
              className={fieldClass}
            />
            <p id="contact-email-hint" className="text-xs text-ink-50/40">
              We&apos;ll send a 6-digit code to confirm it&apos;s really you.
            </p>
            <button type="submit" disabled={busy || !email} className={submitClass}>
              {stage === "sending" ? "Sending…" : "Get verification code"}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="code"
            {...enter}
            transition={transition}
            onSubmit={verifyCode}
            noValidate
            className="space-y-4"
          >
            <label
              htmlFor="contact-code"
              className="block text-xs uppercase tracking-[0.3em] text-ink-50/55"
            >
              6-digit code
            </label>
            <input
              id="contact-code"
              name="one-time-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              aria-describedby="contact-code-hint"
              aria-invalid={isError || undefined}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className={`${fieldClass} text-center text-2xl tracking-[0.5em] placeholder:tracking-[0.4em] placeholder:text-ink-50/20`}
            />
            <p id="contact-code-hint" className="text-center text-xs text-ink-50/40">
              Sent to {email} · expires in 10 minutes
            </p>
            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className={submitClass}
            >
              {stage === "verifying" ? "Verifying…" : "Verify & subscribe"}
            </button>
            <button
              type="button"
              onClick={restart}
              className="w-full rounded py-2 text-xs uppercase tracking-[0.3em] text-ink-50/50 outline-none transition-colors hover:text-ink-50 focus-visible:ring-2 focus-visible:ring-klein"
            >
              ← Use a different email
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Single live region so screen readers hear every status change. */}
      <p
        role={isError ? "alert" : "status"}
        aria-live="polite"
        className={`mt-5 min-h-5 text-center text-sm ${
          isError ? "text-rose-300" : "text-ink-50/60"
        }`}
      >
        {stage === "done" ? "" : message}
      </p>
    </div>
  );
}
