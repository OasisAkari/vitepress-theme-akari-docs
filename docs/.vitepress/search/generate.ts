import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  SearchIndexEntry,
  SearchIndexFile,
} from "../theme/search/types";
import { parseMarkdownPage } from "./parse";

const EXCLUDED_DIRECTORIES = new Set([
  ".vitepress",
  "node_modules",
  "public",
  "dist",
]);

async function collectMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".") || EXCLUDED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function buildSearchIndex(
  docsDir: string,
): Promise<SearchIndexFile> {
  const files = await collectMarkdownFiles(docsDir);
  const entries: SearchIndexEntry[] = [];

  for (const file of files) {
    const relative = path.relative(docsDir, file).split(path.sep).join("/");
    const source = await readFile(file, "utf8");
    entries.push(...parseMarkdownPage(source, relative).entries);
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    entries,
  };
}

export function searchIndexOutputPath(docsDir: string): string {
  return path.join(docsDir, "public", "search-index.json");
}

export async function writeSearchIndex(docsDir: string): Promise<void> {
  const output = searchIndexOutputPath(docsDir);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(
    output,
    JSON.stringify(await buildSearchIndex(docsDir)),
    "utf8",
  );
}
