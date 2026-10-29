---
tab: API
---

# Search: API

## search

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Whether to show the search entry and register the shortcut |
| `placeholder` | `string` | Per language, "Search docs" | Placeholder text of the search box |
| `shortcut` | `string` | `"k"` | Key combined with `⌘` / `Ctrl`; an empty string turns the shortcut off |
| `maxResults` | `number` | `8` | Maximum number of results, clamped between 1 and 20 |
| `debounce` | `number` | `180` | Input debounce in milliseconds, clamped between 0 and 1000 |
| `backend` | `AkariSearchBackendConfig` | Local index | `local`, `http` or `registered` |

`search` can go in a language config, to give each language its own backend.

## Local backend

```ts
backend: { type: "local", endpoint: "/search-index.json" },
```

`endpoint` can point to another same-origin static JSON file; relative paths get `base` added automatically. The file format:

```ts
interface SearchIndexFile {
  version: 1;
  generatedAt: string;          // ISO time
  entries: SearchIndexEntry[];
}

interface SearchIndexEntry {
  id: string;                   // "/en-US/theme/layout::page" or "/en-US/theme/layout::app-bar"
  pageTitle: string;            // page title
  title: string;                // page title for a page entry, section heading for a section entry
  heading: string;              // section heading; empty for a page entry
  href: string;                 // "/en-US/theme/layout#app-bar"
  content: string;              // body text without markup, at most 4000 characters
  level: number;                // 0 for a page entry, 2 or 3 for a section
}
```

## HTTP backend

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

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `endpoint` | `string` | Required | Endpoint URL; relative paths get `base` added, absolute URLs stay as they are |
| `method` | `"GET" \| "POST"` | `"GET"` | `GET` puts the query in query parameters; `POST` sends JSON: `{ "q": "keyword", "limit": 8 }` |
| `headers` | `Record<string, string>` | `{}` | Request headers |
| `credentials` | `RequestCredentials` | `"same-origin"` | Whether to send cookies |
| `queryParam` | `string` | `"q"` | Parameter name of the query |
| `limitParam` | `string` | `"limit"` | Parameter name of the result limit |

The response can be an array of results or `{ "results": [...] }`. The theme reads these fields from each result: `title`; `href` (or `url`, `path`); `pageTitle`; `heading`; `excerpt` (or `content`, `snippet`, `description`); `id`.

```json
{
  "results": [
    {
      "id": "button-variants",
      "title": "Variants",
      "pageTitle": "Buttons",
      "heading": "Variants",
      "href": "/en-US/components/button#variants",
      "excerpt": "Five styles express emphasis from high to low…"
    }
  ]
}
```

A non-2xx response, a network error or a response with an invalid structure shows an error and a retry button.

## Registered backends

Register a function in the theme entry, then refer to its id in the config:

```ts
// docs/.vitepress/theme/index.ts
import { registerSearchBackend } from "./search/registry";

registerSearchBackend("my-search", async (query, { limit, signal, lang }) => {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&lang=${lang}`,
    { signal },
  );
  if (!response.ok) throw new Error("Search failed");
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
  signal?: AbortSignal;   // aborted when a new query is typed or the panel closes
  lang?: string;          // current language, e.g. "zh-CN"
  locale?: string;        // VitePress locale key, "root" for the root language
}
```

If the config refers to an id that is not registered, the panel shows a clear error.

## AkariSearchResult

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique identifier |
| `title` | `string` | Title of the result |
| `href` | `string` | URL; internal URLs use SPA navigation, external URLs open in a new tab |
| `pageTitle` | `string` | Title of the page it belongs to, shown above the result |
| `heading` | `string` | Section it belongs to |
| `excerpt` | `string` | Excerpt; matched words are highlighted |

All text renders as plain text.

## useAkariSearch

```ts
import { useAkariSearch } from "@theme";

const { isOpen, query, results, loading, error, openSearch, closeSearch } =
  useAkariSearch();
```

For a search entry of your own: `openSearch()` opens the panel, and `query`, `results`, `loading` and `error` are the panel's state. Call it only in components inside the layout.
