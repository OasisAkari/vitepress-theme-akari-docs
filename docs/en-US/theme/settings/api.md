---
tab: API
---

# Settings and appearance: API

## settings

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Whether there is a settings dialog; when `false`, the gear button is hidden too |
| `showSchemeToggle` | `boolean` | `true` | Whether to show the appearance button; independent of `enabled` |
| `title` | `string` | Depends on the language: "Settings" | Title of the settings dialog |
| `sections` | `SettingsSectionKey[]` | All six | Which options to show, and in what order |
| `labels` | `Partial<Record<SettingsSectionKey, string>>` | Depends on the language | Overrides the titles of individual options |
| `defaults` | `Partial<AkariThemeSettings>` | See the table below | The appearance every reader sees on their first visit |
| `persist` | `boolean` | `true` | Whether to write the reader's choices to `localStorage` |
| `storageKey` | `string` | `"akari-docs-settings"` | Key name in `localStorage` |

`appBar.showSettingsToggle: false` only hides the gear button. The settings feature itself stays (for example, a custom component can open it).

```ts
settings: {
  sections: ["color", "textSize"],
  labels: { textSize: "Body text size" },
  defaults: { color: "#0b57d0", scheme: "time" },
},
```

Invalid entries in `sections` are filtered out, and only the first of any duplicates is kept. If the result is empty, all six options are shown.

## AkariThemeSettings

| Field | Option key | Values | Default |
| --- | --- | --- | --- |
| `color` | `color` | Six-digit hex color | `"#6750A4"` |
| `variant` | `variant` | `tonal-spot`, `vibrant`, `fidelity`, `expressive`, `monochrome`, `neutral`, `rainbow`, `fruit-salad` | `"tonal-spot"` |
| `scheme` | Appearance button | `auto`, `light`, `dark`, `time` | `"auto"` |
| `contrast` | `contrast` | `standard`, `medium`, `high` | `"standard"` |
| `motion` | `motion` | `standard`, `expressive` | `"expressive"` |
| `direction` | `direction` | `auto`, `ltr`, `rtl` | `"auto"` |
| `textSize` | `textSize` | `16px`, `24px`, `32px` (shown as 100%, 150%, 200%) | `"16px"` |

## akariHead and light and dark mode

`head: akariHead()` in `.vitepress/config.mts` includes a script that applies light and dark mode before the first frame is painted. If you change `storageKey` or `defaults.scheme`, pass the same values to it:

```ts
head: akariHead({ storageKey: "my-docs", defaultScheme: "time" }),
```

Also keep `appearance: false`, so that the theme alone manages `html.dark`.

## Storage format

`localStorage[storageKey]` holds a JSON object with the same fields as `AkariThemeSettings`:

```json
{
  "color": "#6750A4",
  "variant": "tonal-spot",
  "scheme": "dark",
  "contrast": "standard",
  "motion": "expressive",
  "direction": "auto",
  "textSize": "16px"
}
```

Each missing or invalid field falls back to its default on its own.

## useAkariSettings

```ts
import { useAkariSettings } from "@theme";

const { settings, setSetting, reset, isDefault } = useAkariSettings();
setSetting("textSize", "24px");
```

| Return value | Description |
| --- | --- |
| `settings` | The current settings, as a reactive object |
| `setSetting(key, value)` | Changes one setting; when `persist` is true, also writes it to `localStorage` |
| `reset()` | Restores the defaults |
| `isDefault()` | Whether every current setting equals its default |
| `defaults` | The merged defaults |
| `sections`, `labels` | The resolved list of options and their titles |

## useAkariColorScheme

```ts
import { useAkariColorScheme } from "@theme";

const { mode, resolved, cycle } = useAkariColorScheme();
```

| Return value | Type | Description |
| --- | --- | --- |
| `mode` | `ComputedRef<"auto" \| "light" \| "dark" \| "time">` | The mode the reader chose |
| `resolved` | `Ref<"light" \| "dark" \| null>` | Whether the page actually shows light or dark; `null` until it is mounted in the browser |
| `cycle()` | `() => void` | Switches to the next mode: System → Light → Dark → Time of day → System |

Call both functions only from components inside the layout.

## Replacing the settings panel

You can replace the panel in the settings dialog with your own component (slot `Settings`). The title, the close button and the motion are still provided by the dialog. See [Extending the theme](/theme/extending/api#provideakaricomponents).
