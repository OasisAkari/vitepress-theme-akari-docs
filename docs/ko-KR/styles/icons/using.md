# 아이콘 사용하기

아이콘은 사용하기 전에 등록해야 합니다. 아이콘은 한 번만 등록하면 되고, 그 뒤에는 Markdown, 구성, 컴포넌트에서 이름으로 참조할 수 있습니다.

## 등록

`docs/.vitepress/theme/icons.ts`에서 아이콘 모듈을 가져옵니다. 모듈을 가져오면 아이콘이 등록됩니다.

```ts
import "@m3e/icons/outlined/home";
import "@m3e/icons/outlined/search";
import "@m3e/icons/outlined/rocket_launch";
```

- 모듈 이름은 Material Symbols 아이콘 이름입니다. [fonts.google.com/icons](https://fonts.google.com/icons)에서 찾아볼 수 있습니다.
- 아이콘 패키지 전체를 가져오지 마세요. 사용하는 아이콘만 가져옵니다. 가져오지 않은 아이콘은 빌드 결과에 포함되지 않습니다.
- 등록되지 않은 아이콘을 쓰는 `<m3e-icon>`은 빈칸으로 렌더링됩니다. 아이콘이 표시되지 않으면 먼저 등록되었는지 확인하세요.

## 페이지에서 아이콘 사용

Markdown에 `<m3e-icon>`을 직접 씁니다.

```html
<m3e-icon name="rocket_launch"></m3e-icon>
```

버튼 같은 컴포넌트 안에서는 `slot="icon"`으로 아이콘을 배치합니다.

<div class="demo-row">
  <m3e-button variant="filled">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    시작하기
  </m3e-button>
  <m3e-button variant="tonal">
    <m3e-icon slot="icon" name="tune"></m3e-icon>
    조정
  </m3e-button>
</div>

```html
<m3e-button variant="filled">
  <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
  시작하기
</m3e-button>
```

## 내비게이션에서 아이콘 사용

레일과 모바일 드로어 최상위 메뉴의 아이콘은 카테고리 아이콘이며, 공통 구성의 `sidebar.categories`에서 설정합니다. 글의 아이콘은 프런트매터에 씁니다.

```ts
// docs/config.ts
sidebar: {
  categories: {
    "getting-started": { icon: "rocket_launch" },
    styles: { icon: "style" },
  },
},
```

```yaml
# docs/ko-KR/styles/color/index.md
---
icon: colorize
---
```

이 아이콘들도 `icons.ts`에 등록해야 합니다. 아이콘이 없는 카테고리는 `category`를 표시합니다.

## 접근성

- 텍스트 옆의 아이콘은 장식이므로 따로 할 일이 없습니다. `<m3e-icon>`은 기본적으로 보조 기술에서 숨겨집니다.
- 텍스트 없이 아이콘만 있는 버튼에는 반드시 이름이 있어야 합니다. 예를 들어 `<m3e-icon-button aria-label="검색">`처럼 쓰고, 같은 텍스트를 표시하는 `m3e-tooltip`을 함께 둡니다.
- 방향을 나타내는 아이콘(화살표, 앞으로와 뒤로)은 오른쪽에서 왼쪽 레이아웃에서 짝으로 바꿔야 합니다. 예를 들어 `arrow_forward`와 `arrow_back`을 서로 바꿉니다. 방향 이외의 의미를 아이콘만으로 전달하지 마세요.
- 고대비 모드에서 아이콘은 텍스트 색상을 따릅니다. 아이콘에 고정 색상을 주지 마세요.
