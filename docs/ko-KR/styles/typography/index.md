---
icon: text_fields
order: 3
tab: 개요
parallel:
  - api
---

# 타이포그래피

라틴 문자는 Roboto, 중국어 텍스트는 Noto Sans SC(Source Han Sans)를 쓰며, 일본어, 한국어, 아랍어 페이지는 Noto Sans JP, Noto Sans KR, Noto Sans Arabic을 씁니다. 모두 가변 굵기 글꼴이며, 구성에서 글꼴을 바꾸거나 Google Fonts를 끌 수 있습니다. 본문의 기본 크기는 16px, 줄 높이는 1.65입니다. 제목, 본문, 코드, 표는 모두 `rem` 단위로 크기가 정해지므로, 설정에서 글자 크기를 바꾸면 읽기 영역 전체가 비율에 맞게 확대·축소됩니다.

## 제목 단계

각 페이지에는 1단계 제목이 정확히 하나 있으며, 이것이 페이지 제목입니다. 섹션에는 2단계 제목, 하위 섹션에는 3단계 제목, 더 세부적인 설명에는 4단계 제목을 씁니다.

| 단계 | 용도 | 스타일 |
| --- | --- | --- |
| 1단계 | 페이지 제목 | display-large, 57px, 굵기 400 |
| 2단계 | 섹션. 목차에 표시 | headline-medium, 28px, 굵기 500 |
| 3단계 | 하위 섹션. 목차에 표시 | headline-small, 24px, 굵기 500 |
| 4단계 | 세부 설명 | 20px, 굵기 500 |

제목 단계는 연속되게 유지하세요. 단계를 건너뛰지 말고, 제목 대신 굵은 문단을 쓰지 마세요.

### 3단계 제목 예시

3단계 제목은 섹션을 훑어보기 쉬운 부분으로 나눕니다. 각 부분은 한 가지만 다룹니다.

#### 4단계 제목 예시

4단계 제목은 예외 상황, 버전 차이, 매개변수 세부 사항에 대한 보충 설명에 어울립니다.

## 본문

- 문단은 3~5줄로 유지하세요. 긴 문단은 목록이나 소제목으로 나누세요.
- 명령, 필드 이름, 태그 이름에는 `npm run build`, `appBar.title`, `m3e-card`처럼 인라인 코드를 쓰세요.
- 링크 텍스트는 [설치와 시스템 요구 사항](/ko-KR/getting-started/installation)처럼 링크가 가는 곳을 말해야 합니다. “여기를 클릭”이라고 쓰지 마세요.
- 강조를 위한 굵은 글씨는 아껴 쓰세요. 문단 전체를 굵게 하지 마세요.

> 인용은 사양이나 공식 자료에서 가져온 결론에 쓰세요. 본문의 인용과 콜아웃 블록에는 코드 블록과 같은 옅은 패턴이 깔립니다.

<small>보조 텍스트는 더 작은 크기와 `on-surface-variant` 색상을 씁니다.</small>

## 컴포넌트 안의 제목

`m3e-heading`에는 display, headline, title, label 네 가지 모양이 있습니다. 문서 제목과 섞어 쓸 수 있습니다. 아래 제목에는 모두 `m3e-toc-ignore`가 있어 목차에 포함되지 않습니다.

<div class="demo-stack">
  <m3e-heading m3e-toc-ignore variant="display" size="large" level="2">Display Large</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="headline" size="medium" level="3">Headline Medium</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="title" size="large" level="4">Title Large</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="label" size="large" level="5">Label Large</m3e-heading>
</div>

`level`은 보조 기술이 읽는 제목 단계를 정합니다. `variant`와 `size`는 모양만 바꿉니다.

## 글자 크기

“글자 크기” 설정에는 세 단계가 있으며, 루트 요소의 글꼴 크기를 정합니다.

| 옵션 | 루트 크기 | 어울리는 경우 |
| --- | --- | --- |
| 100% | `16px` | 기본 읽기 크기 |
| 150% | `24px` | 저시력 또는 멀리서 읽을 때 |
| 200% | `32px` | 데모와 접근성 확인 |

글꼴, 본문 요소 스타일, 타이포그래피 토큰은 [API](/ko-KR/styles/typography/api)를 참고하세요.
