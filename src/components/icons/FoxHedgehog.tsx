import type { SVGProps } from "react";

/**
 * FoxGlyph / HedgehogGlyph — the fox (many small things) and the hedgehog
 * (one big thing): the two halves of the "generalist / specialist" line.
 *
 * Both are flat silhouettes rather than line art: at the ~15px they sit
 * next to in body copy, strokes blur into noise while a filled outline
 * still reads. Both inherit `currentColor` from the text around them, so
 * they follow whatever polarity the page is in.
 */
export function FoxGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      {/* Tall ears, narrow tapering muzzle; eyes are punched holes
          (evenodd) so the silhouette works on any polarity. */}
      <path
        fillRule="evenodd"
        d="M12 22.5C8.8 20.6 5 16.2 4.6 9.6L5.4 1.6L9.9 8.1C10.5 7.8 11.2 7.6 12 7.6C12.8 7.6 13.5 7.8 14.1 8.1L18.6 1.6L19.4 9.6C19 16.2 15.2 20.6 12 22.5ZM9.4 13.1m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M14.6 13.1m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0"
      />
    </svg>
  );
}

export function HedgehogGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      {/* Spined back, pointed snout to the right; the eye is a punched
          hole (evenodd) so it stays a silhouette on any polarity. */}
      <path
        fillRule="evenodd"
        d="M23.6 15.4L21 13.2L21.6 10L19.4 11.2L19 7.4L16.6 9.6L15.4 5.8L13.2 8.8L11 5.4L9.4 8.8L6.8 6.6L6.2 10.4L3.8 9L4 15.6C4.4 17.2 6.4 18.3 9 18.7C13 19.3 17.6 18.7 20.6 17C22 16.2 23 15.8 23.6 15.4ZM20.2 14.4m-0.85 0a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0-1.7 0"
      />
      <path d="M8.4 18.9L7.9 21.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M15 19.4L15.5 21.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
