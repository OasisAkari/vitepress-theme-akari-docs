# VitePress M3E 文档主题设计规格

日期：2026-10-27  
状态：已确认  
目标仓库：`/Volumes/DATA/vitepress-akari-docs`

## 1. 背景

仓库当前为空。需要从零初始化一个 VitePress 文档项目，并使用 `@m3e/web` 的 Material 3 Expressive Web Components 重建与官方文档（https://matraic.github.io/m3e/）一致的文档壳：顶部 App Bar、左侧可折叠导航、中间圆角内容面板、右侧目录与设置抽屉。

官方站使用 iframe + 多 HTML 页面。本项目不使用 iframe，改为 VitePress 单页应用（SPA）+ 自定义 Layout，保留 VitePress 的 Markdown、路由、SSG 和代码高亮能力。

## 2. 已确认决策

| 项目 | 决策 |
| --- | --- |
| VitePress | 固定 `2.0.0-alpha.21` |
| M3E | `@m3e/web@2.10.2`，图标 `@m3e/icons` |
| 工程形态 | 单站点项目，主题位于 `docs/.vitepress/theme` |
| 侧边栏 | 双模式：富配置 `themeConfig.m3e.sidebar` 优先，回退原生 `themeConfig.sidebar` |
| 演示文档 | 完整骨架，约 12 页中文页面 |
| 组件覆盖 | 支持通过 `themeConfig.m3e.components` 替换核心组件 |
| 字体与图标 | 本地 Roboto Variable + 按需 SVG 图标，不依赖 Google Fonts CDN |
| 包管理器 | npm（仓库内只保留一套 lockfile） |
| 本阶段非目标 | 60+ 组件页全量复刻、独立 npm 发布、搜索后端、多语言内容 |

## 3. 技术基线

- Node.js `v24.21.0`，npm `12.2.1`，macOS arm64。
- TypeScript，Vue 3.5（由 VitePress alpha.21 锁定）。
- VitePress 使用 Vite 8 / Rolldown。
- m3e 组件是 Lit Web Components，不是 Vue 组件。
- VitePress 配置 `vue.template.compilerOptions.isCustomElement` 放行所有 `m3e-*` 标签。

已完成的可行性验证：临时 VitePress alpha.21 项目可成功 SSR、构建并在浏览器水合 `<m3e-theme>`、`<m3e-content-pane>`、`<m3e-button>`。

## 4. 目录结构

```text
.
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts
│   │   └── theme/
│   │       ├── index.ts
│   │       ├── types.ts
│   │       ├── constants.ts
│   │       ├── config.ts
│   │       ├── settings.ts
│   │       ├── sidebar.ts
│   │       ├── m3e.ts
│   │       ├── icons.ts
│   │       ├── augment.d.ts
│   │       ├── layouts/
│   │       │   └── M3eLayout.vue
│   │       ├── components/
│   │       │   ├── shell/
│   │       │   │   ├── AppBar.vue
│   │       │   │   ├── SocialActions.vue
│   │       │   │   └── BrandMark.vue
│   │       │   ├── sidebar/
│   │       │   │   ├── SidebarNav.vue
│   │       │   │   └── SidebarNavItem.vue
│   │       │   ├── settings/
│   │       │   │   ├── SettingsDrawer.vue
│   │       │   │   └── SettingsSection.vue
│   │       │   └── content/
│   │       │       ├── DocToc.vue
│   │       │       └── DocFooter.vue
│   │       ├── composables/
│   │       │   ├── useM3eConfig.ts
│   │       │   ├── useSettings.ts
│   │       │   └── useSidebar.ts
│   │       └── styles/
│   │           ├── index.css
│   │           ├── tokens.css
│   │           ├── base.css
│   │           ├── shell.css
│   │           ├── prose.css
│   │           └── settings.css
│   ├── index.md
│   ├── getting-started/
│   │   ├── installation.md
│   │   └── configuration.md
│   ├── theme/
│   │   ├── layout.md
│   │   ├── sidebar.md
│   │   ├── settings.md
│   │   └── extending.md
│   ├── styles/
│   │   ├── color.md
│   │   └── typography.md
│   ├── components/
│   │   ├── button.md
│   │   ├── card.md
│   │   └── navigation.md
│   └── public/
│       └── logo.svg
├── tests/
│   ├── config.spec.ts
│   ├── sidebar.spec.ts
│   └── settings.spec.ts
├── specs/
├── plans/
├── package.json
├── tsconfig.json
└── .gitignore
```

## 5. 运行时架构

```text
<m3e-theme>                        动态颜色 / 明暗 / 对比度 / 动效
  <AppBar>                         m3e-app-bar + 菜单/设置开关 + 社交入口
  <m3e-drawer-container>
    <SidebarNav slot="start">      递归 m3e-nav-menu
    <main>                         drawer-container 默认内容
      <m3e-content-pane>           Markdown 内容 + 页脚
      <DocToc>                     m3e-toc
    </main>
    <SettingsDrawer slot="end">    富设置面板
  </m3e-drawer-container>
</m3e-theme>
```

- `body` 高度锁定 `100dvh`，App Bar 固定高度，抽屉容器占满剩余高度。
- 内容区内部滚动，符合官方“应用式文档”体验。
- 不使用 iframe；`Content` 直接渲染在内容面板内。
- 路由切换时重置内容滚动位置，`m3e-toc` 通过 MutationObserver 自动更新。

## 6. 主题配置 API

通过 `augment.d.ts` 扩展 `vitepress` 的 `ThemeConfig`，新增 `m3e?: M3eThemeConfig`。提供 `defineM3eThemeConfig` 辅助函数保持类型推断。

```ts
export interface M3eThemeConfig {
  appBar?: {
    title?: string
    version?: string
    logo?: string
    showSidebarToggle?: boolean
    showSettingsToggle?: boolean
    socialLinks?: Array<{ icon: "github" | "npm" | string; link: string; label: string }>
  }
  sidebar?: {
    items: M3eSidebarItem[] | Record<string, M3eSidebarItem[]>
    width?: number
  }
  settings?: {
    enabled?: boolean
    title?: string
    sections?: SettingsSectionKey[]
    defaults?: Partial<M3eThemeSettings>
    persist?: boolean
    storageKey?: string
  }
  toc?: {
    enabled?: boolean
    maxDepth?: number
    overline?: string
  }
  footer?: {
    message?: string
    copyright?: string
    showPrevNext?: boolean
  }
  components?: Partial<Record<M3eComponentSlot, Component>>
}

export interface M3eSidebarItem {
  text: string
  link?: string
  icon?: string
  badge?: string
  collapsed?: boolean
  items?: M3eSidebarItem[]
}
```

`M3eComponentSlot` 初版包含：`AppBar`、`Sidebar`、`Settings`、`Toc`、`Footer`、`Content`。未提供的槽位使用主题默认组件。

## 7. 侧边栏双模式

归一化函数 `resolveSidebar(themeConfig, routePath)` 执行：

1. 若存在 `themeConfig.m3e.sidebar.items`，使用富配置。
2. 否则读取原生 `themeConfig.sidebar`，转换为 `M3eSidebarItem[]`；原生项中的额外 `icon` / `badge` 字段若存在则保留。
3. 支持数组形式或多路径字典形式；字典按当前路径最长前缀匹配。
4. 自动展开包含当前链接的分组，并设置叶子项 `selected`。
5. 扁平化叶子项，按顺序计算上一页/下一页；同原生 VitePress 一样跳过无链接项。
6. 路由比较时忽略 base、结尾斜杠、hash 与查询参数。

导航链接输出真实 `<a>`，由 VitePress 2 核心在捕获阶段拦截站内点击并调用 `router.go()` 完成 SPA 跳转；该版本已移除 vue-router 与 `RouterLink`。外部链接保持原生行为。

## 8. 设置体系

```ts
export interface M3eThemeSettings {
  color: string                    // 默认 #6750A4
  variant: ThemeVariant            // 默认 tonal-spot
  scheme: "light" | "dark" | "auto"// 默认 auto
  contrast: "standard" | "medium" | "high"
  motion: "standard" | "expressive"
  direction: "ltr" | "rtl"
  textSize: "16px" | "24px" | "32px"
}
```

- 设置页字段及可见区块由 `settings.sections` 控制，默认全部显示，顺序与官方一致：颜色、色调变体、明暗、对比度、动效、方向、字号。
- 色调变体默认 8 个：Tonal Spot、Vibrant、Fidelity、Expressive、Monochrome、Neutral、Rainbow、Fruit Salad；`content` 可作为高级选项在配置中追加。
- 设置写入 `<m3e-theme>` 的 `color` / `variant` / `scheme` / `contrast` / `motion` 属性。
- `direction` 同步到 `document.documentElement.dir`；`textSize` 同步到 `document.documentElement.style.fontSize`。
- 持久化使用 localStorage；读取失败、JSON 损坏、值非法时回退默认值。
- SSR 阶段只使用默认值；客户端 `onMounted` 后再读取存储，避免 hydration mismatch。
- 恢复默认值通过公共 composable 暴露，UI 初版不额外增加按钮，保持与官方一致。

## 9. Web Components 与 SSR

- 主题入口在 `!import.meta.env.SSR` 条件下动态导入 `m3e.ts`，避免 Node 环境执行 `customElements.define`。
- `m3e.ts` 只注册主题与演示实际使用的组件，不导入 `@m3e/web/all`，控制首包体积。
- 图标由 `icons.ts` 逐个导入 `@m3e/icons/outlined/<name>`；新增图标需同时补充注册。
- VitePress 配置放行 `m3e-*` 自定义元素，避免 Vue 编译告警。
- 提供基线设计令牌 CSS（浅色/深色），保证 JS 水合前页面可见且接近最终主题；不使用官方站的 `*:not(:defined){visibility:hidden}` 全量隐藏策略。
- 所有 m3e 组件注册完成后再标记 `data-m3e-ready`，用于轻量过渡，不阻塞内容可读性。

## 10. 视觉与布局规格

- 内容面板：`surface-container-lowest`，圆角 28px，桌面端四周 16px 间距。
- TOC：宽 208px，独立圆角卡片，颜色 `surface-container-lowest`，与内容面板之间 16px 间距。
- 设置抽屉：`surface-container`，内边距 16px，字段纵向间距 16px，超长时内部滚动。
- App Bar：高度由组件决定，容器色 `surface-container-low`，标题 + 版本 Chip + 右侧图标按钮。
- 排版：Roboto Variable；H1 使用 display-large 级别，H2 headline-medium，H3 headline-small，正文 body-large。
- 桌面断点（≥1008px）：左抽屉与设置抽屉可并排展开，内容随之伸缩。
- 移动端（<600px）：抽屉变为覆盖模式，TOC 隐藏，内容面板贴边并保留顶部圆角。
- 所有颜色、间距、圆角优先使用 `--md-sys-color-*` 与 m3e CSS 变量，允许用户覆盖。
- 正文支持：标题锚点、代码块与复制按钮、表格、引用、提示容器、任务列表、图片圆角。
- 代码复制复用 VitePress 核心注入的 `button.copy` 与全局点击处理，主题只负责视觉样式，不替换该按钮节点。

## 11. 演示文档

12 页内容必须真实展示主题能力：

1. `index.md`：概览 + 特性卡片 + 快速入口。
2. `getting-started/installation.md`：安装与启动。
3. `getting-started/configuration.md`：站点与主题配置。
4. `theme/layout.md`：应用壳、App Bar、内容面板、TOC。
5. `theme/sidebar.md`：双模式侧边栏与富配置示例。
6. `theme/settings.md`：设置面板字段与持久化。
7. `theme/extending.md`：组件覆盖、公共 composable、CSS 变量。
8. `styles/color.md`：动态色、变体、令牌展示。
9. `styles/typography.md`：排版层级与示例。
10. `components/button.md`：m3e 按钮与图标按钮演示。
11. `components/card.md`：卡片变体与内容组合。
12. `components/navigation.md`：导航菜单、标签页、面包屑等演示。

文档代码块中的 m3e 示例必须能直接运行，避免伪代码。

## 12. 测试与验收

### 自动检查

- `npm run build`：VitePress 客户端 + SSR 构建成功。
- `npm run typecheck`：`vue-tsc --noEmit` 无错误。
- `npm run test`：Vitest 通过。
- 单元测试覆盖：配置默认值合并、双模式侧边栏解析、多路径选择、上一页/下一页、激活链接匹配、设置校验与持久化回退。

### 浏览器验收

- 桌面 1440×960、1600×1000，移动 390×844。
- 顶栏菜单按钮开合侧边栏；齿轮按钮开合设置抽屉；遮罩点击关闭移动端抽屉。
- 路由跳转后侧边栏高亮正确、分组展开、内容滚动归零、TOC 更新。
- 设置面板所有控件生效，刷新后保持；非法存储值不会导致崩溃。
- 浅色/深色/跟随系统、RTL、200% 字号可用。
- 代码复制按钮、上一页/下一页、移动端 TOC 隐藏符合预期。
- 浏览器控制台无 Vue 自定义元素警告、hydration mismatch 或未捕获错误。

### 视觉验收

对照官方文档截图检查：App Bar 结构、左抽屉、内容卡圆角与留白、TOC 卡、设置面板密度、字体与色彩层级。

## 13. 风险与缓解

| 风险 | 缓解 |
| --- | --- |
| VitePress alpha 版本 API 不稳定 | 锁定版本，不在开发中升级 |
| Web Components 在 SSR/水合阶段异常 | 客户端注册 + 已完成的最小沙盒验证 + 水合后浏览器测试 |
| m3e 组件样式与官方 iframe 布局差异 | 先复刻内容面板/TOC/抽屉结构，再按截图微调 |
| 图标模块名与配置不一致 | 集中 `icons.ts` 注册表，文档明确新增流程 |
| 首屏动态色闪烁 | 提供浅/深基线令牌与轻量就绪状态 |
| 并行代理文件冲突 | 主线程先冻结契约，代理仅修改各自文件清单 |

## 14. 并行交付

主线程负责：脚手架、依赖、类型与配置契约、`config.ts` / `settings.ts` / `sidebar.ts` 纯函数、`useM3eConfig` / `useSidebar`、Layout 总装、构建与最终验收。

并行代理及文件所有权：

1. 壳层代理：`components/shell/*`、`components/sidebar/*`。
2. 设置代理：`components/settings/*`、`composables/useSettings.ts`。
3. 内容代理：`components/content/*`、`styles/prose.css`。
4. 文档代理：`docs/**/*.md`（不改配置与主题源码）。
5. 测试代理：`tests/**`，只读主题源码。

任何代理不得修改 `package.json`、`docs/.vitepress/config.mts`、`types.ts`、`config.ts`、`index.ts`、`M3eLayout.vue`。如需契约变更，向主线程报告。

## 15. 实施修订

实现过程中发现并确认了以下与初版设计的差异：

- **RouterLink 不存在**：VitePress `2.0.0-alpha.21` 移除了 vue-router 与 `RouterLink`。侧边栏、页脚与文档示例统一输出真实 `<a>`，依赖 VitePress 核心的全局捕获拦截实现 SPA；需要脚本跳转时使用 `useRouter().go()`。
- **TOC 数据来源**：开启 `markdown.headers: { level: [2, 3] }`，使 `page.headers` 在 SSR 阶段可用；TOC 可见性不再依赖客户端 DOM 计数。`m3e-toc` 仍从渲染后的标题生成条目，因此与官方一致包含 H1 条目。
- **侧边栏初始展开**：m3e 的 `m3e-collapsible` 在“首次渲染即 open”且容器尚未布局时可能保持 0 高度。侧边栏在 `m3e-ready` 后通过公开 `open` 属性恢复展开；`collapsed: false` 的分组默认展开，包含当前页面的分组始终展开。
- **侧边栏高亮**：分组只管理 `open`，不手动设置 `selected`，避免单选菜单取消当前叶子项选中；叶子项由 `isActive` 控制。
- **主题属性同步**：Vue 对已升级的自定义元素写入 property，不会自动更新 attribute。Layout 在设置变化后显式同步 `color` / `variant` / `scheme` / `contrast` / `motion` 属性，保证 CSS 属性选择器与调试状态一致。
- **页面级主题**：由于 `m3e-theme` 位于 VitePress `#app` 内，官方针对 `<body>` 的全局样式不会自动执行。Layout 同步计算后的页面背景、前景、`html.dark` 与 `color-scheme`。
- **移动端内容内边距**：`--m3e-content-pane-container-padding` 只接受单值；移动端使用 `20px`，避免内容贴边。
- **404**：自定义 Layout 增加 404 内容状态，保留应用壳与导航。
- **代码 LTR**：RTL 模式下代码块与行内代码强制 `direction: ltr` 与 bidi 隔离。

## 16. 完成定义

- 上述 12 页可通过侧边栏完整访问。
- 主题可仅通过配置改变标题、版本、社交链接、侧边栏、设置项可见性和 TOC 行为。
- 核心组件可按配置覆盖，至少一个演示页面展示扩展方式。
- 自动检查与浏览器验收全部通过。
- README 提供安装、开发、构建、配置与扩展说明。
