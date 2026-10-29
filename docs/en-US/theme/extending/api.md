---
tab: API
---

# Extending the theme: API

## provideAkariComponents

```ts
import { provideAkariComponents } from "./composables/useAkariConfig";

function provideAkariComponents(
  app: App,
  components: Partial<Record<AkariComponentSlot, Component>>,
): void;
```

Call it in `enhanceApp` of the theme entry. Each component you pass replaces the matching part; parts you leave out use the built-in components. Config files can only hold data, so components are provided here instead of in the config.

| Slot | Replaces | Built-in component |
| --- | --- | --- |
| `AppBar` | App bar | `m3e-app-bar` app bar |
| `DesktopNav` | Desktop rail and navigation drawer | `m3e-nav-rail` and `m3e-nav-menu`; the root element is `display: contents`, the rail spans the full height of column 1 of the page grid, and the persistent drawer sits in column 2, row 2 |
| `Sidebar` | Navigation drawer on narrow screens | Recursive `m3e-nav-menu` |
| `Settings` | Panel in the settings dialog | Six groups of options; the title, close button and motion come from the dialog |
| `Hero` | Page hero | Title card and image card, rendered only when the frontmatter has `hero` |
| `Toc` | TOC on the right | Hanging TOC |
| `Pager` | Pager at the end of the content | Previous and next page cards |
| `Footer` | Footer | Wavy divider and footer surface |
| `Content` | Outer container of the Markdown content | Unstyled `div` |

A minimal app bar:

```vue
<script setup lang="ts">
import { useAkariConfig } from "@theme";

const config = useAkariConfig();
</script>

<template>
  <m3e-app-bar>
    <span slot="title">{{ config.appBar.title }}</span>
    <m3e-chip v-if="config.appBar.version" slot="trailing">
      {{ config.appBar.version }}
    </m3e-chip>
  </m3e-app-bar>
</template>
```

When you replace the app bar for real, also keep the toggle that opens the navigation drawer on narrow screens (`<m3e-drawer-toggle for="akari-sidebar">`). Without it, the navigation cannot be opened on narrow screens.

## Composables

All of them are exported from the theme entry (`import { … } from "@theme"`) and can only be called in components inside the layout.

| Function | Returns | See |
| --- | --- | --- |
| `useAkariConfig()` | `ComputedRef<ResolvedAkariThemeConfig>`: the theme config merged with defaults | Below |
| `useSidebar()` | `{ items, prevNext, tabGroup, isActive, hasActive }` | [Side navigation](/en-US/theme/sidebar/api#usesidebar) |
| `useAkariSettings()` | `{ settings, setSetting, reset, isDefault, defaults, sections, labels }` | [Settings](/en-US/theme/settings/api#useakarisettings) |
| `useAkariColorScheme()` | `{ mode, resolved, cycle }` | [Settings](/en-US/theme/settings/api#useakaricolorscheme) |
| `useAkariI18n()` | `{ lang, messages, t }` | [Internationalization](/en-US/theme/i18n/api#useakarii18n) |
| `useAkariLocales()` | `{ locales, homeHref }` | [Internationalization](/en-US/theme/i18n/api#useakarilocales) |
| `useAkariSearch()` | State and actions of the search panel | [Search](/en-US/theme/search/api#useakarisearch) |

The result of `useAkariConfig()` contains `lang`, `messages`, `appBar`, `sidebar`, `settings`, `toc`, `footer`, `search`, `fonts` and `components`. Each group has its defaults filled in and has been validated (for example, `toc.maxDepth` is clamped between 1 and 6).

## Other exports

| Export | Type | Purpose |
| --- | --- | --- |
| `defineAkariConfig` | `(config: AkariSiteConfig) => AkariDirectoryConfig` | Writing config files; see [Configuration](/en-US/getting-started/configuration/api#defineakariconfig) |
| `defineAkariThemeConfig` | `(config: AkariThemeConfig) => AkariThemeConfig` | Type helper when you write only theme fields |
| `registerSearchBackend` | `(id, handler) => void` | Registers a search backend; see [Search](/en-US/theme/search/api#registered-backends) |
| `AKARI_CONTENT_ID` | `"akari-doc-content"` | id of the content container |
| `AKARI_SIDEBAR_ID` | `"akari-sidebar"` | id of the navigation drawer on narrow screens |
| `AKARI_SETTINGS_ID` | `"akari-settings"` | id of the settings panel |

Types (`AkariThemeConfig`, `AkariSidebarItem`, `AkariSearchResult` and others) are all exported from `types.ts`.

## CSS variables

| Scope | Variables | See |
| --- | --- | --- |
| Document surface, TOC, footer | `--akari-doc-*`, `--akari-toc-width`, `--akari-wavy-divider-color` | [Layout and app bar](/en-US/theme/layout/api#css-variables) |
| Tab bar of parallel pages | `--akari-app-bar-tabs-gap`, `--akari-page-tabs-docked-max-width` | [Side navigation](/en-US/theme/sidebar/api#tab-bar-css-variables) |
| Hero and patterns | `--akari-doc-hero-*`, `--akari-pattern-*` | [Hero](/en-US/theme/hero/api#css-variables) |
| Color | `--md-sys-color-*` | [Color](/en-US/styles/color/api) |
| Typography | `--md-sys-typescale-*` | [Typography](/en-US/styles/typography/api) |
| m3e components | Such as `--m3e-card-shape`, `--m3e-button-*` | m3e component docs |

## Source layout

```text
docs/.vitepress/
├── config.mts             connects the theme to VitePress
├── content/               languages, paths and navigation from the folders (Node)
├── search/                parsing, generation and Vite plugin of the local search index (Node)
└── theme/
    ├── index.ts           theme entry and public exports
    ├── define.ts          defineAkariConfig
    ├── config.ts          config defaults and validation
    ├── types.ts           type definitions
    ├── constants.ts       defaults, breakpoints and ids
    ├── i18n.ts            built-in interface strings
    ├── locales.ts         path mapping for switching language
    ├── sidebar.ts         navigation normalizing, matching and paging
    ├── settings.ts        settings validation and storage
    ├── scheme.ts          light and dark mode resolution and first-frame script
    ├── hero.ts            hero frontmatter parsing
    ├── head.ts / fonts.ts akariHead and fonts
    ├── markdown.ts        akariMarkdown
    ├── m3e.ts / icons.ts  on-demand registration of components and icons
    ├── layouts/           AkariLayout.vue
    ├── components/
    │   ├── shell/         app bar, "More" menu, appearance and language buttons, dialogs
    │   ├── sidebar/       rail, desktop navigation drawer, narrow-screen navigation
    │   ├── content/       hero, tab bar, TOC, pager, FABs, footer
    │   └── settings/      settings dialog and panel
    ├── composables/       composables
    ├── search/            search panel, backends and state
    └── styles/            tokens, shell, content, pattern and tab bar styles
```

Logic that does not depend on the browser (config resolution, navigation matching, language paths, settings validation, hero parsing, motion curves and so on) is written as pure functions, with unit tests in `tests/` at the repository root.
