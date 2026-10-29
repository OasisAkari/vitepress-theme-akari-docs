---
icon: colorize
order: 1
tab: 概要
parallel:
  - api
---

# カラー

テーマの色はすべて m3e のダイナミックカラーから作られます。必要なのはシードカラー 1 つだけです。`m3e-theme` がそこから `--md-sys-color-*` トークン一式を生成します。カラーモード、コントラスト、バリアントを切り替えると、パレット全体がまとめて更新されます。

## ダイナミックカラー

シードカラーは色相とトーンの関係を決め、実際の明度は Material 3 のトーンマッピングが計算します。そのため、同じシードからライトモードでもダークモードでも読みやすい色が得られます。次のデモは、ティールのシードからローカルのパレットを生成しています。

<m3e-theme color="#006A6A">
  <div class="swatch-grid">
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-primary)"></div>
      <code>--md-sys-color-primary</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-primary-container)"></div>
      <code>--md-sys-color-primary-container</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-secondary-container)"></div>
      <code>--md-sys-color-secondary-container</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-tertiary)"></div>
      <code>--md-sys-color-tertiary</code>
    </div>
  </div>
</m3e-theme>

サイトのデフォルトのシードカラーは、共通設定の `settings.defaults.color` で設定します。読者は設定で好きな色に変更できます。ヒーローのあるページは、画像から取った色を使います。[ヒーロー](/ja-JP/theme/hero) を参照してください。

## バリアント {#variants}

同じシードカラーから、さまざまな方法でパレットを生成できます。デフォルトは `tonal-spot` です。

<div class="demo-row">
  <m3e-chip variant="elevated">Tonal Spot</m3e-chip>
  <m3e-chip>Vibrant</m3e-chip>
  <m3e-chip>Fidelity</m3e-chip>
  <m3e-chip>Expressive</m3e-chip>
  <m3e-chip>Monochrome</m3e-chip>
  <m3e-chip>Neutral</m3e-chip>
  <m3e-chip>Rainbow</m3e-chip>
  <m3e-chip>Fruit Salad</m3e-chip>
</div>

| バリアント | 特徴 |
| --- | --- |
| `tonal-spot` | バランスがよく彩度が低めです。ほとんどのドキュメントサイトに向いています |
| `vibrant` | プライマリカラーの彩度が高く、ブランドの印象が強くなります |
| `fidelity` | シードカラーそのものに近い色を保ちます |
| `expressive` | 色相の変化がより生き生きとしています |
| `monochrome` | 色味をなくし、明度の段階だけを残します |
| `neutral` | ニュートラルに近いサーフェスの色 |
| `rainbow` | ロール間の色相の差が大きくなります |
| `fruit-salad` | 色相の分離が最も強く、デモやクリエイティブな用途に向いています |

## ライト、ダーク、コントラスト

同じパレットをライトとダークに割り当てたもの：

<div class="demo-grid">
  <m3e-theme scheme="light">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>ライトモード</strong>
      <p>明るいサーフェスに暗い文字。日中の利用や投影に向いています。</p>
    </div>
  </m3e-theme>
  <m3e-theme scheme="dark">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>ダークモード</strong>
      <p>暗いサーフェスに明るい文字。暗い場所や長時間の読書に向いています。</p>
    </div>
  </m3e-theme>
</div>

コントラストには「標準」「中」「高」の 3 段階があります。前景と背景の明度差と、アウトラインの強さに影響します。カラーモードには 4 つの選択肢があります。[設定と外観](/ja-JP/theme/settings) を参照してください。

## 使い方のガイドライン

- 色をハードコードしないでください。常に `--md-sys-color-*` トークンか m3e コンポーネントの変数を使います。
- コンテナの色とコンテンツの色はペアで使います：`primary` と `on-primary`、`surface-container` と `on-surface`。
- 階層の区別には `surface-container-lowest` から `surface-container-highest` を使います。影の重ね合わせに頼らないでください。
- 枠線と区切り線には `outline-variant` を使い、強調が必要な場合は `outline` を使います。エラーの状態には `error` と `error-container` を使います。
- 固定のブランドカラーが必要な場合は、コンポーネントごとに上書きするのではなく、それをシードカラーにします。
- カスタムの背景、影、半透明のスクリムは、ダークモードと高コントラストで個別に確認してください。

すべてのカラートークンは [API](/ja-JP/styles/color/api) を参照してください。
