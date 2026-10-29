---
title: 페이지 작성
icon: article
order: 3
tab: 개요
parallel:
  - api
  - details
---

# 페이지 작성

페이지는 언어 폴더 안의 Markdown 파일입니다. 파일을 두는 위치가 페이지의 경로와 내비게이션에서의 위치를 정합니다.

## 글 만들기

1. 카테고리 폴더 안에 폴더를 만듭니다. 폴더 이름이 글의 경로가 되므로 소문자, 숫자, 하이픈만 사용하세요.
2. 그 안에 h1 제목으로 시작하는 `index.md`를 작성합니다.
3. 프런트매터에 아이콘과 순서를 지정합니다.

```text
docs/ko-KR/components/
└─ chip/
   └─ index.md          /ko-KR/components/chip
```

```md
---
icon: label
order: 4
---

# 칩

본문…
```

저장하면 개발 서버를 다시 시작하지 않아도 글이 바로 “컴포넌트” 카테고리에 나타납니다. 내비게이션에 표시되는 이름은 페이지 제목, 여기서는 “칩”입니다.

카테고리를 추가하려면 카테고리 폴더를 만들고, 공통 구성의 `sidebar.categories`에 아이콘을, 언어 구성에 이름을 지정합니다. [구성](/ko-KR/getting-started/configuration)을 참고하세요.

## 병렬 페이지 {#parallel-pages}

긴 글은 여러 페이지로 나누어 페이지 상단의 탭 바로 전환할 수 있으며, 사이드바에는 여전히 항목 하나만 표시됩니다. 글 폴더에 `.md` 파일을 더 만들고, `index.md`의 프런트매터에 순서대로 나열합니다.

```text
docs/ko-KR/styles/icons/
├─ index.md           /ko-KR/styles/icons
├─ choosing.md        /ko-KR/styles/icons/choosing
└─ using.md           /ko-KR/styles/icons/using
```

```md
---
title: 아이콘
tab: 개요
parallel:
  - choosing
  - using
---
```

각 페이지는 자신의 `tab`으로 탭 바에 표시될 제목을 정하며, 지정하지 않으면 페이지 제목을 씁니다. 이 사이트의 테마 페이지는 모두 “개요”, “API”, “세부 사항” 세 페이지로 나뉘어 있습니다.

## 히어로

프런트매터에 `hero`를 작성하면 페이지 상단에 제목 카드와 이미지가 나란히 표시됩니다. [히어로](/ko-KR/theme/hero)를 참고하세요.

## 이미지와 링크

- 한 페이지에서만 쓰는 이미지는 글 폴더에 두고 `![설명](./image.png)`으로 참조합니다. 여러 페이지에서 함께 쓰는 이미지는 `docs/public`에 두고 `/hero/image.svg` 같은 절대 경로로 참조합니다.
- 이미지의 너비와 높이는 원격 이미지까지 포함해 렌더링할 때 자동으로 기록되므로, 이미지가 로드되는 동안 페이지가 흔들리지 않습니다. [API](/ko-KR/getting-started/writing/api#images)를 참고하세요.
- 내부 링크는 페이지 경로를 쓰고 `/`로 시작합니다: `[사이드 내비게이션](/theme/sidebar)`. 파일 경로(`/zh-CN/theme/sidebar/index.md`)나 상대 경로는 쓰지 마세요.
- 한국어 페이지 사이의 링크에는 `/ko-KR/` 접두사가 붙습니다.

## Markdown

코드 그룹, 사용자 정의 컨테이너, 코드 블록 줄 강조, 각주 등 VitePress의 Markdown 확장을 모두 사용할 수 있습니다. 테마는 여기에 몇 가지를 더합니다.

- 표에는 M3 외곽선 테두리가 있고, 본문의 링크 앞에는 아이콘이 붙으며, 코드 블록이나 표처럼 배경이 있는 요소에는 옅은 패턴이 깔립니다.
- `<m3e-button>`, `<m3e-card>` 같은 m3e 컴포넌트를 Markdown에 직접 쓸 수 있습니다. 이 사이트의 컴포넌트 데모가 이렇게 작성되었습니다.
- 데모 콘텐츠를 배치하는 보조 클래스가 몇 가지 있습니다: `demo-surface`, `demo-row`, `demo-grid`, `demo-stack`.

모든 프런트매터 필드, 사용할 수 있는 컴포넌트, 보조 클래스는 [API](/ko-KR/getting-started/writing/api)를 참고하세요.

## 다른 언어 버전

다른 언어 폴더의 같은 위치에 같은 이름의 폴더를 둡니다. 예를 들면 `docs/zh-CN/components/chip/index.md`입니다. 그러면 두 페이지가 서로 대응하는 페이지가 되어, 언어를 바꿔도 이 페이지에 머뭅니다. 대응하는 페이지가 없으면 언어를 바꿀 때 그 언어의 홈 페이지로 이동합니다.
