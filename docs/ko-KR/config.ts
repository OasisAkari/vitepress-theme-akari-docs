import { defineAkariConfig } from "../.vitepress/theme/define.ts";

export default defineAkariConfig({
  label: "한국어",
  title: "Vitepress Theme Akari Docs",
  description: "VitePress와 M3E Web Components로 만든 문서 테마",
  markdown: {
    codeCopyButton: { tooltipText: "코드 복사", copiedText: "복사됨" },
  },
  appBar: { title: "Vitepress Theme Akari Docs" },
  sidebar: {
    categories: {
      "getting-started": { text: "시작하기" },
      theme: { text: "테마" },
      styles: { text: "스타일" },
      components: { text: "컴포넌트" },
    },
  },
  footer: {
    message: "VitePress와 M3E Web Components로 제작",
  },
});
