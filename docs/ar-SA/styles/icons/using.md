# استخدام الأيقونات

يجب تسجيل الأيقونات قبل استخدامها. تسجّل الأيقونة مرة واحدة؛ وبعدها يمكنك الإشارة إليها باسمها في Markdown والتهيئة والمكونات.

## التسجيل

استورد وحدات الأيقونات في `docs/.vitepress/theme/icons.ts`. استيراد الوحدة يسجّل الأيقونة:

```ts
import "@m3e/icons/outlined/home";
import "@m3e/icons/outlined/search";
import "@m3e/icons/outlined/rocket_launch";
```

- اسم الوحدة هو اسم الأيقونة في Material Symbols. يمكنك البحث عنه في [fonts.google.com/icons](https://fonts.google.com/icons).
- لا تستورد حزمة الأيقونات كاملة. استورد الأيقونات التي تستخدمها فقط؛ فالأيقونات غير المستوردة تبقى خارج نتيجة البناء.
- عنصر `<m3e-icon>` الذي يستخدم أيقونة غير مسجّلة يُعرض فارغًا. إذا لم تظهر أيقونة، فتحقق أولًا من تسجيلها.

## استخدام الأيقونات في الصفحة

اكتب `<m3e-icon>` مباشرة في Markdown:

```html
<m3e-icon name="rocket_launch"></m3e-icon>
```

داخل مكونات مثل الأزرار، استخدم `slot="icon"` لوضع الأيقونة:

<div class="demo-row">
  <m3e-button variant="filled">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    ابدأ الآن
  </m3e-button>
  <m3e-button variant="tonal">
    <m3e-icon slot="icon" name="tune"></m3e-icon>
    ضبط
  </m3e-button>
</div>

```html
<m3e-button variant="filled">
  <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
  ابدأ الآن
</m3e-button>
```

## استخدام الأيقونات في التنقل

الأيقونات في شريط التنقل (rail) وفي القائمة العليا لدرج التنقل على الأجهزة المحمولة هي أيقونات الفئات، وتُضبط في `sidebar.categories` في التهيئة المشتركة. أما أيقونة المقالة فتوضع في بياناتها الأمامية (frontmatter):

```ts
// docs/config.ts
sidebar: {
  categories: {
    "getting-started": { icon: "rocket_launch" },
    styles: { icon: "style" },
  },
},
```

```yaml
# docs/ar-SA/styles/color/index.md
---
icon: colorize
---
```

يجب تسجيل هذه الأيقونات أيضًا في `icons.ts`. والفئة التي ليست لها أيقونة تعرض `category`.

## إمكانية الوصول

- الأيقونة المجاورة لنص زخرفية ولا تحتاج إلى عمل إضافي: `<m3e-icon>` مخفي عن التقنيات المساعدة افتراضيًا.
- الزر الذي يحتوي على أيقونة فقط دون نص يجب أن يكون له اسم، مثل `<m3e-icon-button aria-label="Search">`، مع `m3e-tooltip` يعرض النص نفسه.
- يجب تبديل الأيقونات الاتجاهية (الأسهم، والتقدم والرجوع) أزواجًا في التخطيطات من اليمين إلى اليسار، مثلًا بتبادل `arrow_forward` و`arrow_back`. ولا تعتمد على أيقونة وحدها لنقل أي معنى غير الاتجاه.
- في وضع التباين العالي، تتبع الأيقونات لون النص. لا تمنح الأيقونات لونًا ثابتًا.
