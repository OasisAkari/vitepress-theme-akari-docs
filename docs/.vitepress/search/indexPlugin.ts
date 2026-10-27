import { copyFile } from "node:fs/promises";
import path from "node:path";

import type { Plugin } from "vite";

import {
  searchIndexOutputPath,
  writeSearchIndex,
} from "./generate";

export interface SearchIndexPluginOptions {
  docsDir: string;
}

export function searchIndexPlugin(options: SearchIndexPluginOptions): Plugin {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let outDir: string | undefined;

  async function generate(): Promise<void> {
    try {
      await writeSearchIndex(options.docsDir);
    } catch (error) {
      console.error("[m3e-search] failed to build search index", error);
    }
  }

  function schedule(): void {
    clearTimeout(timer);
    timer = setTimeout(() => void generate(), 150);
  }

  function isDocument(file: string): boolean {
    return file.endsWith(".md") && !file.includes(`${path.sep}.vitepress${path.sep}`);
  }

  return {
    name: "m3e-search-index",
    async configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      await generate();
    },
    configureServer(server) {
      server.watcher.on("add", (file) => {
        if (isDocument(file)) schedule();
      });
      server.watcher.on("change", (file) => {
        if (isDocument(file)) schedule();
      });
      server.watcher.on("unlink", (file) => {
        if (isDocument(file)) schedule();
      });
    },
    async closeBundle() {
      if (!outDir) return;

      try {
        await copyFile(
          searchIndexOutputPath(options.docsDir),
          path.join(outDir, "search-index.json"),
        );
      } catch {
        // The configResolved generation reports missing or invalid indexes.
      }
    },
  };
}
