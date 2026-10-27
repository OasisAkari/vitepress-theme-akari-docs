import type { M3eSearchHandler } from "./types";

const backends = new Map<string, M3eSearchHandler>();

export function registerSearchBackend(
  id: string,
  handler: M3eSearchHandler,
): void {
  const normalized = id.trim();

  if (!normalized) {
    throw new Error("[vitepress-theme-m3e] search backend id cannot be empty.");
  }

  if (typeof handler !== "function") {
    throw new Error(
      `[vitepress-theme-m3e] search backend "${normalized}" must be a function.`,
    );
  }

  backends.set(normalized, handler);
}

export function getSearchBackend(
  id: string,
): M3eSearchHandler | undefined {
  return backends.get(id);
}
