import { skills } from "@/content/portfolio";

export default function Marquee() {
  // Duplicate for seamless loop
  const items = [...skills, ...skills];
  return (
    <div
      aria-label="Skills marquee"
      className="relative my-20 overflow-hidden border-y border-black/5 bg-cream py-6"
    >
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap px-6">
        {items.map((s, i) => (
          <span
            key={i}
            className="font-display text-3xl font-semibold text-ink/80 md:text-5xl"
          >
            {s}
            <span className="ml-12 inline-block text-gold">✦</span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-cream to-transparent" />
    </div>
  );
}
