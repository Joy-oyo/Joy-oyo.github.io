"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "idle" | "sending" | "code" | "verifying" | "done" | "error";

export default function ContactForm() {
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
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
      setStage("code");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;
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

  return (
    <div className="glass-strong rounded-3xl p-8 md:p-10">
      <AnimatePresence mode="wait">
        {stage !== "code" && stage !== "verifying" && stage !== "done" ? (
          <motion.form
            key="email"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={sendCode}
            className="space-y-4"
          >
            <label className="block text-xs uppercase tracking-[0.3em] text-ink-50/50">
              Your email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@somewhere.com"
              className="w-full bg-transparent border-b border-ink-50/20 focus:border-ink-50 outline-none py-3 text-lg placeholder:text-ink-50/30"
            />
            <button
              type="submit"
              disabled={stage === "sending"}
              className="w-full mt-4 py-3 rounded-full bg-ink-50 text-ink-950 text-xs uppercase tracking-[0.3em] font-medium hover:bg-ink-100 disabled:opacity-50 transition-colors"
            >
              {stage === "sending" ? "Sending…" : "Get verification code"}
            </button>
          </motion.form>
        ) : stage === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="display text-5xl mb-4">✓</div>
            <p className="text-ink-50/80">{message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="code"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={verifyCode}
            className="space-y-4"
          >
            <label className="block text-xs uppercase tracking-[0.3em] text-ink-50/50">
              6-digit code from email
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              className="w-full bg-transparent border-b border-ink-50/20 focus:border-ink-50 outline-none py-3 text-2xl tracking-[0.5em] text-center placeholder:text-ink-50/20"
            />
            <button
              type="submit"
              disabled={stage === "verifying"}
              className="w-full mt-4 py-3 rounded-full bg-ink-50 text-ink-950 text-xs uppercase tracking-[0.3em] font-medium hover:bg-ink-100 disabled:opacity-50 transition-colors"
            >
              {stage === "verifying" ? "Verifying…" : "Verify & subscribe"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStage("idle");
                setCode("");
                setMessage("");
              }}
              className="w-full text-xs uppercase tracking-[0.3em] text-ink-50/50 hover:text-ink-50"
            >
              ← Use a different email
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {message && stage !== "done" && (
        <p
          className={`mt-4 text-sm text-center ${
            stage === "error" ? "text-red-400" : "text-ink-50/60"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
