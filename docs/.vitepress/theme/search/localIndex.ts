import localSearchIndex from "@localSearchIndex";
import type MiniSearch from "minisearch";

import { loadLocalSearchIndex, type LocalSearchDocument } from "./local";

type IndexModules = typeof localSearchIndex;

let modules: IndexModules = localSearchIndex;
const loaded = new Map<string, Promise<MiniSearch<LocalSearchDocument>>>();

// In development VitePress rebuilds the index as pages change.
if (import.meta.hot) {
  import.meta.hot.accept("@localSearchIndex", (next) => {
    if (!next) return;
    modules = (next as unknown as { default: IndexModules }).default;
    loaded.clear();
  });
}

/** Thrown when VitePress built no index for a locale. */
export class MissingLocalIndexError extends Error {}

/**
 * The search index of one VitePress locale (`root` for the root one), as
 * VitePress' local search builds it: each locale its own chunk, loaded on
 * the first search in it.
 */
export function loadLocalIndex(
  locale: string,
): Promise<MiniSearch<LocalSearchDocument>> {
  let index = loaded.get(locale);
  if (!index) {
    const load = modules[locale];
    if (!load) return Promise.reject(new MissingLocalIndexError(locale));
    index = load()
      .then((module) => loadLocalSearchIndex(module.default))
      .catch((error) => {
        loaded.delete(locale);
        throw error;
      });
    loaded.set(locale, index);
  }
  return index;
}
