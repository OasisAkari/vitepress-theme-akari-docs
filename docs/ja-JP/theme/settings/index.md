---
icon: settings
order: 4
tab: 概要
parallel:
  - api
  - details
---

# 設定と外観

読者はページの見た目を調整できます。ナビゲーションレールの下部（狭い画面ではナビゲーションドロワーの下部）にある丸いカラーモードボタンでライトモードとダークモードを切り替え、アプリバーの歯車ボタンで設定を開きます。これらの項目は読者自身のブラウザーにだけ適用されます。`localStorage` に保存され、ほかの訪問者には影響しません。

## ライトモードとダークモード

ボタンを押すたびに次のモードに切り替わり、画面の下部にスナックバーが表示されます。たとえば「テーマを切り替えました：ダーク」です。

| モード | アイコン | 効果 |
| --- | --- | --- |
| システム | `brightness_auto` | システムのライト・ダークの設定に従う（デフォルト） |
| ライト | `light_mode` | 常にライト |
| ダーク | `dark_mode` | 常にダーク |
| 時間帯 | `schedule` | 19:00 から翌日 07:00 まではダーク、それ以外の時間はライト |

「システム」と「時間帯」のモードでは、スナックバーに現在ページがライトかダークかも表示されます。たとえば「テーマを切り替えました：システム（ダーク）」です。

## 設定

歯車ボタンで開く設定ダイアログには、6 つのグループの項目があります。変更はすぐに反映されます。

| 項目 | 内容 |
| --- | --- |
| カラー | テーマのシードカラー |
| バリアント | シードカラーからパレットを生成する方法。たとえば Tonal Spot や Vibrant |
| コントラスト | 標準、中、高 |
| モーション | 標準、エクスプレッシブ |
| 文字の方向 | 言語に合わせる、左から右、右から左 |
| 文字サイズ | 100%、150%、200% |

<div class="demo-surface">
  <div class="demo-stack">
    <div class="demo-row">
      <strong>バリアント</strong>
      <m3e-filter-chip-set aria-label="バリアントの例">
        <m3e-filter-chip selected value="tonal-spot">Tonal Spot</m3e-filter-chip>
        <m3e-filter-chip value="vibrant">Vibrant</m3e-filter-chip>
        <m3e-filter-chip value="expressive">Expressive</m3e-filter-chip>
        <m3e-filter-chip value="monochrome">Monochrome</m3e-filter-chip>
      </m3e-filter-chip-set>
    </div>
    <div class="demo-row">
      <strong>永続化</strong>
      <m3e-switch id="settings-demo-persist" checked aria-label="永続化の例"></m3e-switch>
      <span>このブラウザーに保存</span>
    </div>
  </div>
</div>

これらのコントロールは見た目のデモにすぎません。変更してもテーマは変わりません。

ヒーローのあるページでは、代わりに画像から取り出した色が使われます。ページを離れると、設定の色に戻ります。

## サイトのデフォルトの外観

読者の選択はその読者のブラウザーにだけ保存されます。すべての人が初めて訪れたときに見る外観を変えるには、共通設定でデフォルト値を設定します。

```ts
// docs/config.ts
settings: {
  defaults: {
    color: "#6750A4",
    scheme: "auto",
    motion: "expressive",
  },
},
```

一部の項目だけを表示したり、カラーモードボタンを非表示にしたりもできます。[API](/ja-JP/theme/settings/api) を参照してください。ライトモードとダークモードが最初のフレームより前に反映される仕組みと、各項目が適用される場所は[詳細](/ja-JP/theme/settings/details)を参照してください。
