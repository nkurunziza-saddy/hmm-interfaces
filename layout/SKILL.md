---
name: layout
description: Structure and space in product UI on the web. It sets the spacing scale, grouping, alignment, density (compact or comfortable), hit areas, app shells (sidebar, toolbar, content, inspector), max widths, container-query responsiveness, dropdown and popover sizing, room for long and translated text, layout stability (no shift on load) and sticky elements that must not cover focus. It ends with a measure-the-render step, so fixes come from pixels and not from reading CSS. Use it whenever you place, space, align or size anything, build a screen shell, fix a layout that "feels cramped", "feels off", "jumps" or "breaks on long text", review spacing, or are asked to "tidy this up".
---

# Layout

This skill decides where things go, how far apart they sit and how big they are. It makes the same decisions in the same order, and it checks the result against the rendered pixels.

Before any decision, apply `product-ui` §1 (the taste journal and precedence) and §5 (which skill owns what).

## Decide in this order

1. **Shell.** Name the regions of the screen: sidebar, toolbar, content, inspector. Each region is one scroll owner or none. Details and widths: [shell-and-responsive.md](references/shell-and-responsive.md). *Why: the shell fixes every width the inner layout has to live in.*
2. **Width and measure.** Set the content column by what it holds: form 440px, reading 720px with prose capped at the `type` measure (66ch), data 1200px. A column never stretches because the screen is wide. *Why: past 75 characters a line loses the reader, and a stretched form sends eyes across the screen.*
3. **Space.** Use the scale below and nothing else. Group first, with space; add a fill, then a line, only where space cannot carry it. [spacing-and-density.md](references/spacing-and-density.md).
4. **Align.** Pick the shared edges and put everything on them. A 1–4px miss is a bug. Correct optically where geometry looks wrong. [spacing-and-density.md](references/spacing-and-density.md#alignment).
5. **Size.** Choose the density for the region, then the hit areas. [spacing-and-density.md](references/spacing-and-density.md#density-modes).
6. **Worst-case data.** Resize the box for the longest, shortest, missing, translated and still-loading content before you call it done. [stability-and-text.md](references/stability-and-text.md).
7. **Adapt.** Make the structure respond to its container, not the device. [shell-and-responsive.md](references/shell-and-responsive.md#container-queries).
8. **Measure.** Render at 2×, measure gaps and edges, fix what the pixels show. [measure.md](references/measure.md).

## The scale

One scale, 4px base. Never write a spacing value that isn't a step. *Why: one-off values (10px, 14px, 18px) make rhythm impossible to see and impossible to keep.*

| Token | px | Typical use |
| --- | --- | --- |
| `--space-xs` | 4 | label to its description; icon to label in a chip |
| `--space-sm` | 8 | items within a group; control padding block |
| `--space-md` | 12 | between bordered controls; control padding inline |
| `--space-lg` | 16 | between fields; compact card padding |
| `--space-20` | 20 | between blocks inside a card |
| `--space-xl` | 24 | between groups; comfortable card padding |
| `--space-2xl` | 32 | between sections |
| `--space-3xl` | 48 | above a page's first title |
| `--space-4xl` | 64 | below a page's last block |

1–2px nudges for optical alignment are the only values off the scale. Name them (`--play-nudge: 2px`).

## Rules that need no reference

- **Group with space.** The break between groups is at least 2× the gap inside one: 8px inside means 16px or more between. Equal spacing everywhere makes grouping ambiguous, and ambiguity here is a functional bug.
- **Remove lines before adding them.** Space first, a fill second, a divider last, and only for dense data. *Why: every line costs attention for the same information space gives free.*
- **Space above equals space below** for anything between two things. *Why: a thing nearer one neighbour reads as owned by it.*
- **Controls must look like controls.** A button, link or toggle has a shape, an underline or a toolbar position. Static text never shares those. *Why: a control styled like text hides, and text styled like a control collects dead clicks.*
- **Actions sit above the data they act on**, never under it. A control that sets something sits next to it.
- **Primary content goes first and leading.** Visual order equals DOM order: never `order`, `row-reverse` or grid placement to reorder content. *Why: keyboard and screen-reader order follow the DOM.*
- **Logical properties** (`margin-inline-start`, `padding-block`, `inset-inline-end`, `text-align: start`) for anything that mirrors. *Why: RTL then works without a second stylesheet.*
- **Never put critical controls in the bottom edge** of a window or sidebar. *Why: people push windows partly off screen.*
- **Scroll shows what is hidden.** Content past an edge gets a visible cue: a peek of 16–32px or a fade.
- **Nothing shifts.** Hover, selection and focus never change an element's size. Loaded data takes the box the skeleton held.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| `gap: 12px` in the form and `gap: 12px` between its fieldsets | `gap: 8px` inside, `gap: 24px` between | Groups need a break of at least 2× |
| `padding: 10px 14px` | `padding: var(--space-sm) var(--space-md)` | Steps only |
| Title at x=24, description at x=26 | Both at x=24 | A 1–4px miss reads as a mistake |
| Icon button 16×16 with `padding: 0` | 16px glyph, `::before { inset: -12px }` for a 40px target | Mouse target is 40px |
| `.row + .row { margin-top: 8px }` with hover and click on rows | `.row { padding-block: 4px }`, no margin | A gap between rows is a dead zone and flickers hover |
| `.menu { width: 200px }` | `width: max-content; min-width: 160px; max-width: 320px` | The menu hugs its longest label |
| `@media (max-width: 768px)` on a card | `@container (width < 400px)` on the card's parent | A card in a narrow sidebar needs its own width, not the screen's |
| `<img src>` with no size, then a card that jumps | `width`, `height` or `aspect-ratio` set | The box exists before the bytes |
| Sticky header, anchor lands under it | `scroll-padding-block-start: 56px` on the scroller | Focus and anchors never sit under chrome |

## Before you finish

Search the diff for these, then verify.

| Pattern | Fix |
| --- | --- |
| `margin`, `padding` or `gap` with a value not in the scale | Nearest step |
| One `gap` value used inside and between groups | Inside ≤ half of between |
| Icon-only button under 24px, or under 40px with no `::before` | Expand with a pseudo-element |
| `gap` or `margin` between clickable rows or menu items | Padding inside the item |
| Fixed `width` on a menu, button or text box | `max-content`, `min-width`, `max-width`; `min-height` for text |
| `@media (max-width` inside a reusable component | `@container` on its parent |
| `height: 100vh` for a shell | `100dvh` |
| `1fr` track or flex child holding long text | `minmax(0, 1fr)` or `min-width: 0` |
| `margin-left`, `padding-right`, `left: 0`, `text-align: left` in mirrored UI | Logical form |
| Sticky header or footer with no `scroll-padding-block` | Set it to the chrome's height |
| Skeleton row height or column widths differ from loaded | Match them |
| `<img>` with no dimensions or `aspect-ratio` | Add one |

Verify with [measure.md](references/measure.md): render at 2× at 390px and the shell's widest width, run the script, crop each candidate and count pixels. Then Tab through the screen with sticky chrome in place, and load the longest strings. Report what you couldn't check as not verified.
