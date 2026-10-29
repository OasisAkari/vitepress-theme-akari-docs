---
icon: translate
order: 6
tab: 개요
parallel:
  - api
  - details
---

# 국제화

각 언어는 `docs` 안에서 언어 코드로 이름 붙인 폴더입니다(예: `zh-CN`, `ko-KR`). 루트 언어는 사이트 루트에서 제공되고, 다른 언어의 경로는 폴더 이름으로 시작합니다. 현재 페이지의 언어가 인터페이스 문자열, 내비게이션, 푸터, 검색 범위를 결정합니다.

## 언어 추가

1. `docs` 안에 언어 코드로 이름 붙인 폴더를 만들고, 그 안에 `config.ts`를 작성합니다.

   ```ts
   // docs/ko-KR/config.ts
   import { defineAkariConfig } from "../.vitepress/theme/define.ts";

   export default defineAkariConfig({
     label: "한국어",
     title: "Vitepress Theme Akari Docs",
     appBar: { title: "Vitepress Theme Akari Docs" },
     sidebar: {
       categories: {
         "getting-started": { text: "시작하기" },
         theme: { text: "테마" },
       },
     },
     footer: { message: "VitePress와 M3E Web Components로 제작" },
   });
   ```

2. 루트 언어와 같은 구조로 페이지를 추가합니다. `docs/ko-KR/index.md`는 이 언어의 홈 페이지이고, `docs/ko-KR/getting-started/installation/index.md`는 중국어 `/getting-started/installation`과 짝을 이룹니다.
3. 필요하면 공통 구성에서 `rootLanguage`를 설정해 루트에서 제공할 언어를 고릅니다.

언어 구성은 공통 구성 위에 겹쳐지므로, 그 언어 고유의 이름, 제목, 카테고리 이름만 쓰면 됩니다. 버전, 소셜 링크, 카테고리 아이콘 등은 공통 구성에서 가져옵니다. 오른쪽에서 왼쪽으로 쓰는 언어(아랍어, 히브리어 등)는 언어 구성에 `dir: "rtl"`도 설정합니다.

## 언어 전환

사이트에 언어가 둘 이상이면 레일 하단(좁은 화면에서는 내비게이션 드로어 하단)에 언어 버튼이 나타납니다. 버튼을 클릭하면 “언어 선택” 대화상자가 열립니다.

- 대상 언어에 대응하는 페이지가 있으면 같은 페이지에 머물고, 없으면 그 언어의 홈 페이지로 이동합니다. 따라서 일부 페이지만 번역한 언어라도 독자를 404 페이지로 보내지 않습니다.
- 로고, 푸터의 사이트 이름, 404 페이지의 “홈으로 돌아가기”는 모두 현재 언어의 홈 페이지를 가리킵니다.

## 인터페이스 문자열

테마에는 버튼, 목차, 페이지 이동 카드, 설정, 검색에 쓰는 중국어 간체, 영어, 일본어, 한국어, 프랑스어, 아랍어 문자열이 기본 제공되며, 언어 코드에 따라 선택됩니다. 그 밖의 언어는 영어를 쓰며, 언어 구성의 `messages`로 문자열을 채울 수 있습니다.

```ts
// docs/de-DE/config.ts
export default defineAkariConfig({
  label: "Deutsch",
  messages: {
    tocOverline: "Auf dieser Seite",
    previousPage: "Zurück",
    nextPage: "Weiter",
    searchPlaceholder: "Suchen",
  },
});
```

## 이 사이트의 언어

이 사이트의 모든 페이지에는 중국어(루트에서 제공), 영어, 일본어, 한국어, 프랑스어, 아랍어의 여섯 가지 버전이 있습니다. 언어를 전환해도 같은 페이지에 머뭅니다. 아랍어 버전은 오른쪽에서 왼쪽으로 배치되므로, 테마의 RTL 레이아웃을 확인하는 데 쓸 수 있습니다.

모든 인터페이스 문자열과 언어 함수는 [API](/ko-KR/theme/i18n/api)를, 언어를 감지하고 전환하는 방식은 [세부 사항](/ko-KR/theme/i18n/details)을 참고하세요.
