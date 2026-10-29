---
icon: translate
order: 6
tab: 概览
parallel:
  - api
  - details
---

# 国际化

每种语言是 `docs` 下的一个文件夹，以语言代码命名，例如 `zh-CN`、`en-US`。根语言放在站点根路径，其他语言的地址以文件夹名开头。当前页面所在的语言决定界面文字、导航、页尾与搜索范围。

## 添加一种语言

1. 在 `docs` 下新建以语言代码命名的文件夹，在其中写 `config.ts`：

   ```ts
   // docs/en-US/config.ts
   import { defineAkariConfig } from "../.vitepress/theme/define.ts";

   export default defineAkariConfig({
     label: "English",
     title: "Vitepress Theme Akari Docs",
     appBar: { title: "Vitepress Theme Akari Docs" },
     sidebar: {
       categories: {
         "getting-started": { text: "Getting started" },
         theme: { text: "Theme" },
       },
     },
     footer: { message: "Built with VitePress and M3E Web Components" },
   });
   ```

2. 按与根语言相同的结构放入页面：`docs/en-US/index.md` 是这种语言的首页，`docs/en-US/getting-started/installation/index.md` 对应中文的 `/getting-started/installation`。
3. 需要时在共用配置中用 `rootLanguage` 指定放在根路径的语言。

语言配置叠加在共用配置之上，所以只需要写这种语言自己的名称、标题与分类名称；版本号、社交链接、分类图标等沿用共用配置。从右到左书写的语言（阿拉伯文、希伯来文等）在语言配置中再写 `dir: "rtl"`。

## 语言切换

站点有两种以上语言时，rail 底部（窄屏时在导航抽屉底部）出现语言按钮，点击后打开「选择语言」对话框。

- 目标语言中有对应页面时，停留在这一页；没有时去它的首页。所以只翻译了部分页面的语言，也不会把读者带到 404。
- logo、页尾的站点名称与 404 页的「返回首页」都指向当前语言的首页。

## 界面文字

按钮、目录、翻页、设置与搜索中的文字，主题内置了简体中文、英文、日文、韩文、法文与阿拉伯文六套，按语言代码选择。其他语言使用英文，可以在语言配置中用 `messages` 补全：

```ts
// docs/de-DE/config.ts
export default defineAkariConfig({
  label: "Deutsch",
  messages: {
    tocOverline: "Auf dieser Seite",
    previousPage: "Zurück",
    nextPage: "Weiter",
    searchPlaceholder: "Suchen",
  },
});
```

## 本站的语言

本站有中文（放在站点根路径）、英文、日文、韩文、法文与阿拉伯文六个版本，每一页都有六种语言，切换语言时停留在同一页。阿拉伯文版从右到左排版，可以用来查看主题的 RTL 布局。

全部界面文字与语言相关的函数见[接口](/theme/i18n/api)；语言的识别与切换规则见[技术细节](/theme/i18n/details)。
