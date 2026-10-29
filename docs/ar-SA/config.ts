import { defineAkariConfig } from "../.vitepress/theme/define.ts";

export default defineAkariConfig({
  label: "العربية",
  // Written right to left.
  dir: "rtl",
  title: "Vitepress Theme Akari Docs",
  description: "قالب توثيق مبني على VitePress و M3E Web Components",
  markdown: {
    codeCopyButton: { tooltipText: "نسخ الشيفرة", copiedText: "تم النسخ" },
  },
  appBar: { title: "Vitepress Theme Akari Docs" },
  sidebar: {
    categories: {
      "getting-started": { text: "البدء" },
      theme: { text: "السمة" },
      styles: { text: "الأنماط" },
      components: { text: "المكونات" },
    },
  },
  footer: {
    message: "صُنع باستخدام VitePress و M3E Web Components",
  },
});
