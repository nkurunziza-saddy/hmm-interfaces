---
name: type
description: Sets and checks type for product UI on the web: the size scale, line-height, weight and tracking per role, font loading, OpenType features, wrapping, truncation, numbers in tables, punctuation, and which typeface to pick. Use it whenever you choose a font, set font-size, line-height, letter-spacing or font-weight, style a heading, label, table or counter, fix text that wraps, truncates, jumps or shifts, load a web font, or hear "the text looks off", "numbers jump", "headings look loose" or "which font should we use". Not for marketing or display typography.
---

# Type

Type decisions here are made once per role, not per element. A role is a size, a line-height, a weight and a tracking value, so using one is a single choice and the screen stays consistent.

Before any decision, apply `product-ui` §1 (the taste journal and precedence) and §5 (which skill owns what).

## Decide in this order

1. **Is there a typeface already?** If the project loads one, keep it. Pick a new one only for a new product or when asked, using [references/fonts.md](references/fonts.md#choosing-a-typeface). *Why: swapping a face changes every metric on every screen.*
2. **Name the role** from the table below. Never set a one-off size. If no role fits, the screen needs a different structure, not a new size. *Why: each extra size dilutes hierarchy.*
3. **Apply the whole role**: size, line-height, weight, tracking, together. Tokens and the tracking table are in [references/scale.md](references/scale.md).
4. **Add features by content**: changing or aligned numbers, IDs, uppercase labels. See Features below.
5. **Decide what happens at the edges**: wrap, balance, truncate, long words, missing data.
6. **Check loading**: every weight and style used has a real font file, and the fallback is metric-matched.
7. **Verify** in a browser at 390px and 1280px with long and empty strings.

## The roles

App UI scale ratio is `1.125` from a 13px base, in fixed `rem`, never fluid. Steps are 1–2px apart, which is too close to carry hierarchy alone, so roles skip steps and weight does the rest. Tracking is Inter's formula (`-0.0223 + 0.185 × e^(-0.1745 × px)` em).

| Role | Size | Line-height | Weight | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| Caption | 12px / `0.75rem` | 16px | 400; secondary 450 | `0` | Meta, timestamps, helper text |
| UI | 13px / `0.8125rem` | 18px | 400; labels 500; secondary 450 | `-0.003em` | Rows, controls, labels, short copy |
| Body | 15px / `0.9375rem` | 23px (1.53) | 400 | `-0.009em` | Long-form reading |
| Heading | 16px / `1rem` | 21px | 600 | `-0.011em` | Section and card titles |
| Title | 21px / `1.3125rem` | 28px | 600 | `-0.018em` | Page titles |

- **Comfortable density** moves every role one step up the 14px ladder: Caption 12/16, UI 14/20 (`-0.006em`), Body 16/24 (`-0.011em`), Heading 18/24 (`-0.014em`), Title 22/30 (`-0.018em`). Weights stay. Set them as tokens that `[data-density="comfortable"]` redefines, so components never pick a size by density. Tokens in [references/scale.md](references/scale.md#comfortable-density).
- Smallest size is 12px. *Why: small-text legibility below 12px depends on rendering we don't control; Apple's own floor is 11px.*
- Emphasis is one weight step up in the same role (400 → 500), never a size bump. *Why: size changes the layout; weight within a family barely does.*
- Other fonts: tracking values are for Inter. For another face, use its own table or `0`. Never stack hand tracking on `system-ui`, which already tracks itself.
- Light text on dark: +1px line-height and +0.01em tracking on Caption, UI and Body; same weight.

## Rules

**Line-height by role.** Interface text 1.3–1.4, reading 1.5–1.6, headings (16–21px) 1.25–1.36 (about 1.33 by default), snapped to whole px (the table is already snapped). Anything that wraps to 3+ lines gets at least 1.4, even in a tight card or a heading role (an inspector title at the 16px heading role wraps, so it takes 1.4). Write it as `calc(18 / 13)`, a unitless ratio that lands on whole px at the role size. *Why: whole-px line boxes stop rows blurring; a ratio still scales with zoom.*

**Weight.** Below 18px, 400 or heavier. Under 400 only at 28px and up. Text in the secondary ink (descriptions, IDs, dates, metadata) takes 450 when the face is variable, never primary text. *Why: grey text loses weight to the eye, most on dark surfaces; 450 holds it without reading as emphasis.* Weight never changes on hover, selection or active. *Why: it reflows the line and shoves siblings.*

**Features.** `font-variant-numeric: tabular-nums` on timers, counters, prices, percentages and every numeric column. Leave prose figures proportional. Uppercase labels at 14px or smaller: `+0.05em` and `font-feature-settings: "case"`. IDs, hashes, keys: mono or `slashed-zero` plus Inter's `ss02`. Prefer `font-variant-*` properties; `font-feature-settings` replaces the whole list on that element, so repeat `"calt"` when you override.

**Wrapping.** `text-wrap: balance` on headings and short blocks (it stops working past ~6 lines), `text-wrap: pretty` on paragraphs. `overflow-wrap: break-word` wherever IDs, URLs or emails can appear. `white-space: nowrap` on badges and button labels. `text-align: start`, never `justify`.

**Measure.** Reading text `max-width: 66ch`, giving 60–75 characters. UI rows are exempt.

**Truncation always has a way back.** Single line: `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`. Multi-line: `line-clamp`. Offer the full text in a tooltip that opens on focus too, or an expanded view. Truncate the middle of file names and paths. See [references/details.md](references/details.md#truncation).

**Punctuation and case.** Curly quotes, en dash in ranges, the `…` character, a true minus `−`, `×` for sizes, a non-breaking space between a number and its unit. Straight quotes stay in code. Sentence case everywhere; store natural case and use `text-transform` for display.

**Numbers in tables.** Right-align numeric columns and their headers, tabular figures, the same decimals in a column, the unit in the header. See [references/details.md](references/details.md#numbers-in-tables).

**Fonts.** woff2 only, self-hosted. One variable file when you use 3+ weights. `font-display: swap` with a metric-matched fallback. Preload only the one or two faces visible on first paint. Never rely on browser-synthesised bold or italic. See [references/fonts.md](references/fonts.md).

**Inputs** are 16px on mobile, or iOS zooms the page on focus.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| Sizes 11, 14, 17, 19, 22 on one screen | Roles: 12, 13, 15, 16, 21 | Few sizes; each role has a job |
| `letter-spacing: -0.01em` on everything | `-0.003em` at 13px, `-0.018em` at 21px | One value is too tight small and too loose large |
| `h1 { line-height: 1.1 }` on a title that wraps to 3 lines | `line-height: 1.4` or more | 1.1 is for 1–2 line display only |
| `.row:hover { font-weight: 600 }` | `.row:hover { color: var(--color-text-primary) }` | Weight shifts layout |
| `<td>1,204</td>` left-aligned, proportional | `text-align: end; font-variant-numeric: tabular-nums` | Digits must stack by place value |
| `<h2>` wrapping with one word on line two | `text-wrap: balance` | Even lines read as designed |
| `max-width` unset on an article | `max-width: 66ch` | 100+ characters per line loses the next line |
| `text-overflow: ellipsis` and nothing else | Ellipsis plus a focusable tooltip with the full text | A cut with no way back is data loss |
| `"It's 3-5 items..."` | `“It’s 3–5 items…”` | Straight stand-ins read as typewriter |
| `font-weight: 500` with only 400 and 700 loaded | Load the 500 face or use a variable file | 500 draws as 400, and a weight with no face near it is faked |
| `font-variation-settings: "wght" 600` | `font-weight: 600` | Raw tags break on fallback fonts |

## Before you finish

Search the changed files for these and apply the fix.

| Pattern | Fix |
| --- | --- |
| `font-size` in `px` for text, or a size not in the role table | `rem`; use the nearest role |
| `line-height` in `px`/`rem`, or `1.1` on text that can wrap | Unitless or `calc(n / m)` by role |
| `letter-spacing` in `px`, or one value on all sizes | `em` from the tracking table |
| `font-weight` 100–300 under 18px, or a weight on `:hover`/`[aria-selected]` | 400 or heavier; use colour |
| Changing or aligned numbers without `tabular-nums` | Add it |
| `text-overflow: ellipsis` with no tooltip or expand | Add the way back |
| `...`, `--`, straight quotes in rendered copy | `…`, `–`, curly quotes |
| `text-transform` on stored strings, or `.toUpperCase()` in data | Store natural case; transform in CSS |
| `@font-face` without `font-display`, or non-woff2 | Add `swap`; convert |
| Weights/styles used with no matching face | Load them, or change the weight |
| `text-align: justify`, `text-wrap: balance` on a paragraph | `start`; `pretty` |
| Input under 16px on mobile | 16px, or the scale-and-width recipe in details.md |

Verify: open the page at 390px and 1280px, set one string to 80 characters with no spaces and one to empty, tick a counter, and confirm nothing shifts, clips without a way back, or overflows.
