import type { MarkdownLocaleOptions } from "vitepress";

import { AKARI_DEFAULT_FONTS } from "../fonts";
import type {
  AkariLanguage,
  AkariMessages,
  ResolvedAkariLanguage,
} from "../types";
import {
  AKARI_ENGLISH,
  AKARI_LANGUAGES,
  type AkariBuiltInLanguage,
} from "./languages";

export { AKARI_LANGUAGES, type AkariBuiltInLanguage };

/** The language whose strings fill every gap. */
export const DEFAULT_LANGUAGE = "en";

function normalizeTag(tag: string | undefined): string {
  return tag?.trim().toLowerCase().replace(/_/g, "-") ?? "";
}

/** Strings laid over a complete set; anything that is not a string is ignored. */
export function mergeMessages(
  base: AkariMessages,
  overrides: Partial<AkariMessages> | undefined = {},
): AkariMessages {
  const messages = { ...base };
  for (const key of Object.keys(messages) as Array<keyof AkariMessages>) {
    const value = overrides?.[key];
    if (typeof value === "string") messages[key] = value;
  }
  return messages;
}

/** Markdown strings laid over others, each group field by field. */
export function mergeMarkdown(
  base: MarkdownLocaleOptions | undefined,
  overrides: MarkdownLocaleOptions | undefined,
): MarkdownLocaleOptions {
  const merged: MarkdownLocaleOptions = { ...base, ...overrides };
  for (const key of ["codeCopyButton", "container"] as const) {
    if (base?.[key] || overrides?.[key]) {
      merged[key] = { ...base?.[key], ...overrides?.[key] };
    }
  }
  return merged;
}

/**
 * The languages a site knows: the built-in ones, with the site's own laid
 * over them by code. A language laid over another keeps the strings it
 * leaves out; its other fields replace the old ones.
 */
export function akariLanguages(
  own: readonly AkariLanguage[] | undefined = [],
): AkariLanguage[] {
  const byCode = new Map<string, AkariLanguage>(
    AKARI_LANGUAGES.map((language) => [normalizeTag(language.code), language]),
  );

  for (const language of Array.isArray(own) ? own : []) {
    const code = normalizeTag(language?.code);
    if (!code) continue;
    const base = byCode.get(code);
    byCode.set(
      code,
      base
        ? {
            ...base,
            ...language,
            messages: { ...base.messages, ...language.messages },
            markdown: mergeMarkdown(base.markdown, language.markdown),
          }
        : language,
    );
  }

  return [...byCode.values()];
}

/**
 * The language serving a BCP 47 tag: the one with the full tag (`pt-br`),
 * else the one with its primary subtag (`pt`).
 */
export function findLanguage(
  lang: string | undefined,
  languages: readonly AkariLanguage[] = AKARI_LANGUAGES,
): AkariLanguage | undefined {
  const tag = normalizeTag(lang);
  const withCode = (code: string) =>
    code ? languages.find((language) => normalizeTag(language.code) === code) : undefined;
  return withCode(tag) ?? withCode(tag.split("-")[0] ?? "");
}

/**
 * Everything the theme knows about a page's language, from the language
 * serving its tag: strings missing there are English, a language without
 * fonts of its own takes the theme's, and one without a direction is left
 * to right. A tag no language serves gets English.
 */
export function resolveLanguage(
  lang: string | undefined,
  own?: readonly AkariLanguage[],
): ResolvedAkariLanguage {
  const languages = akariLanguages(own);
  const english = mergeMessages(
    AKARI_ENGLISH.messages,
    findLanguage(DEFAULT_LANGUAGE, languages)?.messages,
  );
  const language =
    findLanguage(lang, languages) ?? findLanguage(DEFAULT_LANGUAGE, languages)!;

  return {
    code: language.code,
    dir: language.dir === "rtl" ? "rtl" : "ltr",
    fonts: language.fonts ?? AKARI_DEFAULT_FONTS,
    messages: mergeMessages(english, language.messages),
    markdown: language.markdown ?? {},
  };
}

/** A language's strings, with a site's overrides. */
export function resolveMessages(
  lang: string | undefined,
  overrides?: Partial<AkariMessages>,
  own?: readonly AkariLanguage[],
): AkariMessages {
  return mergeMessages(resolveLanguage(lang, own).messages, overrides);
}

/**
 * A language's name for itself, from its primary subtag ("日本語",
 * "Français"), for the language menu. The tag when it has none.
 */
export function languageName(lang: string): string {
  const primary = normalizeTag(lang).split("-")[0] ?? "";
  try {
    const name = new Intl.DisplayNames([lang], { type: "language" }).of(primary);
    if (name && name.toLowerCase() !== primary) {
      return name.charAt(0).toLocaleUpperCase(lang) + name.slice(1);
    }
  } catch {
    // Not a valid language tag.
  }
  return lang;
}

/** Fills `{name}` placeholders; unknown names are left as written. */
export function formatMessage(
  template: string,
  params: Readonly<Record<string, string | number>> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** CLDR plural category of `count`, e.g. to tell "1 result" from "2 results". */
export function pluralCategory(
  lang: string,
  count: number,
): Intl.LDMLPluralRule {
  try {
    return new Intl.PluralRules(lang).select(count);
  } catch {
    // Not a valid language tag.
    return count === 1 ? "one" : "other";
  }
}

/**
 * Splits a template around one placeholder, for markup that has to sit in
 * the middle of a translated sentence.
 */
export function splitMessage(
  template: string,
  name: string,
): [before: string, after: string] {
  const token = `{${name}}`;
  const index = template.indexOf(token);
  if (index < 0) return [template, ""];
  return [template.slice(0, index), template.slice(index + token.length)];
}
