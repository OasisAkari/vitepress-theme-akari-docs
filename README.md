# Vitepress Theme Akari Docs

Vitepress Theme Akari Docs 是一个使用 VitePress `2.0.0-alpha.21` 与 [`@m3e/web`](https://github.com/matraic/m3e) Material 3 Expressive Web Components 构建的文档主题。布局参考 m3.material.io：吸顶 App Bar、左侧 rail 与导航抽屉、随窗口滚动的圆角文档表面（右侧悬挂 TOC，底部波浪分隔线与页尾）以及设置模态框。

## 特性

- 用 M3E 组件重写的文档外壳，不使用 iframe，保留 VitePress 的 Markdown、SSR 与 SPA 路由；由窗口直接滚动文档，原生滚动、查找与前进后退位置恢复都可用。
- 按目录组织：`docs/config.ts` 是各语言共用的配置，以语言代码命名的文件夹（`zh-CN`、`en-US`、`ar-SA` 等）各带一份覆写它的 `config.ts`；语言文件夹下的目录是 rail 分类，再下一级的文件夹是文章（`index.md`，文件夹名即路径）。导航由目录与文章的头部信息生成，开发时随文件增删即时更新；也可以手写富配置，或回退 VitePress 原生 `themeConfig.sidebar`。
- 文档搜索：顶栏入口、`⌘K / Ctrl K` 快捷键、由按钮当前样式克隆并吸附到中心的 MD3 动效搜索面板、中文友好的本地 Markdown 索引。
- 可配置搜索后端：本地索引、HTTP 接口或 `registerSearchBackend()` 注册的 JS handler。
- 搜索索引由 Vite 插件在开发/构建期生成到 `docs/public/search-index.json`，不提交生成物。
- 明暗模式：rail 底部的按钮在跟随系统、日间、夜间与跟随时间（07:00 前与 18:59 后为夜间）之间切换，系统偏好未知时跟随系统回退为跟随时间；切换时以提示条显示当前模式；`<head>` 内联脚本在首帧前应用，不闪烁。
- 悬浮按钮：右下角的回到顶部按钮在页面滚动后出现，点击时展开为“返回顶部”并平滑滚回，途中可再次点击打断；窄屏另有目录按钮，展开为当前页的目录面板。
- 顶栏按钮：宽度不足时，除搜索以外的按钮收进三个点的“更多”下拉菜单；搜索框在窄窗口下平滑收成圆形按钮。
- 设置：齿轮按钮以容器变换打开设置模态框，包含颜色、8 种色调变体、对比度、动效、方向与字号，支持 localStorage 持久化，区块与按钮可配置。
- 平行页面：文章在头部信息的 `parallel` 中列出同一文件夹的其他页面、各页用 `tab` 定义标签标题后，组内各页在侧边栏中合为一项，页面顶部以标签栏切换，参考 m3.material.io；向下滚动时标签栏缩小并以弹簧动效飞入顶栏，铺满标题与按钮之间的空白，过长的标题以省略号截断，空间不足时固定在顶栏下方；组内切页时内容左右滑动，标签栏收在顶栏时保持停靠并直接定位到正文。
- 头图：页面 frontmatter 配置 `hero` 后，标题、日期、简介与图片以两张卡片并排显示在页面顶部，参考 Material Design 博客；支持夜间图片，并自动从头图取色作为该页的主题色。
- 国际化：语言文件夹生成 VitePress `locales`，界面文字内置简体中文、英文、日文、韩文、法文与阿拉伯文并可通过 `messages` 覆盖；从右到左的语言在语言配置中写 `dir: "rtl"`，文字方向默认跟随语言；rail 底部的圆形描边按钮以与搜索框相同的容器变换打开语言选择模态框，目标语言没有对应页面时进入该语言首页；搜索只返回当前语言的结果。
- 可覆盖核心组件，可通过公共 composable 与 CSS 变量扩展。
- 字体按语言选择：默认从 Google Fonts 加载 Roboto 与思源黑体（Noto Sans SC），日文、韩文与阿拉伯文页面换成 Noto Sans JP、Noto Sans KR 与 Noto Sans Arabic，以 `display=swap` 异步加载，不阻塞页面显示；`fonts.google: false` 只用本机字体，`fonts.family` 指定字体序列；图标按需注册，不依赖图标 CDN。
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
  config.ts                # 各语言共用的配置
  zh-CN/                   # 简体中文，放在站点根路径
    config.ts              # 覆写共用配置
    index.md               # 首页
    getting-started/       # rail 分类
      installation/
        index.md           # 文章 /getting-started/installation
    theme/ styles/ components/
  en-US/                   # English，放在 /en-US/
  ja-JP/ ko-KR/ fr-FR/     # 日文、韩文、法文
  ar-SA/                   # 阿拉伯文，从右到左
  public/
  .vitepress/
    config.mts             # 把主题接入 VitePress
    content/               # 由目录生成语言、地址与导航
    search/                # Markdown 索引解析、生成与 Vite 插件
    theme/
      index.ts / define.ts
      types.ts / constants.ts / config.ts / settings.ts / sidebar.ts
      i18n.ts / locales.ts   # 界面文字与语言路径
      m3e.ts / icons.ts
      layouts/AkariLayout.vue
      components/{shell,sidebar,settings,content}/
      search/              # 搜索状态、后端适配、触发器和对话框
      composables/
      styles/
specs/
plans/
tests/
```

## 配置

共用配置写在 `docs/config.ts`，每种语言在自己文件夹的 `config.ts` 中覆写（对象按字段合并，其它值替换）。这两层是 VitePress 2 的目录级配置，修改后开发服务器自动重启。

```ts
// docs/config.ts
import { defineAkariConfig } from "./.vitepress/theme/define.ts";

export default defineAkariConfig({
  rootLanguage: "zh-CN",
  appBar: {
    version: "v1.0.0",
    socialLinks: [
      { icon: "github", link: "https://github.com/OasisAkari/vitepress-theme-akari-docs", label: "GitHub" },
    ],
  },
  sidebar: {
    // 分类的文件夹名与图标，键的顺序即 rail 中的顺序
    categories: {
      "getting-started": { icon: "rocket_launch" },
      theme: { icon: "palette" },
    },
  },
  settings: { persist: true, storageKey: "akari-docs-settings" },
  search: { shortcut: "k", maxResults: 8, backend: { type: "local" } },
  toc: { maxDepth: 3 },
});
```

```ts
// docs/zh-CN/config.ts（lang 默认取文件夹名）
import { defineAkariConfig } from "../.vitepress/theme/define.ts";

export default defineAkariConfig({
  label: "简体中文",
  title: "Vitepress Theme Akari Docs",
  appBar: { title: "Vitepress Theme Akari Docs" },
  sidebar: {
    categories: {
      "getting-started": { text: "开始" },
      theme: { text: "主题" },
    },
  },
  footer: { message: "基于 VitePress 与 M3E Web Components 构建" },
});
```

文章在导航中的样子写在它 `index.md` 的头部信息中：

```yaml
---
title: 图标        # 导航名称与页面标题，缺省取第一个一级标题
icon: interests
order: 2           # 在分类中的位置
badge: New
tab: 概览          # 本页在标签栏中的标题
parallel:          # 同一文件夹中的平行页面，不显示在侧栏
  - choosing
  - using
---
```

`docs/.vitepress/config.mts` 只负责接入主题：`akariContent(docsDir)` 读取配置文件与目录，生成 `locales`、`rewrites` 与导航；`akariHead()`、`akariMarkdown` 与 `isCustomElement` 的用法见文档的[配置](docs/zh-CN/getting-started/configuration/index.md)页。

### 导航的来源

- 配置了 `sidebar.items` 时使用手写的富配置。
- 否则有语言文件夹时按目录生成。
- 都没有时读取原生 `themeConfig.sidebar`，支持数组或多路径字典，并生成上一页/下一页。
- 导航项字段：`text`、`link`、`icon`、`badge`、`collapsed`、`items`、`tabs`。
- 链接匹配会忽略 base、查询参数、hash、`.html` 与结尾斜杠。

### 设置项

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `color` | `#6750A4` | 动态色种子颜色 |
| `variant` | `tonal-spot` | 色调变体 |
| `scheme` | `auto` | `auto` / `light` / `dark` / `time`（由 rail 底部按钮切换） |
| `contrast` | `standard` | `standard` / `medium` / `high` |
| `motion` | `expressive` | `standard` / `expressive` |
| `direction` | `auto` | `auto` / `ltr` / `rtl`（`auto` 跟随语言配置的 `dir`） |
| `textSize` | `16px` | `16px` / `24px` / `32px` |

可通过 `settings.sections` 控制显示区块及顺序，通过 `settings.defaults` 修改默认值。

## 扩展

### 覆盖组件

配置文件只能写数据，替换组件在主题入口 `docs/.vitepress/theme/index.ts` 的 `enhanceApp` 中进行：

```ts
import { provideAkariComponents } from "./composables/useAkariConfig";
import MyAppBar from "./MyAppBar.vue";

enhanceApp({ app, siteData }) {
  provideAkariSiteData(app, siteData);
  provideAkariComponents(app, { AppBar: MyAppBar });
},
```

可覆盖：`AppBar`、`DesktopNav`、`Sidebar`、`Settings`、`Hero`、`Toc`、`Pager`、`Footer`、`Content`。覆盖组件需保持原根元素语义与无障碍属性。

### 公共 API

主题入口导出：

- `defineAkariConfig` / `defineAkariThemeConfig`
- `provideAkariComponents`
- `useAkariConfig`
- `useAkariSettings`
- `useAkariI18n` / `useAkariLocales`
- `useSidebar`
- `useAkariSearch`
- `registerSearchBackend`
- `AKARI_CONTENT_ID` / `AKARI_SIDEBAR_ID` / `AKARI_SETTINGS_ID`

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
  --akari-doc-gap: 16px;
  --akari-doc-radius: 28px;
  --akari-doc-padding: 32px;
  --akari-doc-top-space: 32px;
  --akari-doc-max-width: 1280px;
  --akari-doc-toc-offset: 128px;
  --akari-doc-nav-gap: 8px;
  --akari-toc-width: 208px;
}
```

颜色优先使用 m3e 注入的 `--md-sys-color-*` 令牌。`styles/tokens.css` 只保存布局变量，不维护静态调色板；Layout 会把当前 `m3e-theme` 的 shell 色令牌同步到根元素，`html`/`body` 通过 `--akari-doc-page-background` 与 `--akari-doc-page-foreground` 随种子色、变体、明暗和对比度更新。

## 已知限制

- VitePress 使用 alpha 版本，主题锁定 `2.0.0-alpha.21`，升级前需重新验证 Web Components SSR 与水合。
- 60+ 组件的全量 API 页不在当前阶段范围内；英文演示只翻译了首页、“开始”一节与国际化页。
- 本地搜索是轻量级子串检索，不提供语义搜索或拼写纠错；可通过 HTTP/注册式后端替换。
- m3e 组件按需注册；在 Markdown 中使用新组件前，需要在 `m3e.ts` 增加对应导入。
- JS 水合前 `html`/`body` 回退到系统 `Canvas` / `CanvasText`；m3e 主题就绪后由动态色板接管。默认种子色 `#6750A4` 与品牌 logo 是固定输入/品牌资产，不参与令牌替换。

## 设计资料

- [设计规格](specs/2026-10-27-vitepress-akari-theme-design.md)
- [实施计划](plans/2026-10-27-vitepress-m3e-theme.md)
