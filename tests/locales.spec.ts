import { describe, expect, it } from "vitest";

import {
  layerThemeConfig,
  localeHomePath,
  localeKeyForPath,
  localePages,
  resolveLocaleLink,
  translateLocalePath,
} from "../docs/.vitepress/theme/locales";

const KEYS = ["root", "en-US", "fr-FR"];

describe("layerThemeConfig", () => {
  it("merges objects and replaces arrays and scalars", () => {
    const root = {
      logo: "/logo.svg",
      akari: {
        appBar: { title: "文档", version: "v1" },
        sidebar: { items: [{ text: "开始" }], width: 320 },
      },
    };
    const en = {
      akari: {
        appBar: { title: "Docs" },
        sidebar: { items: [{ text: "Start" }, { text: "Guide" }] },
      },
    };

    expect(layerThemeConfig(en, root)).toEqual({
      logo: "/logo.svg",
      akari: {
        appBar: { title: "Docs", version: "v1" },
        sidebar: { items: [{ text: "Start" }, { text: "Guide" }], width: 320 },
      },
    });
  });

  it("keeps the lower layer where the upper one is missing", () => {
    const root = { akari: { toc: { maxDepth: 2 } } };

    expect(layerThemeConfig(undefined, root)).toBe(root);
    expect(layerThemeConfig({ akari: undefined }, root)).toEqual(root);
  });
});

describe("localeKeyForPath", () => {
  it.each([
    ["/guide/install", "/", "root"],
    ["/en-US", "/", "en-US"],
    ["/guide/install", "/", "en-US"],
    ["/en-USA/guide", "/", "root"],
    ["/fr-FR/index.html", "/", "fr-FR"],
    ["/docs/guide", "/docs/", "en-US"],
  ])("assigns %s (base %s) to %s", (path, base, expected) => {
    expect(localeKeyForPath(path, KEYS, base)).toBe(expected);
  });
});

describe("localeHomePath", () => {
  it("uses the locale's own link, or the root of its path space", () => {
    expect(localeHomePath("root", { label: "中文" })).toBe("/");
    expect(localeHomePath("en-US", { label: "English" })).toBe("/");
    expect(localeHomePath("fr-FR", { link: "/fr-FR/guide/" })).toBe(
      "/fr-FR/guide/",
    );
    expect(localeHomePath("ja", { link: "https://ja.example.com" })).toBe(
      "/ja/",
    );
  });
});

describe("translateLocalePath", () => {
  it.each([
    ["/guide/install", "root", "en-US", "/guide/install"],
    ["/guide/install", "en-US", "fr-FR", "/fr-FR/guide/install"],
    ["/", "root", "en-US", "/"],
    ["/", "en-US", "root", "/"],
  ])("moves %s from %s to %s", (path, from, to, expected) => {
    expect(translateLocalePath(path, from, to)).toBe(expected);
  });

  it("works below the site base", () => {
    expect(
      translateLocalePath("/docs/guide", "en-US", "root", "/docs/"),
    ).toBe("/guide");
  });
});

describe("resolveLocaleLink", () => {
  it("opens the same page when the target has it, else its home page", () => {
    const link = (path: string, pages: string[]) =>
      resolveLocaleLink({
        path,
        from: "root",
        to: "en-US",
        home: "/",
        pages,
      });
    const pages = ["/", "/guide/install"];

    expect(link("/guide/install", pages)).toBe("/guide/install");
    expect(link("/guide/advanced", pages)).toBe("/");
    expect(link("/", [])).toBe("/");
  });
});

describe("localePages", () => {
  it("lists the internal links of the locale's own sidebar", () => {
    const themeConfig = {
      akari: {
        sidebar: {
          items: [
            {
              text: "Start",
              items: [
                { text: "Overview", link: "/" },
                { text: "Install", link: "/guide/install" },
                { text: "GitHub", link: "https://github.com" },
              ],
            },
          ],
        },
      },
    };

    expect(localePages(themeConfig, "/")).toEqual([
      "/",
      "/guide/install",
    ]);
  });

  it("picks the multi-sidebar entry matching the path", () => {
    const themeConfig = {
      sidebar: {
        "/": [{ text: "Install", link: "/guide/install" }],
        "/": [{ text: "安装", link: "/guide/install" }],
      },
    };

    expect(localePages(themeConfig, "/guide/install")).toEqual([
      "/guide/install",
    ]);
    expect(localePages(themeConfig, "/guide/install")).toEqual([
      "/guide/install",
    ]);
  });

});
