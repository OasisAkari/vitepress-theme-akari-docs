---
icon: package_2
order: 1
---

# インストール

テーマはリポジトリ内の `docs/.vitepress/theme` にあります。別途インストールするテーマパッケージはありません。

## 動作要件

- Node.js `>=22.12.0`（`package.json` の `engines` フィールド）。リポジトリは Node.js `24.21.0` と npm `12.2.1` で動作を確認しています。
- npm。リポジトリには `package-lock.json` が 1 つだけあります。

## インストールと起動

```bash
npm install
npm run dev
```

開発サーバーはデフォルトで `http://localhost:5173` で起動します。継続的インテグレーションでは、`npm ci` でロックファイルからインストールします。

| コマンド | 用途 |
| --- | --- |
| `npm run dev` | 開発サーバー。Markdown の変更はすぐに反映され、`config.ts` を変更すると自動で再起動します |
| `npm run build` | 静的サイトを `docs/.vitepress/dist` にビルドします |
| `npm run preview` | ビルド結果をローカルでプレビューします |
| `npm run typecheck` | `vue-tsc --noEmit` でテーマとテストを型チェックします |
| `npm test` | Vitest の単体テストを実行します |

## バージョンの基準

| 依存関係 | バージョン | 備考 |
| --- | --- | --- |
| `vitepress` | `2.0.0-alpha.21` | 固定。Vite 8 / Rolldown と Vue 3.5 上に構築 |
| `@m3e/web` | `2.10.2` | Material 3 Expressive Web Components |
| `@m3e/icons` | `1.0.21` | Material Symbols のアイコン。必要に応じて登録 |

VitePress はまだアルファ版です。アップグレードするときは、テーマのコード、設定の型、ビルド結果をあわせて確認してください。

## フォルダー構成

```text
.
├── docs/
│   ├── config.ts                  すべての言語で共通の設定
│   ├── zh-CN/                     簡体字中国語。サイトのルートで配信
│   │   ├── config.ts              共通設定を上書き
│   │   ├── index.md               ホームページ
│   │   └── getting-started/       レールのカテゴリ
│   │       └── installation/
│   │           └── index.md       記事 /getting-started/installation
│   ├── en-US/                     英語。/en-US/ 以下で配信
│   ├── public/                    静的アセット
│   └── .vitepress/
│       ├── config.mts             テーマを VitePress に組み込む
│       ├── content/               フォルダーから言語、パス、ナビゲーションを生成
│       ├── search/                ローカル検索インデックス
│       └── theme/                 テーマのソース
├── tests/                         単体テスト
└── package.json
```

ページと設定の置き場所は [構成](/ja-JP/getting-started/configuration) と [ページの作成](/ja-JP/getting-started/writing) を参照してください。テーマのソースの構成は [テーマの拡張](/ja-JP/theme/extending/api#source-layout) を参照してください。

## デプロイ {#deployment}

`npm run build` はプレーンな静的ファイルを出力するため、どの静的ホスティングでも配信できます。

- **拡張子のないパス**：サイトでは `cleanUrls` を有効にしているため、`/theme/layout` はファイル `theme/layout.html` に対応します。ファイルが見つからないとき、ホスティング側で `.html` を付けて再試行する必要があります。GitHub Pages、Netlify、Cloudflare Pages はデフォルトでこの動作をします。Vercel では `vercel.json` に `"cleanUrls": true` が必要です。Nginx では `try_files $uri $uri.html $uri/ =404;` と書きます。
- **サブパスで配信する場合**：たとえば `https://example.com/docs/` では、`.vitepress/config.mts` に `base: "/docs/"` を設定します。ナビゲーション、ヒーロー、ロゴ、検索インデックスの内部パスには自動で付加されます。
- **検索インデックス**：`search-index.json` はビルド時に生成され、出力のルートにコピーされます。追加の手順は不要です。

## よくある質問

### ページが空白になる、またはコンポーネントにスタイルが当たらない

テーマはブラウザーで m3e コンポーネントを登録し、登録が終わると `html` に `data-akari-ready` を付けます。まずブラウザーのコンソールでモジュールの読み込みエラーを確認してください。スクリプトが無効、または読み込みに失敗した場合は、3 秒後にコンテンツがプレーンな HTML として表示されます。ブラウザーは Custom Elements、Shadow DOM、ネイティブの ES モジュールに対応している必要があります。

### コンポーネントをブラウザーでのみ登録する理由

m3e コンポーネントは Lit のカスタム要素です。登録には `customElements.define` が必要ですが、Node.js にはありません。テーマのエントリーはブラウザーでのみ `m3e.ts` をインポートし、サーバーサイドレンダリングでは要素のタグとそのスロットの内容だけを出力します。サーバーで実行されるコードでは、`@m3e/web` のコンポーネントモジュールをインポートしないでください。

### 新しいコンポーネントやアイコンが表示されない

コンポーネントもアイコンも、必要に応じて登録されます。コンポーネントは `docs/.vitepress/theme/m3e.ts` でそのサブパスをインポートします（すべてのコンポーネントを登録する `@m3e/web/all` はインポートしないでください）。アイコンは `icons.ts` でインポートします。登録されていないアイコンは空白で表示されます。

### ビルドで不明な Vue コンポーネントが報告される

`.vitepress/config.mts` では、`vue.template.compilerOptions.isCustomElement` で `m3e-` で始まるタグを通しています。テーマを別のプロジェクトで再利用するときも、この設定を残してください。
