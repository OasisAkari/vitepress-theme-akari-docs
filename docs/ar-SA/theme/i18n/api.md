---
tab: API
---

# التدويل: API

## تهيئة اللغة

| الحقل | النوع | القيمة الافتراضية | الوصف |
| --- | --- | --- | --- |
| `rootLanguage` | `string` | أول مجلد لغة بالترتيب الأبجدي | صالح في التهيئة المشتركة فقط: اللغة التي تُقدَّم في جذر الموقع |
| `lang` | `string` | اسم مجلد اللغة | رمز اللغة، ويُستخدم في `<html lang>` ولاختيار نصوص الواجهة المدمجة |
| `label` | `string` | `lang` | الاسم في قائمة اللغات |
| `dir` | `"ltr" \| "rtl" \| "auto"` | `"ltr"` | اتجاه النص. اضبط `rtl` للغة تُكتب من اليمين إلى اليسار. يُستخدم عندما يكون إعداد «اتجاه النص» على «حسب اللغة» |
| `markdown` | `MarkdownLocaleOptions` | لا شيء | نصوص هذه اللغة في Markdown، مثل `codeCopyButton: { tooltipText, copiedText }` |
| `messages` | `Partial<AkariMessages>` | لا شيء | يستبدل نصوص الواجهة أو يُكملها |

يمكن أيضًا وضع الحقول الأخرى (`title` و`description` و`appBar` و`footer` و`search` وغيرها) في تهيئة اللغة؛ راجع [التهيئة](/ar-SA/getting-started/configuration/api).

## messages

تتضمن السمة ست مجموعات مدمجة من نصوص الواجهة: الصينية المبسّطة (`zh`)، والإنجليزية (`en`)، واليابانية (`ja`)، والكورية (`ko`)، والفرنسية (`fr`)، والعربية (`ar`). المدخلات التي تكتبها في `messages` تحلّ محل النصوص المدمجة؛ والمدخلات التي لا تكتبها تحتفظ بالقيم المدمجة. المدخلات التي تحتوي على `{name}` تُملأ بالقيمة المطابقة وقت التشغيل.

### التنقل وشريط التطبيق

| المفتاح | القيمة العربية الافتراضية |
| --- | --- |
| `navigationToggle` | تبديل التنقل |
| `navigationLabel` | التوثيق |
| `railLabel` | أقسام التوثيق |
| `categoryNavigation` | التنقل في {category} |
| `categoryPages` | صفحات {category} |
| `homeLink` | الصفحة الرئيسية لـ {title} |
| `moreActions` | المزيد |
| `backToTop` | العودة إلى الأعلى |
| `tocButton` | المحتويات |
| `languageLabel` | تغيير اللغة |
| `languageDialogTitle` | اختر لغة |
| `languageDialogClose` | إغلاق |

### جدول المحتويات والتنقل بين الصفحات والتذييل

| المفتاح | القيمة العربية الافتراضية |
| --- | --- |
| `tocOverline` | في هذه الصفحة |
| `pagerLabel` | التنقل بين الصفحات |
| `previousPage` | السابق |
| `nextPage` | التالي |
| `footerMessage` | صُنع باستخدام VitePress و M3E |
| `footerLinks` | روابط التذييل |
| `notFoundTitle` | الصفحة غير موجودة |
| `notFoundText` | ربما نُقلت الصفحة التي تبحث عنها أو حُذفت. |
| `notFoundLink` | العودة إلى الصفحة الرئيسية |

### الإعدادات

| المفتاح | القيمة العربية الافتراضية |
| --- | --- |
| `settingsTitle` | الإعدادات |
| `settingsClose` | إغلاق الإعدادات |
| `settingsColor` | اللون |
| `settingsVariant` | التنويع |
| `settingsContrast` | التباين |
| `settingsMotion` | الحركة |
| `settingsDirection` | اتجاه النص |
| `settingsTextSize` | حجم النص |
| `contrastStandard` | افتراضي |
| `contrastMedium` | متوسط |
| `contrastHigh` | عالٍ |
| `motionStandard` | قياسية |
| `motionExpressive` | تعبيرية |
| `directionAuto` | حسب اللغة |
| `directionLtr` | من اليسار إلى اليمين |
| `directionRtl` | من اليمين إلى اليسار |

### المظهر

| المفتاح | القيمة العربية الافتراضية |
| --- | --- |
| `schemeToggle` | المظهر: {mode} |
| `schemeLight` | فاتح |
| `schemeAuto` | النظام |
| `schemeDark` | داكن |
| `schemeTime` | حسب الوقت |
| `schemeChanged` | تم تبديل المظهر إلى: {mode} |
| `schemeChangedFollowing` | تم تبديل المظهر إلى: {mode} ({scheme}) |

### البحث

| المفتاح | القيمة العربية الافتراضية |
| --- | --- |
| `searchPlaceholder` | ابحث في التوثيق |
| `searchLabel` | البحث في التوثيق |
| `searchShortcutLabel` | {label}، الاختصار {shortcut} |
| `searchClose` | إغلاق البحث |
| `searchIntroTitle` | ابحث في التوثيق |
| `searchIntroText` | اكتب عنوان صفحة أو اسم مكوّن أو كلمات من النص. |
| `searchIntroShortcut` | اضغط {keys} لفتحه في أي وقت |
| `searchLoading` | جارٍ البحث… |
| `searchErrorTitle` | البحث غير متاح |
| `searchRetry` | إعادة المحاولة |
| `searchEmptyTitle` | لا توجد نتائج |
| `searchEmptyText` | جرّب كلمة أقصر، أو تحقّق من إعدادات خدمة البحث. |
| `searchResultCountOne` | {count} نتيجة |
| `searchResultCount` | {count} نتائج |
| `searchResultsLabel` | نتائج البحث |
| `searchResultPage` | صفحة |
| `searchHintSelect` | اختيار |
| `searchHintOpen` | فتح |
| `searchHintClose` | إغلاق |
| `searchFailed` | فشل البحث. حاول مرة أخرى لاحقًا. |
| `searchIndexUnavailable` | تعذّر تحميل فهرس البحث المحلي (HTTP {status}). |
| `searchIndexInvalid` | فهرس البحث المحلي غير صالح. |
| `searchRequestFailed` | فشل طلب البحث (HTTP {status}). |
| `searchBackendMissing` | لا توجد خدمة بحث مسجّلة باسم \"{id}\". |

يُستخدم `searchResultCountOne` للأعداد التي تكون فئة الجمع الخاصة بها `one` («1 نتيجة» بالعربية)؛ وتستخدم الأعداد الأخرى `searchResultCount`. يحدّد `Intl.PluralRules` الفئة بحسب اللغة. ويُعرض `{keys}` على شكل مفاتيح لوحة مفاتيح عند ظهوره.

## useAkariI18n

```ts
import { useAkariI18n } from "@theme";

const { lang, messages, t } = useAkariI18n();
t("homeLink", { title: "Vitepress Theme Akari Docs" }); // "الصفحة الرئيسية لـ Vitepress Theme Akari Docs"
```

| ما تُرجعه | الوصف |
| --- | --- |
| `lang` | رمز اللغة الحالية |
| `messages` | كل نصوص الواجهة للغة الحالية، مدموجة مع تهيئة `messages` |
| `t(key, params?)` | يجلب نصًا واحدًا ويملأ العناصر النائبة فيه |

## useAkariLocales

```ts
import { useAkariLocales } from "@theme";

const { locales, homeHref } = useAkariLocales();
```

| ما تُرجعه | الوصف |
| --- | --- |
| `locales` | قائمة اللغات، وكل عنصر فيها `{ key, label, lang, href, current }`؛ و`href` هو الرابط الذي يُفتح عند التبديل إلى تلك اللغة. تكون مصفوفة فارغة عندما يحتوي الموقع على لغة واحدة فقط |
| `homeHref` | رابط الصفحة الرئيسية للغة الحالية، مع إضافة `base` |

لا تستدعِ الدالتين إلا في المكوّنات الموجودة داخل التخطيط.

## اللغات في البحث

تتلقى خدمة البحث المسجّلة في وسيطها الثاني `lang` (مثل `zh-CN`) و`locale` (مفتاح لغة VitePress، و`root` للغة الجذرية)؛ راجع [البحث](/ar-SA/theme/search/api#registered-backends).
