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

What belongs to the language itself (its interface strings, fonts, text direction and strings in Markdown) is not written in the site's config. It lives in a [language pack](#language-packs), matched by language code. So adding a language only takes what is specific to this site.

## Add a language

1. Create a folder in `docs` named by the language code, and write a `config.ts` in it:

   ```ts
   // docs/zh-CN/config.ts
   import { defineAkariConfig } from "../.vitepress/theme/define.ts";

   export default defineAkariConfig({
     // The language calls itself "中文"; this name is more precise.
     label: "简体中文",
     title: "Vitepress Theme Akari Docs",
     appBar: { title: "Vitepress Theme Akari Docs" },
     sidebar: {
       categories: {
         "getting-started": { text: "开始" },
         theme: { text: "主题" },
       },
     },
     footer: { message: "基于 VitePress 与 M3E Web Components 构建" },
   });
   ```

2. Add pages with the same structure as the root language: `docs/zh-CN/index.md` is this language's home page, and `docs/zh-CN/getting-started/installation/index.md` pairs with the English `/getting-started/installation.html` and is served at `/zh-CN/getting-started/installation.html`.
3. If needed, set `rootLanguage` in the shared config to choose the language served at the root.

A language config is layered over the shared config, so it only needs the language's titles and category names. The version, social links, category icons and so on come from the shared config. The name in the language menu defaults to the language's own name for itself (English, 日本語), and the text direction, interface strings, code block copy button and container titles come from the language pack. The language config can override any of them.

## Switching language

When the site has two or more languages, a language button appears at the bottom of the rail (at the bottom of the navigation drawer on narrow screens). Clicking it opens the "Choose a language" dialog.

- If the target language has a matching page, you stay on this page; if not, you go to its home page. So a language that translates only some pages never takes readers to a 404.
- The logo, the site name in the footer and "Back to home" on the 404 page all point to the current language's home page.

## Language packs

A language pack describes one language: its interface strings (in buttons, the TOC, the pager, settings and search), its fonts, its text direction, and its strings in Markdown (the code block copy button and container titles). The theme comes with six: Simplified Chinese, English, Japanese, Korean, French and Arabic. A page finds its pack by `lang`: first by the full code, then by the primary language (`zh-TW` uses `zh`), and English when neither matches. Strings a pack leaves out are English too.

For a language the theme doesn't come with, write a language pack and put it in `languages` in the shared config:

```ts
// docs/.vitepress/languages/de.ts
import { defineAkariLanguage } from "../theme/define.ts";

export default defineAkariLanguage({
  code: "de",
  messages: {
    tocOverline: "Auf dieser Seite",
    previousPage: "Zurück",
    nextPage: "Weiter",
    searchPlaceholder: "Suchen",
  },
  markdown: {
    codeCopyButton: { tooltipText: "Code kopieren", copiedText: "Kopiert" },
    container: { tipLabel: "Tipp", warningLabel: "Warnung" },
  },
});
```

```ts
// docs/config.ts
import de from "./.vitepress/languages/de.ts";

export default defineAkariConfig({
  languages: [de],
});
```

From then on, `de-DE`, `de-AT` and any other German language folder use this pack. A pack with the code of a built-in one is laid over it: the strings it writes replace the matching entries, and `fonts` and `dir` are replaced whole. To change a few strings of one language on this site only, you can also write `messages` in its language config.

## Languages on this site

This site has six versions of every page: English (served at the root), Chinese, Japanese, Korean, French and Arabic. Switching language stays on the same page. The Arabic version is laid out right to left, so you can use it to see the theme's RTL layout.

See [API](/theme/i18n/api) for all interface strings and the language functions, and [Details](/theme/i18n/details) for how languages are detected and switched.
