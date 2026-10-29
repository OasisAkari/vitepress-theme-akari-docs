---
tab: API
---

# 검색: API

## search

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 검색 진입점을 표시하고 단축키를 등록할지 여부 |
| `placeholder` | `string` | 언어에 따라 다름. “문서 검색” | 검색 상자의 자리표시자 텍스트 |
| `shortcut` | `string` | `"k"` | `⌘` / `Ctrl`과 조합하는 키. 빈 문자열이면 단축키가 꺼집니다 |
| `maxResults` | `number` | `8` | 최대 결과 수. 1에서 20 사이로 제한됩니다 |
| `debounce` | `number` | `180` | 입력 디바운스(밀리초). 0에서 1000 사이로 제한됩니다 |
| `backend` | `AkariSearchBackendConfig` | 로컬 색인 | `local`, `http`, `registered` |

`search`는 언어 구성에 넣어 언어마다 다른 백엔드를 지정할 수 있습니다.

## 로컬 백엔드

```ts
backend: { type: "local" },
```

VitePress의 로컬 검색(`provider: "local"`)이 만드는 색인을 씁니다. 언어마다 하나씩 있으며, VitePress 로캘 키(루트 언어는 `root`)로 불러옵니다. 어느 언어든 로컬 백엔드를 쓰면 `akariContent`가 사이트 구성에서 이를 켜고, 결과의 발췌문에 쓸 수 있도록 색인이 각 섹션의 텍스트를 보관하게 합니다.

```ts
// akariContent가 생성하는 사이트 구성
themeConfig: {
  search: {
    provider: "local",
    options: { miniSearch: { options: { storeFields: ["title", "titles", "text"] } } },
  },
},
```

각 섹션은 색인의 문서 하나입니다. `id`는 페이지 경로에 제목의 앵커를 붙인 것이고, `title`은 섹션의 제목, `titles`는 그 위의 제목들(페이지 제목이 맨 앞), `text`는 태그를 제거한 본문 텍스트입니다. 페이지의 1단계 제목 아래 섹션은 페이지 자체를 나타내며, 그 결과는 페이지 맨 위로 연결됩니다.

`.vitepress/config.mts`에 `themeConfig`가 없으면 `...content.site`가 이 설정을 함께 가져옵니다. 있으면 `content.site.themeConfig`를 그 안에 병합하세요.

## HTTP 백엔드

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

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `endpoint` | `string` | 필수 | 엔드포인트 URL. 상대 경로에는 `base`가 붙고, 절대 URL은 그대로 씁니다 |
| `method` | `"GET" \| "POST"` | `"GET"` | `GET`은 검색어를 쿼리 매개변수에 넣고, `POST`는 JSON `{ "q": "keyword", "limit": 8 }`을 보냅니다 |
| `headers` | `Record<string, string>` | `{}` | 요청 헤더 |
| `credentials` | `RequestCredentials` | `"same-origin"` | 쿠키를 보낼지 여부 |
| `queryParam` | `string` | `"q"` | 검색어의 매개변수 이름 |
| `limitParam` | `string` | `"limit"` | 결과 수 제한의 매개변수 이름 |

응답은 결과 배열이거나 `{ "results": [...] }`일 수 있습니다. 테마는 각 결과에서 다음 필드를 읽습니다: `title`, `href`(또는 `url`, `path`), `pageTitle`, `heading`, `excerpt`(또는 `content`, `snippet`, `description`), `id`.

```json
{
  "results": [
    {
      "id": "button-variants",
      "title": "변형",
      "pageTitle": "버튼",
      "heading": "변형",
      "href": "/ko-KR/components/button#변형",
      "excerpt": "다섯 가지 스타일로 높은 강조부터 낮은 강조까지 표현합니다…"
    }
  ]
}
```

2xx가 아닌 응답, 네트워크 오류, 구조가 올바르지 않은 응답이 오면 오류와 다시 시도 버튼이 표시됩니다.

## 등록된 백엔드 {#registered-backends}

테마 엔트리에서 함수를 등록한 다음, 구성에서 그 id를 참조합니다.

```ts
// docs/.vitepress/theme/index.ts
import { registerSearchBackend } from "./search/registry";

registerSearchBackend("my-search", async (query, { limit, signal, lang }) => {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&lang=${lang}`,
    { signal },
  );
  if (!response.ok) throw new Error("검색 실패");
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
  signal?: AbortSignal;   // 새 검색어를 입력하거나 패널을 닫으면 중단됨
  lang?: string;          // 현재 언어. 예: "zh-CN"
  locale?: string;        // VitePress 로케일 키. 루트 언어는 "root"
}
```

구성이 등록되지 않은 id를 참조하면 패널에 명확한 오류가 표시됩니다.

## AkariSearchResult

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `string` | 고유 식별자 |
| `title` | `string` | 결과의 제목 |
| `href` | `string` | URL. 내부 URL은 SPA 내비게이션을 쓰고, 외부 URL은 새 탭에서 엽니다 |
| `pageTitle` | `string` | 결과가 속한 페이지의 제목. 결과 위에 표시됩니다 |
| `heading` | `string` | 결과가 속한 섹션 |
| `excerpt` | `string` | 발췌문. 일치하는 단어가 강조됩니다 |

모든 텍스트는 일반 텍스트로 렌더링됩니다.

## useAkariSearch

```ts
import { useAkariSearch } from "@theme";

const { isOpen, query, results, loading, error, openSearch, closeSearch } =
  useAkariSearch();
```

자체 검색 진입점을 만들 때 씁니다. `openSearch()`는 패널을 열고, `query`, `results`, `loading`, `error`는 패널의 상태입니다. 레이아웃 안의 컴포넌트에서만 호출하세요.
