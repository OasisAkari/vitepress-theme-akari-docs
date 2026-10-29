---
title: Icons
hero:
  image: /hero/icons-hero.svg
  alt: Icons on a set of rounded squares, and strokes from thin to thick
  tagline: The theme uses Material Symbols icons, registered on demand, with no icon font or CDN.
  fit: contain
order: 2
tab: Overview
parallel:
  - choosing
  - using
---

# Icons

All icons in the theme are [Material Symbols](https://fonts.google.com/icons). `@m3e/icons` provides them as SVG paths, and `<m3e-icon>` displays them. [Choosing icons](/en-US/styles/icons/choosing) covers styles, fill and size; [Using icons](/en-US/styles/icons/using) covers registration and accessibility requirements.

<div class="demo-row">
  <m3e-icon name="home"></m3e-icon>
  <m3e-icon name="search"></m3e-icon>
  <m3e-icon name="settings"></m3e-icon>
  <m3e-icon name="palette"></m3e-icon>
  <m3e-icon name="translate"></m3e-icon>
  <m3e-icon name="schedule"></m3e-icon>
  <m3e-icon name="dark_mode"></m3e-icon>
  <m3e-icon name="light_mode"></m3e-icon>
</div>

## Features

- **Registered on demand**: each icon is a separate module. Only icons imported in `icons.ts` end up in the build output, so the size of the first screen doesn't depend on the total number of icons.
- **No network needed**: icons are installed with `@m3e/icons` and render as inline SVG. There are no font files, and no flash of text before an icon font loads.
- **Follows the theme**: icons use `currentColor`, so they take their color from the M3 color role of the component they sit in, and follow changes to light and dark mode, contrast and dynamic color automatically.
- **Outlined and filled**: every icon has a filled form, and the `filled` attribute switches between the two. The selected item in the navigation uses it to mark the current location.

## Icons in the theme

| Location | Icon source | Notes |
| --- | --- | --- |
| rail and mobile drawer | The `icon` of each category in `sidebar.categories` in the shared config | Defaults to `category`; the current category shows the filled form |
| App bar | Built into the theme | Menu, search, more, settings and social links |
| Floating action buttons | Built into the theme | Back to top is `keyboard_arrow_up`; the table of contents is `format_list_bulleted` |
| Bottom of the rail | Built into the theme | The appearance button's icon changes with the mode; the language button is `translate` |
| Article body | `<m3e-icon>` in Markdown | Must be registered in `icons.ts` first |

## Pages in this group

These three pages are a set of parallel pages: they appear as a single "Icons" item in the sidebar, and the tab bar at the top of the page switches between them. They are `index.md`, `choosing.md` and `using.md` in the `styles/icons/` folder. To write pages like these, see [Writing pages](/en-US/getting-started/writing#parallel-pages).
