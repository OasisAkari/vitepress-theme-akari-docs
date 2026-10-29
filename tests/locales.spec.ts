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
    ["/en-US/guide/install", "/", "en-US"],
    ["/en-USA/guide", "/", "root"],
    ["/fr-FR/index.html", "/", "fr-FR"],
    ["/docs/en-US/guide", "/docs/", "en-US"],
  ])("assigns %s (base %s) to %s", (path, base, expected) => {
    expect(localeKeyForPath(path, KEYS, base)).toBe(expected);
  });
});

describe("localeHomePath", () => {
  it("uses the locale's own link, or the root of its path space", () => {
    expect(localeHomePath("root", { label: "中文" })).toBe("/");
    expect(localeHomePath("en-US", { label: "English" })).toBe("/en-US/");
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
    ["/guide/install", "root", "en-US", "/en-US/guide/install"],
    ["/en-US/guide/install", "en-US", "fr-FR", "/fr-FR/guide/install"],
    ["/", "root", "en-US", "/en-US/"],
    ["/en-US/", "en-US", "root", "/"],
  ])("moves %s from %s to %s", (path, from, to, expected) => {
    expect(translateLocalePath(path, from, to)).toBe(expected);
  });

  it("works below the site base", () => {
    expect(
      translateLocalePath("/docs/en-US/guide", "en-US", "root", "/docs/"),
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
        home: "/en-US/",
        pages,
      });
    const pages = ["/en-US/", "/en-US/guide/install"];

    expect(link("/guide/install", pages)).toBe("/en-US/guide/install");
    expect(link("/guide/advanced", pages)).toBe("/en-US/");
    expect(link("/", [])).toBe("/en-US/");
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
                { text: "Overview", link: "/en-US/" },
                { text: "Install", link: "/en-US/guide/install" },
                { text: "GitHub", link: "https://github.com" },
              ],
            },
          ],
        },
      },
    };

    expect(localePages(themeConfig, "/en-US/")).toEqual([
      "/en-US/",
      "/en-US/guide/install",
    ]);
  });

  it("picks the multi-sidebar entry matching the path", () => {
    const themeConfig = {
      sidebar: {
        "/en-US/": [{ text: "Install", link: "/en-US/guide/install" }],
        "/": [{ text: "安装", link: "/guide/install" }],
      },
    };

    expect(localePages(themeConfig, "/en-US/guide/install")).toEqual([
      "/en-US/guide/install",
    ]);
    expect(localePages(themeConfig, "/guide/install")).toEqual([
      "/guide/install",
    ]);
  });

});
