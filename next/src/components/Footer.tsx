import { footer, site } from "@/content/portfolio";
import { Github, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-black/5 bg-ink py-10 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 md:flex-row">
        <p className="text-sm">
          © <span>{year}</span> · {site.name} · {footer.copyright}
        </p>
        <ul className="flex flex-wrap items-center gap-1 text-sm">
          {footer.links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="ml-2 flex items-center gap-1">
            <a
              aria-label="GitHub"
              href="https://github.com/joy-oyo"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5 hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              aria-label="Email"
              href="#newsletter"
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5 hover:text-white"
            >
              <Mail className="h-4 w-4" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
