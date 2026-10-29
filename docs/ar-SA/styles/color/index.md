---
icon: colorize
order: 1
tab: نظرة عامة
parallel:
  - api
---

# الألوان

تأتي ألوان السمة كلها من الألوان الديناميكية في m3e. لا تحتاج إلا إلى لون أساسي (seed color) واحد: يولّد منه `m3e-theme` المجموعة الكاملة من رموز `--md-sys-color-*`. وعند التبديل بين الوضع الفاتح والوضع الداكن، أو تغيير التباين أو التنويع، تتحدث لوحة الألوان كلها معًا.

## الألوان الديناميكية

يحدد اللون الأساسي العلاقة بين تدرّج اللون ودرجته، ويحسب تعيين الدرجات في Material 3 السطوعَ الفعلي. لذلك يعطي اللون الأساسي نفسه ألوانًا مقروءة في الوضع الفاتح والوضع الداكن كليهما. يولّد العرض التوضيحي أدناه لوحة ألوان محلية من لون أساسي أخضر مزرق:

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

يُضبط اللون الأساسي الافتراضي للموقع في `settings.defaults.color` في التهيئة المشتركة. ويمكن للقراء تغييره إلى لون يفضّلونه من الإعدادات. أما الصفحات التي تحتوي على قسم الواجهة (hero) فتستخدم لونًا مأخوذًا من الصورة؛ راجع [قسم الواجهة](/ar-SA/theme/hero).

## التنويعات {#variants}

يمكن للون الأساسي نفسه أن يولّد لوحة ألوان بطرق مختلفة. والقيمة الافتراضية هي `tonal-spot`:

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

| التنويع | الطابع |
| --- | --- |
| `tonal-spot` | متوازن ومنخفض التشبع؛ يناسب معظم مواقع التوثيق |
| `vibrant` | لون رئيسي أكثر تشبعًا، بطابع أقوى للعلامة التجارية |
| `fidelity` | يبقى أقرب إلى اللون الأساسي نفسه |
| `expressive` | تحولات أكثر حيوية في تدرّج اللون |
| `monochrome` | يزيل أي مسحة لونية ولا يبقي إلا مستويات السطوع |
| `neutral` | ألوان أسطح قريبة من المحايدة |
| `rainbow` | فروق أكبر في تدرّج اللون بين الأدوار |
| `fruit-salad` | أقوى فصل بين تدرّجات اللون؛ يناسب العروض التوضيحية والاستخدامات الإبداعية |

## الفاتح والداكن والتباين

لوحة الألوان نفسها، معيَّنة إلى الفاتح والداكن:

<div class="demo-grid">
  <m3e-theme scheme="light">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>الوضع الفاتح</strong>
      <p>أسطح فاتحة ونص داكن. يناسب الاستخدام نهارًا والعرض على جهاز إسقاط.</p>
    </div>
  </m3e-theme>
  <m3e-theme scheme="dark">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>الوضع الداكن</strong>
      <p>أسطح داكنة ونص فاتح. يناسب الإضاءة الخافتة وجلسات القراءة الطويلة.</p>
    </div>
  </m3e-theme>
</div>

للتباين ثلاثة مستويات: «افتراضي» و«متوسط» و«عالٍ». ويؤثر في فرق السطوع بين المقدمة والخلفية، وفي قوة الحدود. وللوضع الفاتح والوضع الداكن أربعة خيارات؛ راجع [الإعدادات والمظهر](/ar-SA/theme/settings).

## إرشادات الاستخدام

- لا تكتب الألوان بقيم ثابتة. استخدم دائمًا رموز `--md-sys-color-*` أو متغيرات مكونات m3e.
- استخدم ألوان الحاوية والمحتوى أزواجًا: `primary` مع `on-primary`، و`surface-container` مع `on-surface`.
- استخدم من `surface-container-lowest` إلى `surface-container-highest` للفصل بين المستويات. لا تعتمد على تكديس الظلال.
- استخدم `outline-variant` للحدود والفواصل، و`outline` عندما تحتاج إلى إبراز. واستخدم `error` و`error-container` لحالات الخطأ.
- عندما تحتاج إلى لون ثابت للعلامة التجارية، اجعله اللون الأساسي بدلًا من تجاوزه مكونًا مكونًا.
- افحص الخلفيات والظلال وطبقات التعتيم شبه الشفافة المخصصة كلًّا على حدة في الوضع الداكن وفي التباين العالي.

لجميع رموز الألوان، راجع [API](/ar-SA/styles/color/api).
