"use client";

import dynamic from "next/dynamic";

// R3F needs the browser; defer to client-only.
const Portal = dynamic(() => import("./Portal"), { ssr: false });

export default function PortalMount() {
  return <Portal />;
}
