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

  async rewrites() {
    const asrOrigin = externalProjectOrigin("ASR_DEMO_ORIGIN");
    const readingOrigin = externalProjectOrigin("READING_COLLECTION_ORIGIN");
    const routes = [];

    if (readingOrigin) {
      // The static project lives at its own root. Strip this site's public
      // prefix upstream so its existing same-directory links remain valid.
      routes.push(
        { source: "/reading-collection", destination: `${readingOrigin}/index.html` },
        { source: "/reading-collection/:path*", destination: `${readingOrigin}/:path*` }
      );
    } else if (process.env.VERCEL_ENV === "production") {
      throw new Error("READING_COLLECTION_ORIGIN must be a valid public HTTPS origin");
    }

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
