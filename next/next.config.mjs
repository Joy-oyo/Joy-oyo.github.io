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
};

export default nextConfig;
