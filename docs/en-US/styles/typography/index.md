---
icon: text_fields
order: 3
tab: Overview
parallel:
  - api
---

# Typography

Latin text uses Roboto and Chinese text uses Noto Sans SC (Source Han Sans); Japanese, Korean and Arabic pages use Noto Sans JP, Noto Sans KR and Noto Sans Arabic. All are variable-weight fonts, and the config can change them or turn off Google Fonts. Body text has a base size of 16px and a line height of 1.65. Headings, body text, code and tables are all sized in `rem`, so when you change the text size in the settings, the whole reading area scales in proportion.

## Heading levels

Each page has exactly one first-level heading, which is the page title. Sections use second-level headings, subsections use third-level headings, and finer notes use fourth-level headings.

| Level | Use | Style |
| --- | --- | --- |
| First | Page title | display-large, 57px, weight 400 |
| Second | Sections; listed in the TOC | headline-medium, 28px, weight 500 |
| Third | Subsections; listed in the TOC | headline-small, 24px, weight 500 |
| Fourth | Detailed notes | 20px, weight 500 |

Keep heading levels consecutive. Don't skip a level, and don't use a bold paragraph in place of a heading.

### Third-level heading example

A third-level heading splits a section into parts that are easy to scan. Each part covers one thing.

#### Fourth-level heading example

Fourth-level headings suit added notes on edge cases, version differences or parameter details.

## Body text

- Keep paragraphs to three to five lines. Split long paragraphs into lists or subheadings.
- Use inline code for commands, field names and tag names, such as `npm run build`, `appBar.title` and `m3e-card`.
- Link text should say where the link goes, such as [installation and system requirements](/getting-started/installation). Don't write "click here".
- Use bold sparingly for emphasis. Don't bold whole paragraphs.

> Use quotes for conclusions taken from specifications or official sources. Quotes and callout blocks in body text carry the same faint pattern as code blocks.

<small>Supporting text uses a smaller size and the `on-surface-variant` color.</small>

## Headings in components

`m3e-heading` has four looks: display, headline, title and label. You can mix them with document headings. The headings below all carry `m3e-toc-ignore`, so they stay out of the table of contents:

<div class="demo-stack">
  <m3e-heading m3e-toc-ignore variant="display" size="large" level="2">Display Large</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="headline" size="medium" level="3">Headline Medium</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="title" size="large" level="4">Title Large</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="label" size="large" level="5">Label Large</m3e-heading>
</div>

`level` sets the heading level that assistive technology reads. `variant` and `size` only change the look.

## Text size

The text size setting has three steps, which set the font size of the root element:

| Option | Root size | Suits |
| --- | --- | --- |
| 100% | `16px` | The default reading size |
| 150% | `24px` | Low vision or reading from a distance |
| 200% | `32px` | Demos and accessibility checks |

For fonts, body element styles and typography tokens, see [API](/styles/typography/api).
