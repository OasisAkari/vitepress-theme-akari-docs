---
icon: colorize
order: 1
tab: 개요
parallel:
  - api
---

# 색상

테마의 모든 색상은 m3e의 동적 색상에서 나옵니다. 시드 색상 하나만 있으면 `m3e-theme`이 그로부터 `--md-sys-color-*` 토큰 전체를 생성합니다. 화면 모드, 대비, 변형을 바꾸면 팔레트 전체가 함께 갱신됩니다.

## 동적 색상

시드 색상은 색조와 톤의 관계를 정하고, 실제 밝기는 Material 3의 톤 매핑이 계산합니다. 그래서 같은 시드로 라이트 모드와 다크 모드 모두에서 읽기 좋은 색상을 얻습니다. 아래 데모는 청록색 시드로 로컬 팔레트를 생성합니다.

<m3e-theme color="#006A6A">
  <div class="swatch-grid">
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-primary)"></div>
      <code>--md-sys-color-primary</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-primary-container)"></div>
      <code>--md-sys-color-primary-container</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-secondary-container)"></div>
      <code>--md-sys-color-secondary-container</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-tertiary)"></div>
      <code>--md-sys-color-tertiary</code>
    </div>
  </div>
</m3e-theme>

사이트의 기본 시드 색상은 공통 구성의 `settings.defaults.color`에서 설정합니다. 독자는 설정에서 원하는 색상으로 바꿀 수 있습니다. 히어로가 있는 페이지는 이미지에서 가져온 색상을 씁니다. [히어로](/ko-KR/theme/hero)를 참고하세요.

## 변형 {#variants}

같은 시드 색상으로도 여러 방식으로 팔레트를 생성할 수 있습니다. 기본값은 `tonal-spot`입니다.

<div class="demo-row">
  <m3e-chip variant="elevated">Tonal Spot</m3e-chip>
  <m3e-chip>Vibrant</m3e-chip>
  <m3e-chip>Fidelity</m3e-chip>
  <m3e-chip>Expressive</m3e-chip>
  <m3e-chip>Monochrome</m3e-chip>
  <m3e-chip>Neutral</m3e-chip>
  <m3e-chip>Rainbow</m3e-chip>
  <m3e-chip>Fruit Salad</m3e-chip>
</div>

| 변형 | 특징 |
| --- | --- |
| `tonal-spot` | 균형 잡히고 채도가 낮습니다. 대부분의 문서 사이트에 어울립니다 |
| `vibrant` | 주 색상의 채도가 더 높아 브랜드 느낌이 강합니다 |
| `fidelity` | 시드 색상 자체에 더 가깝게 유지합니다 |
| `expressive` | 색조 변화가 더 생동감 있습니다 |
| `monochrome` | 색감을 모두 빼고 밝기 단계만 남깁니다 |
| `neutral` | 무채색에 가까운 표면 색상 |
| `rainbow` | 역할 간 색조 차이가 더 큽니다 |
| `fruit-salad` | 색조 분리가 가장 강합니다. 데모나 창의적인 용도에 어울립니다 |

## 라이트, 다크, 대비

같은 팔레트를 라이트와 다크에 매핑한 모습입니다.

<div class="demo-grid">
  <m3e-theme scheme="light">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>라이트 모드</strong>
      <p>밝은 표면에 어두운 텍스트. 낮 시간 사용과 프로젝터 발표에 어울립니다.</p>
    </div>
  </m3e-theme>
  <m3e-theme scheme="dark">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>다크 모드</strong>
      <p>어두운 표면에 밝은 텍스트. 어두운 환경과 오랜 시간 읽기에 어울립니다.</p>
    </div>
  </m3e-theme>
</div>

대비는 “기본”, “중간”, “높음” 세 단계입니다. 전경과 배경의 밝기 차이, 그리고 외곽선의 강도에 영향을 줍니다. 화면 모드에는 네 가지 옵션이 있습니다. [설정과 화면 모드](/ko-KR/theme/settings)를 참고하세요.

## 사용 지침

- 색상을 하드코딩하지 마세요. 항상 `--md-sys-color-*` 토큰이나 m3e 컴포넌트의 변수를 쓰세요.
- 컨테이너 색상과 콘텐츠 색상은 짝으로 씁니다: `primary`와 `on-primary`, `surface-container`와 `on-surface`.
- 단계를 구분할 때는 `surface-container-lowest`부터 `surface-container-highest`까지를 쓰세요. 그림자를 겹쳐 쓰는 데 의존하지 마세요.
- 테두리와 구분선에는 `outline-variant`를, 강조가 필요하면 `outline`을 씁니다. 오류 상태에는 `error`와 `error-container`를 씁니다.
- 고정된 브랜드 색상이 필요하면 컴포넌트마다 재정의하지 말고 시드 색상으로 지정하세요.
- 사용자 정의 배경, 그림자, 반투명 스크림은 다크 모드와 높은 대비에서 따로 확인하세요.

모든 색상 토큰은 [API](/ko-KR/styles/color/api)를 참고하세요.
