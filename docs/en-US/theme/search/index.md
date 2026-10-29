---
icon: search
order: 5
tab: Overview
parallel:
  - api
  - details
---

# Search

Search sits on the right of the app bar. On wide screens it is a search box with placeholder text and a shortcut hint; on narrow screens it shrinks to a round button. Click it or press `⌘K` (`Ctrl K` on Windows and Linux), and the search box expands into the search panel.

## Usage

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl K` | Open search on any page |
| `↑` / `↓` | Move between results |
| `Enter` | Open the current result |
| `Esc` | Close search |

Results are listed by page and section, each with an excerpt of the match. Opening a result for a section scrolls to its heading. On a multilingual site, only pages of the current language are returned.

## Local index

By default you need no backend. The theme uses the index that VitePress' local search builds, one per language, downloaded only on the first search in that language. Pages are split into sections at their headings, and [MiniSearch](https://lucaong.github.io/minisearch/) does the matching: Chinese and Japanese are split into words, a word can be typed only partly, and longer words may have a typo or two. While the dev server runs, the index follows your edits.

## Using another search

When you need semantic search or content from outside the site, switch to an HTTP endpoint or a JS function of your own:

```ts
// docs/config.ts
search: {
  backend: { type: "http", endpoint: "/api/docs/search" },
},
```

See [API](/en-US/theme/search/api) for how to write a backend and the result format, and [Details](/en-US/theme/search/details) for the panel's motion and how the index is built and ranked.
