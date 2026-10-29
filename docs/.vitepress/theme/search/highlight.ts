export interface HighlightPart {
  text: string;
  match: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits text around what the search matched: the words of the query, and
 * `terms`, the words a backend says matched (a word the query only started,
 * or misspelled).
 */
export function splitHighlight(
  text: string,
  query: string,
  terms: readonly string[] = [],
): HighlightPart[] {
  if (!text) return [];

  const tokens = [
    ...new Set(
      [...query.split(/\s+/), ...terms]
        .map((token) => token.toLowerCase())
        .filter(Boolean),
    ),
  ].sort((a, b) => b.length - a.length);

  if (!tokens.length) return [{ text, match: false }];

  const pattern = new RegExp(tokens.map(escapeRegExp).join("|"), "gi");
  const parts: HighlightPart[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), match: false });
    }

    parts.push({ text: match[0], match: true });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), match: false });
  }

  return parts.length ? parts : [{ text, match: false }];
}
