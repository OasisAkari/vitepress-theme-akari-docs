---
tab: API
---

# البحث: API

## search

| الحقل | النوع | القيمة الافتراضية | الوصف |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | ما إذا كان يُعرض مدخل البحث ويُسجَّل الاختصار |
| `placeholder` | `string` | بحسب اللغة، «ابحث في التوثيق» | النص التوضيحي في مربع البحث |
| `shortcut` | `string` | `"k"` | المفتاح الذي يُضغط مع `⌘` / `Ctrl`؛ والسلسلة الفارغة توقف الاختصار |
| `maxResults` | `number` | `8` | أقصى عدد للنتائج، محصور بين 1 و20 |
| `debounce` | `number` | `180` | تأخير الإدخال (debounce) بالمللي ثانية، محصور بين 0 و1000 |
| `backend` | `AkariSearchBackendConfig` | الفهرس المحلي | `local` أو `http` أو `registered` |

يمكن وضع `search` في تهيئة اللغة، لإعطاء كل لغة خدمة البحث الخاصة بها.

## خدمة البحث المحلية

```ts
backend: { type: "local", endpoint: "/search-index.json" },
```

يمكن أن يشير `endpoint` إلى ملف JSON ثابت آخر من الأصل نفسه؛ وتُضاف `base` تلقائيًا إلى المسارات النسبية. صيغة الملف:

```ts
interface SearchIndexFile {
  version: 1;
  generatedAt: string;          // وقت بصيغة ISO
  entries: SearchIndexEntry[];
}

interface SearchIndexEntry {
  id: string;                   // "/ar-SA/theme/layout::page" أو "/ar-SA/theme/layout::شريط-التطبيق"
  pageTitle: string;            // عنوان الصفحة
  title: string;                // عنوان الصفحة لمدخل الصفحة، وعنوان القسم لمدخل القسم
  heading: string;              // عنوان القسم؛ فارغ لمدخل الصفحة
  href: string;                 // "/ar-SA/theme/layout#شريط-التطبيق"
  content: string;              // نص المتن دون ترميز، بحد أقصى 4000 حرف
  level: number;                // 0 لمدخل الصفحة، و2 أو 3 للقسم
}
```

## خدمة HTTP

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

| الحقل | النوع | القيمة الافتراضية | الوصف |
| --- | --- | --- | --- |
| `endpoint` | `string` | مطلوب | رابط نقطة النهاية؛ تُضاف `base` إلى المسارات النسبية، وتبقى الروابط المطلقة كما هي |
| `method` | `"GET" \| "POST"` | `"GET"` | `GET` يضع الاستعلام في معاملات الاستعلام؛ و`POST` يرسل JSON: `{ "q": "keyword", "limit": 8 }` |
| `headers` | `Record<string, string>` | `{}` | ترويسات الطلب |
| `credentials` | `RequestCredentials` | `"same-origin"` | ما إذا كانت تُرسل ملفات تعريف الارتباط |
| `queryParam` | `string` | `"q"` | اسم معامل الاستعلام |
| `limitParam` | `string` | `"limit"` | اسم معامل الحد الأقصى للنتائج |

يمكن أن تكون الاستجابة مصفوفة من النتائج أو `{ "results": [...] }`. تقرأ السمة هذه الحقول من كل نتيجة: `title`؛ و`href` (أو `url` أو `path`)؛ و`pageTitle`؛ و`heading`؛ و`excerpt` (أو `content` أو `snippet` أو `description`)؛ و`id`.

```json
{
  "results": [
    {
      "id": "button-variants",
      "title": "التنويعات",
      "pageTitle": "الأزرار",
      "heading": "التنويعات",
      "href": "/ar-SA/components/button#التنويعات",
      "excerpt": "خمسة أنماط تعبّر عن درجة التأكيد من الأعلى إلى الأدنى…"
    }
  ]
}
```

الاستجابة التي ليست 2xx، أو خطأ الشبكة، أو الاستجابة ذات البنية غير الصالحة، تعرض خطأً وزر إعادة المحاولة.

## الخدمات المسجّلة {#registered-backends}

سجّل دالة في مدخل السمة، ثم أشِر إلى معرّفها في التهيئة:

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
  signal?: AbortSignal;   // يُلغى عند كتابة استعلام جديد أو إغلاق اللوحة
  lang?: string;          // اللغة الحالية، مثل "zh-CN"
  locale?: string;        // مفتاح لغة VitePress، و"root" للغة الجذرية
}
```

إذا أشارت التهيئة إلى معرّف غير مسجّل، تعرض اللوحة خطأً واضحًا.

## AkariSearchResult

| الحقل | النوع | الوصف |
| --- | --- | --- |
| `id` | `string` | معرّف فريد |
| `title` | `string` | عنوان النتيجة |
| `href` | `string` | الرابط؛ الروابط الداخلية تستخدم التنقل بأسلوب SPA، والروابط الخارجية تُفتح في علامة تبويب جديدة |
| `pageTitle` | `string` | عنوان الصفحة التي تنتمي إليها، ويظهر فوق النتيجة |
| `heading` | `string` | القسم الذي تنتمي إليه |
| `excerpt` | `string` | المقتطف؛ وتُبرز الكلمات المطابقة |

يُعرض كل النص على أنه نص عادي.

## useAkariSearch

```ts
import { useAkariSearch } from "@theme";

const { isOpen, query, results, loading, error, openSearch, closeSearch } =
  useAkariSearch();
```

لمدخل بحث خاص بك: `openSearch()` يفتح اللوحة، و`query` و`results` و`loading` و`error` هي حالة اللوحة. لا تستدعِها إلا في المكوّنات الموجودة داخل التخطيط.
