import { defineAkariConfig } from "../.vitepress/theme/define.ts";

export default defineAkariConfig({
  title: "Vitepress Theme Akari Docs",
  description: "VitePress と M3E Web Components で作られたドキュメントテーマ",
  appBar: { title: "Vitepress Theme Akari Docs" },
  sidebar: {
    categories: {
      "getting-started": { text: "はじめに" },
      theme: { text: "テーマ" },
      styles: { text: "スタイル" },
      components: { text: "コンポーネント" },
    },
  },
  footer: {
    message: "VitePress と M3E Web Components で構築",
  },
});
