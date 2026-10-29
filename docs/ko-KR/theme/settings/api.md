---
tab: API
---

# 설정과 화면 모드: API

## settings

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 설정 대화상자를 둘지 여부. `false`이면 톱니바퀴 버튼도 숨겨집니다 |
| `showSchemeToggle` | `boolean` | `true` | 화면 모드 버튼을 표시할지 여부. `enabled`와는 별개입니다 |
| `title` | `string` | 언어에 따라 다름: “설정” | 설정 대화상자의 제목 |
| `sections` | `SettingsSectionKey[]` | 6개 모두 | 표시할 옵션과 그 순서 |
| `labels` | `Partial<Record<SettingsSectionKey, string>>` | 언어에 따라 다름 | 개별 옵션의 제목을 재정의합니다 |
| `defaults` | `Partial<AkariThemeSettings>` | 아래 표 참고 | 모든 독자가 첫 방문 때 보는 화면 |
| `persist` | `boolean` | `true` | 독자의 선택을 `localStorage`에 기록할지 여부 |
| `storageKey` | `string` | `"akari-docs-settings"` | `localStorage`의 키 이름 |

`appBar.showSettingsToggle: false`는 톱니바퀴 버튼만 숨깁니다. 설정 기능 자체는 남아 있습니다(예: 사용자 지정 컴포넌트에서 열 수 있습니다).

```ts
settings: {
  sections: ["color", "textSize"],
  labels: { textSize: "본문 글자 크기" },
  defaults: { color: "#0b57d0", scheme: "time" },
},
```

`sections`의 잘못된 항목은 걸러지고, 중복된 항목은 첫 번째만 남습니다. 결과가 비어 있으면 6개 옵션이 모두 표시됩니다.

## AkariThemeSettings

| 필드 | 옵션 키 | 값 | 기본값 |
| --- | --- | --- | --- |
| `color` | `color` | 6자리 16진수 색상 | `"#6750A4"` |
| `variant` | `variant` | `tonal-spot`, `vibrant`, `fidelity`, `expressive`, `monochrome`, `neutral`, `rainbow`, `fruit-salad` | `"tonal-spot"` |
| `scheme` | 화면 모드 버튼 | `auto`, `light`, `dark`, `time` | `"auto"` |
| `contrast` | `contrast` | `standard`, `medium`, `high` | `"standard"` |
| `motion` | `motion` | `standard`, `expressive` | `"expressive"` |
| `direction` | `direction` | `auto`, `ltr`, `rtl` | `"auto"` |
| `textSize` | `textSize` | `16px`, `24px`, `32px`(100%, 150%, 200%로 표시) | `"16px"` |

## akariHead와 화면 모드

`.vitepress/config.mts`의 `head: akariHead()`에는 첫 프레임을 그리기 전에 라이트 모드와 다크 모드를 적용하는 스크립트가 들어 있습니다. `storageKey`나 `defaults.scheme`을 바꾸면 같은 값을 여기에도 전달하세요.

```ts
head: akariHead({ storageKey: "my-docs", defaultScheme: "time" }),
```

또한 `appearance: false`를 유지하여 `html.dark`를 테마만 관리하도록 하세요.

## 저장 형식

`localStorage[storageKey]`에는 `AkariThemeSettings`와 같은 필드를 가진 JSON 객체가 저장됩니다.

```json
{
  "color": "#6750A4",
  "variant": "tonal-spot",
  "scheme": "dark",
  "contrast": "standard",
  "motion": "expressive",
  "direction": "auto",
  "textSize": "16px"
}
```

누락되었거나 잘못된 필드는 각각 따로 기본값으로 돌아갑니다.

## useAkariSettings

```ts
import { useAkariSettings } from "@theme";

const { settings, setSetting, reset, isDefault } = useAkariSettings();
setSetting("textSize", "24px");
```

| 반환값 | 설명 |
| --- | --- |
| `settings` | 현재 설정. 반응형 객체입니다 |
| `setSetting(key, value)` | 설정 하나를 바꿉니다. `persist`가 true이면 `localStorage`에도 기록합니다 |
| `reset()` | 기본값으로 되돌립니다 |
| `isDefault()` | 현재 설정이 모두 기본값과 같은지 여부 |
| `defaults` | 병합된 기본값 |
| `sections`, `labels` | 해석된 옵션 목록과 그 제목 |

## useAkariColorScheme

```ts
import { useAkariColorScheme } from "@theme";

const { mode, resolved, cycle } = useAkariColorScheme();
```

| 반환값 | 타입 | 설명 |
| --- | --- | --- |
| `mode` | `ComputedRef<"auto" \| "light" \| "dark" \| "time">` | 독자가 고른 모드 |
| `resolved` | `Ref<"light" \| "dark" \| null>` | 페이지가 실제로 라이트와 다크 중 무엇으로 표시되는지. 브라우저에 마운트되기 전에는 `null` |
| `cycle()` | `() => void` | 다음 모드로 전환합니다: 시스템 → 라이트 → 다크 → 시간에 따라 → 시스템 |

두 함수 모두 레이아웃 안의 컴포넌트에서만 호출하세요.

## 설정 패널 대체

설정 대화상자 안의 패널을 직접 만든 컴포넌트(슬롯 `Settings`)로 대체할 수 있습니다. 제목, 닫기 버튼, 모션은 여전히 대화상자가 제공합니다. [테마 확장](/ko-KR/theme/extending/api#provideakaricomponents)을 참고하세요.
