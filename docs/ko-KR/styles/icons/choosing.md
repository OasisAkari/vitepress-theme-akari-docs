# 아이콘 고르기

모든 Material Symbols 아이콘에는 세 가지 스타일과 두 가지 형태가 있습니다. 테마는 기본적으로 외곽선(Outlined) 스타일을 쓰고, 선택됨이나 켜짐 같은 상태에는 채워진 형태를 씁니다.

## 스타일

| 스타일 | 특징 | 가져오기 경로 |
| --- | --- | --- |
| Outlined | 고른 획과 분명한 간격. M3 컴포넌트와 가장 잘 어울립니다 | `@m3e/icons/outlined/<name>` |
| Rounded | 둥근 획 끝과 모서리. 더 부드럽습니다 | `@m3e/icons/rounded/<name>` |
| Sharp | 각진 모서리. 더 날카롭습니다 | `@m3e/icons/sharp/<name>` |

한 인터페이스 안에서는 스타일을 하나로 통일하세요. 테마의 내비게이션, 앱 바, 버튼은 모두 Outlined를 씁니다. 사이트 전체를 Rounded로 바꾸려면 `icons.ts`의 모든 import를 바꾸고 `<m3e-icon>`에 `variant="rounded"`를 설정합니다.

## 외곽선과 채우기

`filled` 속성을 주면 아이콘의 채워진 형태가 표시됩니다.

<div class="demo-row">
  <m3e-icon name="home"></m3e-icon>
  <m3e-icon name="home" filled></m3e-icon>
  <m3e-icon name="settings"></m3e-icon>
  <m3e-icon name="settings" filled></m3e-icon>
  <m3e-icon name="palette"></m3e-icon>
  <m3e-icon name="palette" filled></m3e-icon>
</div>

```html
<m3e-icon name="home"></m3e-icon>
<m3e-icon name="home" filled></m3e-icon>
```

M3에서 채우기는 “현재” 또는 “켜짐”을 뜻합니다. 레일에서 현재 카테고리의 아이콘은 채워지고, 나머지는 외곽선으로 표시됩니다. 상태를 채우기만으로 나타내지 마세요. 선택된 항목은 배경색과 텍스트도 바뀝니다.

## 크기

아이콘의 기본 크기는 24px이며 `font-size`에 따라 크기가 바뀝니다. 자주 쓰는 크기는 다음과 같습니다.

| 크기 | 용도 |
| --- | --- |
| 20px | 조밀한 목록, 인라인 설명 |
| 24px | 기본값: 버튼, 내비게이션, 목록 항목 |
| 40px 이상 | 빈 상태 일러스트, 온보딩 페이지 |

```html
<m3e-icon name="search" style="font-size: 20px"></m3e-icon>
<m3e-icon name="search_off" style="font-size: 48px"></m3e-icon>
```

버튼이나 내비게이션 항목 같은 컴포넌트 안에서는 아이콘 크기를 바꾸지 마세요. 이런 컴포넌트는 이미 M3 사양에 따라 아이콘 크기와 간격을 정해 두었습니다.

## 알맞은 아이콘 고르기

- 의미가 굳어진 아이콘을 우선 쓰세요. 검색에는 `search`, 설정에는 `settings`, 언어에는 `translate`.
- 한 의미에는 아이콘 하나를 쓰고, 같은 아이콘을 곳에 따라 다른 동작에 쓰지 마세요.
- 추상적인 개념(“테마”나 “컴포넌트” 등)에 흔히 쓰는 아이콘이 없으면, 24px에서도 알아보기 쉬운 단순한 모양을 고르고 항상 텍스트와 함께 쓰세요.
