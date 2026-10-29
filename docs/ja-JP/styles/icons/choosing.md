# アイコンの選び方

Material Symbols のアイコンには、3 つのスタイルと 2 つの形があります。テーマはデフォルトでアウトラインのスタイルを使い、選択中やオンなどの状態には塗りつぶしの形を使います。

## スタイル

| スタイル | 特徴 | インポートパス |
| --- | --- | --- |
| Outlined | 均一な線と明快な間隔。M3 のコンポーネントと最もよく合います | `@m3e/icons/outlined/<name>` |
| Rounded | 線の端と角が丸く、柔らかい印象 | `@m3e/icons/rounded/<name>` |
| Sharp | 角が直角で、硬い印象 | `@m3e/icons/sharp/<name>` |

1 つのインターフェースの中では 1 つのスタイルに統一します。テーマのナビゲーション、アプリバー、ボタンはすべて Outlined を使っています。サイト全体を Rounded に切り替えるには、`icons.ts` のインポートをすべて置き換え、`<m3e-icon>` に `variant="rounded"` を設定します。

## アウトラインと塗りつぶし

`filled` 属性を付けると、アイコンの塗りつぶしの形が表示されます。

<div class="demo-row">
  <m3e-icon name="home"></m3e-icon>
  <m3e-icon name="home" filled></m3e-icon>
  <m3e-icon name="settings"></m3e-icon>
  <m3e-icon name="settings" filled></m3e-icon>
  <m3e-icon name="palette"></m3e-icon>
  <m3e-icon name="palette" filled></m3e-icon>
</div>

```html
<m3e-icon name="home"></m3e-icon>
<m3e-icon name="home" filled></m3e-icon>
```

M3 では塗りつぶしで「現在」や「オン」を表します。ナビゲーションレールでは、現在のカテゴリのアイコンが塗りつぶしになり、ほかはアウトラインです。塗りつぶしだけで状態を示さないでください。選択中の項目は背景色とテキストも変わります。

## サイズ

アイコンはデフォルトで 24px で、`font-size` に合わせて拡大・縮小します。よく使うサイズ：

| サイズ | 用途 |
| --- | --- |
| 20px | コンパクトなリスト、インラインの注記 |
| 24px | デフォルト：ボタン、ナビゲーション、リストの項目 |
| 40px 以上 | 空の状態のイラスト、オンボーディングのページ |

```html
<m3e-icon name="search" style="font-size: 20px"></m3e-icon>
<m3e-icon name="search_off" style="font-size: 48px"></m3e-icon>
```

ボタンやナビゲーション項目などのコンポーネントの中では、アイコンのサイズを変えないでください。これらのコンポーネントは、M3 の仕様に従ってアイコンのサイズと間隔をすでに設定しています。

## 適切なアイコンを選ぶ

- 意味が定着しているアイコンを優先します：検索には `search`、設定には `settings`、言語には `translate`。
- 1 つの意味には 1 つのアイコンを使い、場所によって同じアイコンを別の操作に使わないでください。
- 抽象的な概念（「テーマ」や「コンポーネント」など）に一般的なアイコンがない場合は、24px でもはっきり見える単純な形のアイコンを選び、必ずテキストと組み合わせます。
