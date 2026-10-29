---
tab: API
---

# 国際化：API

## 言語設定

| フィールド | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `rootLanguage` | `string` | アルファベット順で最初の言語フォルダー | 共通設定でのみ有効。サイトのルートで配信する言語 |
| `lang` | `string` | 言語フォルダーの名前 | 言語コード。`<html lang>` と、組み込みのインターフェース文字列の選択に使われます |
| `label` | `string` | `lang` | 言語メニューに表示する名前 |
| `dir` | `"ltr" \| "rtl" \| "auto"` | `"ltr"` | 文字の方向。右から左に書く言語では `rtl` を設定します。文字の方向の設定が「言語に合わせる」のときに使われます |
| `markdown` | `MarkdownLocaleOptions` | なし | Markdown 内のこの言語の文字列。たとえば `codeCopyButton: { tooltipText, copiedText }` |
| `messages` | `Partial<AkariMessages>` | なし | インターフェースの文字列を上書き、または補います |

ほかのフィールド（`title`、`description`、`appBar`、`footer`、`search` など）も言語設定に書けます。[構成](/ja-JP/getting-started/configuration/api)を参照してください。

## messages

テーマには、簡体字中国語 (`zh`)、英語 (`en`)、日本語 (`ja`)、韓国語 (`ko`)、フランス語 (`fr`)、アラビア語 (`ar`) の 6 セットのインターフェース文字列が組み込まれています。`messages` に書いた項目は組み込みの文字列を置き換え、書かなかった項目は組み込みの値のままです。`{name}` を含む項目には、実行時に対応する値が入ります。

### ナビゲーションとアプリバー

| キー | 日本語のデフォルト |
| --- | --- |
| `navigationToggle` | ナビゲーションを切り替え |
| `navigationLabel` | ドキュメント |
| `railLabel` | ドキュメントのカテゴリ |
| `categoryNavigation` | {category}のナビゲーション |
| `categoryPages` | {category}のページ |
| `homeLink` | {title} ホーム |
| `moreActions` | その他 |
| `backToTop` | トップに戻る |
| `tocButton` | 目次 |
| `languageLabel` | 言語を切り替え |
| `languageDialogTitle` | 言語を選択 |
| `languageDialogClose` | 閉じる |

### 目次、ページ送り、フッター

| キー | 日本語のデフォルト |
| --- | --- |
| `tocOverline` | このページの内容 |
| `pagerLabel` | ページ送り |
| `previousPage` | 前へ |
| `nextPage` | 次へ |
| `footerMessage` | VitePress と M3E で構築 |
| `footerLinks` | フッターのリンク |
| `notFoundTitle` | ページが見つかりません |
| `notFoundText` | お探しのページは移動または削除された可能性があります。 |
| `notFoundLink` | ホームに戻る |

### 設定

| キー | 日本語のデフォルト |
| --- | --- |
| `settingsTitle` | 設定 |
| `settingsClose` | 設定を閉じる |
| `settingsColor` | カラー |
| `settingsVariant` | バリアント |
| `settingsContrast` | コントラスト |
| `settingsMotion` | モーション |
| `settingsDirection` | 文字の方向 |
| `settingsTextSize` | 文字サイズ |
| `contrastStandard` | 標準 |
| `contrastMedium` | 中 |
| `contrastHigh` | 高 |
| `motionStandard` | 標準 |
| `motionExpressive` | エクスプレッシブ |
| `directionAuto` | 言語に合わせる |
| `directionLtr` | 左から右 |
| `directionRtl` | 右から左 |

### 外観

| キー | 日本語のデフォルト |
| --- | --- |
| `schemeToggle` | 外観：{mode} |
| `schemeLight` | ライト |
| `schemeAuto` | システム |
| `schemeDark` | ダーク |
| `schemeTime` | 時間帯 |
| `schemeChanged` | テーマを切り替えました：{mode} |
| `schemeChangedFollowing` | テーマを切り替えました：{mode}（{scheme}） |

### 検索

| キー | 日本語のデフォルト |
| --- | --- |
| `searchPlaceholder` | ドキュメントを検索 |
| `searchLabel` | ドキュメントを検索 |
| `searchShortcutLabel` | {label}、ショートカット {shortcut} |
| `searchClose` | 検索を閉じる |
| `searchIntroTitle` | ドキュメントを検索 |
| `searchIntroText` | ページのタイトル、コンポーネント名、本文の語句を入力してください。 |
| `searchIntroShortcut` | {keys} でいつでも開けます |
| `searchLoading` | 検索中… |
| `searchErrorTitle` | 検索を利用できません |
| `searchRetry` | 再試行 |
| `searchEmptyTitle` | 結果が見つかりません |
| `searchEmptyText` | 短いキーワードを試すか、検索バックエンドの設定を確認してください。 |
| `searchResultCountOne` | {count} 件の結果 |
| `searchResultCount` | {count} 件の結果 |
| `searchResultsLabel` | 検索結果 |
| `searchResultPage` | ページ |
| `searchHintSelect` | 選択 |
| `searchHintOpen` | 開く |
| `searchHintClose` | 閉じる |
| `searchFailed` | 検索に失敗しました。しばらくしてからもう一度お試しください。 |
| `searchIndexUnavailable` | ローカル検索インデックスを読み込めませんでした（HTTP {status}）。 |
| `searchIndexInvalid` | ローカル検索インデックスの形式が正しくありません。 |
| `searchRequestFailed` | 検索リクエストに失敗しました（HTTP {status}）。 |
| `searchBackendMissing` | 検索バックエンド「{id}」は登録されていません。 |

`searchResultCountOne` は複数形のカテゴリが `one` になる数（英語の「1 result」）に使われ、それ以外の数には `searchResultCount` が使われます。カテゴリは `Intl.PluralRules` が言語に応じて判定します。`{keys}` は表示時にキーキャップとして描画されます。

## useAkariI18n

```ts
import { useAkariI18n } from "@theme";

const { lang, messages, t } = useAkariI18n();
t("homeLink", { title: "Vitepress Theme Akari Docs" }); // "Vitepress Theme Akari Docs ホーム"
```

| 戻り値 | 説明 |
| --- | --- |
| `lang` | 現在の言語コード |
| `messages` | 現在の言語のすべてのインターフェース文字列。`messages` の設定がマージされています |
| `t(key, params?)` | 文字列を 1 つ取得し、プレースホルダーを埋めます |

## useAkariLocales

```ts
import { useAkariLocales } from "@theme";

const { locales, homeHref } = useAkariLocales();
```

| 戻り値 | 説明 |
| --- | --- |
| `locales` | 言語の一覧。各要素は `{ key, label, lang, href, current }` で、`href` はその言語に切り替えるときに開く URL です。サイトの言語が 1 つだけのときは空の配列 |
| `homeHref` | 現在の言語のホームページの URL。`base` が付いています |

どちらの関数も、レイアウト内のコンポーネントでのみ呼び出してください。

## 検索での言語

登録した検索バックエンドは、第 2 引数で `lang`（`zh-CN` など）と `locale`（VitePress のロケールキー。ルート言語では `root`）を受け取ります。[検索](/ja-JP/theme/search/api#registered-backends)を参照してください。
