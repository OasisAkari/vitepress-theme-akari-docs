---
icon: translate
order: 6
tab: Overview
parallel:
  - api
  - details
---

# Internationalization

Each language is a folder of `docs` named by its language code, such as `zh-CN` or `en-US`. The root language is served at the site root; the other languages' paths start with their folder's name. The language of the current page decides the interface strings, the navigation, the footer and the search scope.

## Add a language

1. Create a folder in `docs` named by the language code, and write a `config.ts` in it:

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

2. Add pages with the same structure as the root language: `docs/en-US/index.md` is this language's home page, and `docs/en-US/getting-started/installation/index.md` pairs with the Chinese `/getting-started/installation`.
3. If needed, set `rootLanguage` in the shared config to choose the language served at the root.

A language config is layered over the shared config, so it only needs the language's own name, titles and category names. The version, social links, category icons and so on come from the shared config. A language written right to left (Arabic, Hebrew and so on) also sets `dir: "rtl"` in its language config.

## Switching language

When the site has two or more languages, a language button appears at the bottom of the rail (at the bottom of the navigation drawer on narrow screens). Clicking it opens the "Choose a language" dialog.

- If the target language has a matching page, you stay on this page; if not, you go to its home page. So a language that translates only some pages never takes readers to a 404.
- The logo, the site name in the footer and "Back to home" on the 404 page all point to the current language's home page.

## Interface strings

The theme has built-in Simplified Chinese, English, Japanese, Korean, French and Arabic strings for buttons, the TOC, the pager, settings and search, chosen by the language code. Other languages use English, and you can fill in their strings with `messages` in the language config:

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

## Languages on this site

This site has six versions of every page: Chinese (served at the root), English, Japanese, Korean, French and Arabic. Switching language stays on the same page. The Arabic version is laid out right to left, so you can use it to see the theme's RTL layout.

See [API](/en-US/theme/i18n/api) for all interface strings and the language functions, and [Details](/en-US/theme/i18n/details) for how languages are detected and switched.
