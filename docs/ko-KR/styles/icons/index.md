---
title: 아이콘
hero:
  image: /hero/icons-hero.svg
  alt: 둥근 사각형 위의 아이콘들과 가는 획부터 굵은 획까지의 선
  tagline: 테마는 아이콘 글꼴이나 CDN 없이, 필요할 때 등록하는 Material Symbols 아이콘을 사용합니다.
  fit: contain
order: 2
tab: 개요
parallel:
  - choosing
  - using
---

# 아이콘

테마의 모든 아이콘은 [Material Symbols](https://fonts.google.com/icons)입니다. `@m3e/icons`가 SVG 경로로 제공하고, `<m3e-icon>`이 표시합니다. 스타일, 채우기, 크기는 [아이콘 고르기](/ko-KR/styles/icons/choosing)에서, 등록과 접근성 요구 사항은 [아이콘 사용하기](/ko-KR/styles/icons/using)에서 다룹니다.

<div class="demo-row">
  <m3e-icon name="home"></m3e-icon>
  <m3e-icon name="search"></m3e-icon>
  <m3e-icon name="settings"></m3e-icon>
  <m3e-icon name="palette"></m3e-icon>
  <m3e-icon name="translate"></m3e-icon>
  <m3e-icon name="schedule"></m3e-icon>
  <m3e-icon name="dark_mode"></m3e-icon>
  <m3e-icon name="light_mode"></m3e-icon>
</div>

## 특징

- **필요할 때 등록**: 아이콘은 각각 별도의 모듈입니다. `icons.ts`에서 가져온 아이콘만 빌드 결과에 포함되므로, 첫 화면의 크기는 전체 아이콘 수와 관계가 없습니다.
- **네트워크 불필요**: 아이콘은 `@m3e/icons`와 함께 설치되고 인라인 SVG로 렌더링됩니다. 글꼴 파일이 없으므로, 아이콘 글꼴이 로드되기 전에 텍스트가 잠깐 보이는 현상도 없습니다.
- **테마를 따름**: 아이콘은 `currentColor`를 쓰므로 자신이 놓인 컴포넌트의 M3 색상 역할에서 색을 가져오고, 화면 모드, 대비, 동적 색상의 변화를 자동으로 따릅니다.
- **외곽선과 채우기**: 모든 아이콘에는 채워진 형태가 있으며, `filled` 속성으로 두 형태를 전환합니다. 내비게이션의 선택된 항목은 이 속성으로 현재 위치를 표시합니다.

## 테마 안의 아이콘

| 위치 | 아이콘 출처 | 비고 |
| --- | --- | --- |
| 레일과 모바일 드로어 | 공통 구성의 `sidebar.categories`에 있는 각 카테고리의 `icon` | 기본값은 `category`. 현재 카테고리는 채워진 형태로 표시됩니다 |
| 앱 바 | 테마에 내장 | 메뉴, 검색, 더보기, 설정, 소셜 링크 |
| 플로팅 액션 버튼 | 테마에 내장 | “맨 위로”는 `keyboard_arrow_up`, 목차는 `format_list_bulleted` |
| 레일 하단 | 테마에 내장 | 화면 모드 버튼의 아이콘은 모드에 따라 바뀝니다. 언어 버튼은 `translate` |
| 글 본문 | Markdown 안의 `<m3e-icon>` | 먼저 `icons.ts`에 등록해야 합니다 |

## 이 그룹의 페이지

이 세 페이지는 병렬 페이지 한 묶음입니다. 사이드바에는 “아이콘” 항목 하나로 표시되고, 페이지 상단의 탭 바로 서로 전환합니다. 각각 `styles/icons/` 폴더의 `index.md`, `choosing.md`, `using.md`입니다. 이런 페이지를 작성하는 방법은 [페이지 작성](/ko-KR/getting-started/writing#parallel-pages)을 참고하세요.
