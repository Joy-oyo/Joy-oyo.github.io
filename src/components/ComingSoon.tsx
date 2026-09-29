/** Dashed placeholder panel for sections that are paused behind a coming-soon flag. */
export default function ComingSoon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex min-h-[8rem] items-center rounded-[1.5rem] border border-dashed border-ink-50/10 px-6 md:min-h-[10rem] ${className}`}
    >
      <p className="flex items-center gap-3">
        <span aria-hidden className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-klein opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-klein shadow-[0_0_10px_rgba(0,47,167,0.9)]" />
        </span>
        <span className="display text-lg leading-none text-ink-50/55 md:text-xl">Coming soon</span>
      </p>
    </div>
  );
}
