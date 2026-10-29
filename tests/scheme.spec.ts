import { afterEach, describe, expect, it, vi } from "vitest";

import {
  applySchemeBeforePaint,
  isNightHour,
  nextScheme,
  resolveScheme,
  schemeScript,
  systemScheme,
  usesClock,
} from "../docs/.vitepress/theme/scheme";

describe("isNightHour", () => {
  it("treats hours before 07:00 and after 18:59 as night", () => {
    expect([0, 6, 19, 23].every(isNightHour)).toBe(true);
    expect([7, 12, 18].some(isNightHour)).toBe(false);
  });
});

describe("systemScheme", () => {
  it("reads the preference, or nothing when neither query matches", () => {
    expect(systemScheme((q) => q.includes("dark"))).toBe("dark");
    expect(systemScheme((q) => q.includes("light"))).toBe("light");
    expect(systemScheme(() => false)).toBeNull();
  });
});

describe("resolveScheme", () => {
  it("keeps fixed modes and follows the system in auto mode", () => {
    expect(resolveScheme("light", "dark", 23)).toBe("light");
    expect(resolveScheme("dark", "light", 12)).toBe("dark");
    expect(resolveScheme("auto", "dark", 12)).toBe("dark");
    expect(resolveScheme("auto", "light", 23)).toBe("light");
  });

  it("goes by the hour in time mode, or when the system cannot say", () => {
    expect(resolveScheme("auto", null, 23)).toBe("dark");
    expect(resolveScheme("auto", null, 12)).toBe("light");
    expect(resolveScheme("time", "light", 6)).toBe("dark");
    expect(resolveScheme("time", "dark", 7)).toBe("light");
    expect(resolveScheme("time", "dark", 18)).toBe("light");
    expect(resolveScheme("time", "light", 19)).toBe("dark");
  });
});

describe("usesClock", () => {
  it("only needs the clock for time mode or an undecided system", () => {
    expect(usesClock("time", "light")).toBe(true);
    expect(usesClock("auto", null)).toBe(true);
    expect(usesClock("auto", "dark")).toBe(false);
    expect(usesClock("light", null)).toBe(false);
  });
});

describe("nextScheme", () => {
  it("steps through system, light, dark and time of day", () => {
    expect(nextScheme("auto")).toBe("light");
    expect(nextScheme("light")).toBe("dark");
    expect(nextScheme("dark")).toBe("time");
    expect(nextScheme("time")).toBe("auto");
  });
});

describe("applySchemeBeforePaint", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  function run(options: {
    stored?: string | null;
    prefers?: "dark" | "light" | null;
    hour?: number;
    fallback?: string;
  }) {
    const classes = new Set<string>();
    const root = {
      classList: {
        toggle: (name: string, on: boolean) =>
          on ? classes.add(name) : classes.delete(name),
      },
      style: { colorScheme: "" },
    };
    vi.stubGlobal("document", { documentElement: root });
    vi.stubGlobal("localStorage", {
      getItem: () => options.stored ?? null,
    });
    vi.stubGlobal("window", {
      matchMedia: (query: string) => ({
        matches: !!options.prefers && query.includes(options.prefers),
      }),
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 28, options.hour ?? 12));

    applySchemeBeforePaint("key", options.fallback ?? "auto", 7, 18);
    return { dark: classes.has("dark"), colorScheme: root.style.colorScheme };
  }

  it("applies the stored mode", () => {
    expect(run({ stored: '{"scheme":"dark"}', prefers: "light" })).toEqual({
      dark: true,
      colorScheme: "dark",
    });
    expect(run({ stored: '{"scheme":"light"}', prefers: "dark" }).dark).toBe(
      false,
    );
  });

  it("follows the system, then the clock, when nothing is stored", () => {
    expect(run({ prefers: "dark", hour: 12 }).dark).toBe(true);
    expect(run({ prefers: null, hour: 22 }).dark).toBe(true);
    expect(run({ prefers: null, hour: 10 }).dark).toBe(false);
  });

  it("uses the clock in time mode and ignores unreadable storage", () => {
    expect(run({ stored: '{"scheme":"time"}', prefers: "light", hour: 5 }).dark)
      .toBe(true);
    expect(run({ stored: "not json", prefers: "dark" }).dark).toBe(true);
    expect(run({ stored: '{"scheme":"sepia"}', fallback: "light" }).dark).toBe(
      false,
    );
  });
});

describe("schemeScript", () => {
  it("serializes a self-contained call", () => {
    const script = schemeScript("akari-docs-settings", "auto");

    expect(script).toMatch(/^\(function applySchemeBeforePaint\(/);
    expect(script).toContain('("akari-docs-settings","auto",7,18)');
    expect(() => new Function(script)).not.toThrow();
  });
});
