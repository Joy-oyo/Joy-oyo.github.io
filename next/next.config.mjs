/**
 * The ASR demo is a separate repo and a separate Vercel project, stitched in at
 * `/asrtranscriber` as a Next.js multi-zone. Set ASR_DEMO_ORIGIN to that
 * project's origin (e.g. https://asr-transcriber.vercel.app).
 *
 * Deploy-time configuration only — never a request value — so there is no path
 * here for a visitor to steer the proxy. Anything that is not a plain https
 * origin is ignored, and the route simply 404s instead of proxying somewhere
 * unintended.
 */
function asrDemoOrigin() {
  const raw = process.env.ASR_DEMO_ORIGIN?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const isLoopback = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    // https everywhere, except a loopback address so the zone can be exercised
    // against a local dev server.
    if (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopback)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Defaults to `.next` so deploys are unchanged. Verification builds set
  // NEXT_DIST_DIR to write elsewhere — running `next build` into `.next` while
  // `next dev` is live replaces the dev chunks and 404s every asset.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "chenj219.wixsite.com" },
    ],
  },
  transpilePackages: ["three"],

  async rewrites() {
    const origin = asrDemoOrigin();
    if (!origin) return [];

    // The demo sets the same basePath, so the prefix is preserved upstream —
    // its asset URLs then resolve through this proxy rather than at the root.
    // COOP/COEP come from the demo's own responses; they are deliberately not
    // re-added here, because a folded duplicate would invalidate the header and
    // silently drop cross-origin isolation.
    return [
      { source: "/asrtranscriber", destination: `${origin}/asrtranscriber` },
      { source: "/asrtranscriber/:path*", destination: `${origin}/asrtranscriber/:path*` },
    ];
  },
};

export default nextConfig;
