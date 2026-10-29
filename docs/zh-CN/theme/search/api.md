---
tab: 接口
---

# 搜索：接口

## search

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否显示搜索入口并注册快捷键 |
| `placeholder` | `string` | 随语言，「搜索文档」 | 搜索框的占位文字 |
| `shortcut` | `string` | `"k"` | 与 `⌘` / `Ctrl` 组合的按键；空字符串关闭快捷键 |
| `maxResults` | `number` | `8` | 结果上限，限制在 1 到 20 |
| `debounce` | `number` | `180` | 输入防抖的毫秒数，限制在 0 到 1000 |
| `backend` | `AkariSearchBackendConfig` | 本地索引 | `local`、`http` 或 `registered` |

`search` 可以写在语言配置中，为不同语言指定不同的后端。

## 本地后端

```ts
backend: { type: "local", endpoint: "/search-index.json" },
```

`endpoint` 可以换成其他同源的静态 JSON；相对路径自动加上 `base`。文件的格式：

```ts
interface SearchIndexFile {
  version: 1;
  generatedAt: string;          // ISO 时间
  entries: SearchIndexEntry[];
}

interface SearchIndexEntry {
  id: string;                   // "/theme/layout::page" 或 "/theme/layout::顶栏"
  pageTitle: string;            // 页面标题
  title: string;                // 页面条目为页面标题，章节条目为章节标题
  heading: string;              // 章节标题；页面条目为空
  href: string;                 // "/theme/layout#顶栏"
  content: string;              // 去掉标记的正文，最多 4000 字
  level: number;                // 页面条目为 0，章节为 2 或 3
}
```

## HTTP 后端

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

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `endpoint` | `string` | 必填 | 接口地址；相对路径自动加上 `base`，绝对地址不变 |
| `method` | `"GET" \| "POST"` | `"GET"` | `GET` 把查询写进查询参数；`POST` 发送 JSON：`{ "q": "关键词", "limit": 8 }` |
| `headers` | `Record<string, string>` | `{}` | 请求头 |
| `credentials` | `RequestCredentials` | `"same-origin"` | 是否携带 Cookie |
| `queryParam` | `string` | `"q"` | 查询词的参数名 |
| `limitParam` | `string` | `"limit"` | 结果上限的参数名 |

响应可以是结果数组，也可以是 `{ "results": [...] }`。每个结果识别以下字段：`title`；`href`（或 `url`、`path`）；`pageTitle`；`heading`；`excerpt`（或 `content`、`snippet`、`description`）；`id`。

```json
{
  "results": [
    {
      "id": "button-variants",
      "title": "变体",
      "pageTitle": "按钮",
      "heading": "变体",
      "href": "/components/button#变体",
      "excerpt": "五种外观从高到低表达强调程度……"
    }
  ]
}
```

非 2xx 的响应、网络错误或结构不合法的响应会显示错误与重试按钮。

## 注册的后端

在主题入口注册一个函数，再在配置中引用它的 id：

```ts
// docs/.vitepress/theme/index.ts
import { registerSearchBackend } from "./search/registry";

registerSearchBackend("my-search", async (query, { limit, signal, lang }) => {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&lang=${lang}`,
    { signal },
  );
  if (!response.ok) throw new Error("搜索失败");
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
  signal?: AbortSignal;   // 输入新查询或关闭面板时中止
  lang?: string;          // 当前语言，例如 "zh-CN"
  locale?: string;        // VitePress 语言键，根语言为 "root"
}
```

配置中引用了不存在的 id 时，面板显示明确的错误。

## AkariSearchResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 唯一标识 |
| `title` | `string` | 结果的标题 |
| `href` | `string` | 地址；站内地址走 SPA 导航，外部地址在新标签页打开 |
| `pageTitle` | `string` | 所在页面的标题，显示在结果上方 |
| `heading` | `string` | 所在章节 |
| `excerpt` | `string` | 摘要，命中的词会高亮 |

所有文字按纯文本渲染。

## useAkariSearch

```ts
import { useAkariSearch } from "@theme";

const { isOpen, query, results, loading, error, openSearch, closeSearch } =
  useAkariSearch();
```

用于自己做的搜索入口：`openSearch()` 打开面板，`query`、`results`、`loading` 与 `error` 是面板的状态。只能在布局内部的组件中调用。
