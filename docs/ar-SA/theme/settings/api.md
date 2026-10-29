---
tab: API
---

# الإعدادات والمظهر: API

## settings

| الحقل | النوع | القيمة الافتراضية | الوصف |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | ما إذا كان يوجد مربع حوار الإعدادات؛ وعند `false` يُخفى زر الترس أيضًا |
| `showSchemeToggle` | `boolean` | `true` | ما إذا كان يُعرض زر المظهر؛ مستقل عن `enabled` |
| `title` | `string` | بحسب اللغة: «الإعدادات» | عنوان مربع حوار الإعدادات |
| `sections` | `SettingsSectionKey[]` | الستة كلها | الخيارات التي تُعرض وترتيبها |
| `labels` | `Partial<Record<SettingsSectionKey, string>>` | بحسب اللغة | يستبدل عناوين خيارات منفردة |
| `defaults` | `Partial<AkariThemeSettings>` | انظر الجدول أدناه | المظهر الذي يراه كل قارئ في زيارته الأولى |
| `persist` | `boolean` | `true` | ما إذا كانت اختيارات القارئ تُكتب في `localStorage` |
| `storageKey` | `string` | `"akari-docs-settings"` | اسم المفتاح في `localStorage` |

`appBar.showSettingsToggle: false` يُخفي زر الترس فقط. أما ميزة الإعدادات نفسها فتبقى (يمكن لمكوّن مخصّص فتحها مثلًا).

```ts
settings: {
  sections: ["color", "textSize"],
  labels: { textSize: "حجم نص المتن" },
  defaults: { color: "#0b57d0", scheme: "time" },
},
```

تُستبعد المدخلات غير الصالحة في `sections`، ولا يُبقى من أي مدخلات مكررة إلا أولها. وإذا كانت النتيجة فارغة، تُعرض الخيارات الستة كلها.

## AkariThemeSettings

| الحقل | مفتاح الخيار | القيم | القيمة الافتراضية |
| --- | --- | --- | --- |
| `color` | `color` | لون سداسي عشري من ست خانات | `"#6750A4"` |
| `variant` | `variant` | `tonal-spot`، `vibrant`، `fidelity`، `expressive`، `monochrome`، `neutral`، `rainbow`، `fruit-salad` | `"tonal-spot"` |
| `scheme` | زر المظهر | `auto`، `light`، `dark`، `time` | `"auto"` |
| `contrast` | `contrast` | `standard`، `medium`، `high` | `"standard"` |
| `motion` | `motion` | `standard`، `expressive` | `"expressive"` |
| `direction` | `direction` | `auto`، `ltr`، `rtl` | `"auto"` |
| `textSize` | `textSize` | `16px`، `24px`، `32px` (تُعرض بالشكل 100%، 150%، 200%) | `"16px"` |

## akariHead والوضع الفاتح والوضع الداكن

يتضمن `head: akariHead()` في `.vitepress/config.mts` سكربتًا يطبّق الوضع الفاتح أو الداكن قبل رسم الإطار الأول. إذا غيّرت `storageKey` أو `defaults.scheme`، فمرّر القيم نفسها إليه:

```ts
head: akariHead({ storageKey: "my-docs", defaultScheme: "time" }),
```

أبقِ أيضًا على `appearance: false`، لكي تتولى السمة وحدها إدارة `html.dark`.

## صيغة التخزين

يحمل `localStorage[storageKey]` كائن JSON بالحقول نفسها الموجودة في `AkariThemeSettings`:

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

كل حقل مفقود أو غير صالح يعود إلى قيمته الافتراضية بمفرده.

## useAkariSettings

```ts
import { useAkariSettings } from "@theme";

const { settings, setSetting, reset, isDefault } = useAkariSettings();
setSetting("textSize", "24px");
```

| القيمة المُرجعة | الوصف |
| --- | --- |
| `settings` | الإعدادات الحالية، على شكل كائن تفاعلي |
| `setSetting(key, value)` | يغيّر إعدادًا واحدًا؛ وعندما تكون `persist` صحيحة، يكتبه أيضًا في `localStorage` |
| `reset()` | يستعيد القيم الافتراضية |
| `isDefault()` | ما إذا كان كل إعداد حالي يساوي قيمته الافتراضية |
| `defaults` | القيم الافتراضية المدموجة |
| `sections`، `labels` | قائمة الخيارات المحسوبة وعناوينها |

## useAkariColorScheme

```ts
import { useAkariColorScheme } from "@theme";

const { mode, resolved, cycle } = useAkariColorScheme();
```

| القيمة المُرجعة | النوع | الوصف |
| --- | --- | --- |
| `mode` | `ComputedRef<"auto" \| "light" \| "dark" \| "time">` | الوضع الذي اختاره القارئ |
| `resolved` | `Ref<"light" \| "dark" \| null>` | ما إذا كانت الصفحة تعرض فعليًا الوضع الفاتح أو الداكن؛ و`null` إلى أن تُركَّب في المتصفح |
| `cycle()` | `() => void` | ينتقل إلى الوضع التالي: النظام ← فاتح ← داكن ← حسب الوقت ← النظام |

لا تستدعِ الدالتين إلا من المكوّنات الموجودة داخل التخطيط.

## استبدال لوحة الإعدادات

يمكنك استبدال اللوحة الموجودة في مربع حوار الإعدادات بمكوّن خاص بك (الخانة `Settings`). يبقى مربع الحوار هو ما يوفّر العنوان وزر الإغلاق والحركة. راجع [توسيع السمة](/ar-SA/theme/extending/api#provideakaricomponents).
