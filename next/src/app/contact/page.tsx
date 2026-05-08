import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { site } from "@/content/portfolio";

export const metadata = { title: "Contact — Joy Chen" };

export default function ContactPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="05 · Contact"
          title="Say hi"
          lede="Drop a note, subscribe for the occasional update, or find me elsewhere."
        />

        <section className="mx-auto max-w-xl px-6 mt-20">
          <ContactForm />

          <div className="mt-16 text-center text-sm text-ink-50/60">
            Or reach me directly at{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-ink-50 border-b border-ink-50/40 hover:border-ink-50"
            >
              {site.email}
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.3em]">
            {site.socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-ink-50/60 hover:text-ink-50"
              >
                {s.label}
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
