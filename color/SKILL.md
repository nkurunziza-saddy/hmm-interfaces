---
name: color
description: Builds and checks colour systems for product UI on the web: the OKLCH neutral ramp and the job of each step, one accent, semantic tokens over primitives, status colours, contrast measured against the real surface, dark mode as its own palette, themes (light, dark, midnight) with a contrast setting and a user-picked accent, color-scheme and a single theme mechanism, gradients, and generating a whole palette from one brand colour. Use it whenever you pick or change a colour, add a token, theme or dark mode, style a badge, banner, alert or status, fix "low contrast", "washed out", "muddy" or "grey on colour", or someone hands you a brand hex. Not for marketing or illustration palettes.
---

# Color

Product UI is 90–95% neutral. The neutral carries structure, and hue appears only to mean something: an action (the accent) or a status. Colour here is a small system of named jobs, not a palette to pick from by eye.

Before any decision, apply `product-ui` §1 (the taste journal and precedence) and §5 (which skill owns what).

## Decide in this order

1. **Keep the project's system.** If tokens and a notation exist, add to them. Switch notation only when asked. *Why: a hex system with one stray `oklch()` is worse than either.*
2. **Neutral ramp**: 9 named steps below. Delete any step no component uses.
3. **One accent**, from one brand colour. [references/palette.md](references/palette.md) walks it with exact L and C.
4. **Status**: only the ones the product renders. Danger, warning, success; info is neutral plus an icon.
5. **Tokens**: primitives name a value, semantics name a job, components use only semantics.
6. **Contrast**: measure every text and edge pair against the surface directly behind it, in both themes. See [references/contrast.md](references/contrast.md).
7. **Dark**: its own palette, not an inversion. See [references/dark-and-gradients.md](references/dark-and-gradients.md).
8. **Themes, contrast and accent as settings**, for an app people keep open for hours: System, Light, Dark and Midnight; Soft, Standard or High contrast; and an accent at one shared chroma. See [references/themes.md](references/themes.md).
9. **Never colour alone**: every status has an icon, a label or a shape.

## The neutral ramp

OKLCH, hue taken from the brand accent (a product with one fixed accent; when people pick the accent, each theme keeps its own grey hue, see themes.md), chroma 0.004–0.015 (enough to measure, not enough to name). Each step has one job. Components are written against jobs, so a re-skin changes the ramp and nothing else.

| Step | Job | Light L | Dark L | Gate |
| --- | --- | --- | --- | --- |
| n1 | Page background | 0.985 | 0.165 | |
| n2 | Raised surface (cards, menus, dialogs, tables) | 1.000 | 0.205 | |
| n3 | Component rest: field well, chip, stripe | 0.955 | 0.245 | |
| n4 | Hover | 0.935 | 0.275 | |
| n5 | Pressed, selected | 0.910 | 0.305 | |
| n6 | Hairline: dividers, card ring (decorative, exempt) | 0.880 | 0.335 | at least 1.3:1 on n2 |
| n7 | Toggle track, checkbox and radio edge, meaningful icon; field edge at High contrast | 0.640 | 0.540 | at least 3:1 on n1 and n2 |
| n8 | Secondary text, placeholder | 0.500 | 0.760 | at least 4.5:1 on n1–n5 |
| n9 | Primary text; neutral solid fill | 0.220 | 0.950 | at least 7:1 on n1–n5 |

Chroma by step: n1–n6 `0.004`–`0.011`, n7–n9 `0.015`, n2 light `0`. Hue and chroma are held across the ramp, because a warm border on a cool background is visible even when neither is nameable. The L values pass the gates at hue 265; recheck at any other hue with `scripts/contrast.mjs`.

Never reach for n6 as a text colour or n8 as a background: a token is used only in its job. *Why: restyling borders then recolours text.*

## Rules

- **One accent** for the primary action, selection, focus and links. An accent heading or a row of accent icons is a bug. One filled accent button per view. *Why: two filled peers means no hierarchy.*
- **Hue means status or identity, never importance.** One colour carries one meaning; treat hues within 15° as the same colour.
- **Components use semantic tokens only.** `--color-accent-solid`, never `--blue-500`. Primitives are never referenced outside the token file. *Why: the token layer is the theming seam.*
- **Name by purpose.** Neutral roles `--color-{bg|text|border}-{variant}`, accent and status roles `--color-{accent|danger|warning|success}-{subtle|border|solid|text}`. Use `accent`, not `primary`, for the brand, so `text-primary` stays unambiguous.
- **Status roles are fixed**: danger red (hue 25), warning amber (75), success green (150). Info is neutral with an icon. Keep the accent at least 15° from each; see palette.md for the collision rule.
- **Contrast.** Text under 24px (or 18.66px bold) 4.5:1, larger 3:1, toggle tracks, checkbox and radio edges and meaningful icons 3:1. A text field is shown by its label, its fill and its edge together: by default a rest-fill well (n3) with a hairline (n6), and at High contrast the 3:1 edge (n7). *Why: a 3:1 line round every field is the loudest thing on a form; the label and the fill already say where to type.* Measure against the surface behind the element, never the page. Alpha colours are composited first.
- **Grey text on a coloured surface is a bug.** Tint it from that surface's hue instead. *Why: grey on colour reads dirty.*
- **A status icon or dot uses the status text step**, not the solid. *Why: the solid is tuned for a fill with text on it and misses 3:1 on the page for warning.*
- **`color-scheme`** on `:root`, always. One theme mechanism: `light-dark()` tokens driven by `color-scheme`. Never a media query and a class both setting tokens.
- **Gradients** are not decoration in product UI. Allowed: scroll fades, scrims under text on images, data scales, skeletons. Interpolate `in oklab`; use `in oklch` when two hues go grey in the middle.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| `color: #999` on white (2.85:1) | `color: var(--color-text-secondary)` at L 0.50 (5.7:1) | Secondary text is a step with a gate |
| A white field with a `#e5e5e5` border on a white card | A rest-fill well (`n3`) with a hairline (`n6`), its label above; the `n7` edge at High contrast | The fill and the label show where it is; the edge stays quiet |
| `background: var(--blue-500)` in a component | `background: var(--color-accent-solid)` | Primitives have no theming seam |
| Grey label on a blue banner | `oklch(0.42 0.07 var(--banner-hue))` | Tinted text keeps the surface's hue |
| Dark theme = light ramp reversed | Own palette: surfaces rise lighter, accent chroma × 0.85 | Shadows barely show on dark; neon accents glare |
| Red text "Failed" only | Red text, an icon, and the word | Colour alone fails colour-blind users |
| `@media (prefers-color-scheme)` tokens plus `.dark` tokens | `color-scheme` + `light-dark()` | One mechanism, no half-themed UI |
| `linear-gradient(blue, orange)` (grey middle) | `linear-gradient(in oklch, blue, orange)` | Rectangular spaces pass near grey |
| Brand `#3b82f6` as button fill with white text (3.68:1) | Fill at L 0.55 (≥4.5:1); brand stays in the logo token | Never quietly recolour the brand; give it a token |

## Before you finish

| Pattern | Fix |
| --- | --- |
| `var(--blue-`, `var(--gray-`, or a hex/oklch literal in a component | Semantic token, or add the missing role |
| A token used outside its job (border as text colour) | Add the right token |
| Text on a coloured or alpha surface, never measured | `node scripts/contrast.mjs <fg> <bg> --over <surface>` |
| A toggle, checkbox or radio edge under 3:1; a field with neither a fill nor a 3:1 edge | n7; give the field the rest fill |
| Accent on a heading, icon row or more than one filled button | Neutral n9; one filled button |
| Status shown by hue only | Add icon and label |
| Dark tokens = light tokens reversed, or the same accent L and C | Rebuild per palette.md |
| `prefers-color-scheme` and a class both set tokens | One mechanism |
| No `color-scheme`, so scrollbars and inputs stay light | Add it on `:root` |
| Gradient with text on top or used for decoration | Remove, or add a scrim |
| `prefers-contrast: more` block shared by both themes | One block per theme |

Verify: run the contrast script on every text and edge pair in both themes, view the page in light and dark, and emulate colour-blindness (DevTools, or CDP `Emulation.setEmulatedVisionDeficiency`) to confirm status survives without hue.
