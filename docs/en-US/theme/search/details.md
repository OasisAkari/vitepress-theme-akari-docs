---
tab: Details
---

# Search: Details

## Container transform

The search panel is a native modal `<dialog>`. It expands with an M3 container transform built on the Web Animations API. The language picker and the settings dialog use the same implementation (`useContainerTransform`).

- What animates is always the real panel, laid out at its final size from the first frame. At the start, a window shaped like the button (a `clip-path` capsule) shows only the start of the panel's own search bar, and a translation places that window over the button. The first frame therefore still looks like the "icon + placeholder" search box.
- As it expands, the translation returns to zero and the window grows to the whole panel (shadow included). The content is revealed step by step, the results area and the close button fade in together, and no blank surface appears midway. The end state of the animation is the panel's resting style, so removing the animation causes no jump.
- A pixel copy of the button sits on the window and moves with it. The button's and the panel's content do not cross-fade; one fades out before the other fades in (M3 fade through). On open, the panel surface first fades in under the copy, the copy then fades out, and then the panel's own search bar fades in. Text in two different sizes never shows at once.
- On close, it returns the way it came: the results area and the search bar fade out first, the button copy fades in midway to take over, and the panel surface then fades out beneath it. In the last stretch back into the button, including the bounce of expressive motion, what you see is the button itself, and it ends exactly like the real button. A button without a background (such as the gear button) therefore does not flash a patch of background at the end. If opening or closing is interrupted, the motion reverses from the current frame.
- The window's size and corner radius come from the button's current position and size. The panel's position is measured again when the animation starts; nothing depends on fixed coordinates.

| Motion | Expand | Collapse |
| --- | --- | --- |
| Standard | About 300ms, `cubic-bezier(0.2, 0, 0, 1)` | About 250ms, no bounce |
| Expressive | About 500ms, `cubic-bezier(0.38, 1.21, 0.22, 1)`, overshoots slightly and settles | About 400ms, same curve, with a slight bounce on collapse |

When the system's "reduce motion" setting is on, the panel opens and closes without animation. The native dialog provides top-layer display, an inert background and closing with `Esc`. On open, focus moves into the input; on close, it returns to where it was before opening, or to the search button when that element is no longer available.

## Building the index

- A Vite plugin scans every `.md` file in `docs` (except in `.vitepress`, `public` and directories starting with `.`) when the dev server starts and when a build begins, and writes `docs/public/search-index.json`. During development, it regenerates the index about 150ms after a Markdown file is added, changed or removed. When the build ends, it copies the file to the root of the output.
- Page URLs are computed by `content.route`, so they match the pages' real URLs.
- The page title is the frontmatter `title`, then the first level-1 heading, then the file name.
- Each level-2 and level-3 heading produces a section entry. Its anchor matches the heading id that VitePress generates.
- Fenced code blocks are left out of the index. HTML tags, link URLs and Markdown markup are stripped, leaving only the text. Each entry's body text is at most 4000 characters.

## Matching and ranking

The query is first normalized (case, full-width and half-width forms and so on) and split into words on whitespace. An entry matches only when every word appears in its title, page title or body text. Its score adds up as follows, where "title" is the entry's own title: the page title for a page entry, the heading for a section entry:

| Condition | Score |
| --- | --- |
| Title is exactly the whole query | +100 |
| Title starts with the whole query | +60 |
| Title contains the whole query | +40 |
| Page title contains the whole query | +20 |
| Body text contains the whole query | +10 |
| Each word: in the title / page title / body text | +24 / +10 / +6 |
| Entry level: page / level-2 heading / level-3 heading | +3 / +2 / +1 |

Results are sorted by score from high to low, and by title when scores are equal. Only one result per URL is kept, and at most `maxResults` are returned. On a multilingual site, the local index holds the pages of every language, and only entries under the current language's path are kept (the root language does not include pages under `/<language folder>/`).

## Loading and caching

- The local index loads on the first search and is then cached in the page. In development mode the browser cache is not used, so edited content is searchable right away.
- Input is debounced by `debounce`. When a new query is typed or the panel closes, the request in progress is aborted through `AbortSignal`.
- If the index file is missing or malformed, the panel shows an error and a retry button.

## Panel states

| State | Shows |
| --- | --- |
| Empty input | Search hint and shortcut help |
| Loading | M3 loading indicator |
| Results | Page title, section heading, excerpt and highlighted matches; the current item has a `secondary-container` background |
| No results | A suggestion to try another keyword |
| Failed | The cause of the error and a retry button |

Opening a result goes through the VitePress router, keeping SPA navigation. The input, the result list and the error message each have an ARIA name. The shortcut hint in the app bar uses the `label-small` type style and fully rounded keycaps; the arrow-key, `Enter` and `Esc` hints in the panel use `shape-extra-small` corners.

## Known limitations

- The local index uses simple substring matching, with no spelling correction or semantic search. When you need them, use an HTTP or registered backend.
- The local index refreshes only while the dev server runs or during a build. Markdown you edit while the dev server is not running becomes searchable after the next `npm run dev` or `npm run build`.
