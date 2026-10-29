---
tab: Details
---

# Internationalization: Details

## Which language a page belongs to

The path decides the language: a page whose path starts with `/<language folder>/` belongs to that language, and every other page belongs to the root language. In the source, the root language's pages sit in their own folder (`docs/zh-CN/`), and they are served without the folder name; see [Writing pages: Details](/en-US/getting-started/writing/details#path-rules).

The config a page ends up with is the `config.ts` of its language folder layered over the shared config and the VitePress locale config; see [Configuration: Details](/en-US/getting-started/configuration/details#how-the-two-levels-layer).

## Choosing interface strings

1. Take the current language's `lang`, lowercase it, and compare the full code with the built-in languages (`zh`, `en`, `ja`, `ko`, `fr`, `ar`).
2. If nothing matches, compare the primary language: `zh-CN` and `zh-TW` both use Chinese, `en-GB` uses English, and `fr-CA` uses French.
3. If there is still no match, use English.
4. Entries written in the language config's `messages` replace the built-in strings.

When `settings.title`, `settings.labels`, `toc.overline`, `footer.message` and `search.placeholder` are not set, they also come from this table, so one shared config has sensible defaults in every language. Strings written in the shared config are inherited by every language; strings that differ by language belong in the language config.

## Where switching language goes

1. Move the current path into the target language: `/getting-started/installation` → `/en-US/getting-started/installation`, and remove the prefix in the other direction.
2. If the target language's navigation has this path, open it. The navigation includes every page of a parallel page group.
3. Otherwise, open the target language's home page: `/` for the root language, `/<language folder>/` for the others.

Only the target language's navigation counts, so a page that is not in the navigation (for example, a page outside the structure) is never a switching target.

## Language dialog

- The language button is a round outlined icon button (`m3e-icon-button variant="outlined"`). It is not rendered when there is only one language.
- The dialog uses the same container transform as the search panel: the button expands into a centered panel, the icon before the panel title is the button itself, and closing returns the panel the way it came.
- Each language takes two lines in the list: its `label` on the first, and below it its name in the current interface language, from `Intl.DisplayNames` (in an English interface, `zh-CN` shows as "Chinese (China)"). The current language is highlighted with a check icon.
- Clicking a language switches to it and closes the dialog, with SPA navigation. Clicking with `⌘`, `Ctrl` or another modifier key held opens it in a new tab.
- On open, focus is on the current language, and `Tab` moves between languages. `Esc`, clicking the scrim or the close button closes the dialog, and focus returns to the language button.
- On narrow screens, the button is at the bottom of the navigation drawer, and the dialog covers the drawer.

## Search scope

There is one local index, holding the pages of every language. When you search, only entries of the same language as the current page are kept: results for the root language do not include pages under `/<language folder>/`. The search panel's text and error messages follow the language.
