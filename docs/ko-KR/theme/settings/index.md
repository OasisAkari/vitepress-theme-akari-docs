---
icon: settings
order: 4
tab: 개요
parallel:
  - api
  - details
---

# 설정과 화면 모드

독자는 페이지가 보이는 방식을 조정할 수 있습니다. 레일 하단(좁은 화면에서는 내비게이션 드로어 하단)의 둥근 화면 모드 버튼은 라이트 모드와 다크 모드를 전환하고, 앱 바의 톱니바퀴 버튼은 설정을 엽니다. 이 옵션들은 독자 자신의 브라우저에만 적용됩니다. `localStorage`에 저장되며 다른 방문자에게는 영향을 주지 않습니다.

## 라이트 모드와 다크 모드

버튼을 누를 때마다 다음 모드로 전환되고, 화면 하단에 스낵바가 나타납니다. 예: “테마가 전환되었습니다: 다크”.

| 모드 | 아이콘 | 효과 |
| --- | --- | --- |
| 시스템 | `brightness_auto` | 시스템의 라이트·다크 설정을 따름(기본값) |
| 라이트 | `light_mode` | 항상 라이트 |
| 다크 | `dark_mode` | 항상 다크 |
| 시간에 따라 | `schedule` | 19:00부터 다음 날 07:00까지는 다크, 그 밖의 시간에는 라이트 |

“시스템”과 “시간에 따라” 모드에서는 스낵바가 현재 페이지가 라이트인지 다크인지도 알려 줍니다. 예: “테마가 전환되었습니다: 시스템 (다크)”.

## 설정

톱니바퀴 버튼이 여는 설정 대화상자에는 옵션 그룹이 6개 있습니다. 변경 사항은 즉시 적용됩니다.

| 옵션 | 내용 |
| --- | --- |
| 색상 | 테마의 시드 색상 |
| 변형 | 시드 색상에서 팔레트를 생성하는 방식. 예: Tonal Spot, Vibrant |
| 대비 | 기본, 중간, 높음 |
| 모션 | 표준, 표현형 |
| 텍스트 방향 | 언어에 따름, 왼쪽에서 오른쪽, 오른쪽에서 왼쪽 |
| 글자 크기 | 100%, 150%, 200% |

<div class="demo-surface">
  <div class="demo-stack">
    <div class="demo-row">
      <strong>변형</strong>
      <m3e-filter-chip-set aria-label="변형 예시">
        <m3e-filter-chip selected value="tonal-spot">Tonal Spot</m3e-filter-chip>
        <m3e-filter-chip value="vibrant">Vibrant</m3e-filter-chip>
        <m3e-filter-chip value="expressive">Expressive</m3e-filter-chip>
        <m3e-filter-chip value="monochrome">Monochrome</m3e-filter-chip>
      </m3e-filter-chip-set>
    </div>
    <div class="demo-row">
      <strong>설정 유지</strong>
      <m3e-switch id="settings-demo-persist" checked aria-label="설정 유지 예시"></m3e-switch>
      <span>이 브라우저에 저장</span>
    </div>
  </div>
</div>

이 컨트롤은 시각적 데모일 뿐입니다. 바꿔도 테마는 바뀌지 않습니다.

히어로가 있는 페이지는 대신 이미지에서 가져온 색상을 씁니다. 페이지를 떠나면 설정의 색상으로 돌아옵니다.

## 사이트의 기본 화면

독자의 선택은 그 독자의 브라우저에만 저장됩니다. 모든 사람이 첫 방문 때 보는 화면을 바꾸려면 공통 구성에서 기본값을 설정합니다.

```ts
// docs/config.ts
settings: {
  defaults: {
    color: "#6750A4",
    scheme: "auto",
    motion: "expressive",
  },
},
```

일부 옵션만 표시하거나 화면 모드 버튼을 숨길 수도 있습니다. [API](/ko-KR/theme/settings/api)를 참고하세요. 라이트 모드와 다크 모드가 첫 프레임 전에 적용되는 방식과 각 옵션이 적용되는 곳은 [세부 사항](/ko-KR/theme/settings/details)을 참고하세요.
