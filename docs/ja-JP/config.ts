import { defineAkariConfig } from "../.vitepress/theme/define.ts";

export default defineAkariConfig({
  label: "日本語",
  title: "Vitepress Theme Akari Docs",
  description: "VitePress と M3E Web Components で作られたドキュメントテーマ",
  markdown: {
    codeCopyButton: { tooltipText: "コードをコピー", copiedText: "コピーしました" },
  },
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
