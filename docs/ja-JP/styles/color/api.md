---
tab: API
---

# カラー：API

`m3e-theme` は、Material 3 のダイナミックカラーの仕様（2025 年版）に従って次のトークンを生成します。CSS で使います。

```css
.panel {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}
```

トークンは `m3e-theme` の中でだけ値を持ちます。テーマがトークンをルート要素にコピーするので、ページのどこでも使えます。

## アクセントカラー

| トークン | 用途 |
| --- | --- |
| `--md-sys-color-primary`、`--md-sys-color-on-primary` | 最も重要な操作と、その上の文字 |
| `--md-sys-color-primary-container`、`--md-sys-color-on-primary-container` | 目立たせたいが、それほど強くなくてよいコンテナ |
| `--md-sys-color-primary-dim` | 暗めのプライマリカラー |
| `--md-sys-color-inverse-primary` | 反転サーフェス上のプライマリカラー |
| `--md-sys-color-secondary`、`--md-sys-color-on-secondary` | 副次的な強調 |
| `--md-sys-color-secondary-container`、`--md-sys-color-on-secondary-container` | セカンダリのコンテナ。選択中のナビゲーション項目やフローティングアクションボタンなど |
| `--md-sys-color-secondary-dim` | 暗めのセカンダリカラー |
| `--md-sys-color-tertiary`、`--md-sys-color-on-tertiary` | プライマリカラーと対比させる強調 |
| `--md-sys-color-tertiary-container`、`--md-sys-color-on-tertiary-container` | ターシャリのコンテナ |
| `--md-sys-color-tertiary-dim` | 暗めのターシャリカラー |

各アクセントカラーには、ライトとダークで変わらない固定色もあります：`*-fixed`、`*-fixed-dim`、`on-*-fixed`、`on-*-fixed-variant`（`*` は `primary`、`secondary`、`tertiary`）。

## サーフェス

| トークン | 用途 |
| --- | --- |
| `--md-sys-color-surface`、`--md-sys-color-on-surface` | デフォルトのサーフェスと文字。ドキュメントサーフェスは `surface` を使います |
| `--md-sys-color-surface-dim`、`--md-sys-color-surface-bright` | 最も暗いサーフェスと最も明るいサーフェス |
| `--md-sys-color-surface-container-lowest` | 最も低いコンテナ |
| `--md-sys-color-surface-container-low` | 低いコンテナ。デモ領域など |
| `--md-sys-color-surface-container` | デフォルトのコンテナ。ヒーローのテキストカードやテーブルのヘッダーなど |
| `--md-sys-color-surface-container-high` | 高いコンテナ |
| `--md-sys-color-surface-container-highest` | 最も高いコンテナ |
| `--md-sys-color-on-surface-variant` | 補助的な文字。キャプションやテーブルのヘッダーの文字など |
| `--md-sys-color-surface-variant` | 補助的なサーフェス |
| `--md-sys-color-inverse-surface`、`--md-sys-color-inverse-on-surface` | 反転したサーフェスと文字。スナックバーなど |
| `--md-sys-color-background`、`--md-sys-color-on-background` | ページの背景と文字 |
| `--md-sys-color-surface-tint` | サーフェスの色合い |

## アウトライン、エラー、スクリム

| トークン | 用途 |
| --- | --- |
| `--md-sys-color-outline` | 強調が必要な枠線 |
| `--md-sys-color-outline-variant` | 区切り線と通常の枠線。テーブルの枠線など |
| `--md-sys-color-error`、`--md-sys-color-on-error` | エラー |
| `--md-sys-color-error-container`、`--md-sys-color-on-error-container` | エラーのコンテナ |
| `--md-sys-color-error-dim` | 暗めのエラーカラー |
| `--md-sys-color-shadow` | 影 |
| `--md-sys-color-scrim` | ダイアログの背後のスクリム |

## ローカルパレット

ページ内のコンテンツを `m3e-theme` で囲むと、そのコンテンツ用に別のパレットを生成します。[カラー](/ja-JP/styles/color) の概要ページのデモはまさにこの方法です。

```html
<m3e-theme color="#006A6A" scheme="dark" variant="vibrant" contrast="high">
  <!-- コンテンツ -->
</m3e-theme>
```

| 属性 | 値 |
| --- | --- |
| `color` | シードカラー。6 桁の 16 進数の値 |
| `scheme` | `light`、`dark`、`auto` |
| `variant` | [バリアント](/ja-JP/styles/color#variants) を参照 |
| `contrast` | `standard`、`medium`、`high` |
| `motion` | `standard`、`expressive` |

サイト全体のシードカラー、バリアント、コントラストは設定で決まります。[設定と外観](/ja-JP/theme/settings/api#akarithemesettings) を参照してください。
