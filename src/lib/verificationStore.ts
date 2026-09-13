// In-memory verification store.
//
// ⚠️ Vercel/serverless caveat: each API invocation may run in a different
// serverless function instance. This Map is per-instance memory, so a code
// stored by /api/send-verification is NOT guaranteed to be visible from
// /api/verify-code (cold starts, scale-out). It "usually works" for warm
// invocations but is not reliable.
//
// For production, swap for Vercel KV / Upstash Redis / a signed JWT.
type Entry = { code: string; timestamp: number; attempts: number };

declare global {
  // eslint-disable-next-line no-var
  var __verificationStore: Map<string, Entry> | undefined;
}

export const verificationStore: Map<string, Entry> =
  globalThis.__verificationStore ??
  (globalThis.__verificationStore = new Map<string, Entry>());
