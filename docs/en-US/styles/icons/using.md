# Using icons

Icons must be registered before you use them. You register an icon once; after that you can refer to it by name in Markdown, config and components.

## Registering

Import icon modules in `docs/.vitepress/theme/icons.ts`. Importing a module registers the icon:

```ts
import "@m3e/icons/outlined/home";
import "@m3e/icons/outlined/search";
import "@m3e/icons/outlined/rocket_launch";
```

- The module name is the Material Symbols icon name. You can look it up at [fonts.google.com/icons](https://fonts.google.com/icons).
- Don't import the whole icon package. Import only the icons you use; icons that aren't imported stay out of the build output.
- An `<m3e-icon>` that uses an unregistered icon renders blank. If an icon doesn't show, first check that it is registered.

## Using icons on a page

Write `<m3e-icon>` directly in Markdown:

```html
<m3e-icon name="rocket_launch"></m3e-icon>
```

Inside components such as buttons, use `slot="icon"` to place the icon:

<div class="demo-row">
  <m3e-button variant="filled">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    Get started
  </m3e-button>
  <m3e-button variant="tonal">
    <m3e-icon slot="icon" name="tune"></m3e-icon>
    Adjust
  </m3e-button>
</div>

```html
<m3e-button variant="filled">
  <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
  Get started
</m3e-button>
```

## Using icons in navigation

The icons in the rail and in the top-level menu of the mobile drawer are category icons, set in `sidebar.categories` in the shared config. An article's icon goes in its frontmatter:

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
# docs/styles/color/index.md
---
icon: colorize
---
```

These icons also need to be registered in `icons.ts`. A category without an icon shows `category`.

## Accessibility

- An icon next to text is decorative and needs no extra work: `<m3e-icon>` is hidden from assistive technology by default.
- A button with only an icon and no text must have a name, for example `<m3e-icon-button aria-label="Search">`, together with an `m3e-tooltip` that shows the same text.
- Directional icons (arrows, forward and back) must be swapped in pairs in right-to-left layouts, for example by exchanging `arrow_forward` and `arrow_back`. Don't rely on an icon alone to convey any meaning other than direction.
- In high contrast mode, icons follow the text color. Don't give icons a fixed color.
