# Text details

## Contents
- Wrapping and measure
- Truncation
- Numbers in tables
- Counters and live numbers
- Punctuation
- Case
- Inputs on mobile

## Wrapping and measure

| Property | Use on | Not on | Why |
| --- | --- | --- | --- |
| `text-wrap: balance` | Headings, dialog titles, short centred blocks | Paragraphs; anything over ~6 lines (Chromium ignores it) | Evens line lengths |
| `text-wrap: pretty` | Paragraphs and descriptions | Single-line labels | Pulls a second word down beside a lone last word |
| `overflow-wrap: break-word` | Containers that can hold IDs, URLs, emails, pasted text | Normal prose needs no change | A long token otherwise forces horizontal scroll |
| `white-space: nowrap` | Badges, button labels, table headers | Descriptions | A wrapped badge looks broken |
| `hyphens: auto` with a correct `lang` | Narrow reading columns | UI labels | Hyphenation only helps long prose |

Measure: reading text is `max-width: 66ch`, which is 60–75 characters in Inter at 16px. Check it by counting a rendered line, because `ch` is the width of `0`, not the average letter. A table or row of UI text has no measure cap; the container sets it.

Set `lang` on `<html>`. Quotes, hyphenation and screen-reader pronunciation follow it.

## Truncation

One line:

```css
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
```

`min-width: 0` on the flex or grid child, or the ellipsis never triggers. Several lines: `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;`.

**A truncated value always has a way back.**

| Where | Way back | Why |
| --- | --- | --- |
| Table cell, list row, chip | Tooltip with the full text, opening on hover and on keyboard focus; or a detail panel | `title` alone is slow, absent on touch and unreachable by keyboard |
| Paragraph | "Show more" button that removes the clamp | The reader decides |
| Title in a header | Wrap to 2 lines before truncating | A title is the thing people came for |

Only attach the tooltip when the text is cut: `el.scrollWidth > el.clientWidth`. A tooltip that repeats visible text is noise.

**Truncate the middle of file names, paths and hashes.** The start and the end are what tell items apart (`quarterly-rep…2026.pdf`). CSS has no middle ellipsis, so split the string:

```html
<span class="mid"><span class="mid-start">quarterly-report-final-v3-</span><span class="mid-end">2026.pdf</span></span>
```
```css
.mid { display: flex; min-width: 0; }
.mid-start { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.mid-end { flex: none; white-space: nowrap; }
```

Split before the extension or the last 8–12 characters. Keep the full string in the accessible name.

## Numbers in tables

- Numeric columns and their header cells: `text-align: end`, so places line up. Text columns stay `start`. Never centre numbers.
- `font-variant-numeric: tabular-nums` on the column. For Inter add `slashed-zero` only where 0 and O can be confused.
- The same number of decimals within a column. `12.50` and `3.00`, not `12.5` and `3`.
- The unit goes in the header (`Revenue (USD)`), not repeated in every cell. A currency symbol or percent sign stays when units mix.
- Negative numbers use a true minus `−` (U+2212), not a hyphen, so they align with `+`. Colour is never the only sign of negative.
- Format with `Intl.NumberFormat`, never by hand, so grouping and decimals follow the locale. Wrap an RTL-adjacent number in `<bdi>`.
- Missing values show `—` in a muted ink, not `0`, `null` or blank. *Why: 0 is data.*
- Sticky first column and horizontal scroll on narrow screens beat wrapping numbers.

```css
.num { text-align: end; font-variant-numeric: tabular-nums; }
th.num { text-align: end; }
```

## Counters and live numbers

Anything that ticks or updates in place (timers, counters, progress percentages, prices) takes `tabular-nums`. With proportional digits the `1` is narrower than the `0`, so the whole line, and everything beside it, twitches every tick. Give the container a `min-width` in `ch` when the digit count can grow, so it does not push neighbours.

## Punctuation

| Instead of | Use | Notes |
| --- | --- | --- |
| `"quotes"` `'single'` | `“quotes”` `‘single’` | Apostrophe is `’` |
| `3-5` | `3–5` (en dash) | Ranges |
| `--` | `—` (em dash) | Rare in UI; prefer a comma or period |
| `...` | `…` | Allowed only in a search placeholder and on commands needing more input ("Rename…") |
| `-5` | `−5` (U+2212) | Negative numbers |
| `10x20` | `10 × 20` | Dimensions |
| `10 km` (normal space) | `10&nbsp;km` | Value and unit never split |
| `Cmd + K` | `⌘K` in a `<kbd>` | Shortcuts |

Store punctuation correctly in strings, or run a typographic pass on display text only. Never in code, URLs or user-entered data. Straight quotes stay in code.

## Case

Sentence case in buttons, headings, labels and menus. Store text in natural case ("Account settings") and apply `text-transform: uppercase` for display only. *Why: `.toUpperCase()` in data cannot be undone and breaks search, copy and screen readers that spell caps.* Uppercase is for overlines at 14px or smaller, with `+0.05em` tracking and the `case` feature.

## Inputs on mobile

iOS Safari zooms the page when an input's text is under 16px. Either size up on small screens (`font-size: 16px` below the `sm` breakpoint), or keep 16px and draw the smaller size with `transform: scale(0.875)` on the input inside a wrapper widened by `1/0.875`, with the wrapper painting the field's surface. Ask the user which; the first changes how the field looks on phones. Never set `maximum-scale=1` to hide the zoom.
