---
tab: API
---

# 検索：API

## search

| フィールド | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 検索の入口を表示し、ショートカットを登録するかどうか |
| `placeholder` | `string` | 言語による。「ドキュメントを検索」 | 検索ボックスのプレースホルダーテキスト |
| `shortcut` | `string` | `"k"` | `⌘` / `Ctrl` と組み合わせるキー。空文字列でショートカットがオフになります |
| `maxResults` | `number` | `8` | 結果の最大数。1 から 20 の範囲に収められます |
| `debounce` | `number` | `180` | 入力のデバウンス（ミリ秒）。0 から 1000 の範囲に収められます |
| `backend` | `AkariSearchBackendConfig` | ローカルインデックス | `local`、`http`、`registered` のいずれか |

`search` は言語設定にも書けるので、言語ごとに別のバックエンドを使えます。

## ローカルバックエンド

```ts
backend: { type: "local", endpoint: "/search-index.json" },
```

`endpoint` は同一オリジンの別の静的 JSON ファイルを指すこともできます。相対パスには `base` が自動で付きます。ファイルの形式は次のとおりです。

```ts
interface SearchIndexFile {
  version: 1;
  generatedAt: string;          // ISO 形式の時刻
  entries: SearchIndexEntry[];
}

interface SearchIndexEntry {
  id: string;                   // "/ja-JP/theme/layout::page" または "/ja-JP/theme/layout::アプリバー"
  pageTitle: string;            // ページのタイトル
  title: string;                // ページの項目ではページのタイトル、セクションの項目ではセクションの見出し
  heading: string;              // セクションの見出し。ページの項目では空
  href: string;                 // "/ja-JP/theme/layout#アプリバー"
  content: string;              // マークアップを除いた本文。最大 4000 文字
  level: number;                // ページの項目は 0、セクションは 2 または 3
}
```

## HTTP バックエンド

```ts
backend: {
  type: "http",
  endpoint: "/api/docs/search",
  method: "POST",
  headers: { Authorization: "Bearer YOUR_TOKEN" },
  credentials: "include",
  queryParam: "q",
  limitParam: "limit",
},
```

| フィールド | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `endpoint` | `string` | 必須 | エンドポイントの URL。相対パスには `base` が付き、絶対 URL はそのまま使われます |
| `method` | `"GET" \| "POST"` | `"GET"` | `GET` はクエリをクエリパラメーターに入れ、`POST` は JSON を送ります：`{ "q": "keyword", "limit": 8 }` |
| `headers` | `Record<string, string>` | `{}` | リクエストヘッダー |
| `credentials` | `RequestCredentials` | `"same-origin"` | Cookie を送るかどうか |
| `queryParam` | `string` | `"q"` | クエリのパラメーター名 |
| `limitParam` | `string` | `"limit"` | 結果の上限のパラメーター名 |

レスポンスは結果の配列でも、`{ "results": [...] }` でもかまいません。テーマは各結果から次のフィールドを読み取ります：`title`、`href`（または `url`、`path`）、`pageTitle`、`heading`、`excerpt`（または `content`、`snippet`、`description`）、`id`。

```json
{
  "results": [
    {
      "id": "button-variants",
      "title": "バリアント",
      "pageTitle": "ボタン",
      "heading": "バリアント",
      "href": "/ja-JP/components/button#バリアント",
      "excerpt": "5 つのスタイルで、強調の度合いを高から低まで表します…"
    }
  ]
}
```

2xx 以外のレスポンス、ネットワークエラー、構造が正しくないレスポンスでは、エラーと再試行ボタンが表示されます。

## 登録したバックエンド {#registered-backends}

テーマのエントリーで関数を登録し、設定でその id を参照します。

```ts
// docs/.vitepress/theme/index.ts
import { registerSearchBackend } from "./search/registry";

registerSearchBackend("my-search", async (query, { limit, signal, lang }) => {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&lang=${lang}`,
    { signal },
  );
  if (!response.ok) throw new Error("検索に失敗しました");
  const data = await response.json();
  return data.results.slice(0, limit);
});
```

```ts
// docs/config.ts
search: { backend: { type: "registered", id: "my-search" } },
```

```ts
function registerSearchBackend(id: string, handler: AkariSearchHandler): void;

type AkariSearchHandler = (
  query: string,
  context: AkariSearchContext,
) => AkariSearchResult[] | Promise<AkariSearchResult[]>;

interface AkariSearchContext {
  limit: number;
  signal?: AbortSignal;   // 新しいクエリが入力されたときやパネルが閉じたときに中止される
  lang?: string;          // 現在の言語。例："zh-CN"
  locale?: string;        // VitePress のロケールキー。ルート言語では "root"
}
```

登録されていない id を設定が参照している場合、パネルにわかりやすいエラーが表示されます。

## AkariSearchResult

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `id` | `string` | 一意の識別子 |
| `title` | `string` | 結果のタイトル |
| `href` | `string` | URL。サイト内の URL は SPA ナビゲーションを使い、外部 URL は新しいタブで開きます |
| `pageTitle` | `string` | 結果が属するページのタイトル。結果の上に表示されます |
| `heading` | `string` | 結果が属するセクション |
| `excerpt` | `string` | 抜粋。一致した語句はハイライトされます |

すべてのテキストはプレーンテキストとして描画されます。

## useAkariSearch

```ts
import { useAkariSearch } from "@theme";

const { isOpen, query, results, loading, error, openSearch, closeSearch } =
  useAkariSearch();
```

独自の検索の入口を作るときに使います。`openSearch()` はパネルを開き、`query`、`results`、`loading`、`error` はパネルの状態です。レイアウト内のコンポーネントでのみ呼び出してください。
