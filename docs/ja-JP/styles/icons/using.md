# アイコンの使い方

アイコンは使う前に登録する必要があります。アイコンの登録は 1 回だけで、以降は Markdown、設定、コンポーネントから名前で参照できます。

## 登録

`docs/.vitepress/theme/icons.ts` でアイコンのモジュールをインポートします。モジュールをインポートすると、アイコンが登録されます。

```ts
import "@m3e/icons/outlined/home";
import "@m3e/icons/outlined/search";
import "@m3e/icons/outlined/rocket_launch";
```

- モジュール名は Material Symbols のアイコン名です。[fonts.google.com/icons](https://fonts.google.com/icons) で調べられます。
- アイコンのパッケージ全体をインポートしないでください。使うアイコンだけをインポートします。インポートしていないアイコンはビルド結果に含まれません。
- 未登録のアイコンを使った `<m3e-icon>` は空白で描画されます。アイコンが表示されない場合は、まず登録されているかを確認してください。

## ページでアイコンを使う

Markdown に `<m3e-icon>` を直接書きます。

```html
<m3e-icon name="rocket_launch"></m3e-icon>
```

ボタンなどのコンポーネントの中では、`slot="icon"` でアイコンを配置します。

<div class="demo-row">
  <m3e-button variant="filled">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    はじめる
  </m3e-button>
  <m3e-button variant="tonal">
    <m3e-icon slot="icon" name="tune"></m3e-icon>
    調整
  </m3e-button>
</div>

```html
<m3e-button variant="filled">
  <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
  はじめる
</m3e-button>
```

## ナビゲーションでアイコンを使う

ナビゲーションレールと、モバイルのドロワーの最上位メニューにあるアイコンはカテゴリのアイコンで、共通設定の `sidebar.categories` で設定します。記事のアイコンはフロントマターに書きます。

```ts
// docs/config.ts
sidebar: {
  categories: {
    "getting-started": { icon: "rocket_launch" },
    styles: { icon: "style" },
  },
},
```

```yaml
# docs/ja-JP/styles/color/index.md
---
icon: colorize
---
```

これらのアイコンも `icons.ts` で登録する必要があります。アイコンのないカテゴリには `category` が表示されます。

## アクセシビリティ

- テキストの隣にあるアイコンは装飾なので、特別な対応は不要です。`<m3e-icon>` はデフォルトで支援技術から隠されています。
- テキストがなくアイコンだけのボタンには名前が必要です。たとえば `<m3e-icon-button aria-label="検索">` とし、同じテキストを表示する `m3e-tooltip` と組み合わせます。
- 方向を表すアイコン（矢印、進む・戻る）は、右から左のレイアウトでペアごと入れ替える必要があります。たとえば `arrow_forward` と `arrow_back` を交換します。方向以外の意味をアイコンだけで伝えないでください。
- ハイコントラストモードでは、アイコンは文字の色に従います。アイコンに固定の色を指定しないでください。
