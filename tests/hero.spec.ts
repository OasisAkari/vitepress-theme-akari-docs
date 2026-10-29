import { describe, expect, it } from "vitest";

import {
  formatHeroDate,
  HERO_PATTERNS,
  heroImageHref,
  randomHeroPattern,
  resolveHero,
} from "../docs/.vitepress/theme/hero";

describe("resolveHero", () => {
  it("has no hero without a hero image", () => {
    expect(resolveHero({}, "en")).toBeNull();
    expect(resolveHero({ hero: { tagline: "No image" } }, "en")).toBeNull();
    expect(resolveHero({ hero: { image: "  " } }, "en")).toBeNull();
    expect(resolveHero({ hero: ["/a.png"] }, "en")).toBeNull();
  });

  it("accepts an image path on its own", () => {
    expect(resolveHero({ hero: "/hero/a.png" }, "en")).toEqual({
      src: "/hero/a.png",
      darkSrc: undefined,
      alt: "",
      date: undefined,
      tagline: undefined,
      background: undefined,
      fit: "cover",
      color: "auto",
      pattern: "auto",
    });
  });

  it("reads every field", () => {
    const hero = resolveHero(
      {
        hero: {
          image: "/hero/a.png",
          alt: "Devices",
          date: "2026-05-19",
          tagline: "Expressive and adaptive",
          background: "var(--md-sys-color-tertiary-container)",
          fit: "contain",
          pattern: "waves",
        },
      },
      "en-US",
    );

    expect(hero).toEqual({
      src: "/hero/a.png",
      darkSrc: undefined,
      alt: "Devices",
      date: { text: "May 19, 2026", datetime: "2026-05-19" },
      tagline: "Expressive and adaptive",
      background: "var(--md-sys-color-tertiary-container)",
      fit: "contain",
      color: "auto",
      pattern: "waves",
    });
  });

  it("reads a separate image for the dark scheme", () => {
    const image = (value: unknown) =>
      resolveHero({ hero: { image: value } }, "en");

    expect(
      image({ light: "/day.png", dark: "/night.png", alt: "Sky" }),
    ).toMatchObject({ src: "/day.png", darkSrc: "/night.png", alt: "Sky" });
    // A lone dark image serves both schemes.
    expect(image({ dark: "/night.png" })).toMatchObject({
      src: "/night.png",
      darkSrc: undefined,
    });
  });

  it("falls back for missing or unknown options", () => {
    const hero = (options: Record<string, unknown>, page = {}) =>
      resolveHero({ hero: { image: "/a.png", ...options }, ...page }, "en");

    expect(hero({ pattern: "none" })?.pattern).toBe("none");
    expect(hero({ pattern: "sparkles" })?.pattern).toBe("auto");
    expect(hero({ color: "#3A7D44" })?.color).toBe("#3a7d44");
    expect(hero({ color: false })?.color).toBe(false);
    expect(hero({ color: "teal" })?.color).toBe("auto");
    expect(hero({ fit: "fill" })?.fit).toBe("cover");
    expect(
      hero({ image: { src: "/a.png", alt: "Inner" }, alt: "Outer" })?.alt,
    ).toBe("Inner");
    expect(hero({}, { description: "From the page" })?.tagline).toBe(
      "From the page",
    );
  });
});

describe("formatHeroDate", () => {
  it("formats calendar dates for the page language", () => {
    expect(formatHeroDate("2026-05-19", "zh-CN")).toEqual({
      text: "2026年5月19日",
      datetime: "2026-05-19",
    });
    expect(formatHeroDate("2026-05-19", "en-US")?.text).toBe("May 19, 2026");
  });

  it("keeps the day of a frontmatter date in every time zone", () => {
    // VitePress hands YAML dates over as midnight UTC timestamps.
    expect(formatHeroDate("2026-05-19T00:00:00.000Z", "en-US")).toEqual({
      text: "May 19, 2026",
      datetime: "2026-05-19",
    });
    expect(
      formatHeroDate(new Date(Date.UTC(2026, 0, 1)), "en-US")?.text,
    ).toBe("January 1, 2026");
  });

  it("shows other text as written, and nothing for a missing date", () => {
    expect(formatHeroDate("Spring 2026", "en")).toEqual({
      text: "Spring 2026",
    });
    expect(formatHeroDate("2026-99-99", "en")).toEqual({ text: "2026-99-99" });
    expect(formatHeroDate(undefined, "en")).toBeUndefined();
    expect(formatHeroDate("", "en")).toBeUndefined();
    expect(formatHeroDate(new Date(Number.NaN), "en")).toBeUndefined();
  });
});

describe("heroImageHref", () => {
  const withBase = (path: string) => `/docs${path}`;

  it("puts site paths under the base and leaves URLs alone", () => {
    expect(heroImageHref("/hero/a.png", withBase)).toBe("/docs/hero/a.png");
    expect(heroImageHref("https://cdn.example.com/a.png", withBase)).toBe(
      "https://cdn.example.com/a.png",
    );
    expect(heroImageHref("data:image/png;base64,AA", withBase)).toBe(
      "data:image/png;base64,AA",
    );
  });
});

describe("randomHeroPattern", () => {
  it("spreads the whole range over the patterns", () => {
    expect(randomHeroPattern(() => 0)).toBe(HERO_PATTERNS[0]);
    expect(randomHeroPattern(() => 0.999999)).toBe(HERO_PATTERNS.at(-1));
    // Math.random never returns 1, but a stand-in might.
    expect(randomHeroPattern(() => 1)).toBe(HERO_PATTERNS.at(-1));
    const seen = new Set(
      HERO_PATTERNS.map((_, i) =>
        randomHeroPattern(() => (i + 0.5) / HERO_PATTERNS.length),
      ),
    );
    expect(seen.size).toBe(HERO_PATTERNS.length);
  });
});
