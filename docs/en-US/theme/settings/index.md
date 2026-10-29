---
icon: settings
order: 4
tab: Overview
parallel:
  - api
  - details
---

# Settings and appearance

Readers can adjust how pages look. The round appearance button at the bottom of the rail (at the bottom of the navigation drawer on narrow screens) switches between light and dark mode, and the gear button in the app bar opens the settings. These options apply only to the reader's own browser. They are saved in `localStorage` and do not affect other visitors.

## Light and dark mode

Each press of the button switches to the next mode, and a snackbar appears at the bottom of the screen, for example "Theme switched to: Dark".

| Mode | Icon | Effect |
| --- | --- | --- |
| System | `brightness_auto` | Follows the system's light or dark setting (default) |
| Light | `light_mode` | Always light |
| Dark | `dark_mode` | Always dark |
| Time of day | `schedule` | Dark from 19:00 to 07:00 the next day, light the rest of the time |

In System and Time of day modes, the snackbar also says whether the page is currently light or dark, for example "Theme switched to: System (Dark)".

## Settings

The settings dialog that the gear button opens has six groups of options. Changes take effect immediately:

| Option | Content |
| --- | --- |
| Color | The theme's seed color |
| Variant | How the palette is generated from the seed color, for example Tonal Spot or Vibrant |
| Contrast | Default, Medium, High |
| Motion | Standard, Expressive |
| Text direction | Follow language, Left to right, Right to left |
| Text size | 100%, 150%, 200% |

<div class="demo-surface">
  <div class="demo-stack">
    <div class="demo-row">
      <strong>Variant</strong>
      <m3e-filter-chip-set aria-label="Variant example">
        <m3e-filter-chip selected value="tonal-spot">Tonal Spot</m3e-filter-chip>
        <m3e-filter-chip value="vibrant">Vibrant</m3e-filter-chip>
        <m3e-filter-chip value="expressive">Expressive</m3e-filter-chip>
        <m3e-filter-chip value="monochrome">Monochrome</m3e-filter-chip>
      </m3e-filter-chip-set>
    </div>
    <div class="demo-row">
      <strong>Persistence</strong>
      <m3e-switch id="settings-demo-persist" checked aria-label="Persistence example"></m3e-switch>
      <span>Save in this browser</span>
    </div>
  </div>
</div>

These controls are only a visual demo. Changing them does not change the theme.

Pages with a hero use a color taken from the image instead. When you leave the page, the color from the settings comes back.

## The site's default appearance

A reader's choices are saved only in their own browser. To change what everyone sees on their first visit, set defaults in the shared config:

```ts
// docs/config.ts
settings: {
  defaults: {
    color: "#6750A4",
    scheme: "auto",
    motion: "expressive",
  },
},
```

You can also show only some of the options, or hide the appearance button. See [API](/theme/settings/api). For how light and dark mode takes effect before the first frame, and where each option applies, see [Details](/theme/settings/details).
