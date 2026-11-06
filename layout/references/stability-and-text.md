# Room for text, and layout that holds still

Load this for step 6: before you call any layout done, and whenever the user says it "jumps", "breaks", "gets cut off" or "doesn't fit".

## Contents
- Long and translated text
- Missing, empty and long data
- Loading without shift
- Things that must not change size

## Long and translated text

Translated strings grow, and short ones grow most. A one-word button is the riskiest thing on the screen.

| English length | Test at |
| --- | --- |
| 1–10 characters | 3× (+200%) |
| 11–30 characters | 2× (+100%) |
| Over 30 characters | 1.5× (+50%) |

Test with a pseudo-locale (wrap each string in brackets and pad it to the table's length) and one real long locale such as German. Also test one RTL locale for mirroring.

```css
/* Broken: German overflows or cuts */
.button { width: 96px; overflow: hidden; }

/* Fixed: the label sets the size, and rows wrap */
.button { padding-inline: var(--space-md); min-width: 80px; max-width: 100%; }
.button-row { display: flex; flex-wrap: wrap; gap: var(--space-md); }
```

- Size text boxes with `min-height` and `max-width`. Never a fixed `height` or `width` on a box holding text. *Why: a fixed height clips at 200% text zoom and in long locales.*
- A box that must cap its height pairs `max-height` with `overflow-y: auto`.
- A grid track or flex child refuses to shrink below its content. Use `minmax(0, 1fr)` and `min-width: 0` so long words and wide tables cannot push the layout out.
- Fixed boxes (avatars, icons, badges) get `flex-shrink: 0`. Text columns get `min-width: 0`.
- IDs, emails and URLs take `overflow-wrap: anywhere` in cells and `break-word` in prose. *Why: one unbroken token otherwise pushes a row's menu off screen.*
- Truncate to one line with an ellipsis only where a way back exists (tooltip, expand, detail). File names and paths truncate in the middle, where they differ. Numbers, amounts and dates never truncate.
- Free text in table cells hugs up to 32ch, then end-truncates. Descriptions in cards clamp at 2 lines. Badges cap at 24ch.
- Never pack a critical action where resize, zoom or scroll can clip it. Keep it in normal flow or stable chrome: a footer outside the scroll area of a dialog.
- A dialog sets `max-height: 100dvh` with a scrolling body and an action row outside the scroll area.
- Use logical properties everywhere, so the RTL mirror is free. Icons tied to reading direction (back, forward, indent) flip; checkmarks, logos and playback do not.

## Missing, empty and long data

Design the shortest and longest real value, not the sample.

| Case | Layout rule |
| --- | --- |
| Missing optional field | The line is dropped, not shown as a dash or a placeholder |
| Missing required value in a table | An en dash in the secondary tone |
| Figure over 6 digits | `Intl.NumberFormat(locale, { notation: "compact" })`, full value on hover and focus |
| Name that is 120 characters | Truncated with a way back; the row height holds |
| Zero rows | An empty state in the region's box: what belongs here and one action. No table chrome |
| 10,000 rows | Virtualise; the scroll height is correct from the first paint |
| Plural | `Intl.PluralRules`, never `count + " items"` |

Preview each component with the shortest and longest real value, an empty list, one item and a list longer than the viewport.

## Loading without shift

- A skeleton keeps the loaded layout: same row height, same column widths, same number of rows (the page size, at most 10). Only the values change. *Why: any difference is a shift when the data arrives.*
- Tables set `table-layout: fixed` with explicit column widths, or the columns resize when content lands.
- Images, video and embeds carry `width` and `height` or `aspect-ratio` from metadata.
- Async text in a fixed slot reserves its width: a number in `ch` units with `tabular-nums`, or a `min-width`. Cycling text shares one grid cell sized to the longest option.
- Scroll regions set `scrollbar-gutter: stable`, so a scrollbar appearing does not shift content.
- Never insert content above what the user is reading. Insert below, reserve the slot, or overlay.
- An empty state and the populated state share the container's `min-height`.
- Hold steps and panels at a minimum height so buttons stay put between steps.
- Do not show a spinner for a load under 150–300ms. Once shown, keep it at least 300ms.
- Web fonts: use a fallback with matching metrics (`size-adjust`, `ascent-override`) so text does not reflow on swap. `type` owns the details.

## Things that must not change size

| Broken | Fixed | Why |
| --- | --- | --- |
| `font-weight: 600` on `:hover` or `[aria-selected]` | Colour or background change | Weight changes the text width |
| `border: 2px solid` on `:focus` | `outline: 2px solid; outline-offset: 2px` | Outline takes no layout space |
| Selected row adds `border-left: 3px` | `box-shadow: inset 3px 0 0 var(--accent)` or a pseudo-element | Inset shadow takes no layout space |
| Badge count `9` becomes `10` and the toolbar shifts | `min-width: 2ch`, `tabular-nums` | The slot is sized for the widest value |
| Button label swaps for a spinner and shrinks | Keep the label, add the indicator in a reserved slot | The button keeps its width |
| Error text pushes the next field down | Reserve one line (`min-height: 20px`) under every field that validates | The error appears in a slot that already exists |

Verify stability by measurement: record the position of three anchors (a button, a row, a heading) before and after load, and in every state of the interaction. Any change is a bug unless the user caused it.
