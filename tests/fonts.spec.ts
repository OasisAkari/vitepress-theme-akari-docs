import { describe, expect, it } from "vitest";

import {
  fontFamilyValue,
  fontHead,
  googleFontsStylesheet,
  resolveFonts,
} from "../docs/.vitepress/theme/fonts";

describe("resolveFonts", () => {
  it("defaults to Roboto and the Noto Sans of the language's script", () => {
    const zh = resolveFonts("zh-CN");
    expect(zh.stylesheet).toContain("family=Noto+Sans+SC:wght@100..900");
    expect(zh.stylesheet).toContain("family=Roboto:ital,wght@");
    expect(zh.family).toMatch(/^"Roboto", "Noto Sans SC", .*, sans-serif$/);

    const ja = resolveFonts("ja-JP");
    expect(ja.stylesheet).toContain("Noto+Sans+JP");
    expect(ja.stylesheet).not.toContain("Noto+Sans+SC");
    expect(ja.family).toContain('"Noto Sans JP"');

    // Languages without fonts of their own take the theme's.
    expect(resolveFonts("de-DE")).toEqual(zh);
  });

  it("loads nothing from Google Fonts with google: false", () => {
    const fonts = resolveFonts("ja", { google: false });
    expect(fonts.stylesheet).toBeUndefined();
    expect(fonts.family).toContain('"Noto Sans JP"');
  });

  it("takes the families and the stack the config gives", () => {
    const fonts = resolveFonts("ar", {
      google: ["Inter:wght@100..900", "IBM Plex Sans Arabic:wght@400;700"],
      family: ["Inter", "IBM Plex Sans Arabic", "sans-serif"],
    });
    expect(fonts).toEqual({
      stylesheet:
        "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=IBM+Plex+Sans+Arabic:wght@400;700&display=swap",
      family: '"Inter", "IBM Plex Sans Arabic", sans-serif',
    });
    expect(resolveFonts("ar", { google: true })).toEqual(resolveFonts("ar"));
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
    const local = fontHead({ family: "system-ui" });
    expect(local).toEqual([
      ["style", {}, ":root { --akari-font-family: system-ui; }"],
    ]);

    const remote = fontHead(resolveFonts("ko"));
    const href = resolveFonts("ko").stylesheet;
    expect(remote).toContainEqual(["link", { rel: "preload", as: "style", href }]);
    expect(remote).toContainEqual(["noscript", {}, `<link rel="stylesheet" href="${href}">`]);
    expect(remote.at(-1)?.[0]).toBe("style");
  });
});
