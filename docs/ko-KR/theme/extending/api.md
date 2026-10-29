---
tab: API
---

# 테마 확장: API

## provideAkariComponents

```ts
import { provideAkariComponents } from "./composables/useAkariConfig";

function provideAkariComponents(
  app: App,
  components: Partial<Record<AkariComponentSlot, Component>>,
): void;
```

테마 엔트리의 `enhanceApp`에서 호출합니다. 전달한 컴포넌트는 각각 해당하는 부분을 대체하고, 전달하지 않은 부분은 기본 제공 컴포넌트를 씁니다. 구성 파일에는 데이터만 넣을 수 있으므로, 컴포넌트는 구성이 아니라 여기서 제공합니다.

| 슬롯 | 대체하는 부분 | 기본 제공 컴포넌트 |
| --- | --- | --- |
| `AppBar` | 앱 바 | `m3e-app-bar` 앱 바 |
| `DesktopNav` | 데스크톱 레일과 내비게이션 드로어 | `m3e-nav-rail`과 `m3e-nav-menu`. 루트 요소는 `display: contents`이고, 레일은 페이지 그리드 1열의 전체 높이를 차지하며, 상시 표시 드로어는 2열 2행에 놓입니다 |
| `Sidebar` | 좁은 화면의 내비게이션 드로어 | 재귀적인 `m3e-nav-menu` |
| `Settings` | 설정 대화상자 안의 패널 | 옵션 그룹 6개. 제목, 닫기 버튼, 모션은 대화상자가 제공합니다 |
| `Hero` | 페이지 히어로 | 제목 카드와 이미지 카드. 프런트매터에 `hero`가 있을 때만 렌더링됩니다 |
| `Toc` | 오른쪽 목차 | 화면에 고정되는 목차 |
| `Pager` | 콘텐츠 끝의 페이지 이동 카드 | 이전 페이지와 다음 페이지 카드 |
| `Footer` | 푸터 | 물결 구분선과 푸터 표면 |
| `Content` | Markdown 콘텐츠의 바깥 컨테이너 | 스타일이 없는 `div` |

가장 간단한 앱 바:

```vue
<script setup lang="ts">
import { useAkariConfig } from "@theme";

const config = useAkariConfig();
</script>

<template>
  <m3e-app-bar>
    <span slot="title">{{ config.appBar.title }}</span>
    <m3e-chip v-if="config.appBar.version" slot="trailing">
      {{ config.appBar.version }}
    </m3e-chip>
  </m3e-app-bar>
</template>
```

실제로 앱 바를 대체할 때는 좁은 화면에서 내비게이션 드로어를 여는 토글(`<m3e-drawer-toggle for="akari-sidebar">`)도 남겨 두세요. 이 토글이 없으면 좁은 화면에서 내비게이션을 열 수 없습니다.

## 컴포저블

모두 테마 엔트리에서 내보내며(`import { … } from "@theme"`), 레이아웃 안의 컴포넌트에서만 호출할 수 있습니다.

| 함수 | 반환값 | 참고 |
| --- | --- | --- |
| `useAkariConfig()` | `ComputedRef<ResolvedAkariThemeConfig>`: 기본값과 병합된 테마 구성 | 아래 참고 |
| `useSidebar()` | `{ items, prevNext, tabGroup, isActive, hasActive }` | [사이드 내비게이션](/ko-KR/theme/sidebar/api#usesidebar) |
| `useAkariSettings()` | `{ settings, setSetting, reset, isDefault, defaults, sections, labels }` | [설정과 화면 모드](/ko-KR/theme/settings/api#useakarisettings) |
| `useAkariColorScheme()` | `{ mode, resolved, cycle }` | [설정과 화면 모드](/ko-KR/theme/settings/api#useakaricolorscheme) |
| `useAkariI18n()` | `{ lang, messages, t }` | [국제화](/ko-KR/theme/i18n/api#useakarii18n) |
| `useAkariLocales()` | `{ locales, homeHref }` | [국제화](/ko-KR/theme/i18n/api#useakarilocales) |
| `useAkariSearch()` | 검색 패널의 상태와 동작 | [검색](/ko-KR/theme/search/api#useakarisearch) |

`useAkariConfig()`의 결과에는 `lang`, `messages`, `appBar`, `sidebar`, `settings`, `toc`, `footer`, `search`, `fonts`, `components`가 들어 있습니다. 각 그룹은 기본값이 채워져 있고 검증을 거쳤습니다(예: `toc.maxDepth`는 1에서 6 사이로 제한됩니다).

## 그 밖의 내보내기

| 내보내기 | 타입 | 용도 |
| --- | --- | --- |
| `defineAkariConfig` | `(config: AkariSiteConfig) => AkariDirectoryConfig` | 구성 파일 작성. [구성](/ko-KR/getting-started/configuration/api#defineakariconfig) 참고 |
| `defineAkariThemeConfig` | `(config: AkariThemeConfig) => AkariThemeConfig` | 테마 필드만 작성할 때 쓰는 타입 도우미 |
| `registerSearchBackend` | `(id, handler) => void` | 검색 백엔드 등록. [검색](/ko-KR/theme/search/api#registered-backends) 참고 |
| `defineAkariLanguage` | `(language: AkariLanguage) => AkariLanguage` | 언어 팩 작성. [국제화](/ko-KR/theme/i18n/api#akarilanguage) 참고 |
| `AKARI_LANGUAGES` | `AkariLanguage[]` | 기본 제공 언어 팩 |
| `resolveLanguage` | `(lang, languages?) => ResolvedAkariLanguage` | 한 언어가 최종적으로 쓰는 언어 팩 |
| `AKARI_CONTENT_ID` | `"akari-doc-content"` | 콘텐츠 컨테이너의 id |
| `AKARI_SIDEBAR_ID` | `"akari-sidebar"` | 좁은 화면 내비게이션 드로어의 id |
| `AKARI_SETTINGS_ID` | `"akari-settings"` | 설정 패널의 id |

타입(`AkariThemeConfig`, `AkariSidebarItem`, `AkariSearchResult` 등)은 모두 `types.ts`에서 내보냅니다.

## CSS 변수

| 범위 | 변수 | 참고 |
| --- | --- | --- |
| 문서 표면, 목차, 푸터 | `--akari-doc-*`, `--akari-toc-width`, `--akari-wavy-divider-color` | [레이아웃과 앱 바](/ko-KR/theme/layout/api#css-variables) |
| 병렬 페이지의 탭 바 | `--akari-app-bar-tabs-gap`, `--akari-page-tabs-docked-max-width` | [사이드 내비게이션](/ko-KR/theme/sidebar/api#tab-bar-css-variables) |
| 히어로와 패턴 | `--akari-doc-hero-*`, `--akari-pattern-*` | [히어로](/ko-KR/theme/hero/api#css-variables) |
| 색상 | `--md-sys-color-*` | [색상](/ko-KR/styles/color/api) |
| 타이포그래피 | `--md-sys-typescale-*` | [타이포그래피](/ko-KR/styles/typography/api) |
| m3e 컴포넌트 | `--m3e-card-shape`, `--m3e-button-*` 등 | m3e 컴포넌트 문서 |

## 소스 구조 {#source-layout}

```text
docs/.vitepress/
├── config.mts             테마를 VitePress에 연결
├── content/               폴더에서 언어, 경로, 내비게이션 생성 (Node)
└── theme/
    ├── index.ts           테마 엔트리와 공개 내보내기
    ├── define.ts          defineAkariConfig와 defineAkariLanguage
    ├── config.ts          구성 기본값과 검증
    ├── types.ts           타입 정의
    ├── constants.ts       기본값, 브레이크포인트, id
    ├── i18n/              언어 팩과 언어 결정
    │   └── languages/     기본 제공 언어 팩, 언어마다 파일 하나
    ├── locales.ts         언어 전환용 경로 매핑
    ├── sidebar.ts         내비게이션 정규화, 매칭, 페이지 이동
    ├── settings.ts        설정 검증과 저장
    ├── scheme.ts          라이트 모드와 다크 모드 판정, 첫 프레임 스크립트
    ├── hero.ts            히어로 프런트매터 파싱
    ├── loading.ts         로딩 바 진행률 계산
    ├── head.ts / fonts.ts akariHead와 글꼴
    ├── markdown.ts        akariMarkdown
    ├── m3e.ts / icons.ts  컴포넌트와 아이콘의 필요 시 등록
    ├── layouts/           AkariLayout.vue
    ├── components/
    │   ├── shell/         앱 바, "더보기" 메뉴, 화면 모드 버튼과 언어 버튼, 대화상자, 로딩 바
    │   ├── sidebar/       레일, 데스크톱 내비게이션 드로어, 좁은 화면 내비게이션
    │   ├── content/       히어로, 탭 바, 목차, 페이지 이동 카드, FAB, 푸터
    │   └── settings/      설정 대화상자와 패널
    ├── composables/       컴포저블
    ├── search/            검색 패널, 백엔드, 상태
    └── styles/            토큰, 셸, 콘텐츠, 패턴, 탭 바 스타일
```

브라우저에 의존하지 않는 로직(구성 해석, 내비게이션 매칭, 언어 경로, 설정 검증, 히어로 파싱, 모션 곡선 등)은 순수 함수로 작성되어 있으며, 단위 테스트는 저장소 루트의 `tests/`에 있습니다.
