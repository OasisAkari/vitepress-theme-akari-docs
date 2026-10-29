import { defineAkariConfig } from "../.vitepress/theme/define.ts";

export default defineAkariConfig({
  title: "Vitepress Theme Akari Docs",
  description: "A documentation theme built on VitePress and M3E Web Components",
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
