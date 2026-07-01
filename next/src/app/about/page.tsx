import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { site, toolkit } from "@/content/portfolio";

export const metadata = { title: "About — Joy Chen" };

/* ------------------------------------------------------------------ *
 *  Content lives at the top of the file so it's easy to edit.
 *  Everything below is just layout.
 * ------------------------------------------------------------------ */

const story = [
  // 1 — opening / where you are now
  `I work at the seam between product, code, and image. By day I build AI-powered media tools at Tencent; by night I run Veeup with a small team, and shoot stills on the side. The home page is the shortlist — this page is the longer answer to "so, what do you actually do?"`,

  // 2 — how the mix happened
  `The mix wasn't planned. I started in Media Studies because I liked stories, picked up CS because I liked making things, then spent a Master's at UChicago getting comfortable with the parts of AI that aren't a demo. Somewhere along the way I noticed the most interesting questions for me sit between disciplines — what a model can render, what a person actually wants to make, and what a screen can carry.`,

  // 3 — what you optimize for
  `I'm drawn to tools that disappear into the work. The ones that let you forget they're there until the moment you need them. That's true whether it's a cloud media pipeline, a job-hunt copilot, or a camera. I care less about whether something is "AI" and more about whether it earns its place in someone's day.`,

  // 4 — humble / inviting closer
  `If we end up talking, I'd rather hear about what you're trying to make than what you're building with. The stack is downstream of the idea.`,
];

const principles: { title: string; body: string }[] = [
  {
    title: "Ship the smallest interesting thing first.",
    body:
      "A demo that exists beats a roadmap that doesn't. The roadmap can come from what people do with the demo.",
  },
  {
    title: "If a tool needs a tutorial, it isn't done.",
    body:
      "The best interfaces explain themselves through use. I treat onboarding friction as a bug, not a deliverable.",
  },
  {
    title: "Take the photo even when you're tired.",
    body:
      "Showing up is most of the work, in photography and everywhere else. Taste is what's left after a few thousand mediocre attempts.",
  },
  {
    title: "Optimize for the next maker, not the current viewer.",
    body:
      "Code, write, and document like someone has to pick it up after you — including future-you, three months from now, with no context.",
  },
  {
    title: "Be skeptical of cleverness.",
    body:
      "Most clever solutions are someone else's tech debt. Boring choices age better; reach for clever only when the boring version genuinely can't do the job.",
  },
];

const currentlyThinking: { title: string; body: string }[] = [
  {
    title: "Where do AI agents stop being demos and start being craft tools?",
    body:
      "Most agent products feel like party tricks. I'm interested in the boundary where they become reliable enough to live inside a working creative pipeline — and what that does to authorship along the way.",
  },
  {
    title: "Media tools as instruments, not appliances.",
    body:
      "Cameras, DAWs, and even text editors reward mastery. A lot of AI-creative software currently rewards prompting tricks instead. I want to make tools that are deep enough to grow into.",
  },
  {
    title: "The continuum from toy to tool.",
    body:
      "Some of the best products start as toys. I keep a running list of things that feel playful but suspiciously useful — and I try to figure out which side they end up on.",
  },
];

const elsewhere: { label: string; value: string }[] = [
  { label: "Reading", value: "Bits of cognitive science, anything Robin Sloan writes." },
  { label: "Listening", value: "A lot of ambient, occasional 90s shoegaze relapses." },
  { label: "Shooting", value: "35mm film when I have the patience, iPhone when I don't." },
  { label: "If not building", value: "Probably walking, probably overthinking a coffee order." },
];

/* ------------------------------------------------------------------ *
 *  Layout
 * ------------------------------------------------------------------ */

function SectionLabel({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10">
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-50/45">
        {kicker}
      </span>
      <h2 className="display text-3xl md:text-4xl mt-2 text-ink-50/90">
        {title}
      </h2>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="01 · About"
          title="A longer answer"
          lede="The home page is the shortlist of what I do. This page is who's behind it, how I work, and what I'm currently thinking about."
        />

        {/* 1 — Story */}
        <section className="mx-auto max-w-3xl px-6 mt-20">
          <SectionLabel kicker="Story" title="How I got here" />
          <div className="space-y-5 text-ink-50/75 leading-[1.75] text-[15px] md:text-base">
            {story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* 2 — How I work */}
        <section className="mx-auto max-w-3xl px-6 mt-28">
          <SectionLabel kicker="Principles" title="How I work" />
          <ul className="space-y-7">
            {principles.map((p, i) => (
              <li key={i} className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40 tabular-nums pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="display text-lg md:text-xl text-ink-50 leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm md:text-[15px] text-ink-50/65 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 3 — What I'm thinking about */}
        <section className="mx-auto max-w-3xl px-6 mt-28">
          <SectionLabel kicker="Currently" title="What I'm thinking about" />
          <div className="space-y-10">
            {currentlyThinking.map((c, i) => (
              <div key={i}>
                <h3 className="display text-xl md:text-2xl text-ink-50 leading-snug">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm md:text-[15px] text-ink-50/65 leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4 — Elsewhere (humanize) */}
        <section className="mx-auto max-w-3xl px-6 mt-28">
          <SectionLabel kicker="Elsewhere" title="Off the clock" />
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 border-t border-ink-50/10 pt-8">
            {elsewhere.map((e) => (
              <div key={e.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                  {e.label}
                </dt>
                <dd className="mt-2 text-sm md:text-[15px] text-ink-50/80 leading-relaxed">
                  {e.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 5 — Toolkit */}
        <section className="mx-auto max-w-3xl px-6 mt-28">
          <SectionLabel kicker="Toolkit" title="What I reach for" />
          <div className="space-y-8">
            {toolkit.map((group) => (
              <div key={group.group}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                  {group.group}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((s) => (
                    <li
                      key={s}
                      className="glass rounded-full px-3.5 py-1.5 text-xs tracking-wide text-ink-50/80"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 6 — Colophon */}
        <section className="mx-auto max-w-3xl px-6 mt-28">
          <SectionLabel kicker="Colophon" title="About this site" />
          <p className="text-sm md:text-[15px] text-ink-50/65 leading-relaxed max-w-2xl">
            Built with{" "}
            <span className="text-ink-50/85">Next.js</span>,{" "}
            <span className="text-ink-50/85">Three.js</span>, and{" "}
            <span className="text-ink-50/85">Framer Motion</span>. Type set in
            Inter and a display serif. Hosted on Vercel. The 3D cyber room is a
            small experiment in making a portfolio feel like a place, not a
            document.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.25em] text-ink-50/55">
            <a
              href="https://github.com/Joy-oyo/Joy-oyo.github.io"
              target="_blank"
              rel="noreferrer"
              className="border-b border-ink-50/20 pb-0.5 hover:text-ink-50 hover:border-ink-50/80 transition-colors"
            >
              Source on GitHub →
            </a>
            <a
              href="/cyber"
              className="border-b border-ink-50/20 pb-0.5 hover:text-ink-50 hover:border-ink-50/80 transition-colors"
            >
              Enter the cyber room →
            </a>
          </div>
        </section>

        {/* 7 — CTA */}
        <section className="mx-auto max-w-3xl px-6 mt-24">
          <div className="glass rounded-2xl px-6 py-8 md:px-10 md:py-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h3 className="display text-2xl text-ink-50">Want to talk?</h3>
              <p className="mt-1 text-sm text-ink-50/60">
                Reach me at{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="border-b border-ink-50/20 text-ink-50/85 hover:border-ink-50/80 hover:text-ink-50 transition-colors"
                >
                  {site.email}
                </a>
                , or use the form.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-ink-50 px-5 py-2.5 font-medium text-ink-950 hover:bg-white transition-colors"
              >
                Say hi
                <span aria-hidden>→</span>
              </a>
              <a
                href="/work"
                className="text-ink-50/70 border-b border-ink-50/20 pb-0.5 hover:text-ink-50 hover:border-ink-50/80 transition-colors"
              >
                See selected work
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
