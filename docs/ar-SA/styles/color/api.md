---
tab: API
---

# الألوان: API

يولّد `m3e-theme` الرموز التالية وفق مواصفات الألوان الديناميكية في Material 3 (إصدار 2025). استخدمها في CSS:

```css
.panel {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}
```

لا تكون للرموز قيم إلا داخل `m3e-theme`. وتنسخها السمة إلى العنصر الجذر، لذا يمكنك استخدامها في أي مكان من الصفحة.

## ألوان التمييز

| الرمز | الاستخدام |
| --- | --- |
| `--md-sys-color-primary`، `--md-sys-color-on-primary` | أهم الإجراءات والنص فوقها |
| `--md-sys-color-primary-container`، `--md-sys-color-on-primary-container` | حاويات تحتاج إلى البروز، لكن بدرجة أخف |
| `--md-sys-color-primary-dim` | لون رئيسي أغمق |
| `--md-sys-color-inverse-primary` | اللون الرئيسي على الأسطح المعكوسة |
| `--md-sys-color-secondary`، `--md-sys-color-on-secondary` | إبراز ثانوي |
| `--md-sys-color-secondary-container`، `--md-sys-color-on-secondary-container` | حاويات ثانوية، مثل عنصر التنقل المحدد وأزرار الإجراءات العائمة (FAB) |
| `--md-sys-color-secondary-dim` | لون ثانوي أغمق |
| `--md-sys-color-tertiary`، `--md-sys-color-on-tertiary` | إبراز يتباين مع اللون الرئيسي |
| `--md-sys-color-tertiary-container`، `--md-sys-color-on-tertiary-container` | حاويات ثالثية |
| `--md-sys-color-tertiary-dim` | لون ثالثي أغمق |

لكل لون تمييز أيضًا ألوان ثابتة لا تتغير بين الفاتح والداكن: `*-fixed` و`*-fixed-dim` و`on-*-fixed` و`on-*-fixed-variant` (حيث `*` هو `primary` أو `secondary` أو `tertiary`).

## الأسطح

| الرمز | الاستخدام |
| --- | --- |
| `--md-sys-color-surface`، `--md-sys-color-on-surface` | السطح والنص الافتراضيان؛ ويستخدم سطح المستند `surface` |
| `--md-sys-color-surface-dim`، `--md-sys-color-surface-bright` | أغمق الأسطح وأسطعها |
| `--md-sys-color-surface-container-lowest` | أدنى حاوية |
| `--md-sys-color-surface-container-low` | حاوية منخفضة، مثل مناطق العروض التوضيحية |
| `--md-sys-color-surface-container` | الحاوية الافتراضية، مثل بطاقة النص في قسم الواجهة وترويسات الجداول |
| `--md-sys-color-surface-container-high` | حاوية مرتفعة |
| `--md-sys-color-surface-container-highest` | أعلى حاوية |
| `--md-sys-color-on-surface-variant` | النص الثانوي، مثل التسميات التوضيحية ونص ترويسات الجداول |
| `--md-sys-color-surface-variant` | سطح ثانوي |
| `--md-sys-color-inverse-surface`، `--md-sys-color-inverse-on-surface` | السطح والنص المعكوسان، مثل شريط الإشعار (snackbar) |
| `--md-sys-color-background`، `--md-sys-color-on-background` | خلفية الصفحة ونصها |
| `--md-sys-color-surface-tint` | صبغة السطح |

## الحدود والخطأ وطبقة التعتيم

| الرمز | الاستخدام |
| --- | --- |
| `--md-sys-color-outline` | الحدود التي تحتاج إلى إبراز |
| `--md-sys-color-outline-variant` | الفواصل والحدود العادية، مثل حدود الجداول |
| `--md-sys-color-error`، `--md-sys-color-on-error` | الأخطاء |
| `--md-sys-color-error-container`، `--md-sys-color-on-error-container` | حاويات الأخطاء |
| `--md-sys-color-error-dim` | لون خطأ أغمق |
| `--md-sys-color-shadow` | الظلال |
| `--md-sys-color-scrim` | طبقة التعتيم (scrim) خلف مربعات الحوار |

## لوحات الألوان المحلية

غلّف محتوى في الصفحة بـ `m3e-theme` لتوليد لوحة ألوان مستقلة له. والعروض التوضيحية في صفحة النظرة العامة لـ [الألوان](/ar-SA/styles/color) تفعل ذلك تمامًا:

```html
<m3e-theme color="#006A6A" scheme="dark" variant="vibrant" contrast="high">
  <!-- المحتوى -->
</m3e-theme>
```

| الخاصية | القيم |
| --- | --- |
| `color` | اللون الأساسي، بقيمة سداسية عشرية من ستة أرقام |
| `scheme` | `light`، `dark`، `auto` |
| `variant` | راجع [التنويعات](/ar-SA/styles/color#variants) |
| `contrast` | `standard`، `medium`، `high` |
| `motion` | `standard`، `expressive` |

تحدد الإعدادات اللون الأساسي والتنويع والتباين للموقع كله؛ راجع [الإعدادات والمظهر](/ar-SA/theme/settings/api#akarithemesettings).
