import { describe, expect, it } from "vitest";

import {
  fontFamilyValue,
  fontHead,
  googleFontsStylesheet,
  markedFontRules,
  resolveFonts,
} from "../docs/.vitepress/theme/fonts";
import { AKARI_LANGUAGES, resolveLanguage } from "../docs/.vitepress/theme/i18n";

// A page's fonts as the theme works them out: its language's, then its config's.
const fontsOf = (lang: string, config?: Parameters<typeof resolveFonts>[0]) =>
  resolveFonts(config, resolveLanguage(lang).fonts);

describe("resolveFonts", () => {
  it("defaults to Roboto and the Noto Sans of the language's script", () => {
    const zh = fontsOf("zh-CN");
    expect(zh.stylesheet).toContain("family=Noto+Sans+SC:wght@100..900");
    expect(zh.stylesheet).toContain("family=Roboto:ital,wght@");
    expect(zh.family).toMatch(/^"Roboto", "Noto Sans SC", .*, sans-serif$/);

    const ja = fontsOf("ja-JP");
    expect(ja.stylesheet).toContain("Noto+Sans+JP");
    expect(ja.stylesheet).not.toContain("Noto+Sans+SC");
    expect(ja.family).toContain('"Noto Sans JP"');

    // Languages without fonts of their own take the theme's.
    expect(fontsOf("de-DE")).toEqual(zh);
  });

  it("loads nothing from Google Fonts with google: false", () => {
    const fonts = fontsOf("ja", { google: false });
    expect(fonts.stylesheet).toBeUndefined();
    expect(fonts.family).toContain('"Noto Sans JP"');
  });

  it("takes the families and the stack the config gives", () => {
    const fonts = fontsOf("ar", {
      google: ["Inter:wght@100..900", "IBM Plex Sans Arabic:wght@400;700"],
      family: ["Inter", "IBM Plex Sans Arabic", "sans-serif"],
    });
    expect(fonts).toEqual({
      stylesheet:
        "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=IBM+Plex+Sans+Arabic:wght@400;700&display=swap",
      family: '"Inter", "IBM Plex Sans Arabic", sans-serif',
      marked: "",
    });
    expect(fontsOf("ar", { google: true })).toEqual(fontsOf("ar"));
  });
});

describe("markedFontRules", () => {
  it("gives text marked as a language with fonts those fonts, on other pages", () => {
    const rules = markedFontRules(AKARI_LANGUAGES);
    expect(rules).toContain('html:not(:lang(ja)) [lang|="ja"] { font-family: "Roboto", "Noto Sans JP"');
    expect(rules).toContain('html:not(:lang(zh)) [lang|="zh"]');
    // English and French have no fonts of their own.
    expect(rules).not.toContain(":lang(en)");
    expect(markedFontRules([{ code: "x y", fonts: { google: [], family: ["A"] } }])).toBe("");
  });
});

describe("fontFamilyValue", () => {
  it("quotes family names and leaves generic families bare", () => {
    expect(fontFamilyValue(["Inter", "'Noto Sans'", " ", "System-UI"])).toBe(
      '"Inter", "Noto Sans", system-ui',
    );
  });
});

describe("googleFontsStylesheet", () => {
  it("has no stylesheet without families", () => {
    expect(googleFontsStylesheet([])).toBeUndefined();
  });
});

describe("fontHead", () => {
  it("sets the family, and preloads the stylesheet when there is one", () => {
    const local = fontHead({ family: "system-ui", marked: "" });
    expect(local).toEqual([
      ["style", {}, ":root { --akari-font-family: system-ui; }"],
    ]);

    const remote = fontHead(fontsOf("ko"));
    const href = fontsOf("ko").stylesheet;
    expect(remote).toContainEqual(["link", { rel: "preload", as: "style", href }]);
    expect(remote).toContainEqual(["noscript", {}, `<link rel="stylesheet" href="${href}">`]);
    expect(remote.at(-1)?.[0]).toBe("style");
  });
});
