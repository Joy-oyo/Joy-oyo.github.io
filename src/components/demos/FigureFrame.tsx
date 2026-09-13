import Image from "next/image";
import type { LabFigure } from "@/content/demos";

const ASPECT: Record<NonNullable<LabFigure["aspect"]>, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[16/9] md:aspect-[21/9]",
  "4/3": "aspect-[4/3]",
};

/** Faint graph paper so an asset-less frame still reads as designed, not broken. */
const GRID =
  "[background-image:linear-gradient(to_right,rgba(245,245,240,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,245,240,0.6)_1px,transparent_1px)] [background-size:34px_34px]";

/**
 * FigureFrame — the numbered figure/video slot used throughout the project page.
 *
 * Three rendering modes, chosen automatically:
 *  1. `panels` → a four-up baseline comparison grid (reference / baselines / ours)
 *  2. `src`    → the real asset, video or image
 *  3. neither  → a designed placeholder carrying the figure number and a pending note
 *
 * Mode 3 matters: the builds land one at a time, and a page full of broken
 * image icons reads worse than a page that admits what hasn't been shot yet.
 */
export default function FigureFrame({
  figure,
  className = "",
}: {
  figure: LabFigure;
  className?: string;
}) {
  const aspect = ASPECT[figure.aspect ?? "16/9"];

  return (
    <figure
      className={`glass-card glass-sheen relative isolate overflow-hidden rounded-[1.5rem] ${className}`}
    >
      <div
        className={`relative ${aspect} border-b border-ink-50/10 bg-gradient-to-br from-ink-50/[0.06] via-transparent to-klein/15`}
      >
        {figure.panels ? (
          <PanelGrid panels={figure.panels} />
        ) : figure.src && figure.kind === "video" ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={figure.src}
            poster={figure.poster}
            controls
            muted
            loop
            playsInline
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : figure.src ? (
          <Image
            src={figure.src}
            alt={figure.caption}
            fill
            sizes="(max-width: 768px) 100vw, 56rem"
            className="object-cover"
          />
        ) : (
          <Pending label={figure.label} text={figure.pending} />
        )}
      </div>

      <figcaption className="px-5 py-4 md:px-6 md:py-5">
        <p className="text-sm leading-relaxed text-ink-50/70">
          <span className="glass-chip mr-2.5 inline-block rounded px-2 py-0.5 align-[2px] font-mono text-[10px] uppercase tracking-[0.16em] text-ink-50/55">
            {figure.label}
          </span>
          {figure.caption}
        </p>

        {figure.note && (
          <p className="mt-3 border-t border-ink-50/10 pt-3 font-mono text-[11px] leading-relaxed text-ink-50/40">
            {figure.note}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * Four-up comparison grid. Borders are applied positionally so the interior
 * hairlines form a cross without doubling up on the outer edges.
 */
function PanelGrid({ panels }: { panels: NonNullable<LabFigure["panels"]> }) {
  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
      {panels.map((panel, i) => {
        const isLeftColumn = i % 2 === 0;
        const isTopRow = i < 2;
        const isOurs = i === panels.length - 1;

        return (
          <div
            key={panel.title}
            className={`relative flex flex-col justify-between gap-2 p-3 md:p-4 ${
              isLeftColumn ? "border-r border-ink-50/10" : ""
            } ${isTopRow ? "border-b border-ink-50/10" : ""} ${
              isOurs ? "bg-klein/[0.14]" : ""
            }`}
          >
            <div aria-hidden className={`absolute inset-0 opacity-[0.05] ${GRID}`} />

            <span className="relative font-mono text-[9px] uppercase tracking-[0.24em] text-ink-50/35">
              {panel.corner}
            </span>

            <div className="relative">
              <span
                className={`display block text-sm leading-tight md:text-base ${
                  isOurs ? "text-ink-50" : "text-ink-50/70"
                }`}
              >
                {panel.title}
              </span>
              {panel.note && (
                <span className="mt-1 block text-[11px] leading-snug text-ink-50/40">
                  {panel.note}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Pending({ label, text }: { label: string; text?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
      <div aria-hidden className={`absolute inset-0 opacity-[0.07] ${GRID}`} />
      <span className="relative font-mono text-[10px] uppercase tracking-[0.32em] text-ink-50/35">
        {label}
      </span>
      <span className="display relative max-w-sm text-lg leading-snug text-ink-50/45">
        {text ?? "Capture coming soon"}
      </span>
    </div>
  );
}
