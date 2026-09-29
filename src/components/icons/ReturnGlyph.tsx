import type { SVGProps } from "react";

/**
 * ReturnGlyph — a U-turn arrow (↩) drawn in the same idiom as FoxGlyph /
 * HedgehogGlyph: one flat, filled silhouette on a 24×24 grid, coloured by
 * `currentColor`, so it reads cleanly at small sizes on any surface.
 */
export function ReturnGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...props}>
      {/* Arrowhead pointing left, a shaft that bends right and back
          round, ending in a rounded tail. */}
      <path d="M9 7.4H14.5A6.4 6.4 0 0 1 14.5 20.2H7.6A1.6 1.6 0 0 1 7.6 17H14.5A3.2 3.2 0 0 0 14.5 10.6H9V14.6L2.2 9L9 3.4Z" />
    </svg>
  );
}
