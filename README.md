# VitePress M3E Docs Theme

一个使用 VitePress `2.0.0-alpha.21` 与 [`@m3e/web`](https://github.com/matraic/m3e) Material 3 Expressive Web Components 构建的文档主题。布局参考 m3e 官方文档：顶部 App Bar、左侧可折叠导航、圆角内容面板、右侧 TOC 与设置抽屉。

## 特性

- M3E 应用式文档壳，不使用 iframe，保留 VitePress 的 Markdown、SSR 与 SPA 路由。
- 双模式侧边栏：富配置支持图标、徽标、分组与自动展开，也可回退 VitePress 原生 `themeConfig.sidebar`。
- 文档搜索：顶栏入口、`⌘K / Ctrl K` 快捷键、由按钮当前样式克隆并吸附到中心的 MD3 动效搜索面板、中文友好的本地 Markdown 索引。
- 可配置搜索后端：本地索引、HTTP 接口或 `registerSearchBackend()` 注册的 JS handler。
- 搜索索引由 Vite 插件在开发/构建期生成到 `docs/public/search-index.json`，不提交生成物。
- 右侧设置：颜色、8 种色调变体、明暗、对比度、动效、方向与字号，支持 localStorage 持久化。
- 可覆盖核心组件，可通过公共 composable 与 CSS 变量扩展。
- 本地 Roboto 字体与按需图标，不依赖 Google Fonts CDN。
- m3e 组件只在客户端注册，服务端仍输出可索引的文档 HTML。

## 环境要求

- Node.js >= 22.12（开发环境使用 Node 24）
- npm

## 开发

```bash
npm install
npm run dev
```

默认开发地址为 `http://localhost:5173`。

## 构建与检查

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

生产输出位于 `docs/.vitepress/dist`。

## 目录

```text
docs/
  .vitepress/
    config.mts
    search/                # Markdown 索引解析、生成与 Vite 插件
    theme/
      index.ts
      types.ts / constants.ts / config.ts / settings.ts / sidebar.ts
      m3e.ts / icons.ts
      layouts/M3eLayout.vue
      components/{shell,sidebar,settings,content}/
      search/              # 搜索状态、后端适配、触发器和对话框
      composables/
      styles/
  index.md
  getting-started/
  theme/
  styles/
  components/
specs/
plans/
tests/
```

## 配置

```ts
import { defineConfig } from "vitepress";
import { defineM3eThemeConfig } from "./theme/config";

export default defineConfig({
  themeConfig: {
    m3e: defineM3eThemeConfig({
      appBar: {
        title: "M3E 文档主题",
        version: "v2.10.2",
        socialLinks: [
          { icon: "github", link: "https://github.com/matraic/m3e", label: "GitHub" },
        ],
      },
      sidebar: {
        items: [
          {
            text: "开始",
            icon: "rocket_launch",
            items: [{ text: "概览", link: "/", icon: "home" }],
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
      },
    }),
  },
});
```

### 侧边栏双模式

- 配置了 `themeConfig.m3e.sidebar.items` 时使用富配置。
- 未配置时自动读取原生 `themeConfig.sidebar`，支持数组或多路径字典，并生成上一页/下一页。
- 富配置项：`text`、`link`、`icon`、`badge`、`collapsed`、`items`。
- 链接匹配会忽略 base、查询参数、hash、`.html` 与结尾斜杠。

### 设置项

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `color` | `#6750A4` | 动态色种子颜色 |
| `variant` | `tonal-spot` | 色调变体 |
| `scheme` | `auto` | `light` / `dark` / `auto` |
| `contrast` | `standard` | `standard` / `medium` / `high` |
| `motion` | `expressive` | `standard` / `expressive` |
| `direction` | `ltr` | `ltr` / `rtl` |
| `textSize` | `16px` | `16px` / `24px` / `32px` |

可通过 `settings.sections` 控制显示区块及顺序，通过 `settings.defaults` 修改默认值。

## 扩展

### 覆盖组件

```ts
import MyAppBar from "./MyAppBar.vue";

m3e: defineM3eThemeConfig({
  components: {
    AppBar: MyAppBar,
  },
});
```

可覆盖：`AppBar`、`Sidebar`、`Settings`、`Toc`、`Footer`、`Content`。覆盖组件需保持原根元素语义与无障碍属性。

### 公共 API

主题入口导出：

- `defineM3eThemeConfig`
- `useM3eConfig`
- `useM3eSettings`
- `useSidebar`
- `useM3eSearch`
- `registerSearchBackend`
- `M3E_CONTENT_ID` / `M3E_SIDEBAR_ID` / `M3E_SETTINGS_ID`

### 新增图标

图标按需注册，编辑 `docs/.vitepress/theme/icons.ts`：

```ts
import "@m3e/icons/outlined/your_icon_name";
```

组件中使用：

```html
<m3e-icon name="your_icon_name"></m3e-icon>
```

### CSS 变量

常用覆盖点：

```css
:root {
  --m3e-doc-gap: 16px;
  --m3e-doc-radius: 28px;
  --m3e-drawer-container-width: 320px;
  --m3e-content-pane-container-color: var(--md-sys-color-surface-container-lowest);
  --m3e-toc-width: 208px;
}
```

颜色优先使用 m3e 注入的 `--md-sys-color-*` 令牌。`styles/tokens.css` 只保存布局变量，不维护静态调色板；Layout 会把当前 `m3e-theme` 的 shell 色令牌同步到根元素，`html`/`body` 通过 `--m3e-doc-page-background` 与 `--m3e-doc-page-foreground` 随种子色、变体、明暗和对比度更新。

## 已知限制

- VitePress 使用 alpha 版本，主题锁定 `2.0.0-alpha.21`，升级前需重新验证 Web Components SSR 与水合。
- 多语言与 60+ 组件全量 API 页不在当前阶段范围内。
- 本地搜索是轻量级子串检索，不提供语义搜索或拼写纠错；可通过 HTTP/注册式后端替换。
- m3e 组件按需注册；在 Markdown 中使用新组件前，需要在 `m3e.ts` 增加对应导入。
- JS 水合前 `html`/`body` 回退到系统 `Canvas` / `CanvasText`；m3e 主题就绪后由动态色板接管。默认种子色 `#6750A4` 与品牌 logo 是固定输入/品牌资产，不参与令牌替换。

## 设计资料

- [设计规格](specs/2026-10-27-vitepress-m3e-theme-design.md)
- [实施计划](plans/2026-10-27-vitepress-m3e-theme.md)
