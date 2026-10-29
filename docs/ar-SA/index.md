---
title: نظرة عامة
toc: false
category: getting-started
icon: home
---

# نظرة عامة

Vitepress Theme Akari Docs سمة توثيق مبنية على VitePress و`@m3e/web`.

<div class="demo-row">
  <m3e-button variant="filled" href="/ar-SA/getting-started/installation.html">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    دليل التثبيت
  </m3e-button>
  <m3e-chip>
    <m3e-icon slot="icon" name="check"></m3e-icon>
    السمة جاهزة
  </m3e-chip>
  <m3e-chip variant="elevated">
    <m3e-icon slot="icon" name="layers"></m3e-icon>
    Web Components
  </m3e-chip>
  <m3e-badge size="large">v1.0.0</m3e-badge>
</div>

## الميزات

<div class="demo-grid">
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Material 3 Expressive</m3e-heading>
    <div slot="content">تأتي الألوان والأشكال والحركة والطباعة كلها من رموز التصميم في m3e، وتطابق Material 3 الرسمي.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">التنظيم بالمجلدات</m3e-heading>
    <div slot="content">داخل مجلد اللغة، تمثّل المجلداتُ الفئاتِ، وتمثّل المجلداتُ التي بداخلها المقالاتِ. ويُبنى التنقل وقائمة اللغات من المجلدات ومن البيانات الأمامية (frontmatter).</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">الصفحات المتوازية وقسم الواجهة</m3e-heading>
    <div slot="content">يمكن تقسيم المقالة إلى عدة صفحات يُنتقل بينها عبر شريط التبويب. والصفحة التي تحتوي على قسم الواجهة (hero) تأخذ ألوانها من الصورة.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">الإعدادات والمظهر</m3e-heading>
    <div slot="content">أربعة خيارات للوضع الفاتح والوضع الداكن. يُطبَّق اللون والتنويع والتباين والحركة واتجاه النص وحجم النص فورًا، وتُحفظ في المتصفح الحالي.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">البحث وتعدد اللغات</m3e-heading>
    <div slot="content">يعمل الفهرس المحلي مباشرة دون إعداد، ويمكنك استبداله بخدمة HTTP أو بخدمة بحث مخصصة. وعند تبديل اللغة تبقى في الصفحة المقابلة.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">قابلة للاستبدال والتوسيع</m3e-heading>
    <div slot="content">استبدل مكونات مثل شريط التطبيق وجدول المحتويات والتذييل، أو أعد تعريف متغيرات CSS لضبط المظهر.</div>
  </m3e-card>
</div>

## البدء السريع

```bash
npm install
npm run dev
```

اقرأ بعد ذلك:

- [التثبيت](/ar-SA/getting-started/installation): إنشاء مستودع من القالب والمتطلبات والنشر.
- [التهيئة](/ar-SA/getting-started/configuration): التهيئة المشتركة وتهيئة اللغة.
- [كتابة الصفحات](/ar-SA/getting-started/writing): المقالات الجديدة والبيانات الأمامية وMarkdown.
- [التخطيط وشريط التطبيق](/ar-SA/theme/layout)، [التنقل الجانبي](/ar-SA/theme/sidebar): أجزاء واجهة السمة.

يتوفر هذا الموقع بالصينية والإنجليزية واليابانية والكورية والفرنسية والعربية. بدّل اللغة بزر اللغة في أسفل شريط التنقل (rail).
