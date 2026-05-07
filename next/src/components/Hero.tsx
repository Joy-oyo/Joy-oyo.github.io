"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { site } from "@/content/portfolio";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-klein-dark via-klein to-klein-light text-white">
      {/* decorative orbs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />
      <div className="relative grain" />

      <div className="relative mx-auto max-w-5xl px-5 pt-36 pb-32 text-center md:pt-44 md:pb-40">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur"
        >
          {site.hero.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display text-balance text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
        >
          {site.hero.headlinePrefix}{" "}
          <span className="gradient-text">{site.hero.headlineAccent}</span>.
          <br className="hidden sm:block" /> {site.hero.headlineSuffix}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-base text-white/80 md:text-lg"
        >
          {site.hero.lede}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Link
            href={site.hero.primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-klein-dark transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(255,215,0,0.4)]"
          >
            {site.hero.primaryCta.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={site.hero.secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
          >
            {site.hero.secondaryCta.label}
          </Link>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/70"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
