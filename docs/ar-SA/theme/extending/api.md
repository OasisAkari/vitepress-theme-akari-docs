---
tab: API
---

# توسيع السمة: API

## provideAkariComponents

```ts
import { provideAkariComponents } from "./composables/useAkariConfig";

function provideAkariComponents(
  app: App,
  components: Partial<Record<AkariComponentSlot, Component>>,
): void;
```

استدعِها في `enhanceApp` داخل مدخل السمة. كل مكوّن تمرّره يحلّ محل الجزء المقابل له؛ والأجزاء التي لا تمرّرها تستخدم المكوّنات المدمجة. لا تحمل ملفات التهيئة إلا البيانات، لذا تُقدَّم المكوّنات هنا وليس في التهيئة.

| الخانة | ما تستبدله | المكوّن المدمج |
| --- | --- | --- |
| `AppBar` | شريط التطبيق | شريط التطبيق `m3e-app-bar` |
| `DesktopNav` | شريط التنقل (rail) ودرج التنقل على سطح المكتب | `m3e-nav-rail` و`m3e-nav-menu`؛ العنصر الجذري `display: contents`، ويمتد شريط التنقل على كامل ارتفاع العمود 1 من شبكة الصفحة، ويقع الدرج الثابت في العمود 2، الصف 2 |
| `Sidebar` | درج التنقل على الشاشات الضيقة | `m3e-nav-menu` متداخل |
| `Settings` | اللوحة داخل مربع حوار الإعدادات | ست مجموعات من الخيارات؛ أما العنوان وزر الإغلاق والحركة فيوفّرها مربع الحوار |
| `Hero` | قسم الواجهة (hero) في الصفحة | بطاقة العنوان وبطاقة الصورة، ولا يُعرض إلا عندما تحتوي البيانات الأمامية (frontmatter) على `hero` |
| `Toc` | جدول المحتويات على اليسار | جدول محتويات معلّق |
| `Pager` | التنقل بين الصفحات في نهاية المحتوى | بطاقتا الصفحة السابقة والصفحة التالية |
| `Footer` | التذييل | فاصل متموّج وسطح التذييل |
| `Content` | الحاوية الخارجية لمحتوى Markdown | `div` بلا أنماط |

شريط تطبيق في أبسط صوره:

```vue
<script setup lang="ts">
import { useAkariConfig } from "@theme";

const config = useAkariConfig();
</script>

<template>
  <m3e-app-bar>
    <span slot="title">{{ config.appBar.title }}</span>
    <m3e-chip v-if="config.appBar.version" slot="trailing">
      {{ config.appBar.version }}
    </m3e-chip>
  </m3e-app-bar>
</template>
```

عندما تستبدل شريط التطبيق فعليًا، احتفظ أيضًا بزر التبديل الذي يفتح درج التنقل على الشاشات الضيقة (`<m3e-drawer-toggle for="akari-sidebar">`). من دونه لا يمكن فتح التنقل على الشاشات الضيقة.

## دوال composable

كلها مُصدَّرة من مدخل السمة (`import { … } from "@theme"`)، ولا يمكن استدعاؤها إلا في المكوّنات الموجودة داخل التخطيط.

| الدالة | ما تُرجعه | انظر |
| --- | --- | --- |
| `useAkariConfig()` | `ComputedRef<ResolvedAkariThemeConfig>`: تهيئة السمة مدموجة مع القيم الافتراضية | أدناه |
| `useSidebar()` | `{ items, prevNext, tabGroup, isActive, hasActive }` | [التنقل الجانبي](/ar-SA/theme/sidebar/api#usesidebar) |
| `useAkariSettings()` | `{ settings, setSetting, reset, isDefault, defaults, sections, labels }` | [الإعدادات](/ar-SA/theme/settings/api#useakarisettings) |
| `useAkariColorScheme()` | `{ mode, resolved, cycle }` | [الإعدادات](/ar-SA/theme/settings/api#useakaricolorscheme) |
| `useAkariI18n()` | `{ lang, messages, t }` | [التدويل](/ar-SA/theme/i18n/api#useakarii18n) |
| `useAkariLocales()` | `{ locales, homeHref }` | [التدويل](/ar-SA/theme/i18n/api#useakarilocales) |
| `useAkariSearch()` | حالة لوحة البحث وإجراءاتها | [البحث](/ar-SA/theme/search/api#useakarisearch) |

تحتوي نتيجة `useAkariConfig()` على `lang` و`messages` و`appBar` و`sidebar` و`settings` و`toc` و`footer` و`search` و`fonts` و`components`. كل مجموعة منها مُكمَّلة بقيمها الافتراضية وتم التحقق من صحتها (مثلًا، تُحصر قيمة `toc.maxDepth` بين 1 و6).

## تصديرات أخرى

| المُصدَّر | النوع | الغرض |
| --- | --- | --- |
| `defineAkariConfig` | `(config: AkariSiteConfig) => AkariDirectoryConfig` | كتابة ملفات التهيئة؛ راجع [التهيئة](/ar-SA/getting-started/configuration/api#defineakariconfig) |
| `defineAkariThemeConfig` | `(config: AkariThemeConfig) => AkariThemeConfig` | مساعد للأنواع عندما تكتب حقول السمة فقط |
| `registerSearchBackend` | `(id, handler) => void` | يسجّل خدمة بحث؛ راجع [البحث](/ar-SA/theme/search/api#registered-backends) |
| `defineAkariLanguage` | `(language: AkariLanguage) => AkariLanguage` | كتابة حزمة لغة؛ راجع [التدويل](/ar-SA/theme/i18n/api#akarilanguage) |
| `AKARI_LANGUAGES` | `AkariLanguage[]` | حزم اللغات المدمجة |
| `resolveLanguage` | `(lang, languages?) => ResolvedAkariLanguage` | الحزمة التي تنتهي إليها اللغة |
| `AKARI_CONTENT_ID` | `"akari-doc-content"` | معرّف (id) حاوية المحتوى |
| `AKARI_SIDEBAR_ID` | `"akari-sidebar"` | معرّف (id) درج التنقل على الشاشات الضيقة |
| `AKARI_SETTINGS_ID` | `"akari-settings"` | معرّف (id) لوحة الإعدادات |

الأنواع (`AkariThemeConfig` و`AkariSidebarItem` و`AkariSearchResult` وغيرها) كلها مُصدَّرة من `types.ts`.

## متغيرات CSS

| النطاق | المتغيرات | انظر |
| --- | --- | --- |
| سطح المستند، جدول المحتويات، التذييل | `--akari-doc-*`، `--akari-toc-width`، `--akari-wavy-divider-color` | [التخطيط وشريط التطبيق](/ar-SA/theme/layout/api#css-variables) |
| شريط التبويب للصفحات المتوازية | `--akari-app-bar-tabs-gap`، `--akari-page-tabs-docked-max-width` | [التنقل الجانبي](/ar-SA/theme/sidebar/api#tab-bar-css-variables) |
| قسم الواجهة والنقوش | `--akari-doc-hero-*`، `--akari-pattern-*` | [قسم الواجهة](/ar-SA/theme/hero/api#css-variables) |
| الألوان | `--md-sys-color-*` | [الألوان](/ar-SA/styles/color/api) |
| الطباعة | `--md-sys-typescale-*` | [الطباعة](/ar-SA/styles/typography/api) |
| مكوّنات m3e | مثل `--m3e-card-shape` و`--m3e-button-*` | توثيق مكوّنات m3e |

## بنية الشيفرة المصدرية {#source-layout}

```text
docs/.vitepress/
├── config.mts             يربط السمة بـ VitePress
├── content/               اللغات والمسارات والتنقل من المجلدات (Node)
└── theme/
    ├── index.ts           مدخل السمة والتصديرات العامة
    ├── define.ts          defineAkariConfig و defineAkariLanguage
    ├── config.ts          القيم الافتراضية للتهيئة والتحقق منها
    ├── types.ts           تعريفات الأنواع
    ├── constants.ts       القيم الافتراضية ونقاط التوقف والمعرّفات
    ├── i18n/              حزم اللغات وتحديد اللغة
    │   └── languages/     حزم اللغات المدمجة، ملف لكل لغة
    ├── locales.ts         ربط المسارات عند تبديل اللغة
    ├── sidebar.ts         توحيد التنقل ومطابقته والتنقل بين الصفحات
    ├── settings.ts        التحقق من الإعدادات وتخزينها
    ├── scheme.ts          تحديد الوضع الفاتح والوضع الداكن وسكربت الإطار الأول
    ├── hero.ts            تحليل البيانات الأمامية لقسم الواجهة
    ├── loading.ts         حسابات تقدّم شريط التحميل
    ├── head.ts / fonts.ts akariHead والخطوط
    ├── markdown.ts        akariMarkdown
    ├── m3e.ts / icons.ts  تسجيل المكوّنات والأيقونات عند الحاجة
    ├── layouts/           AkariLayout.vue
    ├── components/
    │   ├── shell/         شريط التطبيق، قائمة «المزيد»، زرّا المظهر واللغة، مربعات الحوار، شريط التحميل
    │   ├── sidebar/       شريط التنقل، درج التنقل على سطح المكتب، التنقل على الشاشات الضيقة
    │   ├── content/       قسم الواجهة، شريط التبويب، جدول المحتويات، التنقل بين الصفحات، أزرار FAB، التذييل
    │   └── settings/      مربع حوار الإعدادات ولوحتها
    ├── composables/       دوال composable
    ├── search/            لوحة البحث وخدماته وحالته
    └── styles/            أنماط الرموز والهيكل والمحتوى والنقوش وشريط التبويب
```

المنطق الذي لا يعتمد على المتصفح (تحليل التهيئة، ومطابقة التنقل، ومسارات اللغات، والتحقق من الإعدادات، وتحليل قسم الواجهة، ومنحنيات الحركة وغيرها) مكتوب على شكل دوال نقية، مع اختبارات وحدات في المجلد `tests/` في جذر المستودع.
