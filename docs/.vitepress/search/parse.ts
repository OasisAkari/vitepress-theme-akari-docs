import matter from "gray-matter";

import type { SearchIndexEntry } from "../theme/search/types";

const SPECIAL_SLUG_CHARS = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g;
const INDEX_CONTENT_LIMIT = 4000;

interface ParsedSection {
  level: number;
  heading: string;
  content: string;
}

export interface ParsedSearchPage {
  route: string;
  title: string;
  entries: SearchIndexEntry[];
}

export function fileToRoute(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").replace(/\.md$/i, "");
  let route = `/${normalized}`;

  if (route === "/index") return "/";
  if (route.endsWith("/index")) route = route.slice(0, -"/index".length);

  return route || "/";
}

export function slugifyHeading(
  value: string,
  used?: Map<string, number>,
): string {
  let slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0000-\u001f]/g, "")
    .replace(SPECIAL_SLUG_CHARS, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(\d)/, "_$1")
    .toLowerCase();

  if (!slug) slug = "section";

  if (!used) return slug;

  const count = used.get(slug) ?? 0;
  used.set(slug, count + 1);
  return count === 0 ? slug : `${slug}-${count}`;
}

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

export function stripFencedCode(value: string): string {
  return value.replace(/(?:```|~~~)[\s\S]*?(?:```|~~~)/g, " ");
}

export function extractFirstH1(value: string): string | undefined {
  const match = /^#\s+(.+?)\s*#*\s*$/m.exec(value);
  return match ? markdownToText(match[1]) : undefined;
}

function splitSections(value: string): {
  intro: string;
  sections: ParsedSection[];
} {
  const headingPattern = /^(#{2,3})\s+(.+?)\s*#*\s*$/gm;
  const matches = [...value.matchAll(headingPattern)];

  if (!matches.length) {
    return { intro: value, sections: [] };
  }

  const intro = value.slice(0, matches[0].index);
  const sections = matches.map((match, index) => {
    const next = matches[index + 1];
    return {
      level: match[1].length,
      heading: markdownToText(match[2]),
      content: value.slice(
        (match.index ?? 0) + match[0].length,
        next?.index ?? value.length,
      ),
    };
  });

  return { intro, sections };
}

function fallbackTitle(route: string): string {
  const segment = route.split("/").filter(Boolean).pop();
  return segment ? segment.replace(/[-_]/g, " ") : "Documentation";
}

/**
 * The search entries of a page: the page itself and its `##` and `###`
 * sections. `route` is where the page is served, by default where its
 * path in the docs puts it.
 */
export function parseMarkdownPage(
  source: string,
  relativePath: string,
  route = fileToRoute(relativePath),
): ParsedSearchPage {
  const { data, content } = matter(source);
  const sourceText = stripFencedCode(content);
  const title =
    (typeof data.title === "string" && data.title.trim()) ||
    extractFirstH1(sourceText) ||
    fallbackTitle(route);
  const withoutTitle = sourceText.replace(/^#\s+.*$/m, "");
  const { intro, sections } = splitSections(withoutTitle);
  const usedSlugs = new Map<string, number>();
  const entries: SearchIndexEntry[] = [
    {
      id: `${route}::page`,
      pageTitle: title,
      title,
      heading: "",
      href: route,
      content: markdownToText(intro).slice(0, INDEX_CONTENT_LIMIT),
      level: 0,
    },
  ];

  for (const section of sections) {
    // A heading may name its anchor: `## Heading {#anchor}`.
    const custom = /\s*\{#([^\s{}]+)\}$/.exec(section.heading.trim());
    const heading = section.heading.trim().slice(0, custom?.index).trim();
    if (!heading) continue;

    const slug = custom?.[1] ?? slugifyHeading(heading, usedSlugs);
    entries.push({
      id: `${route}::${slug}`,
      pageTitle: title,
      title: heading,
      heading,
      href: `${route}#${slug}`,
      content: markdownToText(section.content).slice(0, INDEX_CONTENT_LIMIT),
      level: section.level,
    });
  }

  return { route, title, entries };
}
