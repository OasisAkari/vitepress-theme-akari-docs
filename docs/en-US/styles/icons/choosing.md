# Choosing icons

Every Material Symbols icon comes in three styles and two forms. The theme uses the outlined style by default, and the filled form for states such as selected or on.

## Styles

| Style | Character | Import path |
| --- | --- | --- |
| Outlined | Even strokes and clear spacing; fits best with M3 components | `@m3e/icons/outlined/<name>` |
| Rounded | Rounded stroke ends and corners; softer | `@m3e/icons/rounded/<name>` |
| Sharp | Square corners; harder-edged | `@m3e/icons/sharp/<name>` |

Keep to one style within an interface. The theme's navigation, app bar and buttons all use Outlined. To switch the whole site to Rounded, replace every import in `icons.ts` and set `variant="rounded"` on `<m3e-icon>`.

## Outlined and filled

The `filled` attribute shows an icon's filled form:

<div class="demo-row">
  <m3e-icon name="home"></m3e-icon>
  <m3e-icon name="home" filled></m3e-icon>
  <m3e-icon name="settings"></m3e-icon>
  <m3e-icon name="settings" filled></m3e-icon>
  <m3e-icon name="palette"></m3e-icon>
  <m3e-icon name="palette" filled></m3e-icon>
</div>

```html
<m3e-icon name="home"></m3e-icon>
<m3e-icon name="home" filled></m3e-icon>
```

M3 uses fill to mean "current" or "on": in the rail, the current category's icon is filled and the others are outlined. Don't rely on fill alone to show state; the selected item also changes its background color and text.

## Size

Icons are 24px by default and scale with `font-size`. Common sizes:

| Size | Use |
| --- | --- |
| 20px | Compact lists, inline notes |
| 24px | Default: buttons, navigation, list items |
| 40px and up | Empty-state illustrations, onboarding pages |

```html
<m3e-icon name="search" style="font-size: 20px"></m3e-icon>
<m3e-icon name="search_off" style="font-size: 48px"></m3e-icon>
```

Don't change the icon size inside components such as buttons and navigation items. These components already set icon size and spacing according to the M3 spec.

## Choosing the right icon

- Prefer icons with established meanings: `search` for search, `settings` for settings, `translate` for language.
- Use one icon per meaning, and don't use the same icon for different actions in different places.
- When an abstract concept (such as "theme" or "component") has no common icon, pick one with a simple shape that stays clear at 24px, and always pair it with text.
