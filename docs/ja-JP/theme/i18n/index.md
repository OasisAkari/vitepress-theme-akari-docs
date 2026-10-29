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

その言語自体に属するもの（インターフェースの文字列、フォント、文字の方向、Markdown 内の文字列）は、サイトの設定には書きません。これらは[言語パック](#language-packs)にあり、言語コードで照合されます。そのため、言語を追加するときは、このサイト独自の内容だけを書けば済みます。

## 言語を追加する

1. `docs` に言語コードの名前でフォルダーを作り、その中に `config.ts` を書きます。

   ```ts
   // docs/ja-JP/config.ts
   import { defineAkariConfig } from "../.vitepress/theme/define.ts";

   export default defineAkariConfig({
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

言語設定は共通設定の上に重ねられるため、その言語のタイトルとカテゴリ名だけを書けば済みます。バージョン、ソーシャルリンク、カテゴリのアイコンなどは共通設定から引き継がれます。言語メニューに表示される名前は、デフォルトでその言語自身による呼び名（English、日本語）になります。文字の方向、インターフェースの文字列、コードブロックのコピーボタン、コンテナのタイトルは言語パックから取ります。これらはいずれも言語設定で上書きできます。

## 言語の切り替え

サイトに 2 つ以上の言語がある場合、ナビゲーションレールの下部（狭い画面ではナビゲーションドロワーの下部）に言語ボタンが表示されます。クリックすると「言語を選択」ダイアログが開きます。

- 切り替え先の言語に対応するページがあればそのページに留まり、なければその言語のホームページに移動します。そのため、一部のページだけを翻訳した言語でも、読者が 404 に行き着くことはありません。
- ロゴ、フッターのサイト名、404 ページの「ホームに戻る」は、いずれも現在の言語のホームページを指します。

## 言語パック {#language-packs}

言語パックは 1 つの言語を記述します。インターフェースの文字列（ボタン、目次、ページ送り、設定、検索の文字列）、フォント、文字の方向、Markdown 内の文字列（コードブロックのコピーボタンとコンテナのタイトル）です。テーマには簡体字中国語、英語、日本語、韓国語、フランス語、アラビア語の 6 つが付属しています。ページは `lang` で言語パックを探します。まず完全なコードで探し、次に主言語で探し（`zh-TW` は `zh` を使います）、どちらにも一致しなければ英語を使います。言語パックにない文字列も英語になります。

テーマに付属していない言語では、言語パックを書いて共通設定の `languages` に入れます。

```ts
// docs/.vitepress/languages/de.ts
import { defineAkariLanguage } from "../theme/define.ts";

export default defineAkariLanguage({
  code: "de",
  messages: {
    tocOverline: "Auf dieser Seite",
    previousPage: "Zurück",
    nextPage: "Weiter",
    searchPlaceholder: "Suchen",
  },
  markdown: {
    codeCopyButton: { tooltipText: "Code kopieren", copiedText: "Kopiert" },
    container: { tipLabel: "Tipp", warningLabel: "Warnung" },
  },
});
```

```ts
// docs/config.ts
import de from "./.vitepress/languages/de.ts";

export default defineAkariConfig({
  languages: [de],
});
```

これ以降、`de-DE`、`de-AT` などのドイツ語の言語フォルダーはすべてこの言語パックを使います。組み込みの言語パックと同じコードを持つ言語パックは、その上に重ねられます。書いた文字列は対応する項目を置き換え、`fonts` と `dir` は丸ごと置き換えられます。このサイトである言語の文字列をいくつか変えるだけなら、その言語設定に `messages` を書くこともできます。

## このサイトの言語

このサイトのすべてのページには、中国語（サイトのルートで配信）、英語、日本語、韓国語、フランス語、アラビア語の 6 つの版があります。言語を切り替えても同じページに留まります。アラビア語版は右から左にレイアウトされるので、テーマの RTL レイアウトを確認するのに使えます。

すべてのインターフェースの文字列と言語の関数は [API](/ja-JP/theme/i18n/api) を、言語の判定と切り替えの仕組みは[詳細](/ja-JP/theme/i18n/details)を参照してください。
