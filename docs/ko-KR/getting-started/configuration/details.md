---
tab: 세부 사항
---

# 구성: 세부 사항

## 두 단계가 겹쳐지는 방식 {#how-the-two-levels-layer}

`docs/config.ts`와 각 언어 폴더의 `config.ts`는 VitePress 2의 디렉터리 구성입니다.

- VitePress는 `docs`에서 `config.ts`(또는 `.mts`, `.js`, `.mjs`)라는 이름의 파일을 찾으며, `.`으로 시작하는 폴더는 건너뜁니다. 각 파일은 자기 폴더 안의 페이지에만 적용됩니다. 기준은 소스 파일의 위치이며, 페이지의 재작성된 경로가 아닙니다.
- 페이지의 구성은 여러 단계가 겹쳐져 만들어지며, 상위 단계가 먼저 적용됩니다. 순서는 해당 폴더와 그 위 폴더들의 `config.ts`(더 깊은 쪽이 우선), `docs/config.ts`, VitePress 로캘 구성, `.vitepress/config.mts`입니다.
- 겹치기는 필드 단위로 이루어집니다. 객체는 각 필드가 값을 가진 가장 높은 단계에서 값을 가져오고, 문자열, 배열 등 다른 값은 통째로 대체됩니다. 그래서 언어 구성의 `appBar: { title }`은 공통 구성의 `appBar.socialLinks`를 지우지 않지만, `socialLinks` 자체는 배열이므로 통째로만 대체할 수 있습니다.
- 겹치기는 페이지를 렌더링할 때 일어나며, 서버와 브라우저에서 결과가 같습니다.
- `config.ts`를 수정, 추가, 삭제하면 개발 서버가 자동으로 다시 시작됩니다.
- 카테고리 폴더나 글 폴더에도 `config.ts`를 둘 수 있습니다. 이 파일은 그 폴더 안의 페이지에만 적용되므로, 예를 들어 한 카테고리에만 별도의 푸터 메시지를 줄 수 있습니다.

## 폴더에서 언어 생성

`akariContent`는 `.vitepress/config.mts`가 로드될 때 실행됩니다.

1. `docs/config.ts`를 읽고 언어 폴더를 찾습니다. 언어 폴더는 `config.ts`를 포함한 `docs`의 최상위 폴더이며, `public`, `node_modules`, `.`으로 시작하는 폴더는 제외합니다. 구성 파일은 VitePress가 로드하는 방식과 같이 Vite 구성 로더가 번들링해 실행합니다.
2. 루트 언어를 고릅니다. `rootLanguage`가 지정한 폴더입니다. 설정되지 않았거나 존재하지 않으면(이 경우 알림이 표시됩니다) 알파벳순으로 첫 번째 폴더를 씁니다. 다른 언어는 알파벳순으로 뒤따릅니다.
3. 언어마다 VitePress `locales` 항목을 하나씩 생성합니다. 루트 언어의 키는 `root`이고, 나머지는 폴더 이름을 씁니다. 각 항목에는 언어 구성의 내용이 들어갑니다(`head`는 제외합니다. 디렉터리 구성이 이미 추가하므로 다시 넣으면 중복됩니다. 로캘의 `head`에는 그 언어의 글꼴 태그가 들어갑니다. [타이포그래피](/ko-KR/styles/typography/api#fonts)를 참고하세요). `lang`의 기본값은 폴더 이름, `label`의 기본값은 `lang`이며, 항목에는 생성된 내비게이션(`themeConfig.akari.sidebar.items`)이 들어갑니다.
4. 사이트 단위의 `lang`, `title`, `description`은 루트 언어에서 가져옵니다.

언어 구성은 자기 페이지의 디렉터리 구성이면서 동시에 로캘이기도 하며, 두 역할은 각각 목적이 있습니다. 로캘은 언어 메뉴에 그 언어를 표시하고, 코드 블록 복사 버튼 같은 Markdown 텍스트를 그 언어로 렌더링하며, 404 페이지처럼 언어 폴더 밖에 있는 페이지에 루트 언어의 설정을 줍니다. 두 역할의 값이 같으므로 겹친 결과에는 영향이 없습니다.

언어 폴더가 하나도 없으면 `akariContent`는 로캘도 재작성 규칙도 생성하지 않습니다. 사이트는 `.vitepress/config.mts`의 구성으로 동작하고, 내비게이션은 직접 작성한 `sidebar.items`나 VitePress의 `themeConfig.sidebar`에서 가져옵니다.

## 경로와 내비게이션

`akariContent`는 VitePress `rewrites` 함수도 반환하고, 각 언어의 Markdown 프런트매터를 읽어 그 언어의 내비게이션을 생성합니다. 정확한 규칙은 [페이지 작성 · 세부 사항](/ko-KR/getting-started/writing/details)을 참고하세요. 언어 구성이나 공통 구성에 `sidebar.items`가 설정되어 있으면 그 언어는 직접 작성한 내비게이션을 쓰고, 내비게이션을 생성하지 않습니다.

## 개발 중 업데이트

| 변경 | 결과 |
| --- | --- |
| `config.ts` 추가, 삭제, 수정 | VitePress가 개발 서버를 다시 시작하고 `akariContent`가 다시 실행됩니다 |
| Markdown 추가 또는 삭제, 프런트매터 수정 | `content.plugin`이 약 120ms 뒤에 내비게이션을 다시 생성합니다. 내비게이션이 바뀌었으면 사이트 데이터를 갱신하고 페이지를 새로 고칩니다 |
| 본문만 수정 | 내비게이션은 바뀌지 않습니다. VitePress가 자체 핫 업데이트로 처리하며 페이지를 새로 고치지 않습니다 |

`content.plugin`은 언어 폴더 안의 `.md` 파일만 감시합니다. 서버가 실행 중일 때 언어 폴더 전체를 다른 곳으로 옮기면, 플러그인은 다음 재시작까지 그 폴더를 건너뜁니다.

## 구성 파일에 넣을 수 있는 것

구성 파일은 Node.js에서 실행되고, 그 결과는 직렬화되어 사이트 데이터와 함께 브라우저로 전송됩니다. 따라서 데이터만 넣기에 적합합니다. Vue 컴포넌트처럼 import에 의존하는 객체는 전달되지 않습니다. 컴포넌트를 교체하려면 테마 진입점에서 `provideAkariComponents`를 호출하세요. [테마 확장](/ko-KR/theme/extending/api#provideakaricomponents)을 참고하세요.

## defineAkariConfig 가져오기

`defineAkariConfig`는 `theme/define.ts`에 있습니다. 이 파일은 타입만 가져오며 확장자를 명시하고(`./types.ts`), 구성 파일도 전체 파일 이름(`define.ts`)으로 이 파일을 가져옵니다. Vite는 구성 파일을 로드할 때 확장자 없는 import처럼 향후 네이티브 로더가 처리할 수 없는 패턴에 경고를 출력합니다. 이렇게 작성한 구성 파일은 경고를 일으키지 않습니다. 이를 위해 `tsconfig.json`에서 `allowImportingTsExtensions`를 켭니다.

빌드에서는 같은 종류의 경고가 여전히 하나 표시됩니다. 이 경고는 `.vitepress/config.mts` 자체의 import에서 나오며 빌드 결과에는 영향을 주지 않습니다.
