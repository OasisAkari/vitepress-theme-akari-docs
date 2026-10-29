import type { HeadConfig } from "vitepress";

import type {
  AkariFontsConfig,
  AkariLanguage,
  AkariLanguageFonts,
  ResolvedAkariFonts,
} from "./types";

const GOOGLE_FONTS = "https://fonts.googleapis.com/css2";

/** Roboto with variable weight, both styles, for the languages to share. */
export const ROBOTO = "Roboto:ital,wght@0,100..900;1,100..900";

/** The CSS custom property the text's `font-family` is read from. */
export const AKARI_FONT_FAMILY_PROPERTY = "--akari-font-family";

/**
 * The theme's fonts, for a language without fonts of its own: Roboto and
 * Noto Sans SC (思源黑体) from Google Fonts, both with variable weight,
 * then the system's fonts for Chinese.
 */
export const AKARI_DEFAULT_FONTS: AkariLanguageFonts = {
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
 * The rules giving text marked as another language (`lang="ja"`) the
 * fonts of that language, on pages in any other: a name in the language
 * menu, a quotation. Only the page's own language's fonts are loaded, so
 * these take what the device has.
 */
export function markedFontRules(languages: readonly AkariLanguage[]): string {
  return languages
    .flatMap((language) => {
      const code = language.code.trim().toLowerCase().replace(/_/g, "-");
      const family = fontFamilyValue(language.fonts?.family ?? []);
      if (!family || !/^[a-z0-9-]+$/.test(code)) return [];
      return `html:not(:lang(${code})) [lang|="${code}"] { font-family: ${family}; }`;
    })
    .join("\n");
}

/**
 * The fonts of a page: what its config sets, the rest from its language's
 * (`defaults`). `google: false` loads nothing from Google Fonts, `true` the
 * language's. `languages` are the site's, for text marked as another.
 */
export function resolveFonts(
  config: AkariFontsConfig | undefined = {},
  defaults: AkariLanguageFonts = AKARI_DEFAULT_FONTS,
  languages: readonly AkariLanguage[] = [],
): ResolvedAkariFonts {
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
    family: family || fontFamilyValue(AKARI_DEFAULT_FONTS.family),
    marked: markedFontRules(languages),
  };
}

/** The CSS of a page's fonts: its font family, and marked text's. */
function fontStyle(fonts: ResolvedAkariFonts): string {
  const root = `:root { ${AKARI_FONT_FAMILY_PROPERTY}: ${fonts.family}; }`;
  return fonts.marked ? `${root}\n${fonts.marked}` : root;
}

/**
 * Head tags for a language's fonts. They set the text's font family before
 * the first paint, and open the connections and fetch the stylesheet early
 * without making it render-blocking: a preload never blocks, and the theme
 * applies the stylesheet from script (`applyFonts`). Without scripts the
 * noscript copy applies it directly.
 */
export function fontHead(fonts: ResolvedAkariFonts): HeadConfig[] {
  const head: HeadConfig[] = [["style", {}, fontStyle(fonts)]];
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
 * Applies a page's fonts: its font family and marked text's, and its Google
 * Fonts stylesheet if it has one. A stylesheet inserted by script does not
 * block rendering, unlike one written in the page head; one already in the
 * page stays, for a later visit to its language.
 */
export function applyFonts(fonts: ResolvedAkariFonts): void {
  if (typeof document === "undefined") return;
  let style = document.getElementById("akari-fonts");
  if (!style) {
    style = document.createElement("style");
    style.id = "akari-fonts";
    document.head.append(style);
  }
  const css = fontStyle(fonts);
  if (style.textContent !== css) style.textContent = css;

  const href = fonts.stylesheet;
  if (!href) return;
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  if ([...links].some((link) => link.getAttribute("href") === href)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.append(link);
}
