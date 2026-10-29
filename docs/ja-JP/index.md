---
title: 概要
toc: false
category: getting-started
icon: home
---

# 概要

Vitepress Theme Akari Docs は、VitePress と `@m3e/web` で作られたドキュメントテーマです。

<div class="demo-row">
  <m3e-button variant="filled" href="/ja-JP/getting-started/installation.html">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    インストールガイド
  </m3e-button>
  <m3e-chip>
    <m3e-icon slot="icon" name="check"></m3e-icon>
    テーマ準備完了
  </m3e-chip>
  <m3e-chip variant="elevated">
    <m3e-icon slot="icon" name="layers"></m3e-icon>
    Web Components
  </m3e-chip>
  <m3e-badge size="large">v1.0.0</m3e-badge>
</div>

## 特長

<div class="demo-grid">
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Material 3 Expressive</m3e-heading>
    <div slot="content">カラー、シェイプ、モーション、タイポグラフィはすべて m3e のデザイントークンに基づき、公式の Material 3 と一致します。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">フォルダーで整理</m3e-heading>
    <div slot="content">言語フォルダーの中では、フォルダーがカテゴリになり、その中のフォルダーが記事になります。ナビゲーションと言語の一覧は、フォルダーとフロントマターから作られます。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">並列ページとヒーロー</m3e-heading>
    <div slot="content">1 つの記事を複数のページに分け、タブバーで切り替えられます。ヒーローのあるページは、画像から配色を取ります。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">設定と外観</m3e-heading>
    <div slot="content">ライトとダークを切り替えるカラーモードは 4 種類あります。カラー、バリアント、コントラスト、モーション、文字の方向、文字サイズはすぐに反映され、現在のブラウザーに保存されます。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">検索と多言語</m3e-heading>
    <div slot="content">ローカルインデックスは設定なしで動作し、HTTP やカスタムのバックエンドに差し替えることもできます。言語を切り替えても、対応するページにとどまります。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">置き換えと拡張</m3e-heading>
    <div slot="content">アプリバー、目次、フッターなどのコンポーネントを置き換えたり、CSS 変数を上書きして見た目を調整したりできます。</div>
  </m3e-card>
</div>

## クイックスタート

```bash
npm install
npm run dev
```

次に読むページ：

- [インストール](/ja-JP/getting-started/installation)：テンプレートからのリポジトリ作成、動作要件とデプロイ。
- [構成](/ja-JP/getting-started/configuration)：共通設定と言語設定。
- [ページの作成](/ja-JP/getting-started/writing)：新しい記事、フロントマター、Markdown。
- [レイアウトとアプリバー](/ja-JP/theme/layout)、[サイドナビゲーション](/ja-JP/theme/sidebar)：テーマの外枠を構成する各部分。

このサイトは中国語、英語、日本語、韓国語、フランス語、アラビア語で提供しています。ナビゲーションレールの下部にある言語ボタンで切り替えます。
