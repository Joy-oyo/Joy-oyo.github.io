import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { site } from "@/content/site";

export const metadata = { title: "Contact — Joy Chen" };

export default function ContactPage() {
  const focusRing =
    "outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  return (
    <>
      <main id="main" className="relative pb-24 pt-32">
        <PageHeader
          eyebrow="05 · Contact"
          title="Say hi"
          lede="Drop a note, subscribe for the occasional update, or find me elsewhere."
        />

        <section aria-label="Subscribe" className="mx-auto mt-20 max-w-xl px-6">
          <ContactForm />
        </section>

        <section
          aria-label="Other ways to reach me"
          className="mx-auto mt-6 grid max-w-xl gap-3 px-6 sm:grid-cols-2"
        >
          <a
            href={`mailto:${site.email}`}
            className={`glass glass-sheen glass-lift group block rounded-2xl px-5 py-5 ${focusRing}`}
          >
            <span className="text-[10px] uppercase tracking-[0.28em] text-ink-50/40">
              Email direct
            </span>
            <span className="mt-2 block break-all text-sm text-ink-50/85 transition-colors group-hover:text-ink-50">
              {site.email}
            </span>
          </a>

          <div className="glass glass-sheen rounded-2xl px-5 py-5">
            <span className="text-[10px] uppercase tracking-[0.28em] text-ink-50/40">
              Elsewhere
            </span>
            <ul className="mt-2 space-y-1.5">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group inline-flex items-center gap-2 text-sm text-ink-50/70 transition-colors hover:text-ink-50 ${focusRing}`}
                  >
                    {s.label}
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <p className="mx-auto mt-8 max-w-xl px-6 text-center text-xs text-ink-50/35">
          Based in {site.location} · usually replies within a few days.
        </p>
      </main>
      <Footer />
    </>
  );
}
