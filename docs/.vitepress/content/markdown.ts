// Reading a page's title from its Markdown, for the generated navigation.

/** Markdown reduced to its text: no markup, links or HTML tags. */
export function markdownToText(value: string): string {
  return value
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/`{1,3}([^`]*?)`{1,3}/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*\|?[\s:|-]+\|?\s*$/gm, " ")
    .replace(/\|/g, " ")
    .replace(/[*_~]{1,3}/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Markdown without its fenced code blocks. */
export function stripFencedCode(value: string): string {
  return value.replace(/(?:```|~~~)[\s\S]*?(?:```|~~~)/g, " ");
}

/** The text of the first level 1 heading, if there is one. */
export function extractFirstH1(value: string): string | undefined {
  const match = /^#\s+(.+?)\s*#*\s*$/m.exec(value);
  return match ? markdownToText(match[1]) : undefined;
}
