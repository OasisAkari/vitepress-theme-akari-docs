import { isExternalLink } from "./sidebar";
import type { AkariHeroFit, AkariHeroPattern } from "./types";

export interface ResolvedHero {
  /** Image URL as written; the component applies the site base. */
  src: string;
  /** Image for the dark scheme, when the page has one. */
  darkSrc?: string;
  alt: string;
  /** `datetime` is set when the date could be read as one. */
  date?: { text: string; datetime?: string };
  tagline?: string;
  /** CSS color behind the image. */
  background?: string;
  fit: AkariHeroFit;
  /**
   * Theme seed while the page is shown: sampled from the image (`auto`), a
   * fixed `#rrggbb`, or `false` to keep the reader's color.
   */
  color: "auto" | false | string;
  /**
   * The title card's pattern: one named in the frontmatter, or `auto`
   * for one picked at random each time the page loads.
   */
  pattern: AkariHeroPattern | "auto";
}

/** The patterns a page picks from when its frontmatter names none. */
export const HERO_PATTERNS = [
  "dots",
  "grid",
  "plus",
  "diagonal",
  "waves",
] as const satisfies readonly AkariHeroPattern[];

/** One of the patterns, at random. */
export function randomHeroPattern(random = Math.random): AkariHeroPattern {
  const index = Math.floor(random() * HERO_PATTERNS.length);
  return HERO_PATTERNS[Math.min(index, HERO_PATTERNS.length - 1)]!;
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * The date shown above the title. Dates (`2026-10-28`, which VitePress hands
 * over as an ISO timestamp, or a Date) are written out for the page's
 * language; any other text is shown as written.
 */
export function formatHeroDate(
  value: unknown,
  lang: string,
): ResolvedHero["date"] {
  let date: Date | undefined;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    date = new Date(value);
  } else {
    const written = text(value);
    return written ? { text: written } : undefined;
  }

  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? { text: value.trim() } : undefined;
  }

  // Frontmatter dates are calendar days at midnight UTC; formatting them in
  // UTC keeps the day from shifting with the reader's time zone.
  const datetime = date.toISOString().slice(0, 10);
  try {
    return {
      text: new Intl.DateTimeFormat(lang, {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(date),
      datetime,
    };
  } catch {
    // Not a valid language tag.
    return { text: datetime, datetime };
  }
}

/**
 * Reads a page's `hero` frontmatter: either an image path, or an object with
 * `image` (a path, `{ src, alt }`, or `{ light, dark, alt }` for a separate
 * dark-scheme image), `alt`, `date`, `tagline`, `background`, `fit`,
 * `color` and `pattern`. A hero needs an image; without one the page has
 * none. The tagline defaults to the page's frontmatter description; the
 * pattern, unless named, is `auto`.
 */
export function resolveHero(
  frontmatter: Record<string, unknown>,
  lang: string,
): ResolvedHero | null {
  const raw = frontmatter.hero;
  const config = typeof raw === "string" ? { image: raw } : raw;
  if (!isRecord(config)) return null;

  const image = config.image;
  const darkSrc = isRecord(image) ? text(image.dark) : undefined;
  const src =
    (isRecord(image) ? (text(image.src) ?? text(image.light)) : text(image)) ??
    darkSrc;
  if (!src) return null;

  const color = config.color;
  const pattern = config.pattern;

  return {
    src,
    darkSrc: darkSrc && darkSrc !== src ? darkSrc : undefined,
    alt: (isRecord(image) ? text(image.alt) : undefined) ?? text(config.alt) ?? "",
    date: formatHeroDate(config.date, lang),
    tagline: text(config.tagline) ?? text(frontmatter.description),
    background: text(config.background),
    fit: config.fit === "contain" ? "contain" : "cover",
    color:
      color === false
        ? false
        : typeof color === "string" && HEX_COLOR.test(color.trim())
          ? color.trim().toLowerCase()
          : "auto",
    pattern:
      pattern === "none" ||
      HERO_PATTERNS.includes(pattern as (typeof HERO_PATTERNS)[number])
        ? (pattern as AkariHeroPattern)
        : "auto",
  };
}

/** The hero image's address for an `<img>`, under the site base. */
export function heroImageHref(
  src: string,
  withBase: (path: string) => string,
): string {
  return isExternalLink(src) ? src : withBase(src);
}
