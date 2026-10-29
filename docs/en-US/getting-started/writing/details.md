---
tab: Details
---

# Writing pages: Details

## Path rules

VitePress decides where each page is served with the `rewrites` function that `akariContent` generates:

| Source file | Served as | Path |
| --- | --- | --- |
| `zh-CN/index.md` | `index.md` | `/` |
| `zh-CN/theme/layout/index.md` | `theme/layout.md` | `/theme/layout` |
| `zh-CN/styles/icons/using.md` | `styles/icons/using.md` | `/styles/icons/using` |
| `en-US/index.md` | `en-US/index.md` | `/` |
| `en-US/theme/i18n/index.md` | `en-US/theme/i18n.md` | `/theme/i18n` |
| `404.md` (outside the language folders) | Unchanged | Unchanged |

- The root language's folder name is dropped from the path. Other languages keep their folder name as a prefix.
- A file at exactly "language/category/article/index.md" is rewritten to "category/article.md", so an article's path is its folder name, with no trailing slash. Other files only lose the root language's folder name.
- `cleanUrls` is on, so in the build output `/theme/layout` maps to `theme/layout.html`.

## Relative paths

- **Links**: VitePress outputs Markdown links as written, and the browser resolves them against the page's path. An article's path is `/theme/layout`, not `/theme/layout/`, so `./sidebar` in it points to `/theme/sidebar`, not to a file in the article folder. So write internal links as full paths.
- **Images and assets**: Vite imports images as modules and resolves them from the source file's location, so `./image.png` points to the file in the article folder. Small images are inlined as data URLs; the rest are copied to the output with a hash at build time.

## How the navigation is generated

Each language's navigation is generated from its language folder, by these rules:

- **Categories**: each folder in the language folder is a category. They follow the key order of `sidebar.categories` in the shared config, then keys that appear only in the language config, then folders not listed in `categories`, sorted by name. A category with no articles is not shown. A category's name is its `text`, or the folder name if there is none.
- **Articles**: each folder with an `index.md` in a category folder. The name is the frontmatter `title`, then the first h1 heading, then the folder name. Sorting compares `order` first; articles without `order` go last, and ties are sorted by folder name.
- **Home page**: the `index.md` of the language folder is not in the navigation by default. With `category`, it joins that category; without `order`, it goes first in the category.
- **Parallel pages**: each entry in `parallel` makes one tab, in order, and the article itself is the first tab. The item has no link of its own in the navigation; the first tab stands for it. Parallel pages do not appear in the navigation on their own.
- **Finding the h1 heading**: fenced code blocks are skipped, the first line starting with `# ` is taken, and its Markdown markup is removed.

The generated navigation has the same structure as a hand-written `sidebar.items` (`AkariSidebarItem`), so expanding, highlighting, paging and the footer's link columns behave exactly the same.

## Notices

While generating the navigation, the terminal shows a notice in the following cases. Each notice appears only once.

- A file listed in `parallel` does not exist, or is not a file name in the article folder (for example, a path was written). The entry is skipped.
- A page is not in the navigation structure: an `.md` placed directly in a category folder, a file nested deeper, or a file that no article lists as a parallel page. These still become pages; they just do not appear in the navigation.
- The folder that `rootLanguage` names is not a language folder.

## Counterpart pages

When you switch language, the theme moves the current path into the target language (`/theme/i18n` ↔ `/theme/i18n`). If the target language's navigation has that path, the theme opens it; otherwise it opens the target language's home page. So switching language stays on the same page when both pages have the same path in their language folders and the target page is in the target language's navigation.

## Search index

VitePress builds the local search index, so its links are the pages' actual paths (after the rewrites above). There is one index per language. Each page is split into sections at its headings; the part under the level-1 heading stands for the page itself, and parallel pages are pages of their own.
