import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { searchIndexPlugin } from "./search/indexPlugin";
import { defineM3eThemeConfig } from "./theme/config";

const docsDir = fileURLToPath(new URL("../", import.meta.url));

export default defineConfig({
  lang: "zh-CN",
  title: "M3E 文档主题",
  description: "基于 VitePress 与 M3E Web Components 的文档主题",
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
  ],
  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    headers: { level: [2, 3] },
    codeCopyButton: { tooltipText: "复制代码", copiedText: "已复制" },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => tag.startsWith("m3e-"),
      },
    },
  },
  vite: {
    plugins: [searchIndexPlugin({ docsDir })],
  },
  themeConfig: {
    logo: "/logo.svg",
    m3e: defineM3eThemeConfig({
      appBar: {
        title: "M3E 文档主题",
        version: "v2.10.2",
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/matraic/m3e",
            label: "M3E GitHub",
          },
          {
            icon: "npm",
            link: "https://www.npmjs.com/package/@m3e/web",
            label: "@m3e/web npm",
          },
        ],
      },
      sidebar: {
        items: [
          {
            text: "开始",
            icon: "rocket_launch",
            items: [
              { text: "概览", link: "/", icon: "home" },
              {
                text: "安装",
                link: "/getting-started/installation",
                icon: "package_2",
              },
              {
                text: "配置",
                link: "/getting-started/configuration",
                icon: "tune",
              },
            ],
          },
          {
            text: "主题",
            icon: "palette",
            items: [
              {
                text: "布局与顶栏",
                link: "/theme/layout",
                icon: "view_quilt",
              },
              {
                text: "侧边导航",
                link: "/theme/sidebar",
                icon: "view_sidebar",
              },
              {
                text: "右侧设置",
                link: "/theme/settings",
                icon: "settings",
              },
              {
                text: "搜索",
                link: "/theme/search",
                icon: "search",
              },
              {
                text: "扩展主题",
                link: "/theme/extending",
                icon: "integration_instructions",
                badge: "扩展",
              },
            ],
          },
          {
            text: "样式",
            icon: "style",
            items: [
              { text: "色彩", link: "/styles/color", icon: "colorize" },
              { text: "排版", link: "/styles/typography", icon: "text_fields" },
            ],
          },
          {
            text: "组件",
            icon: "widgets",
            items: [
              {
                text: "按钮",
                link: "/components/button",
                icon: "radio_button_checked",
              },
              {
                text: "卡片",
                link: "/components/card",
                icon: "dashboard",
              },
              {
                text: "导航",
                link: "/components/navigation",
                icon: "language",
                badge: "New",
              },
            ],
          },
        ],
      },
      settings: {
        enabled: true,
        persist: true,
        storageKey: "m3e-docs-settings",
      },
      search: {
        enabled: true,
        placeholder: "搜索文档",
        shortcut: "k",
        maxResults: 8,
        backend: { type: "local" },
      },
      toc: {
        enabled: true,
        maxDepth: 3,
        overline: "本页内容",
      },
      footer: {
        message: "基于 VitePress 与 M3E Web Components 构建",
        copyright: "M3E Docs",
      },
    }),
  },
});
