import { defineAkariConfig } from "../.vitepress/theme/define.ts";

export default defineAkariConfig({
  label: "English",
  title: "Vitepress Theme Akari Docs",
  description: "A documentation theme built on VitePress and M3E Web Components",
  markdown: {
    codeCopyButton: { tooltipText: "Copy code", copiedText: "Copied" },
  },
  appBar: { title: "Vitepress Theme Akari Docs" },
  sidebar: {
    categories: {
      "getting-started": { text: "Getting started" },
      theme: { text: "Theme" },
      styles: { text: "Styles" },
      components: { text: "Components" },
    },
  },
  footer: {
    message: "Built with VitePress and M3E Web Components",
  },
});
