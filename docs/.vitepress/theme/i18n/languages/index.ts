import type { AkariLanguage, AkariMessages } from "../../types";
import ar from "./ar";
import en from "./en";
import fr from "./fr";
import ja from "./ja";
import ko from "./ko";
import zh from "./zh";

/** A language that comes with the theme: every string translated. */
export type AkariBuiltInLanguage = AkariLanguage & { messages: AkariMessages };

/**
 * The theme's own languages. A site adds others, or changes these, with
 * `languages` in its config; a new built-in one is a file here, listed
 * below.
 */
export const AKARI_LANGUAGES: readonly AkariBuiltInLanguage[] = [
  en,
  zh,
  ja,
  ko,
  fr,
  ar,
];

export { en as AKARI_ENGLISH };
