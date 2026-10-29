import type { AkariSearchResult } from "../types";

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

export interface AkariSearchContext {
  limit: number;
  signal?: AbortSignal;
  /** Language of the locale being read, e.g. `en-US`. */
  lang?: string;
  /** Key of the VitePress locale being read; `root` for the default one. */
  locale?: string;
}

export type AkariSearchHandler = (
  query: string,
  context: AkariSearchContext,
) => Promise<AkariSearchResult[]> | AkariSearchResult[];

export interface AkariSearchBackend {
  search(query: string, context: AkariSearchContext): Promise<AkariSearchResult[]>;
}
