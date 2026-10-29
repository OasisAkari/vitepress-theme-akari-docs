---
icon: translate
order: 6
tab: 概要
parallel:
  - api
  - details
---

# 国際化

各言語は `docs` 内のフォルダーで、`zh-CN` や `en-US` のように言語コードで名前を付けます。ルート言語はサイトのルートで配信され、ほかの言語のパスはそのフォルダー名で始まります。現在のページの言語によって、インターフェースの文字列、ナビゲーション、フッター、検索の範囲が決まります。

## 言語を追加する

1. `docs` に言語コードの名前でフォルダーを作り、その中に `config.ts` を書きます。

   ```ts
   // docs/ja-JP/config.ts
   import { defineAkariConfig } from "../.vitepress/theme/define.ts";

   export default defineAkariConfig({
     label: "日本語",
     title: "Vitepress Theme Akari Docs",
     appBar: { title: "Vitepress Theme Akari Docs" },
     sidebar: {
       categories: {
         "getting-started": { text: "はじめに" },
         theme: { text: "テーマ" },
       },
     },
     footer: { message: "VitePress と M3E Web Components で構築" },
   });
   ```

2. ルート言語と同じ構成でページを追加します。`docs/ja-JP/index.md` がこの言語のホームページになり、`docs/ja-JP/getting-started/installation/index.md` は中国語の `/getting-started/installation` に対応します。
3. 必要に応じて、共通設定で `rootLanguage` を設定し、ルートで配信する言語を選びます。

言語設定は共通設定の上に重ねられるため、その言語独自の名前、タイトル、カテゴリ名だけを書けば済みます。バージョン、ソーシャルリンク、カテゴリのアイコンなどは共通設定から引き継がれます。右から左に書く言語（アラビア語、ヘブライ語など）は、言語設定で `dir: "rtl"` も設定します。

## 言語の切り替え

サイトに 2 つ以上の言語がある場合、ナビゲーションレールの下部（狭い画面ではナビゲーションドロワーの下部）に言語ボタンが表示されます。クリックすると「言語を選択」ダイアログが開きます。

- 切り替え先の言語に対応するページがあればそのページに留まり、なければその言語のホームページに移動します。そのため、一部のページだけを翻訳した言語でも、読者が 404 に行き着くことはありません。
- ロゴ、フッターのサイト名、404 ページの「ホームに戻る」は、いずれも現在の言語のホームページを指します。

## インターフェースの文字列

ボタン、目次、ページ送り、設定、検索の文字列として、テーマには簡体字中国語、英語、日本語、韓国語、フランス語、アラビア語が組み込まれており、言語コードで選ばれます。それ以外の言語では英語が使われ、言語設定の `messages` で文字列を補えます。

```ts
// docs/de-DE/config.ts
export default defineAkariConfig({
  label: "Deutsch",
  messages: {
    tocOverline: "Auf dieser Seite",
    previousPage: "Zurück",
    nextPage: "Weiter",
    searchPlaceholder: "Suchen",
  },
});
```

## このサイトの言語

このサイトのすべてのページには、中国語（サイトのルートで配信）、英語、日本語、韓国語、フランス語、アラビア語の 6 つの版があります。言語を切り替えても同じページに留まります。アラビア語版は右から左にレイアウトされるので、テーマの RTL レイアウトを確認するのに使えます。

すべてのインターフェースの文字列と言語の関数は [API](/ja-JP/theme/i18n/api) を、言語の判定と切り替えの仕組みは[詳細](/ja-JP/theme/i18n/details)を参照してください。
