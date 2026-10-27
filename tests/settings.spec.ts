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
  M3eThemeSettings,
  StorageLike,
} from "../docs/.vitepress/theme/types";

const validSettings: M3eThemeSettings = {
  color: "#abcdef",
  variant: "vibrant",
  scheme: "dark",
  contrast: "high",
  motion: "standard",
  direction: "rtl",
  textSize: "24px",
};

const customDefaults: M3eThemeSettings = {
  color: "#101010",
  variant: "monochrome",
  scheme: "light",
  contrast: "medium",
  motion: "standard",
  direction: "rtl",
  textSize: "32px",
};

interface MemoryStorage extends StorageLike {
  readonly store: Map<string, string>;
}

function createMemoryStorage(
  initial: Record<string, string> = {},
): MemoryStorage {
  const store = new Map<string, string>(Object.entries(initial));

  return {
    store,
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
}

describe("normalizeSettings", () => {
  it("fills every invalid field with its default", () => {
    const result = normalizeSettings({
      color: "red",
      variant: "unknown",
      scheme: "sepia",
      contrast: "max",
      motion: "bouncy",
      direction: "up",
      textSize: "40px",
    });

    expect(result).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps valid values and lowercases hex colors", () => {
    const result = normalizeSettings({
      color: "#ABCDEF",
      variant: "vibrant",
      scheme: "dark",
      contrast: "high",
      motion: "standard",
      direction: "rtl",
      textSize: "24px",
    });

    expect(result).toStrictEqual(validSettings);
  });

  it.each([null, undefined, "settings", 42, true, []])(
    "returns defaults for non-object input %j",
    (input) => {
      expect(normalizeSettings(input)).toEqual(DEFAULT_SETTINGS);
    },
  );

  const colorCases: Array<[string, string]> = [
    ["#ABCDEF", "#abcdef"],
    ["#abcdef", "#abcdef"],
    ["#000000", "#000000"],
    ["#abc", DEFAULT_SETTINGS.color],
    ["#12345", DEFAULT_SETTINGS.color],
    ["#1234567", DEFAULT_SETTINGS.color],
    ["#11223344", DEFAULT_SETTINGS.color],
    ["#12345g", DEFAULT_SETTINGS.color],
    ["6750A4", DEFAULT_SETTINGS.color],
  ];

  it.each(colorCases)("normalizes color %s to %s", (input, expected) => {
    expect(normalizeSettings({ color: input }).color).toBe(expected);
  });

  it("uses the provided defaults for invalid values", () => {
    const result = normalizeSettings(
      { color: "not-a-color", scheme: "sepia", variant: "bogus" },
      customDefaults,
    );

    expect(result).toEqual(customDefaults);
  });

  it("drops unknown keys from the result", () => {
    const result = normalizeSettings({ ...validSettings, injected: "nope" });

    expect(Object.keys(result).sort()).toEqual([
      "color",
      "contrast",
      "direction",
      "motion",
      "scheme",
      "textSize",
      "variant",
    ]);
  });

  it("does not mutate its input", () => {
    const input = { color: "#ABCDEF", scheme: "dark" };

    normalizeSettings(input);

    expect(input).toEqual({ color: "#ABCDEF", scheme: "dark" });
  });
});

describe("parseStoredSettings", () => {
  it("returns defaults for null", () => {
    expect(parseStoredSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it("returns defaults for an empty string", () => {
    expect(parseStoredSettings("")).toEqual(DEFAULT_SETTINGS);
  });

  it("returns defaults for corrupt JSON", () => {
    expect(parseStoredSettings("{not-json")).toEqual(DEFAULT_SETTINGS);
  });

  it("merges a partial stored payload with defaults", () => {
    const parsed = parseStoredSettings(
      JSON.stringify({ scheme: "dark", textSize: "24px" }),
    );

    expect(parsed).toEqual({
      ...DEFAULT_SETTINGS,
      scheme: "dark",
      textSize: "24px",
    });
  });

  it("falls back field by field for invalid stored values", () => {
    const parsed = parseStoredSettings(
      JSON.stringify({ color: "red", variant: "bogus", scheme: "dark" }),
    );

    expect(parsed).toEqual({
      ...DEFAULT_SETTINGS,
      scheme: "dark",
    });
  });

  it.each(["null", "[]", "42", '"text"'])(
    "returns defaults for non-object JSON %s",
    (raw) => {
      expect(parseStoredSettings(raw)).toEqual(DEFAULT_SETTINGS);
    },
  );

  it("merges stored values onto custom defaults", () => {
    const parsed = parseStoredSettings(
      JSON.stringify({ scheme: "dark" }),
      customDefaults,
    );

    expect(parsed).toEqual({ ...customDefaults, scheme: "dark" });
  });

  it("returns an independent copy of the defaults", () => {
    const originalColor = DEFAULT_SETTINGS.color;
    const parsed = parseStoredSettings(null);

    expect(parsed).not.toBe(DEFAULT_SETTINGS);

    parsed.color = "#000000";

    expect(DEFAULT_SETTINGS.color).toBe(originalColor);
  });
});

describe("storage helpers", () => {
  it("round-trips normalized settings through a StorageLike", () => {
    const storage = createMemoryStorage();

    writeStoredSettings(storage, "test", validSettings);

    expect(readStoredSettings(storage, "test")).toStrictEqual(validSettings);
    expect(storage.store.size).toBe(1);
    expect(JSON.parse(storage.store.get("test") ?? "")).toEqual(validSettings);
  });

  it("round-trips the default settings unchanged", () => {
    const storage = createMemoryStorage();

    writeStoredSettings(storage, "test", DEFAULT_SETTINGS);

    expect(readStoredSettings(storage, "test")).toStrictEqual(DEFAULT_SETTINGS);
  });

  it("keeps keys isolated", () => {
    const storage = createMemoryStorage();

    writeStoredSettings(storage, "a", validSettings);
    writeStoredSettings(storage, "b", customDefaults);

    expect(readStoredSettings(storage, "a")).toStrictEqual(validSettings);
    expect(readStoredSettings(storage, "b")).toStrictEqual(customDefaults);
  });

  it("returns defaults when the key is missing", () => {
    const storage = createMemoryStorage();

    expect(readStoredSettings(storage, "missing")).toEqual(DEFAULT_SETTINGS);
  });

  it("returns defaults when the stored value is corrupt", () => {
    const storage = createMemoryStorage({ test: "{not-json" });

    expect(readStoredSettings(storage, "test")).toEqual(DEFAULT_SETTINGS);
  });

  it("tolerates an undefined storage", () => {
    expect(readStoredSettings(undefined, "test")).toEqual(DEFAULT_SETTINGS);
    expect(() =>
      writeStoredSettings(undefined, "test", DEFAULT_SETTINGS),
    ).not.toThrow();
  });

  it("falls back when storage throws", () => {
    const storage: StorageLike = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };

    expect(readStoredSettings(storage, "test")).toEqual(DEFAULT_SETTINGS);
    expect(() =>
      writeStoredSettings(storage, "test", DEFAULT_SETTINGS),
    ).not.toThrow();
  });

  it("uses custom defaults when storage throws", () => {
    const storage: StorageLike = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };

    expect(readStoredSettings(storage, "test", customDefaults)).toEqual(
      customDefaults,
    );
  });
});

describe("mergeSettings", () => {
  it("applies partial overrides without touching other fields", () => {
    const merged = mergeSettings(DEFAULT_SETTINGS, { scheme: "dark" });

    expect(merged.scheme).toBe("dark");
    expect(merged.variant).toBe(DEFAULT_SETTINGS.variant);
    expect(merged.direction).toBe(DEFAULT_SETTINGS.direction);
  });

  it("ignores invalid overrides and keeps the base value", () => {
    const merged = mergeSettings(DEFAULT_SETTINGS, {
      scheme: "sepia",
    } as unknown as Partial<M3eThemeSettings>);

    expect(merged.scheme).toBe(DEFAULT_SETTINGS.scheme);
  });

  it("falls back to the normalized base color for an invalid color override", () => {
    const merged = mergeSettings(DEFAULT_SETTINGS, {
      color: "red",
    } as unknown as Partial<M3eThemeSettings>);

    expect(merged.color).toBe("#6750a4");
  });

  it("falls back to a custom base for invalid overrides", () => {
    const base: M3eThemeSettings = {
      ...DEFAULT_SETTINGS,
      variant: "fidelity",
    };

    const merged = mergeSettings(base, {
      variant: "bogus",
    } as unknown as Partial<M3eThemeSettings>);

    expect(merged.variant).toBe("fidelity");
  });

  it("treats null and undefined overrides as empty", () => {
    const baseline = normalizeSettings(DEFAULT_SETTINGS);

    expect(mergeSettings(DEFAULT_SETTINGS, null)).toEqual(baseline);
    expect(mergeSettings(DEFAULT_SETTINGS)).toEqual(baseline);
  });

  it("does not mutate the base and returns a new object", () => {
    const base: M3eThemeSettings = { ...DEFAULT_SETTINGS };
    const snapshot = { ...base };

    const merged = mergeSettings(base, { direction: "rtl" });

    expect(merged.direction).toBe("rtl");
    expect(merged).not.toBe(base);
    expect(base).toEqual(snapshot);
  });

  it("normalizes the base before merging", () => {
    const base: M3eThemeSettings = { ...DEFAULT_SETTINGS, color: "#ABCDEF" };

    expect(mergeSettings(base, {}).color).toBe("#abcdef");
  });
});
