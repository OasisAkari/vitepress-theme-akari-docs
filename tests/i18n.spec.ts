import { describe, expect, it } from "vitest";

import {
  AKARI_LANGUAGES,
  akariLanguages,
  findLanguage,
  formatMessage,
  languageName,
  pluralCategory,
  resolveLanguage,
  resolveMessages,
  splitMessage,
} from "../docs/.vitepress/theme/i18n";
import type { AkariMessages } from "../docs/.vitepress/theme/types";

const english = AKARI_LANGUAGES.find((language) => language.code === "en")!;

describe("built-in languages", () => {
  it("translate every string", () => {
    const keys = Object.keys(english.messages).sort();

    for (const { code, messages } of AKARI_LANGUAGES) {
      expect(Object.keys(messages).sort(), code).toEqual(keys);
      for (const value of Object.values(messages)) {
        expect(value.trim(), code).not.toBe("");
      }
    }
  });

  it("keep the placeholders of the English strings", () => {
    const placeholders = (text: string) =>
      (text.match(/\{\w+\}/g) ?? []).sort();

    for (const { code, messages } of AKARI_LANGUAGES) {
      for (const [key, text] of Object.entries(english.messages)) {
        expect(placeholders(messages[key as keyof AkariMessages]), `${code} ${key}`)
          .toEqual(placeholders(text));
      }
    }
  });

  it("have one code each", () => {
    const codes = AKARI_LANGUAGES.map((language) => language.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("resolveLanguage", () => {
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
  ])("serves %s with the %s language", (lang, expected) => {
    expect(resolveLanguage(lang).code).toBe(expected);
  });

  it("brings the language's direction, fonts and Markdown strings", () => {
    const arabic = resolveLanguage("ar-SA");
    expect(arabic.dir).toBe("rtl");
    expect(arabic.fonts.family).toContain("Noto Sans Arabic");
    expect(arabic.markdown.codeCopyButton?.copiedText).toBe("تم النسخ");

    // English has no fonts of its own: it takes the theme's.
    const fallback = resolveLanguage("de");
    expect(fallback.dir).toBe("ltr");
    expect(fallback.fonts.family).toContain("Noto Sans SC");
  });

  it("takes a site's languages, and its changes to built-in ones", () => {
    const languages = [
      {
        code: "de",
        messages: { nextPage: "Weiter" },
        markdown: { container: { tipLabel: "Tipp" } },
      },
      {
        code: "zh",
        fonts: { google: [], family: ["LXGW WenKai", "serif"] },
        messages: { nextPage: "下一篇" },
      },
    ];
    const german = resolveLanguage("de-AT", languages);
    expect(german.code).toBe("de");
    expect(german.messages.nextPage).toBe("Weiter");
    // What a language leaves out is English.
    expect(german.messages.previousPage).toBe("Previous");

    const chinese = resolveLanguage("zh-CN", languages);
    expect(chinese.messages.nextPage).toBe("下一篇");
    expect(chinese.messages.previousPage).toBe("上一页");
    expect(chinese.fonts.family).toEqual(["LXGW WenKai", "serif"]);
    // Laid over the built-in one, its Markdown strings stay.
    expect(chinese.markdown.codeCopyButton?.tooltipText).toBe("复制代码");

    expect(akariLanguages(languages)).toHaveLength(AKARI_LANGUAGES.length + 1);
    expect(findLanguage("pt-BR", akariLanguages(languages))).toBeUndefined();
  });

  it("applies string overrides, ignoring anything else", () => {
    expect(resolveMessages("zh-CN").nextPage).toBe("下一页");

    const messages = resolveMessages("en", {
      nextPage: "Onward",
      previousPage: 42 as never,
    });
    expect(messages.nextPage).toBe("Onward");
    expect(messages.previousPage).toBe("Previous");
    expect(english.messages.nextPage).toBe("Next");
  });
});

describe("languageName", () => {
  it.each([
    ["ja-JP", "日本語"],
    ["fr-FR", "Français"],
    ["en-US", "English"],
    ["ar-SA", "العربية"],
    ["not a tag!", "not a tag!"],
  ])("names %s %s", (lang, name) => {
    expect(languageName(lang)).toBe(name);
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
