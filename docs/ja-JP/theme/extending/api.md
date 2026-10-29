---
tab: API
---

# テーマの拡張：API

## provideAkariComponents

```ts
import { provideAkariComponents } from "./composables/useAkariConfig";

function provideAkariComponents(
  app: App,
  components: Partial<Record<AkariComponentSlot, Component>>,
): void;
```

テーマのエントリーの `enhanceApp` で呼び出します。渡したコンポーネントがそれぞれ対応する部分を置き換え、渡さなかった部分には組み込みのコンポーネントが使われます。設定ファイルにはデータしか書けないため、コンポーネントは設定ではなくここで渡します。

| スロット | 置き換える部分 | 組み込みのコンポーネント |
| --- | --- | --- |
| `AppBar` | アプリバー | `m3e-app-bar` のアプリバー |
| `DesktopNav` | デスクトップのナビゲーションレールとナビゲーションドロワー | `m3e-nav-rail` と `m3e-nav-menu`。ルート要素は `display: contents` で、レールはページグリッドの 1 列目を全高にわたって占め、常時表示のドロワーは 2 列目の 2 行目に置かれます |
| `Sidebar` | 狭い画面のナビゲーションドロワー | 再帰的な `m3e-nav-menu` |
| `Settings` | 設定ダイアログ内のパネル | 6 つのグループの項目。タイトル、閉じるボタン、モーションはダイアログが提供します |
| `Hero` | ページのヒーロー | タイトルカードと画像カード。フロントマターに `hero` があるときだけ描画されます |
| `Toc` | 右側の目次 | 追従表示される目次 |
| `Pager` | コンテンツ末尾のページ送り | 前のページ・次のページのカード |
| `Footer` | フッター | 波線の区切り線とフッターのサーフェス |
| `Content` | Markdown コンテンツの外側のコンテナ | スタイルのない `div` |

最小限のアプリバーの例です。

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

実際にアプリバーを置き換えるときは、狭い画面でナビゲーションドロワーを開くトグル (`<m3e-drawer-toggle for="akari-sidebar">`) も残してください。これがないと、狭い画面でナビゲーションを開けません。

## コンポーザブル

すべてテーマのエントリーからエクスポートされており (`import { … } from "@theme"`)、レイアウト内のコンポーネントでのみ呼び出せます。

| 関数 | 戻り値 | 参照 |
| --- | --- | --- |
| `useAkariConfig()` | `ComputedRef<ResolvedAkariThemeConfig>`：デフォルト値とマージしたテーマ設定 | 下記 |
| `useSidebar()` | `{ items, prevNext, tabGroup, isActive, hasActive }` | [サイドナビゲーション](/ja-JP/theme/sidebar/api#usesidebar) |
| `useAkariSettings()` | `{ settings, setSetting, reset, isDefault, defaults, sections, labels }` | [設定と外観](/ja-JP/theme/settings/api#useakarisettings) |
| `useAkariColorScheme()` | `{ mode, resolved, cycle }` | [設定と外観](/ja-JP/theme/settings/api#useakaricolorscheme) |
| `useAkariI18n()` | `{ lang, messages, t }` | [国際化](/ja-JP/theme/i18n/api#useakarii18n) |
| `useAkariLocales()` | `{ locales, homeHref }` | [国際化](/ja-JP/theme/i18n/api#useakarilocales) |
| `useAkariSearch()` | 検索パネルの状態と操作 | [検索](/ja-JP/theme/search/api#useakarisearch) |

`useAkariConfig()` の結果には `lang`、`messages`、`appBar`、`sidebar`、`settings`、`toc`、`footer`、`search`、`fonts`、`components` が含まれます。各グループはデフォルト値が補われ、検証済みです（たとえば `toc.maxDepth` は 1 から 6 の範囲に収められます）。

## その他のエクスポート

| エクスポート | 型 | 用途 |
| --- | --- | --- |
| `defineAkariConfig` | `(config: AkariSiteConfig) => AkariDirectoryConfig` | 設定ファイルを書くためのもの。[構成](/ja-JP/getting-started/configuration/api#defineakariconfig)を参照 |
| `defineAkariThemeConfig` | `(config: AkariThemeConfig) => AkariThemeConfig` | テーマのフィールドだけを書くときの型ヘルパー |
| `registerSearchBackend` | `(id, handler) => void` | 検索バックエンドを登録します。[検索](/ja-JP/theme/search/api#registered-backends)を参照 |
| `defineAkariLanguage` | `(language: AkariLanguage) => AkariLanguage` | 言語パックを書くためのもの。[国際化](/ja-JP/theme/i18n/api#akarilanguage)を参照 |
| `AKARI_LANGUAGES` | `AkariLanguage[]` | 組み込みの言語パック |
| `resolveLanguage` | `(lang, languages?) => ResolvedAkariLanguage` | ある言語が最終的に使う言語パック |
| `AKARI_CONTENT_ID` | `"akari-doc-content"` | コンテンツコンテナの id |
| `AKARI_SIDEBAR_ID` | `"akari-sidebar"` | 狭い画面のナビゲーションドロワーの id |
| `AKARI_SETTINGS_ID` | `"akari-settings"` | 設定パネルの id |

型（`AkariThemeConfig`、`AkariSidebarItem`、`AkariSearchResult` など）はすべて `types.ts` からエクスポートされています。

## CSS 変数

| 範囲 | 変数 | 参照 |
| --- | --- | --- |
| ドキュメントサーフェス、目次、フッター | `--akari-doc-*`、`--akari-toc-width`、`--akari-wavy-divider-color` | [レイアウトとアプリバー](/ja-JP/theme/layout/api#css-variables) |
| 並列ページのタブバー | `--akari-app-bar-tabs-gap`、`--akari-page-tabs-docked-max-width` | [サイドナビゲーション](/ja-JP/theme/sidebar/api#tab-bar-css-variables) |
| ヒーローとパターン | `--akari-doc-hero-*`、`--akari-pattern-*` | [ヒーロー](/ja-JP/theme/hero/api#css-variables) |
| カラー | `--md-sys-color-*` | [カラー](/ja-JP/styles/color/api) |
| タイポグラフィ | `--md-sys-typescale-*` | [タイポグラフィ](/ja-JP/styles/typography/api) |
| m3e コンポーネント | `--m3e-card-shape`、`--m3e-button-*` など | m3e の各コンポーネントのドキュメント |

## ソースの構成 {#source-layout}

```text
docs/.vitepress/
├── config.mts             テーマを VitePress に接続
├── content/               フォルダーから言語、パス、ナビゲーションを生成 (Node)
└── theme/
    ├── index.ts           テーマのエントリーと公開エクスポート
    ├── define.ts          defineAkariConfig と defineAkariLanguage
    ├── config.ts          設定のデフォルト値と検証
    ├── types.ts           型定義
    ├── constants.ts       デフォルト値、ブレークポイント、id
    ├── i18n/              言語パックと言語の解決
    │   └── languages/     組み込みの言語パック。1 言語 1 ファイル
    ├── locales.ts         言語切り替えのためのパスの対応付け
    ├── sidebar.ts         ナビゲーションの正規化、照合、ページ送り
    ├── settings.ts        設定の検証と保存
    ├── scheme.ts          ライトモードとダークモードの判定と、最初のフレーム用のスクリプト
    ├── hero.ts            ヒーローのフロントマターの解析
    ├── loading.ts         ローディングバーの進行状況の計算
    ├── head.ts / fonts.ts akariHead と fonts
    ├── markdown.ts        akariMarkdown
    ├── m3e.ts / icons.ts  コンポーネントとアイコンのオンデマンド登録
    ├── layouts/           AkariLayout.vue
    ├── components/
    │   ├── shell/         アプリバー、「その他」メニュー、カラーモードボタンと言語ボタン、ダイアログ、ローディングバー
    │   ├── sidebar/       レール、デスクトップのナビゲーションドロワー、狭い画面のナビゲーション
    │   ├── content/       ヒーロー、タブバー、目次、ページ送り、FAB、フッター
    │   └── settings/      設定ダイアログとパネル
    ├── composables/       コンポーザブル
    ├── search/            検索パネル、バックエンド、状態
    └── styles/            トークン、シェル、コンテンツ、パターン、タブバーのスタイル
```

ブラウザーに依存しないロジック（設定の解決、ナビゲーションの照合、言語のパス、設定の検証、ヒーローの解析、モーションのカーブなど）は純粋関数として書かれており、リポジトリのルートの `tests/` に単体テストがあります。
