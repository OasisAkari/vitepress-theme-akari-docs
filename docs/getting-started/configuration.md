# 配置

主题的站点级配置集中在 `docs/.vitepress/config.mts` 的 `themeConfig` 中。所有主题专属字段写在 `themeConfig.m3e` 下，并由 `defineM3eThemeConfig` 提供类型推断；没有填写的字段使用主题默认值。

## 配置文件位置

- 站点配置：`docs/.vitepress/config.mts`
- 主题配置类型：`docs/.vitepress/theme/types.ts`
- 配置解析与默认值：`docs/.vitepress/theme/config.ts`
- 本节示例的顶栏效果：

<div class="demo-surface">
  <m3e-app-bar>
    <m3e-icon-button slot="leading" aria-label="切换导航" toggle>
      <m3e-icon name="menu"></m3e-icon>
      <m3e-icon slot="selected" name="menu_open"></m3e-icon>
    </m3e-icon-button>
    <span slot="title">M3E 文档主题</span>
    <m3e-chip slot="trailing">v2.10.2</m3e-chip>
    <m3e-icon-button slot="trailing" aria-label="打开设置">
      <m3e-icon name="settings"></m3e-icon>
    </m3e-icon-button>
  </m3e-app-bar>
</div>

## 完整配置示例

下面的示例覆盖 `appBar`、`sidebar`、`settings`、`toc`、`footer` 与 `components` 六组字段。`components` 中的自定义顶栏需要先创建对应 Vue 组件，具体写法见[扩展主题](/theme/extending)。

```ts
import { defineConfig } from "vitepress";
import { defineM3eThemeConfig } from "./theme/config";
import CustomAppBar from "./theme/components/CustomAppBar.vue";

export default defineConfig({
  title: "M3E 文档主题",
  description: "基于 VitePress 与 M3E Web Components 的文档主题",
  lang: "zh-CN",
  cleanUrls: true,
  themeConfig: {
    logo: "/logo.svg",
    m3e: defineM3eThemeConfig({
      appBar: {
        title: "M3E 文档主题",
        version: "v2.10.2",
        logo: "/logo.svg",
        showSidebarToggle: true,
        showSettingsToggle: true,
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
        width: 320,
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
                badge: "New",
              },
            ],
          },
        ],
      },
      settings: {
        enabled: true,
        title: "设置",
        sections: [
          "color",
          "variant",
          "scheme",
          "contrast",
          "motion",
          "direction",
          "textSize",
        ],
        labels: {
          color: "颜色",
          variant: "色调变体",
          scheme: "明暗模式",
          contrast: "对比度",
          motion: "动效",
          direction: "文字方向",
          textSize: "字号",
        },
        defaults: {
          color: "#6750A4",
          variant: "tonal-spot",
          scheme: "auto",
          contrast: "standard",
          motion: "expressive",
          direction: "ltr",
          textSize: "16px",
        },
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
        showPrevNext: true,
      },
      components: {
        AppBar: CustomAppBar,
      },
    }),
  },
});
```

## 字段参考

### appBar

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | 站点 `title` | 顶栏标题；未配置时回退到站点标题 |
| `version` | `string` | 无 | 显示在标题旁的版本标签，通常写 `v2.10.2` |
| `logo` | `string` | `themeConfig.logo` | 品牌图标地址，使用 `withBase` 解析 |
| `showSidebarToggle` | `boolean` | `true` | 是否显示左侧导航开关 |
| `showSettingsToggle` | `boolean` | `true` | 是否显示设置抽屉开关；设置整体关闭时也会隐藏 |
| `socialLinks` | `M3eSocialLink[]` | `[]` | 社交入口，字段为 `icon`、`link`、`label` |

### sidebar

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `M3eSidebarItem[] \| Record<string, M3eSidebarItem[]>` | 无 | 富配置导航；存在时优先于原生 `themeConfig.sidebar` |
| `width` | `number` | `320` | 桌面抽屉宽度，解析时限制在 `240` 到 `400` 之间 |

### settings

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否启用设置抽屉 |
| `title` | `string` | `"设置"` | 抽屉的无障碍标题 |
| `sections` | `SettingsSectionKey[]` | 全部七项 | 显示哪些区块及其顺序；非法项会被过滤 |
| `labels` | `Partial<Record<SettingsSectionKey, string>>` | 中文标签 | 覆盖单个区块标题 |
| `defaults` | `Partial<M3eThemeSettings>` | 主题默认值 | 修改设置初始值与“恢复默认”的目标 |
| `persist` | `boolean` | `true` | 是否写入 `localStorage` |
| `storageKey` | `string` | `"m3e-docs-settings"` | 持久化键名 |

### search

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否显示顶栏搜索入口并注册快捷键 |
| `placeholder` | `string` | `"搜索文档"` | 顶栏与搜索框占位文案 |
| `shortcut` | `string` | `"k"` | 与 Cmd/Ctrl 组合的快捷键；空字符串关闭 |
| `maxResults` | `number` | `8` | 结果上限，限制在 `1` 到 `20` |
| `debounce` | `number` | `180` | 输入防抖毫秒数，限制在 `0` 到 `1000` |
| `backend` | `M3eSearchBackendConfig` | 本地索引 | `local`、`http` 或 `registered` |

本地索引、HTTP 后端、注册式后端与结果结构见[搜索](/theme/search)。

### toc

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否渲染右侧目录 |
| `maxDepth` | `number` | `3` | 目录最大标题层级，限制在 `1` 到 `6` |
| `overline` | `string` | `"本页内容"` | 目录顶部的小标题 |

### footer

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `message` | `string` | `"基于 VitePress 与 M3E 构建"` | 页脚说明文字 |
| `copyright` | `string` | `""` | 版权信息；为空时不显示 |
| `showPrevNext` | `boolean` | `true` | 是否显示上一页与下一页 |

### components

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `AppBar` | `Component` | 内置顶栏 | 替换顶部应用栏 |
| `Sidebar` | `Component` | 内置侧边导航 | 替换左侧导航 |
| `Settings` | `Component` | 内置设置抽屉 | 替换右侧设置 |
| `Toc` | `Component` | 内置目录 | 替换右侧目录 |
| `Footer` | `Component` | 内置页脚 | 替换文档页脚 |
| `Content` | `Component` | `"div"` | 替换 Markdown 内容的外层容器 |

未提供的槽位使用内置组件，因此可以只覆盖其中一个。

## 双模式侧边栏

解析顺序只有两条：

1. `themeConfig.m3e.sidebar.items` 存在且非空时，使用富配置。
2. 否则读取原生 `themeConfig.sidebar`，把 VitePress 的数组或按路径分组对象归一化为 `M3eSidebarItem`。

原生配置中的 `icon` 与 `badge` 不是 VitePress 官方字段，但归一化时会保留，因此无需一次性改写全部导航。富配置的分组、图标、徽标与折叠状态更完整，推荐作为长期方案。

## 原生 sidebar 回退

只写 VitePress 原生字段也能工作：

```ts
import { defineConfig } from "vitepress";

export default defineConfig({
  themeConfig: {
    sidebar: [
      {
        text: "开始",
        items: [
          { text: "概览", link: "/" },
          { text: "安装", link: "/getting-started/installation" },
          { text: "配置", link: "/getting-started/configuration" },
        ],
      },
      {
        text: "组件",
        items: [
          {
            text: "按钮",
            link: "/components/button",
            icon: "radio_button_checked",
            badge: "New",
          },
        ],
      },
    ],
  },
});
```

原生对象形式同样支持按路径分组，解析时按当前路径做最长前缀匹配。两种模式下，路由比较都会忽略 `base`、结尾斜杠、查询参数与 hash。

## 扩展点

- 想替换顶栏、侧边栏等界面组件，使用 `m3e.components`，见[扩展主题](/theme/extending)。
- 想调整颜色、圆角、目录宽度等视觉细节，覆盖 CSS 变量，见[扩展主题](/theme/extending)的“CSS 令牌”一节。
- 想控制设置面板的可见区块，见[右侧设置](/theme/settings)。
