---
tab: Details
---

# Configuration: Details

## How the two levels layer

`docs/config.ts` and the `config.ts` of each language folder are VitePress 2 directory configs.

- VitePress looks in `docs` for files named `config.ts` (or `.mts`, `.js`, `.mjs`), skipping folders that start with `.`. Each file applies only to the pages in its folder. This depends on where the source file is, not on the page's rewritten path.
- A page's config is layered from several levels, higher levels first: the `config.ts` of its folder and the folders above it (deeper wins), `docs/config.ts`, the VitePress locale config, and `.vitepress/config.mts`.
- Layering works field by field. For an object, each field takes its value from the highest level that has one; strings, arrays and other values are replaced whole. So `appBar: { title }` in a language config does not clear `appBar.socialLinks` from the shared config, while `socialLinks` itself, being an array, can only be replaced whole.
- Layering happens when the page renders, with the same result on the server and in the browser.
- Changing, adding or removing any `config.ts` restarts the dev server automatically.
- A category folder or an article folder can also hold a `config.ts`. It applies only to the pages in that folder, for example to give one category its own footer message.

## Languages from folders

`akariContent` runs when `.vitepress/config.mts` loads:

1. It reads `docs/config.ts` and finds the language folders: the top-level folders of `docs` that contain a `config.ts`, except `public`, `node_modules` and folders starting with `.`. The config files are bundled and run by the Vite config loader, the same way VitePress loads them.
2. It picks the root language: the folder that `rootLanguage` names. If it is not set or does not exist (which gives a notice), it takes the first folder in alphabetical order. The other languages follow in alphabetical order.
3. It generates one VitePress `locales` entry per language. The root language's key is `root`; the others use the folder name. Each entry carries the content of the language config (except `head`, which the directory config already adds; adding it again would duplicate it. The locale's `head` holds the language's font tags; see [Typography](/styles/typography/api#fonts)). `lang` defaults to the folder name, and the entry carries the generated navigation (`themeConfig.akari.sidebar.items`). The `label`, `dir` and `markdown` the language config leaves out come from the language pack for `lang`; see [Internationalization: Details](/theme/i18n/details#where-language-packs-are-used).
4. The site-level `lang`, `title` and `description` come from the root language.

A language config acts both as a directory config for its own pages and as a locale, and each role has a purpose. The locale lists the language in the language menu, renders Markdown text such as the code block copy button in that language, and gives pages outside the language folders, such as the 404 page, the root language's settings. Both hold the same values, so the layered result is not affected.

Without any language folder, `akariContent` generates no locales and no rewrites. The site runs on the config in `.vitepress/config.mts`, and the navigation comes from a hand-written `sidebar.items` or from the VitePress `themeConfig.sidebar`.

## Paths and navigation

`akariContent` also returns the VitePress `rewrites` function, and reads the Markdown frontmatter of each language to generate its navigation. For the exact rules, see [Writing pages · Details](/getting-started/writing/details). When the language config or the shared config sets `sidebar.items`, that language uses the hand-written navigation and none is generated.

## Updates during development

| Change | Result |
| --- | --- |
| Add, remove or edit a `config.ts` | VitePress restarts the dev server and `akariContent` runs again |
| Add or remove Markdown, or edit frontmatter | `content.plugin` regenerates the navigation after about 120ms. If the navigation changed, it updates the site data and reloads the page |
| Edit only the body | The navigation does not change. VitePress handles it with its own hot update, without reloading the page |

`content.plugin` watches only `.md` files in language folders. If a whole language folder is moved away while the server runs, the plugin skips that folder until the next restart.

## What a config file can hold

Config files run in Node.js, and the result is serialized and sent to the browser with the site data, so they only suit data. Objects that depend on imports, such as Vue components, cannot get through. To replace components, call `provideAkariComponents` in the theme entry; see [Extending the theme](/theme/extending/api#provideakaricomponents).

## Importing defineAkariConfig

`defineAkariConfig` lives in `theme/define.ts`. That file imports only types and spells out the extension (`./types.ts`), and the config files import it by its full file name (`define.ts`) too. When Vite loads a config file, it prints a warning for patterns that a future native loader cannot handle, such as imports without an extension. Config files written this way do not trigger it. `tsconfig.json` enables `allowImportingTsExtensions` for this.

The build still shows one warning of the same kind. It comes from the imports in `.vitepress/config.mts` itself and does not affect the build output.
