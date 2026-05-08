// In-memory verification store.
// For production, swap for Redis / database.
type Entry = { code: string; timestamp: number; attempts: number };

declare global {
  // eslint-disable-next-line no-var
  var __verificationStore: Map<string, Entry> | undefined;
}

export const verificationStore: Map<string, Entry> =
  globalThis.__verificationStore ??
  (globalThis.__verificationStore = new Map<string, Entry>());
