import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import PortalMount from "@/components/PortalMount";

// Fraunces is a variable font — omit `weight` to load the full wght range,
// which is required when declaring extra `axes` (opsz / SOFT).
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://joy-oyo.github.io"),
  title: {
    default: "Joy Chen — Portfolio",
    template: "%s · Joy Chen",
  },
  description:
    "Joy Chen — product, creative coding, and photography. A small interactive universe of work.",
  keywords: [
    "Joy Chen",
    "portfolio",
    "product design",
    "creative coding",
    "photography",
    "Next.js",
    "Three.js",
  ],
  authors: [{ name: "Joy Chen" }],
  creator: "Joy Chen",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    title: "Joy Chen — Portfolio",
    description:
      "Product · Creative Coding · Photography. An interactive portfolio by Joy Chen.",
    siteName: "Joy Chen",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joy Chen — Portfolio",
    description: "Product · Creative Coding · Photography.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="grain">
        <Nav />
        {children}
        <PortalMount />
      </body>
    </html>
  );
}
