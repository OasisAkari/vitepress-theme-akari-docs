---
icon: view_quilt
order: 1
tab: Overview
parallel:
  - api
  - details
---

# Layout and app bar

The layout matches [m3.material.io](https://m3.material.io): the app bar and the side navigation stay fixed in the window, while the content, the table of contents on the right and the pager cards sit on one rounded document surface. The footer is a second surface below it. The browser window scrolls the whole page, so find in page, back and forward, and anchor jumps all work the way the browser normally does.

## App bar

- **Left**: the site logo, name and version number. Once the article title scrolls under the app bar, the name changes to the title of the current page. On narrow screens, a menu button that opens the navigation drawer appears at the far left.
- **Right**: the search box, social links and the settings button. When space runs short, the search box shrinks to a round button, and the social links and settings move into the three-dot "More" menu.

<div class="demo-surface">
  <m3e-app-bar>
    <span slot="title">Vitepress Theme Akari Docs</span>
    <m3e-chip slot="trailing">v1.0.0</m3e-chip>
    <m3e-icon-button id="layout-demo-settings" slot="trailing" aria-label="Settings">
      <m3e-icon name="settings"></m3e-icon>
    </m3e-icon-button>
    <m3e-tooltip for="layout-demo-settings">Open settings</m3e-tooltip>
  </m3e-app-bar>
</div>

You set the content of the app bar in the `appBar` config:

```ts
appBar: {
  title: "Vitepress Theme Akari Docs",
  version: "v1.0.0",
  socialLinks: [
    { icon: "github", link: "https://github.com/OasisAkari/vitepress-theme-akari-docs", label: "GitHub" },
  ],
},
```

## Document surface and table of contents

- Paragraphs and lists are at most about 760px wide. Headings, tables and code blocks take the full width of the surface.
- The table of contents on the right lists level 2 and level 3 headings. It highlights the current section as you read, and scrolls smoothly to a heading when you click it.
- When the window is narrower than 960px, the table of contents is hidden, and a TOC button at the bottom right opens it instead.
- Write `toc: false` in a page's frontmatter, and that page has no table of contents.

A page that belongs to a group of parallel pages has a tab bar at the top of the surface; see [Side navigation](/theme/sidebar#parallel-pages). On a page with a hero, the title and the image show at the top of the surface; see [Hero](/theme/hero).

## Floating action buttons

- **Back to top**: appears at the bottom right once the page scrolls. Click it to scroll smoothly back to the top; on the way it expands to show "Back to top". Click it again, or scroll yourself, to stop it.
- **Table of contents**: appears above it when the window is narrower than 960px. Click it to expand it into a panel with the table of contents of the current page; click outside the panel to close it.

## Footer

After the pager cards come a wavy divider and the footer: the logo, site name and `footer.message` on the left, link columns on the right, and `footer.copyright` at the bottom. By default, the link columns take the first four categories of the navigation.

## Loading bar

While a page is still loading, a thin bar in the primary color runs along the top of the window: on opening the site it waits for the scripts, images and fonts, and on navigating within the site for the next page's script and its images and fonts. A quick load shows nothing. The config can turn it off; see [API](/theme/layout/api#loadingbar).

## Window sizes

| Window width | Navigation | Table of contents |
| --- | --- | --- |
| 1600px and wider | Rail and navigation drawer both always shown | On the right |
| 960–1599px | Rail; the navigation drawer slides out when the pointer rests on a category | On the right |
| Below 960px | The menu button in the app bar opens the navigation drawer | Button at the bottom right |
| Below 600px | Same as above; the document surface reaches the window edges | Button at the bottom right |

For every option, the CSS variables and the page state, see [API](/theme/layout/api). For how scrolling, the title swap, button collapsing and other behavior work, see [Details](/theme/layout/details).
