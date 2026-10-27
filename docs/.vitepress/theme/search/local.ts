import type { M3eSearchResult } from "../types";
import type { SearchIndexEntry } from "./types";

const EXCERPT_LENGTH = 160;

interface ScoredSearchResult extends M3eSearchResult {
  score: number;
}

function normalizeText(value: string): string {
  return value.normalize("NFKC").toLowerCase();
}

function queryTokens(query: string): string[] {
  return [...new Set(normalizeText(query).split(/\s+/).filter(Boolean))];
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
    const index = lower.indexOf(token);
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

export function searchLocal(
  entries: SearchIndexEntry[],
  query: string,
  limit: number,
): M3eSearchResult[] {
  const normalizedQuery = normalizeText(query.trim());
  const tokens = queryTokens(query);

  if (!normalizedQuery || !tokens.length) return [];

  const scored: ScoredSearchResult[] = entries
    .flatMap((entry): ScoredSearchResult[] => {
      const title = normalizeText(`${entry.title} ${entry.pageTitle}`);
      const pageTitle = normalizeText(entry.pageTitle);
      const content = normalizeText(entry.content);

      if (
        !tokens.every(
          (token) =>
            title.includes(token) ||
            pageTitle.includes(token) ||
            content.includes(token),
        )
      ) {
        return [];
      }

      let score = 0;

      if (title === normalizedQuery) score += 100;
      if (title.startsWith(normalizedQuery)) score += 60;
      if (title.includes(normalizedQuery)) score += 40;
      if (pageTitle.includes(normalizedQuery)) score += 20;
      if (content.includes(normalizedQuery)) score += 10;

      for (const token of tokens) {
        if (title.includes(token)) score += 24;
        if (pageTitle.includes(token)) score += 10;
        if (content.includes(token)) score += 6;
      }

      score += entry.level === 2 ? 3 : entry.level === 3 ? 1 : 2;

      const result: ScoredSearchResult = {
        id: entry.id,
        title: entry.heading || entry.pageTitle,
        pageTitle: entry.pageTitle,
        heading: entry.heading || undefined,
        href: entry.href,
        excerpt: makeExcerpt(entry.content, tokens),
        score,
      };

      return [result];
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const seen = new Set<string>();
  const unique: ScoredSearchResult[] = [];

  for (const result of scored) {
    if (seen.has(result.href)) continue;
    seen.add(result.href);
    unique.push(result);
    if (unique.length >= limit) break;
  }

  return unique.map(({ score: _score, ...result }) => result);
}
