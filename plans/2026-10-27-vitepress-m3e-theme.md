# VitePress M3E 文档主题实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从空仓库初始化 VitePress `2.0.0-alpha.21` 文档站，交付一个仿 m3e 官方文档、模块化、可配置侧边栏与右侧设置面板的 M3E 主题，并附 12 页中文演示文档。

**Architecture:** 主题位于 `docs/.vitepress/theme`，使用自定义 `M3eLayout` 组合 `m3e-app-bar`、`m3e-drawer-container`、`m3e-nav-menu`、`m3e-content-pane`、`m3e-toc` 与设置抽屉。配置由 `themeConfig.m3e` 驱动，侧边栏支持富配置与 VitePress 原生配置双模式。m3e Web Components 仅在客户端注册，Markdown 内容仍由 VitePress SSR 输出。

**Tech Stack:** VitePress 2.0.0-alpha.21, Vue 3.5, TypeScript 5.9, `@m3e/web@2.10.2`, `@m3e/icons@1.0.21`, `@fontsource-variable/roboto`, Vitest 5, npm.

**Spec:** `specs/2026-10-27-vitepress-m3e-theme-design.md`

## Implementation Revisions (2026-10-27)

执行期间确认的修正，后续读者以此为准：

- VitePress 2 alpha 已移除 `RouterLink`；所有内部导航使用真实 `<a>`，由核心全局点击拦截完成 SPA。
- 开启 `markdown.headers` 获取 SSR TOC 数据；TOC 仍包含 H1 条目，与官方一致。
- `collapsed: false` 分组默认展开；包含当前页面的分组始终展开。
- 分组只控制 `open`，不再手动设置 `selected`，以免取消叶子项选中。
- 侧边栏在 `m3e-ready` 后恢复展开，绕过 m3e collapsible 首次 open 高度为 0 的问题。
- Layout 显式同步 `m3e-theme` 属性与页面级背景、`html.dark`、`color-scheme`。
- 增加 404 内容状态、RTL 代码 LTR 隔离、移动端单值内容内边距。

## Global Constraints

- 锁定 `vitepress@2.0.0-alpha.21`、`@m3e/web@2.10.2`、`@m3e/icons@1.0.21`；开发过程中不升级。
- 只使用 npm；不新增第二个 lockfile，不修改包管理器配置。
- 主题 UI 与演示文档使用中文；代码标识符与注释使用英文。
- 不导入 `@m3e/web/all`；只导入实际使用的组件模块。
- 不依赖 Google Fonts CDN；正文字体使用本地 `@fontsource-variable/roboto`，图标使用 `@m3e/icons` 逐个注册。
- m3e Web Components 只在 `!import.meta.env.SSR` 时动态导入注册。
- 所有 `m3e-*` 标签通过 VitePress 的 `vue.template.compilerOptions.isCustomElement` 放行。
- 不使用 iframe；内容直接在 `m3e-content-pane` 内渲染。
- 代码复制按钮复用 VitePress 注入的 `button.copy`，不要替换其 DOM 节点。
- 子代理不得修改 `package.json`、`package-lock.json`、`docs/.vitepress/config.mts`、`types.ts`、`config.ts`、`settings.ts`、`sidebar.ts`、`index.ts`、`layouts/M3eLayout.vue`，除非任务明确列出。
- 不创建 git commit；用户自行决定提交时机。
- 所有代理完成后由主线程统一构建、浏览器验收与修复。

---

## 文件责任图

| 区域 | 文件 | 负责人 |
| --- | --- | --- |
| 工具链 | `package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore` | 主线程 |
| 主题契约 | `docs/.vitepress/theme/types.ts`, `constants.ts`, `settings.ts`, `sidebar.ts`, `config.ts`, `augment.d.ts` | 主线程 |
| 组件与图标注册 | `docs/.vitepress/theme/m3e.ts`, `icons.ts`, `index.ts` | 主线程 |
| 组合式函数 | `composables/useM3eConfig.ts`, `useSidebar.ts` | 主线程 |
| 设置状态 | `composables/useSettings.ts` | 设置代理（主线程提供接口） |
| 总装 | `layouts/M3eLayout.vue` | 主线程 |
| 基线样式 | `styles/index.css`, `tokens.css`, `base.css`, `shell.css` | 主线程 |
| 壳层 | `components/shell/*`, `components/sidebar/*` | 壳层代理 |
| 设置 UI | `components/settings/*`, `styles/settings.css` | 设置代理 |
| 内容 UI | `components/content/*`, `styles/prose.css` | 内容代理 |
| 演示文档 | `docs/**/*.md`, `docs/public/*` | 文档代理 |
| 测试 | `tests/**` | 测试代理 |
| 站点配置 | `docs/.vitepress/config.mts` | 主线程 |

---

## Task 1: 项目脚手架与工具链

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `docs/public/logo.svg`

**Interfaces:**
- Produces: npm scripts `dev` / `build` / `preview` / `typecheck` / `test`，以及已安装的固定依赖。

- [ ] **Step 1: 写入 `package.json`**

```json
{
  "name": "vitepress-akari-docs",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@fontsource-variable/roboto": "^5.3.0",
    "@m3e/icons": "1.0.21",
    "@m3e/web": "2.10.2"
  },
  "devDependencies": {
    "@types/node": "^24.19.2",
    "typescript": "5.9.3",
    "vitepress": "2.0.0-alpha.21",
    "vitest": "5.0.5",
    "vue": "^3.5.43",
    "vue-tsc": "3.3.13"
  }
}
```

- [ ] **Step 2: 安装依赖**

Run: `npm install --no-audit --no-fund`
Expected: 生成唯一 `package-lock.json`，无安装错误。

- [ ] **Step 3: 写入 `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["node", "vite/client"]
  },
  "include": [
    "docs/.vitepress/**/*.ts",
    "docs/.vitepress/**/*.d.ts",
    "docs/.vitepress/**/*.vue",
    "tests/**/*.ts"
  ],
  "exclude": ["node_modules", "docs/.vitepress/dist", "docs/.vitepress/cache"]
}
```

- [ ] **Step 4: 写入 `.gitignore`**

```gitignore
node_modules
docs/.vitepress/dist
docs/.vitepress/cache
.DS_Store
*.log
.vitest
```

- [ ] **Step 5: 创建品牌占位图形 `docs/public/logo.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="M3E Docs">
  <rect width="64" height="64" rx="18" fill="#6750A4"/>
  <path d="M17 44V20h8l7 12 7-12h8v24h-7V32l-8 13-8-13v12z" fill="#FEF7FF"/>
</svg>
```

- [ ] **Step 6: 验证版本**

Run: `npx vitepress --version && npm run typecheck`
Expected: `2.0.0-alpha.21`；typecheck 暂无源码，正常退出。

---

## Task 2: 类型、常量与纯设置模块

**Files:**
- Create: `docs/.vitepress/theme/types.ts`
- Create: `docs/.vitepress/theme/constants.ts`
- Create: `docs/.vitepress/theme/settings.ts`
- Create: `docs/.vitepress/theme/augment.d.ts`

**Interfaces:**
- Produces: `M3eThemeSettings`, `M3eThemeConfig`, `M3eSidebarItem`, `ResolvedM3eThemeConfig`, `SettingsSectionKey`, `M3eSettingsApi` 类型。
- Produces: `DEFAULT_SETTINGS`, `DEFAULT_SECTION_LABELS`, `SETTINGS_SECTION_KEYS`, `VARIANT_OPTIONS`, `SCHEME_OPTIONS`, `CONTRAST_OPTIONS`, `MOTION_OPTIONS`, `DIRECTION_OPTIONS`, `TEXT_SIZE_OPTIONS`, `SETTINGS_STORAGE_KEY`, `M3E_CONTENT_ID`, `M3E_SIDEBAR_ID`, `M3E_SETTINGS_ID`。
- Produces: `normalizeSettings()`, `mergeSettings()`, `parseStoredSettings()`, `readStoredSettings()`, `writeStoredSettings()`。

- [ ] **Step 1: 写入 `types.ts`**

```ts
import type { Component } from "vue";

export type M3eThemeVariant =
  | "tonal-spot"
  | "vibrant"
  | "fidelity"
  | "expressive"
  | "monochrome"
  | "neutral"
  | "rainbow"
  | "fruit-salad";

export type M3eColorScheme = "light" | "dark" | "auto";
export type M3eContrastLevel = "standard" | "medium" | "high";
export type M3eMotionScheme = "standard" | "expressive";
export type M3eDirection = "ltr" | "rtl";
export type M3eTextSize = "16px" | "24px" | "32px";

export type SettingsSectionKey =
  | "color"
  | "variant"
  | "scheme"
  | "contrast"
  | "motion"
  | "direction"
  | "textSize";

export interface M3eThemeSettings {
  color: string;
  variant: M3eThemeVariant;
  scheme: M3eColorScheme;
  contrast: M3eContrastLevel;
  motion: M3eMotionScheme;
  direction: M3eDirection;
  textSize: M3eTextSize;
}

export interface M3eSidebarItem {
  text: string;
  link?: string;
  icon?: string;
  badge?: string;
  collapsed?: boolean;
  items?: M3eSidebarItem[];
}

export type M3eSidebarItems =
  | M3eSidebarItem[]
  | Record<string, M3eSidebarItem[]>;

export interface M3eSocialLink {
  icon: string;
  link: string;
  label: string;
}

export interface M3eAppBarConfig {
  title?: string;
  version?: string;
  logo?: string;
  showSidebarToggle?: boolean;
  showSettingsToggle?: boolean;
  socialLinks?: M3eSocialLink[];
}

export interface M3eSidebarConfig {
  items?: M3eSidebarItems;
  width?: number;
}

export interface M3eSettingsConfig {
  enabled?: boolean;
  title?: string;
  sections?: SettingsSectionKey[];
  labels?: Partial<Record<SettingsSectionKey, string>>;
  defaults?: Partial<M3eThemeSettings>;
  persist?: boolean;
  storageKey?: string;
}

export interface M3eTocConfig {
  enabled?: boolean;
  maxDepth?: number;
  overline?: string;
}

export interface M3eFooterConfig {
  message?: string;
  copyright?: string;
  showPrevNext?: boolean;
}

export type M3eComponentSlot =
  | "AppBar"
  | "Sidebar"
  | "Settings"
  | "Toc"
  | "Footer"
  | "Content";

export interface M3eThemeConfig {
  appBar?: M3eAppBarConfig;
  sidebar?: M3eSidebarConfig;
  settings?: M3eSettingsConfig;
  toc?: M3eTocConfig;
  footer?: M3eFooterConfig;
  components?: Partial<Record<M3eComponentSlot, Component>>;
}

export interface ResolvedSidebarConfig {
  source: "m3e" | "native";
  m3eItems?: M3eSidebarItems;
  nativeItems?: unknown;
  width: number;
}

export interface ResolvedM3eThemeConfig {
  appBar: {
    title: string;
    version?: string;
    logo?: string;
    showSidebarToggle: boolean;
    showSettingsToggle: boolean;
    socialLinks: M3eSocialLink[];
  };
  sidebar: ResolvedSidebarConfig;
  settings: {
    enabled: boolean;
    title: string;
    sections: SettingsSectionKey[];
    labels: Record<SettingsSectionKey, string>;
    defaults: M3eThemeSettings;
    persist: boolean;
    storageKey: string;
  };
  toc: {
    enabled: boolean;
    maxDepth: number;
    overline: string;
  };
  footer: {
    message: string;
    copyright: string;
    showPrevNext: boolean;
  };
  components: Partial<Record<M3eComponentSlot, Component>>;
}

export interface M3eSettingsApi {
  settings: M3eThemeSettings;
  sections: SettingsSectionKey[];
  labels: Record<SettingsSectionKey, string>;
  defaults: M3eThemeSettings;
  setSetting<K extends keyof M3eThemeSettings>(
    key: K,
    value: M3eThemeSettings[K],
  ): void;
  reset(): void;
  isDefault(): boolean;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
```

- [ ] **Step 2: 写入 `constants.ts`**

```ts
import type {
  M3eColorScheme,
  M3eContrastLevel,
  M3eDirection,
  M3eMotionScheme,
  M3eTextSize,
  M3eThemeSettings,
  M3eThemeVariant,
  SettingsSectionKey,
} from "./types";

export const M3E_CONTENT_ID = "m3e-doc-content";
export const M3E_SIDEBAR_ID = "m3e-sidebar";
export const M3E_SETTINGS_ID = "m3e-settings";
export const SETTINGS_STORAGE_KEY = "m3e-docs-settings";

export const SETTINGS_SECTION_KEYS: SettingsSectionKey[] = [
  "color",
  "variant",
  "scheme",
  "contrast",
  "motion",
  "direction",
  "textSize",
];

export const DEFAULT_SECTION_LABELS: Record<SettingsSectionKey, string> = {
  color: "颜色",
  variant: "色调变体",
  scheme: "明暗模式",
  contrast: "对比度",
  motion: "动效",
  direction: "文字方向",
  textSize: "字号",
};

export const DEFAULT_SETTINGS: M3eThemeSettings = {
  color: "#6750A4",
  variant: "tonal-spot",
  scheme: "auto",
  contrast: "standard",
  motion: "expressive",
  direction: "ltr",
  textSize: "16px",
};

export const VARIANT_VALUES: M3eThemeVariant[] = [
  "tonal-spot",
  "vibrant",
  "fidelity",
  "expressive",
  "monochrome",
  "neutral",
  "rainbow",
  "fruit-salad",
];

export const VARIANT_OPTIONS: ReadonlyArray<{
  value: M3eThemeVariant;
  label: string;
}> = [
  { value: "tonal-spot", label: "Tonal Spot" },
  { value: "vibrant", label: "Vibrant" },
  { value: "fidelity", label: "Fidelity" },
  { value: "expressive", label: "Expressive" },
  { value: "monochrome", label: "Monochrome" },
  { value: "neutral", label: "Neutral" },
  { value: "rainbow", label: "Rainbow" },
  { value: "fruit-salad", label: "Fruit Salad" },
];

export const SCHEME_VALUES: M3eColorScheme[] = ["light", "auto", "dark"];

export const SCHEME_OPTIONS: ReadonlyArray<{
  value: M3eColorScheme;
  label: string;
  icon: string;
}> = [
  { value: "light", label: "浅色", icon: "light_mode" },
  { value: "auto", label: "跟随系统", icon: "settings_brightness" },
  { value: "dark", label: "深色", icon: "dark_mode" },
];

export const CONTRAST_VALUES: M3eContrastLevel[] = [
  "standard",
  "medium",
  "high",
];

export const CONTRAST_OPTIONS: ReadonlyArray<{
  value: M3eContrastLevel;
  label: string;
}> = [
  { value: "standard", label: "默认" },
  { value: "medium", label: "中等" },
  { value: "high", label: "高" },
];

export const MOTION_VALUES: M3eMotionScheme[] = ["standard", "expressive"];

export const MOTION_OPTIONS: ReadonlyArray<{
  value: M3eMotionScheme;
  label: string;
}> = [
  { value: "standard", label: "标准" },
  { value: "expressive", label: "表现力" },
];

export const DIRECTION_VALUES: M3eDirection[] = ["ltr", "rtl"];

export const DIRECTION_OPTIONS: ReadonlyArray<{
  value: M3eDirection;
  label: string;
  icon: string;
}> = [
  { value: "ltr", label: "从左到右", icon: "format_textdirection_l_to_r" },
  { value: "rtl", label: "从右到左", icon: "format_textdirection_r_to_l" },
];

export const TEXT_SIZE_VALUES: M3eTextSize[] = ["16px", "24px", "32px"];

export const TEXT_SIZE_OPTIONS: ReadonlyArray<{
  value: M3eTextSize;
  label: string;
}> = [
  { value: "16px", label: "100%" },
  { value: "24px", label: "150%" },
  { value: "32px", label: "200%" },
];
```

- [ ] **Step 3: 写入 `settings.ts`**

```ts
import {
  CONTRAST_VALUES,
  DEFAULT_SETTINGS,
  DIRECTION_VALUES,
  MOTION_VALUES,
  SCHEME_VALUES,
  TEXT_SIZE_VALUES,
  VARIANT_VALUES,
} from "./constants";
import type { M3eThemeSettings, StorageLike } from "./types";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function copySettings(settings: M3eThemeSettings): M3eThemeSettings {
  return { ...settings };
}

function includes<T extends string>(values: T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function normalizeSettings(
  input: unknown,
  defaults: M3eThemeSettings = DEFAULT_SETTINGS,
): M3eThemeSettings {
  const source =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  return {
    color:
      typeof source.color === "string" && HEX_COLOR.test(source.color)
        ? source.color.toLowerCase()
        : defaults.color,
    variant: includes(VARIANT_VALUES, source.variant)
      ? source.variant
      : defaults.variant,
    scheme: includes(SCHEME_VALUES, source.scheme)
      ? source.scheme
      : defaults.scheme,
    contrast: includes(CONTRAST_VALUES, source.contrast)
      ? source.contrast
      : defaults.contrast,
    motion: includes(MOTION_VALUES, source.motion)
      ? source.motion
      : defaults.motion,
    direction: includes(DIRECTION_VALUES, source.direction)
      ? source.direction
      : defaults.direction,
    textSize: includes(TEXT_SIZE_VALUES, source.textSize)
      ? source.textSize
      : defaults.textSize,
  };
}

export function mergeSettings(
  base: M3eThemeSettings,
  overrides?: Partial<M3eThemeSettings> | null,
): M3eThemeSettings {
  return normalizeSettings({ ...base, ...overrides }, base);
}

export function parseStoredSettings(
  raw: string | null,
  defaults: M3eThemeSettings = DEFAULT_SETTINGS,
): M3eThemeSettings {
  if (!raw) return copySettings(defaults);

  try {
    return normalizeSettings(JSON.parse(raw), defaults);
  } catch {
    return copySettings(defaults);
  }
}

export function readStoredSettings(
  storage: StorageLike | undefined,
  key: string,
  defaults: M3eThemeSettings = DEFAULT_SETTINGS,
): M3eThemeSettings {
  if (!storage) return copySettings(defaults);

  try {
    return parseStoredSettings(storage.getItem(key), defaults);
  } catch {
    return copySettings(defaults);
  }
}

export function writeStoredSettings(
  storage: StorageLike | undefined,
  key: string,
  settings: M3eThemeSettings,
): void {
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(settings));
  } catch {
    // Storage may be unavailable in private mode or when quota is exhausted.
  }
}
```

- [ ] **Step 4: 写入 `augment.d.ts`**

```ts
import type { M3eThemeConfig } from "./types";

declare module "vitepress" {
  namespace DefaultTheme {
    interface Config {
      m3e?: M3eThemeConfig;
    }
  }
}

export {};
```

- [ ] **Step 5: 验证类型**

Run: `npm run typecheck`
Expected: 通过；若 `DefaultTheme` 命名空间无法增强，改用站点配置处显式交叉类型 `DefaultTheme.Config & { m3e?: M3eThemeConfig }`，不要改成 `any`。

---

## Task 3: 配置归一化与侧边栏解析

**Files:**
- Create: `docs/.vitepress/theme/config.ts`
- Create: `docs/.vitepress/theme/sidebar.ts`

**Interfaces:**
- Consumes: Task 2 的常量和类型。
- Produces: `defineM3eThemeConfig(config: M3eThemeConfig): M3eThemeConfig`
- Produces: `resolveM3eConfig(themeConfig: ThemeConfigLike, site?: { title?: string }): ResolvedM3eThemeConfig`
- Produces: `resolveSidebarItems(config: ResolvedSidebarConfig, path: string, base?: string): M3eSidebarItem[]`
- Produces: `isActiveLink(currentPath: string, target: string, base?: string): boolean`
- Produces: `hasActiveItem(item: M3eSidebarItem, currentPath: string, base?: string): boolean`
- Produces: `flattenSidebar(items: M3eSidebarItem[]): M3eSidebarItem[]`
- Produces: `findPrevNext(items: M3eSidebarItem[], currentPath: string, base?: string): { prev?: M3eSidebarItem; next?: M3eSidebarItem }`
- Produces: `normalizePath(path: string, base?: string): string`

- [ ] **Step 1: 写入 `config.ts`**

```ts
import {
  DEFAULT_SECTION_LABELS,
  DEFAULT_SETTINGS,
  SETTINGS_SECTION_KEYS,
  SETTINGS_STORAGE_KEY,
} from "./constants";
import { mergeSettings } from "./settings";
import type {
  M3eSocialLink,
  M3eThemeConfig,
  ResolvedM3eThemeConfig,
  SettingsSectionKey,
} from "./types";

interface ThemeConfigLike {
  logo?: string;
  sidebar?: unknown;
  m3e?: M3eThemeConfig;
}

export function defineM3eThemeConfig(config: M3eThemeConfig): M3eThemeConfig {
  return config;
}

function normalizeSections(
  value: SettingsSectionKey[] | undefined,
): SettingsSectionKey[] {
  if (!Array.isArray(value)) return [...SETTINGS_SECTION_KEYS];

  const filtered = value.filter((key): key is SettingsSectionKey =>
    SETTINGS_SECTION_KEYS.includes(key),
  );
  const unique = [...new Set(filtered)];
  return unique.length ? unique : [...SETTINGS_SECTION_KEYS];
}

function normalizeSocialLinks(value: M3eSocialLink[] | undefined): M3eSocialLink[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is M3eSocialLink =>
      !!item &&
      typeof item.icon === "string" &&
      typeof item.link === "string" &&
      typeof item.label === "string",
  );
}

export function resolveM3eConfig(
  themeConfig: ThemeConfigLike = {},
  site: { title?: string } = {},
): ResolvedM3eThemeConfig {
  const m3e = themeConfig.m3e ?? {};
  const appBar = m3e.appBar ?? {};
  const settings = m3e.settings ?? {};
  const toc = m3e.toc ?? {};
  const footer = m3e.footer ?? {};

  const m3eSidebarItems = m3e.sidebar?.items;
  const hasM3eSidebar =
    !!m3eSidebarItems &&
    (Array.isArray(m3eSidebarItems) ||
      (typeof m3eSidebarItems === "object" &&
        Object.keys(m3eSidebarItems).length > 0));

  const width = Number.isFinite(m3e.sidebar?.width)
    ? Math.min(400, Math.max(240, Number(m3e.sidebar?.width)))
    : 320;

  const maxDepth = Number.isInteger(toc.maxDepth)
    ? Math.min(6, Math.max(1, Number(toc.maxDepth)))
    : 3;

  return {
    appBar: {
      title: appBar.title ?? site.title ?? "Documentation",
      version: appBar.version,
      logo: appBar.logo ?? themeConfig.logo,
      showSidebarToggle: appBar.showSidebarToggle ?? true,
      showSettingsToggle: appBar.showSettingsToggle ?? true,
      socialLinks: normalizeSocialLinks(appBar.socialLinks),
    },
    sidebar: {
      source: hasM3eSidebar ? "m3e" : "native",
      m3eItems: hasM3eSidebar ? m3eSidebarItems : undefined,
      nativeItems: themeConfig.sidebar,
      width,
    },
    settings: {
      enabled: settings.enabled ?? true,
      title: settings.title ?? "设置",
      sections: normalizeSections(settings.sections),
      labels: { ...DEFAULT_SECTION_LABELS, ...settings.labels },
      defaults: mergeSettings(DEFAULT_SETTINGS, settings.defaults),
      persist: settings.persist ?? true,
      storageKey: settings.storageKey ?? SETTINGS_STORAGE_KEY,
    },
    toc: {
      enabled: toc.enabled ?? true,
      maxDepth,
      overline: toc.overline ?? "本页内容",
    },
    footer: {
      message: footer.message ?? "基于 VitePress 与 M3E 构建",
      copyright: footer.copyright ?? "",
      showPrevNext: footer.showPrevNext ?? true,
    },
    components: m3e.components ?? {},
  };
}
```

- [ ] **Step 2: 写入 `sidebar.ts`**

```ts
import type {
  M3eSidebarItem,
  M3eSidebarItems,
  ResolvedSidebarConfig,
} from "./types";

interface NativeSidebarItem {
  text?: string;
  link?: string;
  items?: NativeSidebarItem[];
  collapsed?: boolean;
  base?: string;
  icon?: string;
  badge?: string;
}

type NativeSidebarItems =
  | NativeSidebarItem[]
  | Record<string, NativeSidebarItem[]>;

function stripQueryAndHash(input: string): string {
  return input.split(/[?#]/)[0] ?? "";
}

export function normalizePath(input: string, base = "/"): string {
  let path = stripQueryAndHash(input || "/");
  const normalizedBase =
    base === "/" ? "" : stripQueryAndHash(base).replace(/\/+$/, "");

  if (
    normalizedBase &&
    (path === normalizedBase || path.startsWith(`${normalizedBase}/`))
  ) {
    path = path.slice(normalizedBase.length) || "/";
  }

  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\.html$/, "");
  if (path.length > 1) path = path.replace(/\/+$/, "");

  return path || "/";
}

export function isExternalLink(link: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(link) && !link.startsWith("/");
}

function joinLink(base: string, link: string): string {
  if (!link || isExternalLink(link) || link.startsWith("/") || link.startsWith("#")) {
    return link;
  }

  const prefix = base.replace(/\/+$/, "");
  return `${prefix}/${link.replace(/^\/+/, "")}`;
}

function pickItems<T>(
  config: T[] | Record<string, T[]>,
  path: string,
  base: string,
): T[] {
  if (Array.isArray(config)) return config;

  const current = normalizePath(path, base);
  const entries = Object.entries(config)
    .map(([key, items]) => ({ key: normalizePath(key, base), items }))
    .sort((a, b) => b.key.length - a.key.length);

  const match = entries.find(({ key }) =>
    key === "/"
      ? current.startsWith("/")
      : current === key || current.startsWith(`${key}/`),
  );

  return match?.items ?? [];
}

function normalizeNativeItems(
  items: NativeSidebarItem[],
  parentBase = "",
): M3eSidebarItem[] {
  return items.map((item) => {
    const childBase = item.base ? joinLink(parentBase, item.base) : parentBase;
    const children = Array.isArray(item.items)
      ? normalizeNativeItems(item.items, childBase)
      : undefined;

    return {
      text: item.text ?? item.link ?? "",
      link: item.link ? joinLink(parentBase, item.link) : undefined,
      icon: item.icon,
      badge: item.badge,
      collapsed: item.collapsed,
      ...(children ? { items: children } : {}),
    };
  });
}

function isNativeSidebar(value: unknown): value is NativeSidebarItems {
  return Array.isArray(value) || (!!value && typeof value === "object");
}

export function resolveSidebarItems(
  config: ResolvedSidebarConfig,
  path: string,
  base = "/",
): M3eSidebarItem[] {
  if (config.source === "m3e" && config.m3eItems) {
    return pickItems<M3eSidebarItem>(config.m3eItems, path, base);
  }

  if (!isNativeSidebar(config.nativeItems)) return [];

  return normalizeNativeItems(
    pickItems<NativeSidebarItem>(config.nativeItems, path, base),
  );
}

export function isActiveLink(
  currentPath: string,
  target: string,
  base = "/",
): boolean {
  if (!target || isExternalLink(target) || target.startsWith("#")) return false;
  return normalizePath(currentPath, base) === normalizePath(target, base);
}

export function hasActiveItem(
  item: M3eSidebarItem,
  currentPath: string,
  base = "/",
): boolean {
  if (item.link && isActiveLink(currentPath, item.link, base)) return true;
  return item.items?.some((child) => hasActiveItem(child, currentPath, base)) ?? false;
}

export function flattenSidebar(items: M3eSidebarItem[]): M3eSidebarItem[] {
  const result: M3eSidebarItem[] = [];

  for (const item of items) {
    if (item.link) result.push(item);
    if (item.items) result.push(...flattenSidebar(item.items));
  }

  return result;
}

export function findPrevNext(
  items: M3eSidebarItem[],
  currentPath: string,
  base = "/",
): { prev?: M3eSidebarItem; next?: M3eSidebarItem } {
  const flat = flattenSidebar(items);
  const index = flat.findIndex(
    (item) => item.link && isActiveLink(currentPath, item.link, base),
  );

  if (index < 0) return {};

  return {
    prev: index > 0 ? flat[index - 1] : undefined,
    next: index < flat.length - 1 ? flat[index + 1] : undefined,
  };
}
```

- [ ] **Step 3: 验证类型**

Run: `npm run typecheck`
Expected: 通过。若 `NativeSidebarItems` 有未使用告警，保持类型导出或在测试中使用，不要删除分支逻辑。

---

## Task 4: Vue 组合式函数、组件注册与主题入口

**Files:**
- Create: `docs/.vitepress/theme/composables/useM3eConfig.ts`
- Create: `docs/.vitepress/theme/composables/useSidebar.ts`
- Create: `docs/.vitepress/theme/composables/useSettings.ts`（主线程提供可运行版本，设置代理后续增强）
- Create: `docs/.vitepress/theme/m3e.ts`
- Create: `docs/.vitepress/theme/icons.ts`
- Create: `docs/.vitepress/theme/index.ts`

**Interfaces:**
- Consumes: Task 2、Task 3 的函数与类型。
- Produces: `provideM3eConfig()`, `useM3eConfig()`, `provideM3eSettings()`, `useM3eSettings()`, `useSidebar()`。
- Produces: 客户端 m3e 组件与图标注册，副作用导入 `./m3e` 后生效。

- [ ] **Step 1: 写入 `useM3eConfig.ts`**

```ts
import { computed, inject, provide, type ComputedRef, type InjectionKey } from "vue";
import { useData } from "vitepress";

import { resolveM3eConfig } from "../config";
import type { ResolvedM3eThemeConfig } from "../types";

const m3eConfigKey: InjectionKey<ComputedRef<ResolvedM3eThemeConfig>> =
  Symbol("m3e-config");

export function provideM3eConfig(): ComputedRef<ResolvedM3eThemeConfig> {
  const { themeConfig, site } = useData();
  const config = computed(() =>
    resolveM3eConfig(themeConfig.value, { title: site.value.title }),
  );

  provide(m3eConfigKey, config);
  return config;
}

export function useM3eConfig(): ComputedRef<ResolvedM3eThemeConfig> {
  const config = inject(m3eConfigKey);

  if (!config) {
    throw new Error(
      "[vitepress-theme-m3e] useM3eConfig() must be called inside M3eLayout.",
    );
  }

  return config;
}
```

- [ ] **Step 2: 写入 `useSidebar.ts`**

```ts
import { computed } from "vue";
import { useData, useRoute } from "vitepress";

import {
  findPrevNext,
  hasActiveItem,
  isActiveLink,
  resolveSidebarItems,
} from "../sidebar";
import type { M3eSidebarItem } from "../types";
import { useM3eConfig } from "./useM3eConfig";

export function useSidebar() {
  const config = useM3eConfig();
  const { site } = useData();
  const route = useRoute();

  const base = computed(() => site.value.base ?? "/");
  const items = computed(() =>
    resolveSidebarItems(config.value.sidebar, route.path, base.value),
  );
  const prevNext = computed(() =>
    findPrevNext(items.value, route.path, base.value),
  );

  function isActive(link?: string): boolean {
    return !!link && isActiveLink(route.path, link, base.value);
  }

  function hasActive(item: M3eSidebarItem): boolean {
    return hasActiveItem(item, route.path, base.value);
  }

  return { items, prevNext, isActive, hasActive };
}
```

- [ ] **Step 3: 写入 `useSettings.ts` 的主线程版本**

```ts
import {
  inject,
  onMounted,
  provide,
  reactive,
  watch,
  type InjectionKey,
} from "vue";

import { readStoredSettings, writeStoredSettings } from "../settings";
import type {
  M3eSettingsApi,
  M3eThemeSettings,
  ResolvedM3eThemeConfig,
} from "../types";

const settingsKey: InjectionKey<M3eSettingsApi> = Symbol("m3e-settings");

function getStorage(): Storage | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function provideM3eSettings(
  config: ResolvedM3eThemeConfig,
): M3eSettingsApi {
  const { defaults, sections, labels, persist, storageKey } = config.settings;
  const state = reactive<M3eThemeSettings>({ ...defaults });
  let hydrated = false;

  const api: M3eSettingsApi = {
    settings: state,
    sections,
    labels,
    defaults: { ...defaults },
    setSetting(key, value) {
      state[key] = value;
    },
    reset() {
      Object.assign(state, defaults);
    },
    isDefault() {
      return (Object.keys(defaults) as Array<keyof M3eThemeSettings>).every(
        (key) => state[key] === defaults[key],
      );
    },
  };

  function applyDocumentSettings(): void {
    if (typeof document === "undefined") return;
    document.documentElement.dir = state.direction;
    document.documentElement.style.fontSize = state.textSize;
  }

  onMounted(() => {
    if (persist) {
      Object.assign(
        state,
        readStoredSettings(getStorage(), storageKey, defaults),
      );
    }

    applyDocumentSettings();
    hydrated = true;
  });

  watch(
    () => [state.direction, state.textSize] as const,
    () => {
      if (hydrated) applyDocumentSettings();
    },
  );

  watch(
    state,
    () => {
      if (hydrated && persist) {
        writeStoredSettings(getStorage(), storageKey, state);
      }
    },
    { deep: true },
  );

  provide(settingsKey, api);
  return api;
}

export function useM3eSettings(): M3eSettingsApi {
  const api = inject(settingsKey);

  if (!api) {
    throw new Error(
      "[vitepress-theme-m3e] useM3eSettings() must be called inside M3eLayout.",
    );
  }

  return api;
}
```

注意：此文件之后归设置代理所有；设置代理需要保留以上导出签名，并完善 SSR/存储异常与持久化行为。

- [ ] **Step 4: 写入 `m3e.ts`**

```ts
import "@m3e/web/theme";
import "@m3e/web/app-bar";
import "@m3e/web/drawer-container";
import "@m3e/web/nav-menu";
import "@m3e/web/icon";
import "@m3e/web/icon-button";
import "@m3e/web/tooltip";
import "@m3e/web/content-pane";
import "@m3e/web/toc";
import "@m3e/web/heading";
import "@m3e/web/segmented-button";
import "@m3e/web/chips";
import "@m3e/web/badge";
import "@m3e/web/divider";
import "@m3e/web/button";
import "@m3e/web/card";
import "@m3e/web/switch";
import "@m3e/web/checkbox";
import "@m3e/web/tabs";
import "@m3e/web/dialog";
import "@m3e/web/snackbar";

import "./icons";
```

- [ ] **Step 5: 写入 `icons.ts`**

```ts
import "@m3e/icons/outlined/arrow_back";
import "@m3e/icons/outlined/arrow_forward";
import "@m3e/icons/outlined/category";
import "@m3e/icons/outlined/check";
import "@m3e/icons/outlined/chevron_right";
import "@m3e/icons/outlined/close";
import "@m3e/icons/outlined/colorize";
import "@m3e/icons/outlined/content_copy";
import "@m3e/icons/outlined/dark_mode";
import "@m3e/icons/outlined/dashboard";
import "@m3e/icons/outlined/format_textdirection_l_to_r";
import "@m3e/icons/outlined/format_textdirection_r_to_l";
import "@m3e/icons/outlined/home";
import "@m3e/icons/outlined/integration_instructions";
import "@m3e/icons/outlined/language";
import "@m3e/icons/outlined/layers";
import "@m3e/icons/outlined/light_mode";
import "@m3e/icons/outlined/menu";
import "@m3e/icons/outlined/menu_open";
import "@m3e/icons/outlined/package_2";
import "@m3e/icons/outlined/palette";
import "@m3e/icons/outlined/radio_button_checked";
import "@m3e/icons/outlined/rocket_launch";
import "@m3e/icons/outlined/settings";
import "@m3e/icons/outlined/settings_brightness";
import "@m3e/icons/outlined/style";
import "@m3e/icons/outlined/text_fields";
import "@m3e/icons/outlined/tune";
import "@m3e/icons/outlined/view_quilt";
import "@m3e/icons/outlined/view_sidebar";
import "@m3e/icons/outlined/widgets";
```

- [ ] **Step 6: 写入 `index.ts`**

```ts
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import "@fontsource-variable/roboto";

import Layout from "./layouts/M3eLayout.vue";
import "./styles/index.css";

if (!import.meta.env.SSR) {
  void import("./m3e").then(() => {
    document.documentElement.dataset.m3eReady = "";
  });
}

export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme;

export * from "./types";
export { defineM3eThemeConfig } from "./config";
export {
  M3E_CONTENT_ID,
  M3E_SETTINGS_ID,
  M3E_SIDEBAR_ID,
} from "./constants";
export { useM3eConfig } from "./composables/useM3eConfig";
export { useM3eSettings } from "./composables/useSettings";
export { useSidebar } from "./composables/useSidebar";
```

- [ ] **Step 7: 验证**

Run: `npm run typecheck`
Expected: 除尚未创建的 Layout/样式/组件外无新增错误；下一步马上补齐。

---

## Task 5: 站点配置、Layout、基线样式与可构建占位组件

**Files:**
- Create: `docs/.vitepress/config.mts`
- Create: `docs/.vitepress/theme/layouts/M3eLayout.vue`
- Create: `docs/.vitepress/theme/styles/index.css`
- Create: `docs/.vitepress/theme/styles/tokens.css`
- Create: `docs/.vitepress/theme/styles/base.css`
- Create: `docs/.vitepress/theme/styles/shell.css`
- Create: `docs/.vitepress/theme/styles/prose.css`（占位，内容代理替换）
- Create: `docs/.vitepress/theme/styles/settings.css`（占位，设置代理替换）
- Create: `docs/.vitepress/theme/components/shell/AppBar.vue`（占位）
- Create: `docs/.vitepress/theme/components/sidebar/SidebarNav.vue`（占位）
- Create: `docs/.vitepress/theme/components/settings/SettingsDrawer.vue`（占位）
- Create: `docs/.vitepress/theme/components/content/DocToc.vue`（占位）
- Create: `docs/.vitepress/theme/components/content/DocFooter.vue`（占位）
- Create: `docs/index.md`（占位）

**Interfaces:**
- Consumes: Task 4 的组合式函数和主题入口。
- Produces: 可运行的空壳站点，供并行代理替换各自组件。
- Produces: `M3E_CONTENT_ID` 指向 `m3e-content-pane`，`M3E_SIDEBAR_ID` / `M3E_SETTINGS_ID` 指向抽屉槽位包装元素，供 `m3e-drawer-toggle` 使用。

- [ ] **Step 1: 写入 `config.mts`**

```ts
import { defineConfig } from "vitepress";
import { defineM3eThemeConfig } from "./theme/config";

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
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => tag.startsWith("m3e-"),
      },
    },
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
      toc: {
        enabled: true,
        maxDepth: 3,
        overline: "本页内容",
      },
      footer: {
        message: "基于 VitePress 与 M3E Web Components 构建",
        copyright: "MIT License",
      },
    }),
  },
});
```

- [ ] **Step 2: 写入 `M3eLayout.vue`**

```vue
<script setup lang="ts">
import { computed } from "vue";
import { Content, onContentUpdated } from "vitepress";

import DefaultAppBar from "../components/shell/AppBar.vue";
import DefaultSidebar from "../components/sidebar/SidebarNav.vue";
import DefaultSettings from "../components/settings/SettingsDrawer.vue";
import DefaultToc from "../components/content/DocToc.vue";
import DefaultFooter from "../components/content/DocFooter.vue";
import { provideM3eConfig } from "../composables/useM3eConfig";
import { provideM3eSettings } from "../composables/useSettings";
import {
  M3E_CONTENT_ID,
  M3E_SETTINGS_ID,
  M3E_SIDEBAR_ID,
} from "../constants";

const config = provideM3eConfig();
const { settings } = provideM3eSettings(config.value);

const components = computed(() => ({
  AppBar: config.value.components.AppBar ?? DefaultAppBar,
  Sidebar: config.value.components.Sidebar ?? DefaultSidebar,
  Settings: config.value.components.Settings ?? DefaultSettings,
  Toc: config.value.components.Toc ?? DefaultToc,
  Footer: config.value.components.Footer ?? DefaultFooter,
  Content: config.value.components.Content ?? "div",
}));

function resetContentScroll(): void {
  requestAnimationFrame(() => {
    const pane = document.getElementById(M3E_CONTENT_ID);
    const scroller = pane?.shadowRoot?.querySelector<HTMLElement>(
      ".scroll-container",
    );
    scroller?.scrollTo({ top: 0 });
  });
}

onContentUpdated(resetContentScroll);
</script>

<template>
  <m3e-theme
    :color="settings.color"
    :variant="settings.variant"
    :scheme="settings.scheme"
    :contrast="settings.contrast"
    :motion="settings.motion"
    strong-focus
  >
    <component :is="components.AppBar" />
    <m3e-drawer-container
      class="m3e-shell"
      start
      start-mode="auto"
      end-mode="auto"
    >
      <div :id="M3E_SIDEBAR_ID" class="m3e-sidebar-slot" slot="start">
        <component :is="components.Sidebar" />
      </div>
      <main class="m3e-main">
        <div class="m3e-panes">
          <m3e-content-pane :id="M3E_CONTENT_ID" class="m3e-content-pane">
            <component :is="components.Content" class="m3e-content">
              <div class="m3e-prose">
                <Content />
              </div>
            </component>
            <component :is="components.Footer" />
          </m3e-content-pane>
          <component :is="components.Toc" class="m3e-toc" />
        </div>
      </main>
      <div :id="M3E_SETTINGS_ID" class="m3e-settings-slot" slot="end">
        <component :is="components.Settings" />
      </div>
    </m3e-drawer-container>
  </m3e-theme>
</template>
```

注意：`requestAnimationFrame` 使用浏览器全局，不要从 Vue 导入；SSR 不执行 `onContentUpdated` 回调。

- [ ] **Step 3: 写入 `styles/tokens.css`**

```css
:root {
  --m3e-doc-content-max-width: 100%;
  --m3e-doc-gap: 16px;
  --m3e-doc-radius: 28px;
  --m3e-doc-app-bar-height: 64px;

  --md-sys-color-background: #fef7ff;
  --md-sys-color-on-background: #1d1b20;
  --md-sys-color-surface: #fef7ff;
  --md-sys-color-surface-container-lowest: #ffffff;
  --md-sys-color-surface-container-low: #f7f2fa;
  --md-sys-color-surface-container: #f3edf7;
  --md-sys-color-surface-container-high: #ece6f0;
  --md-sys-color-surface-container-highest: #e6e0e9;
  --md-sys-color-on-surface: #1d1b20;
  --md-sys-color-on-surface-variant: #49454f;
  --md-sys-color-outline: #79747e;
  --md-sys-color-outline-variant: #cac4d0;
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;
  --md-sys-color-on-primary-container: #21005d;
  --md-sys-color-secondary: #625b71;
  --md-sys-color-secondary-container: #e8def8;
  --md-sys-color-on-secondary-container: #1d192b;
  --md-sys-color-tertiary: #7d5260;
  --md-sys-color-error: #b3261e;
  --md-sys-color-inverse-surface: #322f35;
  --md-sys-color-inverse-on-surface: #f5eff7;
}

@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-background: #141218;
    --md-sys-color-on-background: #e6e0e9;
    --md-sys-color-surface: #141218;
    --md-sys-color-surface-container-lowest: #0f0d13;
    --md-sys-color-surface-container-low: #1d1b20;
    --md-sys-color-surface-container: #211f26;
    --md-sys-color-surface-container-high: #2b2930;
    --md-sys-color-surface-container-highest: #36343b;
    --md-sys-color-on-surface: #e6e0e9;
    --md-sys-color-on-surface-variant: #cac4d0;
    --md-sys-color-outline: #938f99;
    --md-sys-color-outline-variant: #49454f;
    --md-sys-color-primary: #d0bcff;
    --md-sys-color-on-primary: #381e72;
    --md-sys-color-primary-container: #4f378b;
    --md-sys-color-on-primary-container: #eaddff;
    --md-sys-color-secondary: #ccc2dc;
    --md-sys-color-secondary-container: #4a4458;
    --md-sys-color-on-secondary-container: #e8def8;
    --md-sys-color-tertiary: #efb8c8;
    --md-sys-color-error: #f2b8b5;
    --md-sys-color-inverse-surface: #e6e0e9;
    --md-sys-color-inverse-on-surface: #322f35;
  }
}
```

- [ ] **Step 4: 写入 `styles/base.css`**

```css
html,
body {
  margin: 0;
  height: 100%;
}

html {
  background: var(--md-sys-color-background);
}

body {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  background: var(--md-sys-color-background);
  color: var(--md-sys-color-on-background);
  font-family:
    "Roboto Variable", Roboto, "PingFang SC", "Microsoft YaHei", system-ui,
    sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

#app,
m3e-theme {
  display: contents;
}

m3e-app-bar {
  flex: none;
  z-index: 4;
  --m3e-app-bar-container-color: var(--md-sys-color-surface-container-low);
}

m3e-app-bar:not(:defined) {
  display: block;
  height: var(--m3e-doc-app-bar-height);
}

html:not([data-m3e-ready]) m3e-app-bar {
  visibility: hidden;
}

html:not([data-m3e-ready]) .m3e-sidebar-slot,
html:not([data-m3e-ready]) .m3e-settings-slot {
  display: none;
}

.m3e-shell {
  flex: 1 1 auto;
  min-height: 0;
  --m3e-drawer-container-color: var(--md-sys-color-surface-container-low);
  --m3e-modal-drawer-container-color: var(--md-sys-color-surface-container);
  --m3e-drawer-container-width: 320px;
}

.m3e-main {
  height: 100%;
  min-height: 0;
}

.m3e-panes {
  display: flex;
  gap: var(--m3e-doc-gap);
  height: 100%;
  min-height: 0;
  padding: 0 var(--m3e-doc-gap) var(--m3e-doc-gap);
}

.m3e-content-pane {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  --m3e-content-pane-container-color: var(
    --md-sys-color-surface-container-lowest
  );
  --m3e-content-pane-container-shape: var(--m3e-doc-radius);
  --m3e-content-pane-container-padding: 32px;
}

.m3e-toc {
  flex: none;
  height: 100%;
  --m3e-toc-width: 208px;
  --m3e-toc-container-color: var(--md-sys-color-surface-container-lowest);
  --m3e-toc-container-shape: var(--m3e-doc-radius);
  --m3e-toc-container-padding-inline: 8px;
  --m3e-toc-container-padding-block: 8px;
}

.m3e-sidebar-slot,
.m3e-settings-slot {
  box-sizing: border-box;
  min-height: 0;
}

.m3e-sidebar-slot {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
}

.m3e-settings-slot {
  display: flex;
  height: 100%;
}

@media (max-width: 959px) {
  .m3e-toc {
    display: none;
  }

  .m3e-panes {
    gap: 8px;
    padding: 0 8px 8px;
  }
}

@media (max-width: 600px) {
  .m3e-panes {
    padding: 0;
  }

  .m3e-content-pane {
    --m3e-content-pane-container-shape: 28px 28px 0 0;
    --m3e-content-pane-container-padding: 24px 20px;
  }
}
```

- [ ] **Step 5: 写入 `styles/index.css`**

```css
@import "./tokens.css";
@import "./base.css";
@import "./shell.css";
@import "./prose.css";
@import "./settings.css";
```

- [ ] **Step 6: 写入 `styles/shell.css`**

```css
.m3e-content {
  min-height: 100%;
}

.m3e-content > .m3e-prose:first-child {
  margin-block-start: 0;
}

.m3e-content-pane:defined {
  display: block;
}
```

- [ ] **Step 7: 写入两个占位样式文件**

`styles/prose.css`：

```css
.m3e-prose {
  color: var(--md-sys-color-on-surface);
}
```

`styles/settings.css`：

```css
.m3e-settings {
  box-sizing: border-box;
  width: 100%;
}
```

- [ ] **Step 8: 写入可构建的占位组件**

`AppBar.vue`：

```vue
<template>
  <m3e-app-bar class="m3e-app-bar">
    <span slot="title">M3E 文档主题</span>
  </m3e-app-bar>
</template>
```

`SidebarNav.vue`：

```vue
<template>
  <m3e-nav-menu class="m3e-sidebar" aria-label="文档导航">
    <m3e-nav-menu-item>
      <span slot="label">文档</span>
    </m3e-nav-menu-item>
  </m3e-nav-menu>
</template>
```

`SettingsDrawer.vue`：

```vue
<template>
  <div class="m3e-settings" role="complementary" aria-label="设置"></div>
</template>
```

`DocToc.vue`：

```vue
<script setup lang="ts">
import { M3E_CONTENT_ID } from "../../constants";
</script>

<template>
  <m3e-toc :for="M3E_CONTENT_ID" max-depth="3" />
</template>
```

`DocFooter.vue`：

```vue
<template>
  <footer class="m3e-doc-footer"></footer>
</template>
```

- [ ] **Step 9: 写入 `docs/index.md` 占位页**

```md
# 概览

M3E 文档主题正在构建中。
```

- [ ] **Step 10: 构建验证**

Run: `npm run build`
Expected: 构建成功；页面可生成，m3e 组件仅在客户端注册，无 SSR 报错。若出现 `customElements is not defined`，检查 `m3e.ts` 只能经 `!import.meta.env.SSR` 动态导入。

---

## Task 6: 壳层代理——AppBar 与递归侧边栏

**启动时机：** Task 5 构建通过后，与 Task 7、8、9、10 并行。

**Files（仅允许修改）：**
- `docs/.vitepress/theme/components/shell/AppBar.vue`
- Create: `docs/.vitepress/theme/components/shell/BrandMark.vue`
- Create: `docs/.vitepress/theme/components/shell/SocialActions.vue`
- `docs/.vitepress/theme/components/sidebar/SidebarNav.vue`
- Create: `docs/.vitepress/theme/components/sidebar/SidebarNavItem.vue`

**Interfaces:**
- Consumes: `useM3eConfig()`、`useSidebar()`、`M3E_SIDEBAR_ID`、`M3E_SETTINGS_ID`、`withBase`（来自 vitepress）。
- Produces: 根节点为 `m3e-app-bar` 的 AppBar；根节点为 `m3e-nav-menu` 的 SidebarNav。二者均不接受必填 props。
- 设置按钮必须包含 `<m3e-drawer-toggle :for="M3E_SETTINGS_ID">`；菜单按钮必须包含 `<m3e-drawer-toggle :for="M3E_SIDEBAR_ID">`。

**Constraints:**
- 不得修改 Layout、config、类型、样式基线或其它代理文件。
- 只使用已注册图标：`menu`, `menu_open`, `settings`。社交图标 `github` / `npm` 使用内联品牌 SVG；其它社交图标使用 `<m3e-icon :name="icon">`，并在最终报告中列出需要注册的图标名。
- 所有路由链接使用 VitePress `RouterLink` custom 模式，保持 SPA 导航；外部链接原样输出。
- 不注册新的 m3e 组件；只用 `m3e-app-bar`, `m3e-icon-button`, `m3e-icon`, `m3e-chip`, `m3e-tooltip`, `m3e-nav-menu`, `m3e-nav-menu-item`, `m3e-badge`, `m3e-drawer-toggle`。

- [ ] **Step 1: 实现 `AppBar.vue`**

结构：

```vue
<m3e-app-bar class="m3e-app-bar">
  <m3e-icon-button
    v-if="config.appBar.showSidebarToggle"
    slot="leading"
    aria-label="切换导航"
    toggle
  >
    <m3e-icon name="menu"></m3e-icon>
    <m3e-icon slot="selected" name="menu_open"></m3e-icon>
    <m3e-drawer-toggle :for="M3E_SIDEBAR_ID"></m3e-drawer-toggle>
  </m3e-icon-button>

  <span slot="title" class="m3e-title">
    <BrandMark />
  </span>

  <span slot="trailing" class="m3e-actions">
    <SocialActions :links="config.appBar.socialLinks" />
    <m3e-icon-button
      v-if="config.settings.enabled && config.appBar.showSettingsToggle"
      id="m3e-settings-button"
      aria-label="设置"
      toggle
    >
      <m3e-icon name="settings"></m3e-icon>
      <m3e-drawer-toggle :for="M3E_SETTINGS_ID"></m3e-drawer-toggle>
    </m3e-icon-button>
    <m3e-tooltip for="m3e-settings-button">设置</m3e-tooltip>
  </span>
</m3e-app-bar>
```

`BrandMark.vue`：logo 使用 `withBase(config.appBar.logo)`，标题截断省略，版本用 `<m3e-chip class="m3e-title__version">{{ config.appBar.version }}</m3e-chip>`，只在 version 存在时显示。

`SocialActions.vue`：为每个链接生成稳定唯一 id（`m3e-social-${index}`），`m3e-icon-button` 设置 `href`、`target="_blank"`、`rel="noreferrer"`、`aria-label`；`github` 与 `npm` 使用内联 SVG path（可参考官方 docs/index.html），其它使用 `<m3e-icon>`；每个按钮配 `<m3e-tooltip :for="id">`。

- [ ] **Step 2: 实现 `SidebarNavItem.vue`**

递归组件要点：

```vue
<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vitepress";
import { useSidebar } from "../../composables/useSidebar";
import type { M3eSidebarItem } from "../../types";

const props = defineProps<{ item: M3eSidebarItem }>();
const { isActive, hasActive } = useSidebar();

const hasChildren = computed(() => !!props.item.items?.length);
const open = computed(() => hasActive(props.item));
</script>
```

有子项时输出 `<m3e-nav-menu-item :open="open">`，icon 可选、label 为文本、badge 可选，并递归渲染子项。叶子输出 `<m3e-nav-menu-item :selected="isActive(item.link)">`，`<a slot="label">` 使用 `RouterLink` custom：

```vue
<RouterLink v-if="item.link && !isExternalLink(item.link)" :to="item.link" custom v-slot="{ href, navigate }">
  <a slot="label" :href="href" @click="navigate">{{ item.text }}</a>
</RouterLink>
<a v-else-if="item.link" slot="label" :href="item.link" target="_blank" rel="noreferrer">
  {{ item.text }}
</a>
```

需要从 `../../sidebar` 导入 `isExternalLink`。不要使用 `v-html`。

- [ ] **Step 3: 实现 `SidebarNav.vue`**

```vue
<m3e-nav-menu class="m3e-sidebar" aria-label="文档导航">
  <SidebarNavItem v-for="item in items" :key="item.link ?? item.text" :item="item" />
</m3e-nav-menu>
```

从 `useSidebar()` 获取 `items`。根元素必须保留默认 attrs 透传，以便外部挂载 `id`。

- [ ] **Step 4: 组件级样式**

在各自 SFC 的 `<style scoped>` 中处理标题截断、工具区间距、社交按钮间距、侧栏宽度与滚动。不要写入 `styles/*.css`。侧栏根元素设置 `height: 100%; overflow-y: auto;`。移动端保证文本不溢出。

- [ ] **Step 5: 自检**

Run: `npm run typecheck`
Expected: 自己负责的文件无类型错误。忽略其它代理尚在编辑导致的无关错误，并在报告中列出。

Run: `npm run build`
Expected: 若其它代理文件仍为占位，构建应成功；若失败，先确认错误不在自己的文件。

**交付报告必须包含：** 修改文件列表、使用的图标名、运行过的命令与结果、任何未决问题。

---

## Task 7: 设置代理——右侧设置抽屉与持久化

**启动时机：** Task 5 构建通过后并行。

**Files（仅允许修改）：**
- `docs/.vitepress/theme/components/settings/SettingsDrawer.vue`
- Create: `docs/.vitepress/theme/components/settings/SettingsSection.vue`
- `docs/.vitepress/theme/composables/useSettings.ts`
- `docs/.vitepress/theme/styles/settings.css`

**Interfaces:**
- Consumes: `useM3eSettings()`、`M3E_SETTINGS_ID`、Task 2 中的选项常量、Task 2 的 `readStoredSettings` / `writeStoredSettings`。
- Produces: 根节点带 `class="m3e-settings"`、`role="complementary"`、`:aria-label="labels.title"`。根节点需透传 attrs。
- 保持 `M3eSettingsApi` 导出签名不变。

**Constraints:**
- 不修改 Layout、配置、类型、其它样式文件。
- 只用已注册图标：`light_mode`, `settings_brightness`, `dark_mode`, `format_textdirection_l_to_r`, `format_textdirection_r_to_l`。
- 只用 `m3e-heading`, `m3e-filter-chip-set`, `m3e-filter-chip`, `m3e-segmented-button`, `m3e-button-segment`, `m3e-icon`。

- [ ] **Step 1: 完善 `useSettings.ts`**

保留 Task 4 的公开 API，增强：
- `onMounted` 中仅在 `persist` 为真时读取存储；读取必须经过 `readStoredSettings`。
- `setup` 期间不访问 `window` / `document`。
- 方向与字号变更后同步 `document.documentElement`。
- 设置变更后仅在 `hydrated` 为真时持久化；持久化失败不得抛出。
- `reset()` 恢复 `config.settings.defaults`。
- `isDefault()` 比较所有键。
- 配置在运行时不变，`sections` / `labels` 直接使用 resolved 值。

- [ ] **Step 2: 实现 `SettingsSection.vue`**

```vue
<script setup lang="ts">
defineProps<{ id: string; label: string }>();
</script>

<template>
  <section class="m3e-settings__section">
    <m3e-heading :id="id" variant="label" size="large">{{ label }}</m3e-heading>
    <slot />
  </section>
</template>
```

- [ ] **Step 3: 实现 `SettingsDrawer.vue` 的全部区块**

按 `api.sections` 顺序渲染，使用 `v-if="show('color')"` 等：

1. 颜色：`<input type="color" :value="settings.color" @change="onColor" />`，heading id `m3e-settings-color`，输入设置 `aria-labelledby`。
2. 色调变体：`<m3e-filter-chip-set aria-labelledby="m3e-settings-variant" @change="onVariantChange">`，每个选项输出 `<m3e-filter-chip :selected="settings.variant === option.value" :value="option.value">{{ option.label }}</m3e-filter-chip>`。
3. 明暗：`<m3e-segmented-button @change="onSchemeChange">`，每个选项输出 `<m3e-button-segment :checked="settings.scheme === option.value" :value="option.value">`，含 `slot="icon"` 图标与文本。
4. 对比度、动效：同分段按钮，无图标。
5. 方向：分段按钮，含图标。
6. 字号：分段按钮，显示 100% / 150% / 200%。

事件处理读取控件当前值：

```ts
type ValueControl = EventTarget & { value?: string | readonly string[] | null };

function stringValue(event: Event): string | undefined {
  const value = (event.currentTarget as ValueControl).value;
  return typeof value === "string" ? value : undefined;
}

function onVariantChange(event: Event) {
  const value = stringValue(event);
  if (value && VARIANT_VALUES.includes(value as M3eThemeVariant)) {
    api.setSetting("variant", value as M3eThemeVariant);
  }
}
```

颜色输入使用原生值校验：

```ts
function onColor(event: Event) {
  const value = (event.currentTarget as HTMLInputElement).value;
  if (/^#[0-9a-f]{6}$/i.test(value)) api.setSetting("color", value);
}
```

- [ ] **Step 4: 写 `styles/settings.css`**

实现：
- 抽屉根节点纵向排列，`padding: 16px`，`row-gap: 16px`，内部滚动，`scrollbar-width: thin`。
- 分区标题与控件间距 8px。
- `input[type="color"]` 48×48 圆形、无边框、`appearance: none`，swatch 圆形。
- 分段按钮 `width: fit-content; max-width: 100%;`，允许换行/横向收缩。
- 滤镜 chips 容器间距与右 margin。
- 移动端允许整个抽屉内部滚动。
- 不隐藏滚动条。

- [ ] **Step 5: 自检**

Run: `npm run typecheck`
Run: `npm run build`
Expected: 自己文件无错误；设置抽屉静态渲染不报错。最终交互由主线程浏览器验收。

**交付报告必须包含：** 修改文件列表、控件事件映射、持久化行为、运行命令与结果。

---

## Task 8: 内容代理——正文排版、右侧 TOC 与页脚

**启动时机：** Task 5 构建通过后并行。

**Files（仅允许修改）：**
- `docs/.vitepress/theme/components/content/DocToc.vue`
- `docs/.vitepress/theme/components/content/DocFooter.vue`
- `docs/.vitepress/theme/styles/prose.css`

**Interfaces:**
- Consumes: `useM3eConfig()`, `useSidebar()`, `M3E_CONTENT_ID`, `withBase`，VitePress `useData` / `RouterLink`。
- Produces: `DocToc` 根节点为 `m3e-toc`，无必填 props；`DocFooter` 根节点为 `footer.m3e-doc-footer`，无必填 props。
- 正文样式作用域为 `.m3e-prose` / `.m3e-content`。

**Constraints:**
- 不修改 Layout、主题配置、其他代理文件。
- 只用已注册图标：`arrow_back`, `arrow_forward`。
- 不替换 VitePress 的 `button.copy` 节点。

- [ ] **Step 1: 实现 `DocToc.vue`**

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

import { useM3eConfig } from "../../composables/useM3eConfig";
import { M3E_CONTENT_ID } from "../../constants";

const { page, frontmatter } = useData();
const config = useM3eConfig();

const visible = computed(
  () =>
    config.value.toc.enabled &&
    frontmatter.value.toc !== false &&
    page.value.headers.length > 0,
);
</script>

<template>
  <m3e-toc
    v-if="visible"
    :for="M3E_CONTENT_ID"
    :max-depth="config.toc.maxDepth"
  >
    <span slot="overline">{{ config.toc.overline }}</span>
    <span slot="title">{{ page.title }}</span>
  </m3e-toc>
</template>
```

确保类名 `m3e-toc` 由 Layout 传入并透传到根元素。

- [ ] **Step 2: 实现 `DocFooter.vue`**

- 使用 `useSidebar().prevNext` 与 `config.footer`。
- 上一页/下一页使用 `<RouterLink custom v-slot="{ href, navigate }" :to="item.link">` 包裹 `<m3e-button variant="text" :href="href" @click.prevent="navigate($event)">`。
- 上一页图标 `arrow_back`，下一页图标 `arrow_forward`，标题文本保留在按钮内。
- `showPrevNext` 为 false 时隐藏导航。
- 底部显示 `message` 与 `copyright`；`copyright` 为空则不显示。
- 使用 `m3e-divider` 分隔正文与页脚。
- 页面没有上一页/下一页时仍显示 footer 信息，不留空大块。
- 根节点加 `class="m3e-doc-footer"`。

- [ ] **Step 3: 编写 `prose.css`**

覆盖以下内容，使用 `--md-sys-color-*` 变量：

- 正文基础：`.m3e-prose` 的字体、字号 1rem、行高 1.65、颜色、`padding-block-end: 8px`。
- 标题：H1 display large（`3.5625rem/1.12`，字重 400，margin 0 0 16px）；H2 1.75rem/1.3，字重 500，margin 40px 0 16px；H3 1.5rem/1.35，字重 500，margin 32px 0 12px；H4-H6 对应层级。
- 段落、列表、`hr`、强调查阅官方视觉。
- 链接：primary 色、下划线、`text-underline-offset: 2px`。
- 行内 code：surface-container-low 背景、primary 文本、4px 圆角、2px 4px 内边距。
- 代码块：`div[class*="language-"]` 使用 surface-container-low、1px outline-variant 边框、16px 圆角、`position: relative`；`pre` 内边距 16px；隐藏或弱化 `.lang` 标签；`code` 背景透明。
- 代码复制按钮：只改 `div[class*="language-"] > button.copy` 的视觉，40×40 圆形、hover 状态、`.copied` 状态；使用 CSS `mask` 与内联 SVG data URI：
  - 复制图标 path：`M300-200q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440v-560H300v560ZM180-80q-24 0-42-18t-18-42v-620h60v620h500v60H180Zm120-180v-560 560Z`
  - 成功图标 path：`M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z`
  - viewBox 使用 `0 -960 960 960`。
- 表格：100% 宽度、折叠边框、outline-variant 边框、表头 surface-container 背景、单元格 12px 内边距。
- 引用块：4px primary 左边框、surface-container-low 背景、右侧 12px 圆角。
- VitePress 自定义容器 `.tip` `.info` `.warning` `.danger`：surface-container-low 背景、outline-variant 边框、16px 圆角、16px 内边距；标题颜色区分。
- 图片圆角 16px，最大宽度 100%。
- 标题锚点：默认半透明、hover 显示 primary。
- 演示辅助类（供文档代理使用）：
  - `.demo-grid`：响应式网格，`repeat(auto-fit, minmax(240px, 1fr))`，gap 16px，margin 16px 0。
  - `.demo-row`：flex 换行，gap 12px，align-items center。
  - `.demo-stack`：flex column，gap 16px。
  - `.demo-surface`：surface-container-low 背景、outline-variant 边框、16px 圆角、16px 内边距。
  - `.swatch-grid`：`repeat(auto-fill, minmax(160px, 1fr))`，gap 12px。
  - `.swatch`：圆角 12px，边框 outline-variant，padding 12px，显示色块与 token 名。
  - `.swatch__color`：高度 56px，圆角 8px，边框 outline-variant。
- 移动端：H1 降至 2.5rem，内容内边距由 shell 控制；表格允许横向滚动（用 `.m3e-prose table { display: block; overflow-x: auto; }` 或包装器）。
- 页脚：`.m3e-doc-footer` 的 margin、网格、按钮布局；上一页/下一页按钮文字对齐；移动端单列。

- [ ] **Step 4: 自检**

Run: `npm run typecheck`
Run: `npm run build`
Expected: 自己文件无类型错误；样式可编译。

**交付报告必须包含：** 修改文件列表、覆盖的 Markdown 元素、运行命令与结果、需要主线程浏览器验证的点。

---

## Task 9: 文档代理——12 页中文演示文档

**启动时机：** Task 5 构建通过后并行；侧边栏链接已在 `config.mts` 固定。

**Files（仅允许创建/修改）：**
- `docs/index.md`
- `docs/getting-started/installation.md`
- `docs/getting-started/configuration.md`
- `docs/theme/layout.md`
- `docs/theme/sidebar.md`
- `docs/theme/settings.md`
- `docs/theme/extending.md`
- `docs/styles/color.md`
- `docs/styles/typography.md`
- `docs/components/button.md`
- `docs/components/card.md`
- `docs/components/navigation.md`
- `docs/public/*` 仅限必要的图片或 favicon

**Constraints:**
- 不修改任何主题源码或站点配置。
- 不使用未注册组件。允许的标签：
  `m3e-theme`, `m3e-app-bar`, `m3e-drawer-container`, `m3e-nav-menu`, `m3e-nav-menu-item`, `m3e-icon`, `m3e-icon-button`, `m3e-tooltip`, `m3e-content-pane`, `m3e-toc`, `m3e-heading`, `m3e-segmented-button`, `m3e-button-segment`, `m3e-chip`, `m3e-filter-chip`, `m3e-filter-chip-set`, `m3e-badge`, `m3e-divider`, `m3e-button`, `m3e-card`, `m3e-switch`, `m3e-checkbox`, `m3e-tabs`, `m3e-tab`, `m3e-tab-panel`, `m3e-dialog`, `m3e-dialog-trigger`, `m3e-dialog-action`, `m3e-snackbar`。
- 允许的图标名：
  `menu`, `menu_open`, `settings`, `light_mode`, `dark_mode`, `settings_brightness`, `format_textdirection_l_to_r`, `format_textdirection_r_to_l`, `arrow_back`, `arrow_forward`, `close`, `chevron_right`, `home`, `package_2`, `tune`, `rocket_launch`, `palette`, `style`, `widgets`, `view_quilt`, `view_sidebar`, `integration_instructions`, `colorize`, `text_fields`, `radio_button_checked`, `dashboard`, `language`, `content_copy`, `check`, `category`, `layers`。
- 每页正文以单个 H1 开头（VitePress 从 Markdown H1 或 frontmatter title 生成页面标题）；不要出现多个 H1。
- `index.md` 使用 `toc: false`，其余页面保留 TOC，并至少包含两个 H2。
- 代码块必须可复制；示例配置使用 TypeScript。
- 中文文案，术语与 m3e 一致；不要逐字复制官方整页文案，自己组织说明。
- 组件演示必须实际运行，不能只贴代码。

- [ ] **Step 1: 写 `index.md`**

Frontmatter：

```yaml
---
title: 概览
toc: false
---
```

内容要求：
- `# 概览`
- 一段介绍：VitePress 2 alpha + M3E Web Components。
- 4–6 个 `<m3e-card variant="outlined">` 特性卡片，放在 `.demo-grid` 中，说明：Material 3 Expressive、双模式侧边栏、右侧设置、SSR/SPA、组件覆盖、离线字体图标。
- 快速开始代码块：`npm install` / `npm run dev`。
- 指向安装、配置、设置页的 RouterLink 或普通链接。
- 一个 `.demo-row` 展示 `m3e-button`、`m3e-chip`、`m3e-badge` 运行效果。

- [ ] **Step 2: 写安装页**

`docs/getting-started/installation.md`：
- `# 安装`
- 环境要求：Node >=22.12（项目实际使用 Node 24）、npm。
- 本仓库安装与启动命令。
- 依赖版本表：VitePress `2.0.0-alpha.21`、`@m3e/web` `2.10.2`、`@m3e/icons` `1.0.21`。
- 目录结构代码块。
- 首次构建与预览命令。
- 常见问题：Web Components 仅在客户端注册；不要从服务端直接导入 `@m3e/web/all`。

- [ ] **Step 3: 写配置页**

`docs/getting-started/configuration.md`：
- `# 配置`
- 展示 `themeConfig.m3e.appBar`、`sidebar`、`settings`、`toc`、`footer`、`components` 的完整 TypeScript 示例。
- 双模式侧边栏说明与原生 `themeConfig.sidebar` 回退示例。
- 表格列：字段、类型、默认值、说明。
- 配置扩展点链接到 `/theme/extending`。

- [ ] **Step 4: 写主题四页**

`theme/layout.md`：
- `# 布局与顶栏`
- 应用壳结构说明（AppBar → DrawerContainer → 内容面板 + TOC）。
- AppBar 配置示例（标题、版本、logo、社交链接、开关）。
- 内容面板与 TOC 行为、滚动重置、移动端断点。
- 一个使用 `m3e-app-bar` 的静态演示（放在 `.demo-surface`，注意不要让演示的 app-bar 使用固定定位）。

`theme/sidebar.md`：
- `# 侧边导航`
- 富配置项说明：`text` / `link` / `icon` / `badge` / `collapsed` / `items`。
- 双模式规则、路径匹配、自动展开、上一页/下一页。
- 富配置与原生配置两个代码示例。
- 一个 `m3e-nav-menu` 静态演示（限高，放 `.demo-surface`）。
- 图标注册说明：新增图标需在 `docs/.vitepress/theme/icons.ts` 导入 `@m3e/icons/outlined/<name>`。

`theme/settings.md`：
- `# 右侧设置`
- 七个设置区块与对应 `<m3e-theme>` 属性表。
- 设置持久化、SSR 默认值、`storageKey` 配置。
- `settings.sections` 隐藏区块示例。
- 提示：设置只影响当前浏览器，不写入站点配置。

`theme/extending.md`：
- `# 扩展主题`
- 三类扩展：配置、组件覆盖、CSS 令牌。
- `m3e.components` 覆盖示例（编写一个自定义 AppBar 的代码片段，不需要实际生效）。
- 公共导出：`useM3eConfig`、`useM3eSettings`、`useSidebar`、`defineM3eThemeConfig`。
- CSS 变量示例：内容面板颜色、圆角、TOC 宽度、抽屉宽度。
- 注意事项：覆盖组件必须保持原有根元素语义与无障碍属性。

- [ ] **Step 5: 写样式两页**

`styles/color.md`：
- `# 色彩`
- 动态色、色调变体、对比度、明暗模式说明。
- 使用 `.swatch-grid` / `.swatch` / `.swatch__color` 展示至少 12 个 `--md-sys-color-*` 令牌，色块用内联 `background: var(--md-sys-color-primary)` 等。
- 设置面板操作指引。
- 强调：不要在主题里硬编码颜色，使用令牌。

`styles/typography.md`：
- `# 排版`
- 展示 H1–H4、正文、辅助文本、行内代码、引用。
- 字体：Roboto Variable + 系统中文字体回退。
- 字号与设置面板 100%/150%/200% 的联动说明。
- 代码块展示 Markdown 用法。

- [ ] **Step 6: 写组件三页**

`components/button.md`：
- `# 按钮`
- `<m3e-button>` 的 filled / tonal / outlined / text / elevated 变体展示，使用 `.demo-row` 或 `.demo-grid`。
- `<m3e-icon-button>` 带 tooltip 示例（注意 tooltip 需要唯一 id）。
- disabled、带图标、href 链接示例。
- 每个演示后附对应 HTML 代码块。

`components/card.md`：
- `# 卡片`
- `m3e-card` 的 elevated / filled / outlined 变体。
- header / content / actions 插槽组合。
- 卡片网格与混合内容演示。
- 代码块。

`components/navigation.md`：
- `# 导航`
- `m3e-nav-menu` 静态演示。
- `m3e-tabs` + `m3e-tab` + `m3e-tab-panel` 演示。
- `m3e-chip-set` / `m3e-filter-chip-set` / `m3e-badge` 演示。
- 说明 SPA 中应使用 RouterLink，而不是整页刷新。
- 代码块。

- [ ] **Step 7: 校验 Markdown 链接**

Run: `rg -n '\]\(/' docs --glob '*.md'` 并人工确认每个链接对应一个已有页面或合法外链。

Run: `npm run build`
Expected: 12 个页面全部生成；没有死链导致的构建错误；无未注册自定义元素告警（Vue 编译器不应报 `m3e-*`）。

**交付报告必须包含：** 页面清单、每页使用的 m3e 标签、运行命令与结果、任何配置/图标缺口（不要自行修改配置或图标文件）。

---

## Task 10: 测试代理——纯函数单元测试

**启动时机：** Task 5 构建通过后并行；只写测试，不改源码。

**Files（仅允许创建/修改）：**
- `tests/config.spec.ts`
- `tests/settings.spec.ts`
- `tests/sidebar.spec.ts`
- 必要时 `tests/helpers/*.ts`

**Interfaces:**
- 测试 Task 3 与 Task 2 的纯函数；直接相对导入：
  `../docs/.vitepress/theme/config`
  `../docs/.vitepress/theme/settings`
  `../docs/.vitepress/theme/sidebar`
- 不导入 Vue/VitePress 运行时。

- [ ] **Step 1: 写 `tests/settings.spec.ts`**

至少覆盖：

```ts
import { describe, expect, it } from "vitest";
import {
  mergeSettings,
  normalizeSettings,
  parseStoredSettings,
  readStoredSettings,
  writeStoredSettings,
} from "../docs/.vitepress/theme/settings";
import { DEFAULT_SETTINGS } from "../docs/.vitepress/theme/constants";

describe("normalizeSettings", () => {
  it("fills invalid fields with defaults", () => {
    const result = normalizeSettings({
      color: "red",
      variant: "unknown",
      scheme: "sepia",
      contrast: "max",
      motion: "bouncy",
      direction: "up",
      textSize: "40px",
    });
    expect(result).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps valid values and lowercases hex colors", () => {
    const result = normalizeSettings({
      color: "#ABCDEF",
      variant: "vibrant",
      scheme: "dark",
      contrast: "high",
      motion: "standard",
      direction: "rtl",
      textSize: "24px",
    });
    expect(result).toMatchObject({
      color: "#abcdef",
      variant: "vibrant",
      scheme: "dark",
      contrast: "high",
      motion: "standard",
      direction: "rtl",
      textSize: "24px",
    });
  });
});

describe("parseStoredSettings", () => {
  it("returns defaults for corrupt JSON", () => {
    expect(parseStoredSettings("{not-json")).toEqual(DEFAULT_SETTINGS);
  });

  it("returns defaults for null", () => {
    expect(parseStoredSettings(null)).toEqual(DEFAULT_SETTINGS);
  });
});

describe("storage helpers", () => {
  it("round-trips settings through a storage-like object", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    };
    writeStoredSettings(storage, "test", DEFAULT_SETTINGS);
    expect(readStoredSettings(storage, "test")).toEqual(DEFAULT_SETTINGS);
  });

  it("falls back when storage throws", () => {
    const storage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readStoredSettings(storage, "test")).toEqual(DEFAULT_SETTINGS);
    expect(() => writeStoredSettings(storage, "test", DEFAULT_SETTINGS)).not.toThrow();
  });

  it("merges partial overrides", () => {
    expect(mergeSettings(DEFAULT_SETTINGS, { scheme: "dark" }).scheme).toBe("dark");
  });
});
```

- [ ] **Step 2: 写 `tests/sidebar.spec.ts`**

覆盖：

- `normalizePath` 去除 query/hash、`.html`、尾斜杠、base 前缀。
- `isActiveLink` 对 `/guide/`、`/guide/intro`、base `/docs/`、外部链接、hash 的判断。
- `resolveSidebarItems` 在 `source: "m3e"` 时选择最长前缀；在 `source: "native"` 时转换原生项并处理组级 `base`；无匹配返回空数组。
- `flattenSidebar` 保持深度优先顺序。
- `findPrevNext` 返回正确的相邻项，首项无 prev、末项无 next。
- `hasActiveItem` 能识别嵌套激活项。

测试数据示例：

```ts
const m3eConfig = {
  source: "m3e" as const,
  m3eItems: {
    "/": [{ text: "概览", link: "/" }],
    "/guide/": [
      { text: "指南", icon: "home", items: [{ text: "安装", link: "/guide/install" }, { text: "配置", link: "/guide/config" }] },
    ],
    "/guide/advanced/": [{ text: "高级", link: "/guide/advanced/one" }],
  },
  width: 320,
};
```

- [ ] **Step 3: 写 `tests/config.spec.ts`**

覆盖：

- 空配置的默认值：标题回退、settings 七项顺序、TOC maxDepth=3、footer 默认、sidebar source 由原生 sidebar 是否存在决定。
- `m3e.sidebar.items` 存在时 source 为 `m3e`。
- `settings.sections` 去重、过滤非法项、空数组回退默认。
- `m3e.settings.labels` 与默认标签合并。
- `socialLinks` 过滤非法项。
- sidebar 宽度与 toc maxDepth 的边界（clamp）。
- `defineM3eThemeConfig` 原样返回。
- `normalizePath` 相关常量不在此文件重复测试。

- [ ] **Step 4: 运行测试**

Run: `npm test`
Expected: 3 个测试文件全部通过。若失败，只修改 `tests/**` 或向主线程报告源码缺陷；不要直接改源码。

**交付报告必须包含：** 测试用例数、运行命令与结果、发现的源码问题列表。

---

## Task 11: 主线程总装与浏览器验收

**Files:**
- Modify: 任何需要修复的主题/文档文件（代理完成后主线程拥有最终修复权）。

**Interfaces:**
- Consumes: Task 6–10 的全部交付物。

- [ ] **Step 1: 检查代理交付**

Run: `git status --short`
Run: `find docs/.vitepress/theme -maxdepth 4 -type f | sort`
Expected: 所有约定文件存在；没有代理创建越界文件或修改 `package.json`。

- [ ] **Step 2: 类型检查与单测**

Run: `npm run typecheck`
Expected: 0 错误。

Run: `npm test`
Expected: 全部测试通过。

- [ ] **Step 3: 生产构建**

Run: `npm run build`
Expected: 构建成功；12 个页面生成；无 `customElements is not defined`、无 Vue 自定义元素警告。

- [ ] **Step 4: 启动预览**

Run: `npm run preview -- --port 4173`
Expected: 本地预览服务启动。后续使用 Chrome DevTools MCP 打开 `http://localhost:4173/`。

- [ ] **Step 5: 桌面端验收（1440×960）**

逐项检查并截图记录：

1. 顶栏：菜单按钮、标题、版本 chip、社交按钮、设置按钮。
2. 左抽屉默认展开、分组图标、当前页高亮、分组折叠/展开。
3. 内容卡圆角、背景、H1 尺寸、卡片网格、正文排版。
4. 右侧 TOC 卡显示当前页标题与激活项；点击 TOC 项滚动正确。
5. 设置抽屉打开/关闭；颜色选择器、8 个变体、明暗、对比度、动效、方向、字号全部生效。
6. 刷新后设置保持；localStorage 键为 `m3e-docs-settings`。
7. 浏览器控制台无错误或 hydration mismatch。

- [ ] **Step 6: 深色、RTL、字号验收**

在设置面板中切换深色、RTL、200% 字号，分别检查：

- 内容卡/TOC/抽屉颜色由 m3e 令牌驱动。
- 布局方向翻转后抽屉与图标方向正确。
- 字号增大不导致抽屉横向溢出。
- 切回浅色/LTR/100%。

- [ ] **Step 7: 移动端验收（390×844）**

检查：

- 左抽屉为覆盖模式，菜单按钮打开，遮罩关闭。
- 设置抽屉为覆盖模式，设置按钮打开，遮罩关闭。
- TOC 隐藏。
- 内容面板贴边且顶部圆角正确。
- 页面无横向滚动。

- [ ] **Step 8: SPA 路由验收**

从侧边栏依次访问 12 页：

- 每次跳转后内容更新、滚动归零、侧边栏高亮与展开正确、TOC 更新。
- 上一页/下一页链接可点击并保持 SPA。
- 返回概览页后 `toc: false` 不显示 TOC。

- [ ] **Step 9: 修复与复验**

修复发现的问题后，重新运行：

Run: `npm run typecheck && npm test && npm run build`

重新截取桌面与移动端关键页面截图。不要只修 CSS 而忽略控制台错误。

---

## Task 12: README、最终复核与交付

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: 最终主题配置与公共导出。

- [ ] **Step 1: 写 `README.md`**

内容：
- 项目简介与特性列表。
- 环境要求与安装/开发/构建/测试命令。
- 目录结构。
- 快速配置示例（appBar、sidebar、settings、toc）。
- 双模式侧边栏说明。
- 右侧设置与持久化说明。
- 扩展方式：配置、组件覆盖、CSS 变量、公共 composable。
- 新增图标流程。
- 已知限制：VitePress alpha 版本、仅客户端 m3e 注册、搜索未包含。
- 设计规格与实施计划链接。

- [ ] **Step 2: 独立复核**

使用技术总监代理或主线程自检：

- 对照 `specs/2026-10-27-vitepress-m3e-theme-design.md` 的“完成定义”逐条核对。
- 确认 12 页、双模式侧边栏、七项设置、组件覆盖、TOC、代码复制、响应式、无障碍标签全部满足。
- 确认没有未使用的依赖、没有 `@m3e/web/all`、没有 Google Fonts CDN、没有服务端 DOM 访问。
- 确认 `npm run typecheck && npm test && npm run build` 全绿。

- [ ] **Step 3: 最终交付说明**

向用户报告：
- 启动命令。
- 实现范围与截图验证结果。
- 已知限制与后续建议。
- 未执行 git commit（除非用户明确要求）。

---

## 验证命令汇总

```bash
npm install --no-audit --no-fund
npm run typecheck
npm test
npm run build
npm run preview -- --port 4173
```

浏览器验收地址：`http://localhost:4173/`

## 代理并行启动顺序

1. 主线程完成 Task 1–5，确保 `npm run build` 成功。
2. 同一消息中并行启动：
   - 壳层代理（Task 6）
   - 设置代理（Task 7）
   - 内容代理（Task 8）
   - 文档代理（Task 9）
   - 测试代理（Task 10）
3. 所有代理完成后，主线程执行 Task 11 总装与浏览器验收。
4. 修复完成后执行 Task 12 与最终复核。
