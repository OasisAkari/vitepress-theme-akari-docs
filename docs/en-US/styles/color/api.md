---
tab: API
---

# Color: API

`m3e-theme` generates the following tokens according to the Material 3 dynamic color spec (2025 version). Use them in CSS:

```css
.panel {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}
```

The tokens only have values inside `m3e-theme`. The theme copies them to the root element, so you can use them anywhere on the page.

## Accent colors

| Token | Use |
| --- | --- |
| `--md-sys-color-primary`, `--md-sys-color-on-primary` | The most important actions and the text on them |
| `--md-sys-color-primary-container`, `--md-sys-color-on-primary-container` | Containers that need to stand out, but less strongly |
| `--md-sys-color-primary-dim` | A darker primary color |
| `--md-sys-color-inverse-primary` | The primary color on inverse surfaces |
| `--md-sys-color-secondary`, `--md-sys-color-on-secondary` | Secondary emphasis |
| `--md-sys-color-secondary-container`, `--md-sys-color-on-secondary-container` | Secondary containers, such as the selected navigation item and floating action buttons |
| `--md-sys-color-secondary-dim` | A darker secondary color |
| `--md-sys-color-tertiary`, `--md-sys-color-on-tertiary` | Emphasis that contrasts with the primary color |
| `--md-sys-color-tertiary-container`, `--md-sys-color-on-tertiary-container` | Tertiary containers |
| `--md-sys-color-tertiary-dim` | A darker tertiary color |

Each accent color also has fixed colors that don't change between light and dark: `*-fixed`, `*-fixed-dim`, `on-*-fixed` and `on-*-fixed-variant` (where `*` is `primary`, `secondary` or `tertiary`).

## Surfaces

| Token | Use |
| --- | --- |
| `--md-sys-color-surface`, `--md-sys-color-on-surface` | The default surface and text; the document surface uses `surface` |
| `--md-sys-color-surface-dim`, `--md-sys-color-surface-bright` | The darkest and brightest surfaces |
| `--md-sys-color-surface-container-lowest` | The lowest container |
| `--md-sys-color-surface-container-low` | A low container, such as demo areas |
| `--md-sys-color-surface-container` | The default container, such as the hero's text card and table headers |
| `--md-sys-color-surface-container-high` | A high container |
| `--md-sys-color-surface-container-highest` | The highest container |
| `--md-sys-color-on-surface-variant` | Secondary text, such as captions and table header text |
| `--md-sys-color-surface-variant` | A secondary surface |
| `--md-sys-color-inverse-surface`, `--md-sys-color-inverse-on-surface` | Inverse surface and text, such as the snackbar |
| `--md-sys-color-background`, `--md-sys-color-on-background` | Page background and text |
| `--md-sys-color-surface-tint` | Surface tint |

## Outline, error and scrim

| Token | Use |
| --- | --- |
| `--md-sys-color-outline` | Borders that need emphasis |
| `--md-sys-color-outline-variant` | Dividers and ordinary borders, such as table borders |
| `--md-sys-color-error`, `--md-sys-color-on-error` | Errors |
| `--md-sys-color-error-container`, `--md-sys-color-on-error-container` | Error containers |
| `--md-sys-color-error-dim` | A darker error color |
| `--md-sys-color-shadow` | Shadows |
| `--md-sys-color-scrim` | The scrim behind dialogs |

## Local palettes

Wrap content on a page in `m3e-theme` to generate a separate palette for it. The demos on the [Color](/styles/color) overview do exactly this:

```html
<m3e-theme color="#006A6A" scheme="dark" variant="vibrant" contrast="high">
  <!-- Content -->
</m3e-theme>
```

| Attribute | Values |
| --- | --- |
| `color` | The seed color, as a six-digit hex value |
| `scheme` | `light`, `dark`, `auto` |
| `variant` | See [Variants](/styles/color#variants) |
| `contrast` | `standard`, `medium`, `high` |
| `motion` | `standard`, `expressive` |

The settings decide the seed color, variant and contrast for the whole site; see [Settings and appearance](/theme/settings/api#akarithemesettings).
