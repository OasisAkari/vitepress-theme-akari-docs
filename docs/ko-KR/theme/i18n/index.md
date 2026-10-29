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

언어 자체에 속하는 것(인터페이스 문자열, 글꼴, 텍스트 방향, Markdown에서 쓰는 문자열)은 사이트 구성에 쓰지 않습니다. 이것들은 [언어 팩](#language-packs)에 들어 있으며, 언어 코드로 찾습니다. 그래서 언어를 추가할 때는 이 사이트에 고유한 내용만 쓰면 됩니다.

## 언어 추가

1. `docs` 안에 언어 코드로 이름 붙인 폴더를 만들고, 그 안에 `config.ts`를 작성합니다.

   ```ts
   // docs/ko-KR/config.ts
   import { defineAkariConfig } from "../.vitepress/theme/define.ts";

   export default defineAkariConfig({
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

언어 구성은 공통 구성 위에 겹쳐지므로, 그 언어의 제목과 카테고리 이름만 쓰면 됩니다. 버전, 소셜 링크, 카테고리 아이콘 등은 공통 구성에서 가져옵니다. 언어 메뉴에 표시되는 이름의 기본값은 그 언어로 표기한 언어 이름(English, 日本語)이고, 텍스트 방향, 인터페이스 문자열, 코드 블록 복사 버튼, 컨테이너 제목은 언어 팩에서 가져옵니다. 이 값들은 모두 언어 구성에서 재정의할 수 있습니다.

## 언어 전환

사이트에 언어가 둘 이상이면 레일 하단(좁은 화면에서는 내비게이션 드로어 하단)에 언어 버튼이 나타납니다. 버튼을 클릭하면 “언어 선택” 대화상자가 열립니다.

- 대상 언어에 대응하는 페이지가 있으면 같은 페이지에 머물고, 없으면 그 언어의 홈 페이지로 이동합니다. 따라서 일부 페이지만 번역한 언어라도 독자를 404 페이지로 보내지 않습니다.
- 로고, 푸터의 사이트 이름, 404 페이지의 “홈으로 돌아가기”는 모두 현재 언어의 홈 페이지를 가리킵니다.

## 언어 팩 {#language-packs}

언어 팩은 한 언어를 기술합니다. 인터페이스 문자열(버튼, 목차, 페이지 이동 카드, 설정, 검색), 글꼴, 텍스트 방향, Markdown에서 쓰는 문자열(코드 블록 복사 버튼과 컨테이너 제목)이 여기에 들어 있습니다. 테마에는 중국어 간체, 영어, 일본어, 한국어, 프랑스어, 아랍어의 언어 팩 6개가 기본 제공됩니다. 페이지는 `lang`으로 언어 팩을 찾습니다. 먼저 전체 코드로, 다음으로 주 언어로 찾으며(`zh-TW`는 `zh`를 씁니다), 둘 다 맞지 않으면 영어를 씁니다. 언어 팩에 없는 문자열도 영어로 표시됩니다.

테마에 기본 제공되지 않는 언어는 언어 팩을 작성해 공통 구성의 `languages`에 넣습니다.

```ts
// docs/.vitepress/languages/de.ts
import { defineAkariLanguage } from "../theme/define.ts";

export default defineAkariLanguage({
  code: "de",
  messages: {
    tocOverline: "Auf dieser Seite",
    previousPage: "Zurück",
    nextPage: "Weiter",
    searchPlaceholder: "Suchen",
  },
  markdown: {
    codeCopyButton: { tooltipText: "Code kopieren", copiedText: "Kopiert" },
    container: { tipLabel: "Tipp", warningLabel: "Warnung" },
  },
});
```

```ts
// docs/config.ts
import de from "./.vitepress/languages/de.ts";

export default defineAkariConfig({
  languages: [de],
});
```

이후로는 `de-DE`, `de-AT` 등 모든 독일어 언어 폴더가 이 언어 팩을 씁니다. 기본 제공 언어 팩과 코드가 같은 언어 팩은 그 위에 겹쳐집니다. 이 언어 팩에 쓴 문자열은 대응하는 항목을 대체하고, `fonts`와 `dir`은 통째로 대체됩니다. 이 사이트에서만 한 언어의 문자열 몇 개를 바꾸려면 그 언어의 언어 구성에 `messages`를 써도 됩니다.

## 이 사이트의 언어

이 사이트의 모든 페이지에는 중국어(루트에서 제공), 영어, 일본어, 한국어, 프랑스어, 아랍어의 여섯 가지 버전이 있습니다. 언어를 전환해도 같은 페이지에 머뭅니다. 아랍어 버전은 오른쪽에서 왼쪽으로 배치되므로, 테마의 RTL 레이아웃을 확인하는 데 쓸 수 있습니다.

모든 인터페이스 문자열과 언어 함수는 [API](/ko-KR/theme/i18n/api)를, 언어를 감지하고 전환하는 방식은 [세부 사항](/ko-KR/theme/i18n/details)을 참고하세요.
