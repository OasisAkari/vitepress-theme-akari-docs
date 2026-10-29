import { defineAkariConfig } from "../.vitepress/theme/define.ts";

export default defineAkariConfig({
  label: "Français",
  title: "Vitepress Theme Akari Docs",
  description: "Un thème de documentation construit avec VitePress et M3E Web Components",
  markdown: {
    codeCopyButton: { tooltipText: "Copier le code", copiedText: "Copié" },
  },
  appBar: { title: "Vitepress Theme Akari Docs" },
  sidebar: {
    categories: {
      "getting-started": { text: "Premiers pas" },
      theme: { text: "Thème" },
      styles: { text: "Styles" },
      components: { text: "Composants" },
    },
  },
  footer: {
    message: "Conçu avec VitePress et M3E Web Components",
  },
});
