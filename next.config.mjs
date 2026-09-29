/**
 * Validate deploy-time origins used by external rewrites. Values come only from
 * project environment variables, never request input. Production accepts a
 * plain HTTPS hostname; local development additionally accepts loopback HTTP.
 */
function externalProjectOrigin(name) {
  const raw = process.env[name]?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const isLoopback = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const hasUnexpectedParts =
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash;
    const isIpLiteral = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(url.hostname) || url.hostname.includes(":");
    const isPrivateHostname = url.hostname.endsWith(".local") || url.hostname === "0.0.0.0";
    const localHttp = process.env.VERCEL_ENV !== "production" && url.protocol === "http:" && isLoopback;

    if (hasUnexpectedParts || isPrivateHostname || (isIpLiteral && !isLoopback)) return null;
    if (url.protocol !== "https:" && !localHttp) return null;

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

  // Reading moved into the home page's secret bookshelf. The guides it opens
  // are served by this app (src/app/reading-collection/[file]); the old
  // page and collection index send visitors home.
  async redirects() {
    return [
      { source: "/reading", destination: "/", permanent: false },
      { source: "/reading-collection", destination: "/", permanent: false },
      { source: "/reading-collection/index.html", destination: "/", permanent: false },
    ];
  },

  async rewrites() {
    const asrOrigin = externalProjectOrigin("ASR_DEMO_ORIGIN");
    const routes = [];

    if (asrOrigin) {
      // The ASR demo sets the same basePath, so preserve its prefix upstream.
      // Its own responses remain responsible for COOP/COEP.
      routes.push(
        { source: "/asrtranscriber", destination: `${asrOrigin}/asrtranscriber` },
        { source: "/asrtranscriber/:path*", destination: `${asrOrigin}/asrtranscriber/:path*` }
      );
    }

    return routes;
  },
};

export default nextConfig;
