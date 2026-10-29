---
tab: API
---

# 색상: API

`m3e-theme`은 Material 3 동적 색상 사양(2025년 버전)에 따라 다음 토큰을 생성합니다. CSS에서 사용하세요.

```css
.panel {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}
```

토큰은 `m3e-theme` 안에서만 값을 가집니다. 테마가 이 토큰을 루트 요소로 복사하므로 페이지 어디에서나 쓸 수 있습니다.

## 강조 색상

| 토큰 | 용도 |
| --- | --- |
| `--md-sys-color-primary`, `--md-sys-color-on-primary` | 가장 중요한 동작과 그 위의 텍스트 |
| `--md-sys-color-primary-container`, `--md-sys-color-on-primary-container` | 눈에 띄어야 하지만 그보다 약한 컨테이너 |
| `--md-sys-color-primary-dim` | 더 어두운 주 색상 |
| `--md-sys-color-inverse-primary` | 반전 표면 위의 주 색상 |
| `--md-sys-color-secondary`, `--md-sys-color-on-secondary` | 보조 강조 |
| `--md-sys-color-secondary-container`, `--md-sys-color-on-secondary-container` | 보조 컨테이너. 선택된 내비게이션 항목, 플로팅 액션 버튼 등 |
| `--md-sys-color-secondary-dim` | 더 어두운 보조 색상 |
| `--md-sys-color-tertiary`, `--md-sys-color-on-tertiary` | 주 색상과 대비되는 강조 |
| `--md-sys-color-tertiary-container`, `--md-sys-color-on-tertiary-container` | 3차 컨테이너 |
| `--md-sys-color-tertiary-dim` | 더 어두운 3차 색상 |

각 강조 색상에는 라이트와 다크 사이에서 바뀌지 않는 고정 색상도 있습니다: `*-fixed`, `*-fixed-dim`, `on-*-fixed`, `on-*-fixed-variant`(`*`는 `primary`, `secondary`, `tertiary`).

## 표면

| 토큰 | 용도 |
| --- | --- |
| `--md-sys-color-surface`, `--md-sys-color-on-surface` | 기본 표면과 텍스트. 문서 표면은 `surface`를 씁니다 |
| `--md-sys-color-surface-dim`, `--md-sys-color-surface-bright` | 가장 어두운 표면과 가장 밝은 표면 |
| `--md-sys-color-surface-container-lowest` | 가장 낮은 컨테이너 |
| `--md-sys-color-surface-container-low` | 낮은 컨테이너. 데모 영역 등 |
| `--md-sys-color-surface-container` | 기본 컨테이너. 히어로의 텍스트 카드, 표 머리글 등 |
| `--md-sys-color-surface-container-high` | 높은 컨테이너 |
| `--md-sys-color-surface-container-highest` | 가장 높은 컨테이너 |
| `--md-sys-color-on-surface-variant` | 보조 텍스트. 캡션, 표 머리글 텍스트 등 |
| `--md-sys-color-surface-variant` | 보조 표면 |
| `--md-sys-color-inverse-surface`, `--md-sys-color-inverse-on-surface` | 반전 표면과 텍스트. 스낵바 등 |
| `--md-sys-color-background`, `--md-sys-color-on-background` | 페이지 배경과 텍스트 |
| `--md-sys-color-surface-tint` | 표면 틴트 |

## 외곽선, 오류, 스크림

| 토큰 | 용도 |
| --- | --- |
| `--md-sys-color-outline` | 강조가 필요한 테두리 |
| `--md-sys-color-outline-variant` | 구분선과 일반 테두리. 표 테두리 등 |
| `--md-sys-color-error`, `--md-sys-color-on-error` | 오류 |
| `--md-sys-color-error-container`, `--md-sys-color-on-error-container` | 오류 컨테이너 |
| `--md-sys-color-error-dim` | 더 어두운 오류 색상 |
| `--md-sys-color-shadow` | 그림자 |
| `--md-sys-color-scrim` | 대화상자 뒤의 스크림 |

## 로컬 팔레트

페이지의 콘텐츠를 `m3e-theme`으로 감싸면 그 콘텐츠만의 팔레트가 생성됩니다. [색상](/ko-KR/styles/color) 개요의 데모가 바로 이렇게 되어 있습니다.

```html
<m3e-theme color="#006A6A" scheme="dark" variant="vibrant" contrast="high">
  <!-- 콘텐츠 -->
</m3e-theme>
```

| 속성 | 값 |
| --- | --- |
| `color` | 시드 색상. 여섯 자리 16진수 값 |
| `scheme` | `light`, `dark`, `auto` |
| `variant` | [변형](/ko-KR/styles/color#variants) 참고 |
| `contrast` | `standard`, `medium`, `high` |
| `motion` | `standard`, `expressive` |

사이트 전체의 시드 색상, 변형, 대비는 설정이 정합니다. [설정과 화면 모드](/ko-KR/theme/settings/api#akarithemesettings)를 참고하세요.
