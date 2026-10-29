import type { AkariSearchHandler } from "./types";

const backends = new Map<string, AkariSearchHandler>();

export function registerSearchBackend(
  id: string,
  handler: AkariSearchHandler,
): void {
  const normalized = id.trim();

  if (!normalized) {
    throw new Error("[vitepress-akari-theme-docs] search backend id cannot be empty.");
  }

  if (typeof handler !== "function") {
    throw new Error(
      `[vitepress-akari-theme-docs] search backend "${normalized}" must be a function.`,
    );
  }

  backends.set(normalized, handler);
}

export function getSearchBackend(
  id: string,
): AkariSearchHandler | undefined {
  return backends.get(id);
}
