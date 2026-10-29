import MiniSearch, { type Options, type SearchOptions } from "minisearch";

import type { AkariSearchResult } from "../types";

const EXCERPT_LENGTH = 160;

/** What VitePress' local search index holds for each section of a page. */
export interface LocalSearchDocument {
  /** The page's path, with the section's anchor. */
  id: string;
  /** The section's heading; the page's title for its first section. */
  title: string;
  /** The headings above it, the page's title first. */
  titles: string[];
  text: string;
}

const SPACE_OR_PUNCTUATION_RE = /[\n\r\p{Z}\p{P}]+/u;
const UNSPACED_RUN_RE =
  /[\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]+|[^\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]+/gu;
const UNSPACED_START_RE = /^[\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]/u;

let segmenter: Intl.Segmenter | undefined;

/**
 * Splits text into words the way VitePress does when it builds the index,
 * so queries meet the same words: at spaces and punctuation, and runs of
 * Chinese or Japanese, which have no spaces, by `Intl.Segmenter`.
 */
export function tokenizeSearchText(text: string): string[] {
  const terms = text.split(SPACE_OR_PUNCTUATION_RE);
  if (typeof Intl.Segmenter !== "function") return terms;
  segmenter ??= new Intl.Segmenter(undefined, { granularity: "word" });
  const words = segmenter;
  return terms.flatMap(
    (term) =>
      term.match(UNSPACED_RUN_RE)?.flatMap((run) =>
        UNSPACED_START_RE.test(run)
          ? Array.from(words.segment(run), (part) => part.segment)
          : run,
      ) ?? term,
  );
}

/**
 * The index's options, as VitePress builds it plus the text stored for
 * excerpts (`themeConfig.search.options` that `akariContent` sets).
 */
export const LOCAL_SEARCH_OPTIONS: Options<LocalSearchDocument> = {
  fields: ["title", "titles", "text"],
  storeFields: ["title", "titles", "text"],
  tokenize: tokenizeSearchText,
};

/**
 * Words match as typed, as the start of a longer one, or with a typo or
 * two in long ones; a match in a heading counts most.
 */
const MATCHING: SearchOptions = {
  fuzzy: 0.2,
  prefix: true,
  boost: { title: 4, text: 2, titles: 1 },
};

export function loadLocalSearchIndex(
  json: string,
): MiniSearch<LocalSearchDocument> {
  return MiniSearch.loadJSON<LocalSearchDocument>(json, LOCAL_SEARCH_OPTIONS);
}

function normalizeText(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

export function makeExcerpt(
  content: string,
  tokens: string[],
  maxLength = EXCERPT_LENGTH,
): string {
  const text = content.replace(/\s+/g, " ").trim();
  if (!text) return "";

  const lower = text.toLowerCase();
  let matchIndex = Number.POSITIVE_INFINITY;

  for (const token of tokens) {
    const index = token ? lower.indexOf(token.toLowerCase()) : -1;
    if (index >= 0 && index < matchIndex) matchIndex = index;
  }

  if (!Number.isFinite(matchIndex)) {
    return text.length > maxLength
      ? `${text.slice(0, maxLength).trim()}…`
      : text;
  }

  const start = Math.max(0, matchIndex - Math.floor(maxLength / 3));
  const end = Math.min(text.length, start + maxLength);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";

  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

/**
 * How a hit relates to the query as typed, which word matching can't see:
 * 4, the query is its heading; 3, its heading starts with the query; 2,
 * contains it; 1, its page title or text has it word for word, as a phrase
 * in Chinese or Japanese would be; 0, none of these.
 */
function phraseTier(query: string, title: string, rest: string): number {
  if (title === query) return 4;
  if (title.startsWith(query)) return 3;
  if (title.includes(query)) return 2;
  return rest.includes(query) ? 1 : 0;
}

/**
 * Searches one locale's index. Every word of the query has to match, or,
 * when nothing does, any of them. Hits are ranked by how they relate to the
 * query as typed (phraseTier), a page over its sections when the query is
 * or starts its heading, then by MiniSearch's relevance.
 */
export function searchLocal(
  index: MiniSearch<LocalSearchDocument>,
  query: string,
  limit: number,
): AkariSearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  let hits = index.search(trimmed, { ...MATCHING, combineWith: "AND" });
  if (!hits.length) hits = index.search(trimmed, MATCHING);

  const phrase = normalizeText(trimmed);
  const results = hits.map((hit) => {
    const title = String(hit.title ?? "");
    const titles = Array.isArray(hit.titles) ? (hit.titles as string[]) : [];
    const text = String(hit.text ?? "");
    const isPage = titles.length === 0;
    const tier = phraseTier(
      phrase,
      normalizeText(title),
      normalizeText(`${titles.join(" ")} ${text}`),
    );
    const terms = [...new Set(hit.terms)];

    const result: AkariSearchResult & { tier: number; page: number; score: number } = {
      id: hit.id,
      title,
      // A page's first section is the page itself: link to its top.
      href: isPage ? hit.id.replace(/#.*$/, "") : hit.id,
      pageTitle: isPage ? title : titles[0],
      heading: isPage ? undefined : title,
      excerpt: makeExcerpt(text, [phrase, ...terms]),
      terms,
      tier,
      page: isPage && tier >= 3 ? 1 : 0,
      score: hit.score,
    };
    return result;
  });

  results.sort(
    (a, b) =>
      b.tier - a.tier ||
      b.page - a.page ||
      b.score - a.score ||
      a.title.localeCompare(b.title),
  );

  const seen = new Set<string>();
  const unique: AkariSearchResult[] = [];
  for (const { tier: _tier, page: _page, score: _score, ...result } of results) {
    if (seen.has(result.href)) continue;
    seen.add(result.href);
    unique.push(result);
    if (unique.length >= limit) break;
  }
  return unique;
}
