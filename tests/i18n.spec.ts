import { describe, expect, it } from "vitest";

import {
  formatMessage,
  AKARI_MESSAGES,
  pluralCategory,
  resolveMessages,
  resolveMessagesLang,
  splitMessage,
} from "../docs/.vitepress/theme/i18n";
import type { AkariMessages } from "../docs/.vitepress/theme/types";

describe("built-in messages", () => {
  it("translates every string into every built-in language", () => {
    const keys = Object.keys(AKARI_MESSAGES.en!).sort();

    for (const [lang, messages] of Object.entries(AKARI_MESSAGES)) {
      expect(Object.keys(messages).sort(), lang).toEqual(keys);
      for (const value of Object.values(messages)) {
        expect(value.trim(), lang).not.toBe("");
      }
    }
  });

  it("keeps placeholders consistent across languages", () => {
    const placeholders = (text: string) =>
      (text.match(/\{\w+\}/g) ?? []).sort();

    for (const [key, english] of Object.entries(AKARI_MESSAGES.en!)) {
      const chinese = AKARI_MESSAGES.zh![key as keyof AkariMessages];
      expect(placeholders(chinese), key).toEqual(placeholders(english));
    }
  });
});

describe("resolveMessages", () => {
  it.each([
    ["zh-TW", "zh"],
    ["ZH", "zh"],
    ["en_GB", "en"],
    ["ja-JP", "ja"],
    ["ko-KR", "ko"],
    ["fr-CA", "fr"],
    ["ar-SA", "ar"],
    ["de", "en"],
    [undefined, "en"],
  ])("maps %s to the %s strings", (lang, expected) => {
    expect(resolveMessagesLang(lang)).toBe(expected);
  });

  it("applies string overrides, ignoring anything else", () => {
    expect(resolveMessages("zh-CN").nextPage).toBe("下一页");

    const messages = resolveMessages("en", {
      nextPage: "Onward",
      previousPage: 42 as never,
    });
    expect(messages.nextPage).toBe("Onward");
    expect(messages.previousPage).toBe("Previous");
    expect(AKARI_MESSAGES.en!.nextPage).toBe("Next");
  });
});

describe("placeholders", () => {
  it("fills named placeholders and leaves unknown ones as written", () => {
    expect(formatMessage("{count} results for {query}", {
      count: 3,
      query: "theme",
    })).toBe("3 results for theme");
    expect(formatMessage("Press {keys}", {})).toBe("Press {keys}");
  });

  it("splits a message around a placeholder", () => {
    expect(splitMessage("使用 {keys} 随时打开", "keys")).toEqual([
      "使用 ",
      " 随时打开",
    ]);
    expect(splitMessage("Open search", "keys")).toEqual(["Open search", ""]);
  });
});

describe("pluralCategory", () => {
  it("follows the language's plural rules, one/other for invalid tags", () => {
    expect(pluralCategory("en", 1)).toBe("one");
    expect(pluralCategory("en", 2)).toBe("other");
    expect(pluralCategory("zh-CN", 1)).toBe("other");
    expect(pluralCategory("not a tag!", 1)).toBe("one");
  });
});
