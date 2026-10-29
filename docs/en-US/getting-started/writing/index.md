---
title: Writing pages
icon: article
order: 3
tab: Overview
parallel:
  - api
  - details
---

# Writing pages

A page is a Markdown file in a language folder. Where you put it decides its path and its place in the navigation.

## Create an article

1. Create a folder in a category folder. The folder name becomes the article's path; use only lowercase letters, digits and hyphens.
2. Write an `index.md` in it that starts with an h1 heading.
3. Give it an icon and an order in the frontmatter.

```text
docs/en-US/components/
└─ chip/
   └─ index.md          /components/chip
```

```md
---
icon: label
order: 4
---

# Chip

Body text…
```

Once you save it, the article appears in the "Components" category right away, without restarting the dev server. Its name in the navigation is the page title, here "Chip".

To add a category, create a category folder, give it an icon in `sidebar.categories` of the shared config, and give it a name in the language config; see [Configuration](/getting-started/configuration).

## Parallel pages

A long article can be split into several pages, switched with the tab bar at the top of the page, while the sidebar still shows a single item. Create more `.md` files in the article folder and list them, in order, in the frontmatter of `index.md`:

```text
docs/en-US/styles/icons/
├─ index.md           /styles/icons
├─ choosing.md        /styles/icons/choosing
└─ using.md           /styles/icons/using
```

```md
---
title: Icons
tab: Overview
parallel:
  - choosing
  - using
---
```

Each page sets its title in the tab bar with its own `tab`; without one, the page title is used. The theme pages of this site are all split into three pages: "Overview", "API" and "Details".

## Hero

Write `hero` in the frontmatter, and the top of the page shows a title card and an image side by side; see [Hero](/theme/hero).

## Images and links

- An image used by only one page goes in the article folder and is referenced as `![Description](./image.png)`. Images shared by several pages go in `docs/public` and are referenced by an absolute path such as `/hero/image.svg`.
- Image width and height are written automatically at render time, for remote images too, so the page does not jump while images load; see [API](/getting-started/writing/api#images).
- Internal links use the page's path and start with `/`, without `.html`, which VitePress adds according to `cleanUrls`: `[Side navigation](/theme/sidebar)`. Do not write the file path (`/en-US/theme/sidebar/index.md`) or a relative path.
- This site's root language is English: links between English pages have no language prefix, and links between Chinese pages carry the `/zh-CN/` prefix.

## Markdown

All the VitePress Markdown extensions work, such as code groups, custom containers, line highlighting in code blocks and footnotes. The theme adds a few things on top:

- Tables have an M3 outlined border, links in the body have an icon in front, and elements with a background, such as code blocks and tables, carry a faint pattern.
- You can write m3e components directly in Markdown, such as `<m3e-button>` and `<m3e-card>`. The component demos on this site are written this way.
- A few helper classes lay out demo content: `demo-surface`, `demo-row`, `demo-grid`, `demo-stack`.

For every frontmatter field, the available components and the helper classes, see [API](/getting-started/writing/api).

## Versions in other languages

Put a folder of the same name at the same place in another language folder, for example `docs/zh-CN/components/chip/index.md`. The two pages are then counterparts, and switching language stays on this page. When there is no counterpart, switching language goes to that language's home page.
