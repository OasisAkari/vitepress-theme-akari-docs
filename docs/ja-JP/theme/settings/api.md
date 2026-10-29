---
tab: API
---

# 設定と外観：API

## settings

| フィールド | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 設定ダイアログを用意するかどうか。`false` のときは歯車ボタンも非表示になります |
| `showSchemeToggle` | `boolean` | `true` | カラーモードボタンを表示するかどうか。`enabled` とは独立しています |
| `title` | `string` | 言語による。「設定」 | 設定ダイアログのタイトル |
| `sections` | `SettingsSectionKey[]` | 6 つすべて | 表示する項目とその順序 |
| `labels` | `Partial<Record<SettingsSectionKey, string>>` | 言語による | 個々の項目のタイトルを上書きします |
| `defaults` | `Partial<AkariThemeSettings>` | 下の表を参照 | すべての読者が初めて訪れたときに見る外観 |
| `persist` | `boolean` | `true` | 読者の選択を `localStorage` に書き込むかどうか |
| `storageKey` | `string` | `"akari-docs-settings"` | `localStorage` のキー名 |

`appBar.showSettingsToggle: false` は歯車ボタンを隠すだけです。設定機能そのものは残ります（たとえば独自のコンポーネントから開けます）。

```ts
settings: {
  sections: ["color", "textSize"],
  labels: { textSize: "本文の文字サイズ" },
  defaults: { color: "#0b57d0", scheme: "time" },
},
```

`sections` の無効な項目は除外され、重複した項目は最初のものだけが残ります。結果が空の場合は、6 つの項目がすべて表示されます。

## AkariThemeSettings

| フィールド | 項目のキー | 値 | デフォルト |
| --- | --- | --- | --- |
| `color` | `color` | 6 桁の 16 進カラー | `"#6750A4"` |
| `variant` | `variant` | `tonal-spot`、`vibrant`、`fidelity`、`expressive`、`monochrome`、`neutral`、`rainbow`、`fruit-salad` | `"tonal-spot"` |
| `scheme` | カラーモードボタン | `auto`、`light`、`dark`、`time` | `"auto"` |
| `contrast` | `contrast` | `standard`、`medium`、`high` | `"standard"` |
| `motion` | `motion` | `standard`、`expressive` | `"expressive"` |
| `direction` | `direction` | `auto`、`ltr`、`rtl` | `"auto"` |
| `textSize` | `textSize` | `16px`、`24px`、`32px`（100%、150%、200% と表示） | `"16px"` |

## akariHead とライトモード・ダークモード

`.vitepress/config.mts` の `head: akariHead()` には、最初のフレームが描画される前にライトモードとダークモードを適用するスクリプトが含まれています。`storageKey` や `defaults.scheme` を変更した場合は、同じ値をこれにも渡してください。

```ts
head: akariHead({ storageKey: "my-docs", defaultScheme: "time" }),
```

また、`html.dark` をテーマだけが管理するように、`appearance: false` のままにしておいてください。

## 保存形式

`localStorage[storageKey]` には、`AkariThemeSettings` と同じフィールドを持つ JSON オブジェクトが入ります。

```json
{
  "color": "#6750A4",
  "variant": "tonal-spot",
  "scheme": "dark",
  "contrast": "standard",
  "motion": "expressive",
  "direction": "auto",
  "textSize": "16px"
}
```

欠けているフィールドや無効なフィールドは、それぞれ個別にデフォルト値に戻ります。

## useAkariSettings

```ts
import { useAkariSettings } from "@theme";

const { settings, setSetting, reset, isDefault } = useAkariSettings();
setSetting("textSize", "24px");
```

| 戻り値 | 説明 |
| --- | --- |
| `settings` | 現在の設定。リアクティブなオブジェクト |
| `setSetting(key, value)` | 設定を 1 つ変更します。`persist` が true のときは `localStorage` にも書き込みます |
| `reset()` | デフォルト値に戻します |
| `isDefault()` | 現在の設定がすべてデフォルト値と等しいかどうか |
| `defaults` | マージ後のデフォルト値 |
| `sections`、`labels` | 解決済みの項目の一覧とそのタイトル |

## useAkariColorScheme

```ts
import { useAkariColorScheme } from "@theme";

const { mode, resolved, cycle } = useAkariColorScheme();
```

| 戻り値 | 型 | 説明 |
| --- | --- | --- |
| `mode` | `ComputedRef<"auto" \| "light" \| "dark" \| "time">` | 読者が選んだモード |
| `resolved` | `Ref<"light" \| "dark" \| null>` | ページが実際にライトとダークのどちらで表示されているか。ブラウザーでマウントされるまでは `null` |
| `cycle()` | `() => void` | 次のモードに切り替えます：システム → ライト → ダーク → 時間帯 → システム |

どちらの関数も、レイアウト内のコンポーネントからのみ呼び出してください。

## 設定パネルの置き換え

設定ダイアログ内のパネルを独自のコンポーネントに置き換えられます（スロット `Settings`）。タイトル、閉じるボタン、モーションは引き続きダイアログが提供します。[テーマの拡張](/ja-JP/theme/extending/api#provideakaricomponents)を参照してください。
