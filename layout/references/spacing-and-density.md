# Spacing, alignment, density and hit areas

Load this for steps 3 to 5 of the decision order: grouping recipes, optical correction, density tokens and target sizes.

## Contents
- Grouping
- Alignment
- Optical alignment
- Density modes
- Hit areas
- Control clearance
- Settings rows

## Grouping

Reach for the next tool only when the one before it cannot carry the structure: space, then a fill, then a line.

| Situation | Within a group | Between groups |
| --- | --- | --- |
| Label and its description | `--space-xs` (4) | n/a |
| Rows in a settings group | `--space-sm` (8) | `--space-xl` (24) |
| Fields in a form block | `--space-sm` (8) | `--space-xl` (24) |
| Sections on a page | n/a | `--space-2xl` (32), with the next title 32 below |
| Compact data panel | `--space-xs` (4) | `--space-lg` (16) |

Pick the pair so between ≥ 2× within. Break the rule only to make a break bigger.

```css
/* Broken: uniform gap, then lines to repair the ambiguity */
.form > * { margin-bottom: 12px; border-bottom: 1px solid var(--border); }

/* Fixed: space carries the grouping */
.form { display: grid; gap: var(--space-xl); }
.group { display: grid; gap: var(--space-sm); }
```

- Separators in menus and drawers run edge to edge. The space above and below a separator equals the side padding. *Why: a separator that stops short reads as an inset item.*
- A list's gap between items exceeds its line-height gap, or the items read as one paragraph.
- Do not repeat a heading's words in the card under it. Spend the space on content.

## Alignment

- Text, icons and controls that start a column share one x. List the shared edges before writing CSS: page edge, content edge, one indent step.
- Deeper nesting repeats the same indent step (`--space-lg`). It never invents a new one.
- Repeated siblings share one gap. 8, 8, 12 is a bug.
- Table text aligns `start`. Numbers align `end` and use `tabular-nums`, because digits then stack by place value.
- Mixed font sizes on one line align on `baseline`, not centre.
- A 1–4px miss is a bug. Under 1px at 2× is rounding; 8px or more reads as intent. *Why: the eye reads a small offset as an error and a large one as a decision.*
- Align to what the eye sees. An icon beside a label centres on the label's cap height or first line, not the line box.

## Optical alignment

| Case | Fix | Why |
| --- | --- | --- |
| Button with a text side and an icon side | Padding 2px less on the icon side (16 and 14) | An icon's empty box edge reads as extra padding |
| Play triangle in a circle | `translateX(2px)` toward the point, named `--play-nudge` | A triangle's geometric centre sits behind its visual centre |
| Circle beside a square | Circle 10% larger | Round shapes look smaller at equal size |
| Star, arrow, caret | Fix the SVG path or `viewBox`; nudge the wrapper only when the asset is fixed | Uneven weight is a property of the glyph |
| Text in a control | Trim the line box to the caps: `text-box: trim-both cap alphabetic` on the label, then centre with flex | Line-box centring leaves ink 1–2px off in fonts with uneven ascent and descent |

```css
.button { display: inline-flex; align-items: center; height: var(--control-h); padding-inline: var(--space-md); }
.button > .label { text-box: trim-both cap alphabetic; }
@supports not (text-box: trim-both cap alphabetic) {
  .button > .label { padding-top: 1px; } /* confirm the number at 2×; it depends on the font */
}
```

Do the optical step last, after the geometry is on the scale, and confirm it at 2×. Never apply a nudge you did not measure.

## Density modes

Two modes, switched by `data-density` on `<html>`, never mixed inside one screen. *Why: mixed row heights read as inconsistent sizing, not as hierarchy.* Comfortable is one step up, not a different product: everything grows by about 8/7, and the type moves to the 14px roles (`type`, comfortable density).

| Token | Compact (default) | Comfortable |
| --- | --- | --- |
| `--control-h` | 28px | 32px |
| `--row-h` | 28px | 32px |
| `--pad-card` | 16px (`--space-lg`) | 20px (`--space-20`) |
| Gap within a group | 4px | 4px |
| Gap between groups | 16px | 20px |
| Hit area floor | 24px | 24px |
| UI text | 13px / 18px | 14px / 20px |

```css
:root                         { --control-h: 28px; --row-h: 28px; --pad-card: var(--space-lg); --gap-in: var(--space-xs); --gap-between: var(--space-lg); }
[data-density="comfortable"] { --control-h: 32px; --row-h: 32px; --pad-card: var(--space-20); --gap-between: var(--space-20); }
@media (pointer: coarse) { :root { --control-h: 44px; --row-h: 48px; } }
```

1. **Compact is the default** for every product surface. *Why: it is a tool; the work, not the chrome, should take the room.*
2. **Comfortable is the person's choice**, a setting in Appearance beside theme and accent (`color`, themes). It applies to the whole app, and it persists like the theme. *Why: people who read better a size up should not have to zoom the browser.*
3. **Touch is the primary input:** controls 44px, whatever the mode. Enlarge with `(pointer: coarse)`, never globally. *Why: a dense desktop tool stays dense on a touch laptop used with a mouse.*

The space scale itself never changes with density; only these tokens and the type roles do. Row height equals line height plus 2× vertical padding; recompute it when the type scale changes.

## Hit areas

| Input | Floor | Target |
| --- | --- | --- |
| Mouse | 24×24px | 40×40px |
| Touch | 24×24px | 44×44px |

- When the glyph is smaller than the target, a pseudo-element carries the hit area: `inset: calc((glyph - target) / 2)`. A 16px glyph to 40px is `inset: -12px`. *Why: the visible size stays tidy and the target stays fair.*
- An expanded area never overlaps a neighbour's. The gap between controls is at least the two overhangs combined, or the expansion shrinks.
- Adjacent toolbar buttons have contiguous hit regions, or hover flickers in the gaps.
- A list has no dead zones: padding sits inside the clickable item, never margin or gap between items. Where a visual gap is needed, bridge it with a pseudo-element.
- A label and its control share one hit area (`<label for>`).
- Never nest a `<button>` in a `<button>`. Make siblings and enlarge each target with CSS.

```css
.icon-button { position: relative; width: 24px; height: 24px; }
.icon-button::before { content: ""; position: absolute; inset: -8px; } /* 24 + 16 = 40 */
```

## Control clearance

| Between | Gap |
| --- | --- |
| Bordered or filled controls, comfortable | 12px (`--space-md`) |
| Bordered or filled controls, compact | 8px (`--space-sm`) |
| Visible glyphs of borderless icon or text buttons | 24px, counting each button's padding |
| Unrelated control groups | 24px or more |

A borderless control has no visible edge, so the space is its boundary. Keep an established usable density rather than stretching controls to match this table.

## Settings rows

One shape for every setting, so a page of them scans as a list:

- **The row:** the label (UI role at 500) over a description (UI or Caption role in the secondary ink at 450), the control at the end, centred on the row. Padding `--space-lg` on every side. *Why: the label and its explanation read as one, and every control lines up on one edge.*
- **The group:** a section heading outside, then one card holding the rows, divided by hairlines. *Why: one surface per group; a card per row is a stack of nested edges.*
- **A row that opens a sub-page** shows its current state under the label, as a status dot and words ("Enabled for all notifications"), with a chevron at the end. *Why: people see the state without opening every page.*
- **A setting that depends on another** stays visible, dimmed and disabled, while the parent is off. *Why: it shows what turning the parent on unlocks.* Only settings: sections elsewhere still hide until they apply (`product-ui`).
- **Show the setting's effect** beside it when it changes something visual (a theme, a code font, a density): a small live sample of the real UI. *Why: people choose by looking, not by name.*
