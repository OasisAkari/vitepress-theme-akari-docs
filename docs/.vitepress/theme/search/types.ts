import type { M3eSearchResult } from "../types";

export interface SearchIndexEntry {
  id: string;
  pageTitle: string;
  title: string;
  heading: string;
  href: string;
  content: string;
  level: number;
}

export interface SearchIndexFile {
  version: number;
  generatedAt: string;
  entries: SearchIndexEntry[];
}

export interface M3eSearchContext {
  limit: number;
  signal?: AbortSignal;
}

export type M3eSearchHandler = (
  query: string,
  context: M3eSearchContext,
) => Promise<M3eSearchResult[]> | M3eSearchResult[];

export interface M3eSearchBackend {
  search(query: string, context: M3eSearchContext): Promise<M3eSearchResult[]>;
}
