import type { AkariColorScheme } from "./types";

export type AkariResolvedScheme = "light" | "dark";

/** Order the appearance button steps through. */
export const SCHEME_CYCLE: readonly AkariColorScheme[] = [
  "auto",
  "light",
  "dark",
  "time",
];

// Night is any hour before 07:00 or after 18:59 local time.
export const NIGHT_ENDS_AT = 7;
export const NIGHT_STARTS_AFTER = 18;

/** How often the time-of-day mode looks at the clock. */
export const SCHEME_CLOCK_INTERVAL = 60_000;

export function isNightHour(hour: number): boolean {
  return hour < NIGHT_ENDS_AT || hour > NIGHT_STARTS_AFTER;
}

/**
 * The system's preference, or null when the browser cannot tell (no media
 * query support, or neither `light` nor `dark` matches).
 */
export function systemScheme(
  matches: (query: string) => boolean,
): AkariResolvedScheme | null {
  if (matches("(prefers-color-scheme: dark)")) return "dark";
  if (matches("(prefers-color-scheme: light)")) return "light";
  return null;
}

/** Whether the mode needs the clock: time of day, or a system that cannot say. */
export function usesClock(
  mode: AkariColorScheme,
  system: AkariResolvedScheme | null,
): boolean {
  return mode === "time" || (mode === "auto" && system === null);
}

/** Light or dark for a mode. `auto` falls back to the time of day. */
export function resolveScheme(
  mode: AkariColorScheme,
  system: AkariResolvedScheme | null,
  hour: number,
): AkariResolvedScheme {
  if (mode === "light" || mode === "dark") return mode;
  if (mode === "auto" && system) return system;
  return isNightHour(hour) ? "dark" : "light";
}

export function nextScheme(mode: AkariColorScheme): AkariColorScheme {
  const index = SCHEME_CYCLE.indexOf(mode);
  return SCHEME_CYCLE[(index + 1) % SCHEME_CYCLE.length] ?? "auto";
}

/**
 * Runs in the page head before the first paint: reads the stored mode and
 * sets `html.dark` and the color scheme, so a dark page never flashes light.
 * It is serialized into an inline script, so it must not reference anything
 * outside itself; the theme applies the same rules once it runs.
 */
export function applySchemeBeforePaint(
  storageKey: string,
  fallback: string,
  nightEndsAt: number,
  nightStartsAfter: number,
): void {
  let mode = fallback;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (["light", "dark", "auto", "time"].includes(stored?.scheme)) {
      mode = stored.scheme;
    }
  } catch {
    // Storage unavailable or unreadable: keep the default.
  }

  const matches = (query: string): boolean => {
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  };
  const system = matches("(prefers-color-scheme: dark)")
    ? "dark"
    : matches("(prefers-color-scheme: light)")
      ? "light"
      : null;
  const hour = new Date().getHours();
  const dark =
    mode === "dark" ||
    (mode !== "light" &&
      (mode === "auto" && system
        ? system === "dark"
        : hour < nightEndsAt || hour > nightStartsAfter));

  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

/** Inline script source for the page head, see `applySchemeBeforePaint`. */
export function schemeScript(storageKey: string, fallback: AkariColorScheme): string {
  const args = [storageKey, fallback, NIGHT_ENDS_AT, NIGHT_STARTS_AFTER]
    .map((value) => JSON.stringify(value))
    .join(",");
  return `(${applySchemeBeforePaint.toString()})(${args})`;
}
