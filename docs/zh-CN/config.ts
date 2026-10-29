import { defineAkariConfig } from "../.vitepress/theme/define.ts";

export default defineAkariConfig({
  label: "简体中文",
  title: "Vitepress Theme Akari Docs",
  description: "基于 VitePress 与 M3E Web Components 的文档主题",
  appBar: { title: "Vitepress Theme Akari Docs" },
  sidebar: {
    categories: {
      "getting-started": { text: "开始" },
      theme: { text: "主题" },
      styles: { text: "样式" },
      components: { text: "组件" },
    },
  },
  footer: {
    message: "基于 VitePress 与 M3E Web Components 构建",
  },
});
