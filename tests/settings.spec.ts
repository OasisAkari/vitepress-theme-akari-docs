import { describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS } from "../docs/.vitepress/theme/constants";
import {
  mergeSettings,
  normalizeSettings,
  parseStoredSettings,
  readStoredSettings,
  writeStoredSettings,
} from "../docs/.vitepress/theme/settings";
import type {
  AkariThemeSettings,
  StorageLike,
} from "../docs/.vitepress/theme/types";

const validSettings: AkariThemeSettings = {
  color: "#abcdef",
  variant: "vibrant",
  scheme: "dark",
  contrast: "high",
  motion: "standard",
  direction: "rtl",
  textSize: "24px",
};

const customDefaults: AkariThemeSettings = {
  color: "#101010",
  variant: "monochrome",
  scheme: "light",
  contrast: "medium",
  motion: "standard",
  direction: "rtl",
  textSize: "32px",
};

function memoryStorage(initial: Record<string, string> = {}): StorageLike {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, value),
  };
}

const blockedStorage: StorageLike = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};

describe("normalizeSettings", () => {
  it("keeps valid values, lowercases colors and drops unknown keys", () => {
    expect(
      normalizeSettings({ ...validSettings, color: "#ABCDEF", injected: "x" }),
    ).toStrictEqual(validSettings);
  });

  it("replaces each invalid value with its default", () => {
    const invalid = {
      color: "red",
      variant: "unknown",
      scheme: "sepia",
      contrast: "max",
      motion: "bouncy",
      direction: "up",
      textSize: "40px",
    };

    expect(normalizeSettings(invalid)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings(invalid, customDefaults)).toEqual(customDefaults);
    for (const input of [null, "settings", 42, []]) {
      expect(normalizeSettings(input)).toEqual(DEFAULT_SETTINGS);
    }
  });

  it.each([
    ["#000000", "#000000"],
    ["#abc", DEFAULT_SETTINGS.color],
    ["#1234567", DEFAULT_SETTINGS.color],
    ["#12345g", DEFAULT_SETTINGS.color],
    ["6750A4", DEFAULT_SETTINGS.color],
  ])("accepts only six-digit hex colors: %s → %s", (input, expected) => {
    expect(normalizeSettings({ color: input }).color).toBe(expected);
  });
});

describe("parseStoredSettings", () => {
  it("returns the defaults for anything that is not a stored object", () => {
    for (const raw of [null, "", "{not-json", "null", "[]", '"text"']) {
      expect(parseStoredSettings(raw)).toEqual(DEFAULT_SETTINGS);
    }
  });

  it("lays valid stored fields over the defaults, field by field", () => {
    const raw = JSON.stringify({
      scheme: "dark",
      variant: "bogus",
      color: "red",
    });

    expect(parseStoredSettings(raw)).toEqual({
      ...DEFAULT_SETTINGS,
      scheme: "dark",
    });
    expect(parseStoredSettings(raw, customDefaults)).toEqual({
      ...customDefaults,
      scheme: "dark",
    });
  });
});

describe("stored settings", () => {
  it("round-trips through a storage, one key per site", () => {
    const storage = memoryStorage();

    writeStoredSettings(storage, "a", validSettings);
    writeStoredSettings(storage, "b", customDefaults);

    expect(readStoredSettings(storage, "a")).toStrictEqual(validSettings);
    expect(readStoredSettings(storage, "b")).toStrictEqual(customDefaults);
  });

  it("falls back to the defaults when the storage cannot help", () => {
    expect(readStoredSettings(memoryStorage(), "missing")).toEqual(
      DEFAULT_SETTINGS,
    );
    expect(
      readStoredSettings(memoryStorage({ test: "{not-json" }), "test"),
    ).toEqual(DEFAULT_SETTINGS);
    expect(readStoredSettings(undefined, "test")).toEqual(DEFAULT_SETTINGS);
    expect(readStoredSettings(blockedStorage, "test", customDefaults)).toEqual(
      customDefaults,
    );
    expect(() =>
      writeStoredSettings(blockedStorage, "test", DEFAULT_SETTINGS),
    ).not.toThrow();
    expect(() =>
      writeStoredSettings(undefined, "test", DEFAULT_SETTINGS),
    ).not.toThrow();
  });
});

describe("mergeSettings", () => {
  it("applies valid overrides and keeps the base for invalid ones", () => {
    const base = { ...DEFAULT_SETTINGS, variant: "fidelity" as const };
    const merged = mergeSettings(base, {
      scheme: "dark",
      variant: "bogus",
      color: "red",
    } as unknown as Partial<AkariThemeSettings>);

    expect(merged).toEqual({
      ...base,
      color: "#6750a4",
      scheme: "dark",
    });
  });

  it("normalizes the base, with or without overrides", () => {
    const base = { ...DEFAULT_SETTINGS, color: "#ABCDEF" };

    expect(mergeSettings(base, {}).color).toBe("#abcdef");
    expect(mergeSettings(base, null)).toEqual(normalizeSettings(base));
    expect(mergeSettings(base)).toEqual(normalizeSettings(base));
  });
});
