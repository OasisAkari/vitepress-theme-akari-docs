import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { akariContent } from "./content";
import { akariHead } from "./theme/head";
import { akariMarkdown } from "./theme/markdown";

const docsDir = fileURLToPath(new URL("../", import.meta.url));

// The site's content and its config live in the docs folder: config.ts for
// what every language shares, a folder per language with its own config.ts,
// and in it a folder per rail category holding a folder per article. This
// file only wires the theme into VitePress.
const content = await akariContent(docsDir);

export default defineConfig({
  ...content.site,
  cleanUrls: true,
  // Light and dark belong to the theme's appearance button.
  appearance: false,
  head: akariHead(),
  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    headers: { level: [2, 3] },
    config: (md) => akariMarkdown(md),
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => tag.startsWith("m3e-"),
      },
    },
  },
  vite: {
    plugins: [content.plugin],
  },
});
