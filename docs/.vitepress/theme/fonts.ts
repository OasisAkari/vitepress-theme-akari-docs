import type { HeadConfig } from "vitepress";

import type { AkariFontsConfig, ResolvedAkariFonts } from "./types";

const GOOGLE_FONTS = "https://fonts.googleapis.com/css2";
const ROBOTO = "Roboto:ital,wght@0,100..900;1,100..900";

/** A language's default fonts: Google Fonts families and the font stack. */
export interface AkariFontDefaults {
  google: string[];
  family: string[];
}

/** The CSS custom property the text's `font-family` is read from. */
export const AKARI_FONT_FAMILY_PROPERTY = "--akari-font-family";

/**
 * The theme's fonts, for a language without fonts of its own: Roboto and
 * Noto Sans SC (思源黑体) from Google Fonts, both with variable weight,
 * then the system's fonts for Chinese.
 */
export const AKARI_DEFAULT_FONTS: Readonly<AkariFontDefaults> = {
  google: [ROBOTO, "Noto Sans SC:wght@100..900"],
  family: [
    "Roboto",
    "Noto Sans SC",
    "PingFang SC",
    "Microsoft YaHei",
    "system-ui",
    "sans-serif",
  ],
};

/**
 * The fonts of the languages that need their own, by primary language
 * subtag: Japanese kanji and kana, Korean hangul and Arabic script would
 * otherwise take Chinese or system shapes.
 */
export const AKARI_LANGUAGE_FONTS: Readonly<
  Record<string, Readonly<AkariFontDefaults>>
> = {
  ja: {
    google: [ROBOTO, "Noto Sans JP:wght@100..900"],
    family: [
      "Roboto",
      "Noto Sans JP",
      "Hiragino Sans",
      "Hiragino Kaku Gothic ProN",
      "Yu Gothic UI",
      "Yu Gothic",
      "Meiryo",
      "system-ui",
      "sans-serif",
    ],
  },
  ko: {
    google: [ROBOTO, "Noto Sans KR:wght@100..900"],
    family: [
      "Roboto",
      "Noto Sans KR",
      "Apple SD Gothic Neo",
      "Malgun Gothic",
      "system-ui",
      "sans-serif",
    ],
  },
  ar: {
    google: [ROBOTO, "Noto Sans Arabic:wght@100..900"],
    family: [
      "Roboto",
      "Noto Sans Arabic",
      "Geeza Pro",
      "Tahoma",
      "system-ui",
      "sans-serif",
    ],
  },
};

/** CSS keywords that name a kind of font rather than a family. */
const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "math",
  "emoji",
  "fangsong",
]);

/** A `font-family` value: family names quoted, generic keywords as they are. */
export function fontFamilyValue(families: readonly string[]): string {
  return families
    .map((family) => family.trim().replace(/^(["'])(.*)\1$/, "$2"))
    .filter(Boolean)
    .map((family) =>
      GENERIC_FAMILIES.has(family.toLowerCase())
        ? family.toLowerCase()
        : JSON.stringify(family),
    )
    .join(", ");
}

/**
 * The Google Fonts stylesheet of some families, each written as the css2
 * API's `family` value (`"Noto Sans JP:wght@100..900"`). `display=swap`
 * keeps text visible in a fallback font until they arrive.
 */
export function googleFontsStylesheet(
  families: readonly string[],
): string | undefined {
  const query = families
    .map((family) => family.trim())
    .filter(Boolean)
    .map(
      (family) =>
        `family=${encodeURI(family).replace(/%20/g, "+").replace(/[&#]/g, encodeURIComponent)}`,
    );
  return query.length
    ? `${GOOGLE_FONTS}?${query.join("&")}&display=swap`
    : undefined;
}

/**
 * The fonts of a language: what its config sets, the rest from the
 * language's defaults (AKARI_LANGUAGE_FONTS, else AKARI_DEFAULT_FONTS).
 * `google: false` loads nothing from Google Fonts, `true` the defaults.
 */
export function resolveFonts(
  lang: string | undefined,
  config: AkariFontsConfig = {},
): ResolvedAkariFonts {
  const primary = lang?.trim().toLowerCase().split(/[-_]/)[0] ?? "";
  const defaults = AKARI_LANGUAGE_FONTS[primary] ?? AKARI_DEFAULT_FONTS;
  const google = Array.isArray(config.google)
    ? config.google
    : config.google === false
      ? []
      : defaults.google;
  const family = fontFamilyValue(
    Array.isArray(config.family) ? config.family : defaults.family,
  );

  return {
    stylesheet: googleFontsStylesheet(google),
    family: family || fontFamilyValue(defaults.family),
  };
}

/**
 * Head tags for a language's fonts. They set the text's font family before
 * the first paint, and open the connections and fetch the stylesheet early
 * without making it render-blocking: a preload never blocks, and the theme
 * applies the stylesheet from script (`applyFonts`). Without scripts the
 * noscript copy applies it directly.
 */
export function fontHead(fonts: ResolvedAkariFonts): HeadConfig[] {
  const head: HeadConfig[] = [
    ["style", {}, `:root { ${AKARI_FONT_FAMILY_PROPERTY}: ${fonts.family}; }`],
  ];
  const href = fonts.stylesheet;
  if (!href) return head;

  return [
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    ["link", { rel: "preload", as: "style", href }],
    ["noscript", {}, `<link rel="stylesheet" href="${href}">`],
    ...head,
  ];
}

/**
 * Applies a language's fonts in the page: its font family, and its Google
 * Fonts stylesheet if it has one. A stylesheet inserted by script does not
 * block rendering, unlike one written in the page head; one already in the
 * page stays, for a later visit to its language.
 */
export function applyFonts(fonts: ResolvedAkariFonts): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty(AKARI_FONT_FAMILY_PROPERTY, fonts.family);

  const href = fonts.stylesheet;
  if (!href) return;
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  if ([...links].some((link) => link.getAttribute("href") === href)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.append(link);
}
