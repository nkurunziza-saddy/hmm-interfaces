# States and icons

Load this for steps 5 and 6: any interactive element's states, focus rings, and any icon.

## Contents
- States
- Focus ring
- Icons

## States

Every state is a change to the surface: fill, text colour, ring. None of them changes the box. Design all five before polishing the default.

| State | Surface change | Rules |
| --- | --- | --- |
| Hover | Fill one step: the `color` skill's opaque hover step on known surfaces; translucent ink (5% light, 6% white dark) only over images, accent fills or mixed backgrounds | Inside `@media (hover: hover)`. Instant on frequent lists and nav; otherwise motion owns the timing. Never weight, size or border width |
| Pressed | Fill two steps: ink at 8% in light, white at 10% in dark | `:not(:disabled):active`. The `scale(0.98)` comes from `motion` |
| Selected | Accent at 12% fill and a 1px inset accent ring | `[aria-selected="true"]`, `[aria-pressed="true"]`, `[aria-current]`. Selection is the accent's job. Plain list rows may use the fill alone |
| Disabled | Opacity 0.5, `cursor: not-allowed` | No hover, no press, no scale. Say why in text nearby, not in a tooltip on the disabled control |
| Focus-visible | The ring below | `:focus-visible` only, so a click doesn't show it |

```css
.item {
  --fill: transparent;
  background: var(--fill);
  border: 1px solid transparent;       /* same box in every state */
}
.item[aria-selected="true"] { --fill: color-mix(in oklch, var(--accent) 12%, transparent); box-shadow: inset 0 0 0 1px var(--accent); }
@media (hover: hover) {
  .item:hover { --fill: var(--fill-hover); }
  .item[aria-selected="true"]:hover { --fill: color-mix(in oklch, var(--accent) 16%, transparent); }
}
.item:not(:disabled):active { --fill: var(--fill-pressed); }
.item:disabled { opacity: .5; cursor: not-allowed; }
:root { --fill-hover: light-dark(oklch(0 0 0 / .05), oklch(1 0 0 / .06)); --fill-pressed: light-dark(oklch(0 0 0 / .08), oklch(1 0 0 / .10)); }
```

- Write states in this order so the later one wins: base, selected, hover, pressed, disabled.
- A primary (filled accent) button hovers one step darker in light and lighter in dark. It does not gain a shadow.
- Hover on a disabled control does nothing, and a disabled control is never the one that scales.
- Never use `:hover` to show required UI. Touch has no hover.
- Do not rely on colour alone for selection or error: add the ring, a check or text.
- Keep `border: 1px solid transparent` on any element that gets a border in some state. *Why: a border appearing adds width and shifts neighbours.*

| Broken | Fixed | Why |
| --- | --- | --- |
| `.row:hover { font-weight: 600 }` | `.row:hover { background: var(--fill-hover) }` | Weight changes text width |
| `.tab[aria-selected] { border-bottom: 2px solid }` on a box with none | Transparent 2px border on all tabs, coloured on selected | The tab doesn't jump |
| `.btn:disabled:hover { background: … }` | Hover only under `:not(:disabled)` | Disabled means inert |
| Card hover raises the shadow with `transition: box-shadow` | Fill steps one level | Shadow animation repaints every frame |

## Focus ring

Default: an outline.

```css
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; transition: none; }
.scroller :focus-visible { outline-offset: -2px; }   /* inside anything that clips */
```

- 2px wide, 2px gap, the accent. 3:1 against both what it touches and the surface behind it. *Why: the gap shows the page colour, so the ring reads on any background.*
- `transition: none`. The ring appears with the keypress. *Why: a ring that fades in lags behind the user's place.*
- It follows `border-radius` (Safari 16.4 and later), draws in forced-colours mode, takes no layout space and doesn't clash with the elevation ring in `box-shadow`.
- Clipped by `overflow: hidden`? Draw it inset (`outline-offset: -2px`) or pad the scroller by ≥ 4px.
- A box-shadow ring (`0 0 0 2px var(--surface), 0 0 0 4px var(--accent)`) is allowed where the element is drawn with `clip-path` or its outline can't follow its shape. Add `outline: 2px solid transparent` so forced-colours mode still draws it.
- **Fields** take the ring flush, not offset: the border turns the accent and a 1px accent shadow sits outside it, a 2px accent edge with no gap (`border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent)`). *Why: an offset ring around a bordered field draws two edges with a gap between them.* The 2px edge measures 4.9:1 on a light card and 3.7:1 on a dark one; a border-colour change alone measures 2.45:1 in dark, so the extra pixel is required.
- Never `outline: none` without a `:focus-visible` replacement.
- Never `:focus` for the ring. Mouse users see rings they didn't ask for.

## Icons

- **One set per surface.** Mixed sets show in stroke, corner and weight. If the set lacks a glyph, draw it in the set's style.
- **`currentColor` only.** Strip `fill="#666"` on import. State changes colour in CSS, one SVG per icon.
- **Outline by default; filled marks the active state.** The two are a state pair, never interchangeable. Active tab: swap instantly. Infrequent toggles (bookmark, like): cross-fade, owned by `motion`.
- **Stroke tracks the neighbouring text weight**, in rendered pixels:

| Adjacent text | Stroke |
| --- | --- |
| 400 | 1.5px |
| 500–600 | 2px |
| A standalone emphasised icon | 2.5px |

A 24px-grid icon drawn at 16px scales its stroke by 16/24, so `stroke-width="2"` paints 1.33px. Fix the rendered width with `vector-effect: non-scaling-stroke` on the shapes, or the library's absolute-stroke option.

- **Sizes.** 16px beside 12–13px text and in compact controls; 20px beside 15–16px text and in 40px controls; 24px for standalone icons and 44px touch controls. An inline icon is `1em`–`1.25em`. Where the set ships a drawing per size, use the one for the render size. *Why: a 24px drawing scaled to 16px lands off the pixel grid and renders soft.*
- **Optical grid.** 24×24 viewBox, live area 20×20 (2px padding), stroke centred on whole pixels at the render size. Keyline shapes: circle 20, square 18, tall rectangle 16×20, wide rectangle 20×16. The circle is about 10% larger than the square so they read equal.
- **Optical fixes live in the SVG**, not in the component. Asymmetric glyphs (play, arrow, caret) are padded in the path.
- **Gap to the label** is a layout step (8px, 4px in a chip). Centre the icon on the label's cap height.
- **Colour.** Icons take the secondary text tone and move to the primary tone on hover; `color` owns the tones. An accent row of icons is a bug.
- **Always SVG, never raster.** An icon-only button carries an accessible name (`interaction`).
- Test every icon at the smallest size it renders. If it isn't recognisable at 16px, draw a simpler glyph for that size.
- RTL: flip direction-tied glyphs (back, forward, indent); leave checkmarks, logos, clocks and playback.

```html
<button class="btn" style="font-weight:500">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path vector-effect="non-scaling-stroke" d="M12 5v14M5 12h14"/>
  </svg>
  New project
</button>
```

| Broken | Fixed | Why |
| --- | --- | --- |
| 1.5px icon stroke beside a 600-weight label | 2px | The icon looks thin against the text |
| Mixed outline and filled icons in one toolbar | All outline; filled only on the active one | Fill is the state |
| `fill="#6b7280"` baked in | `currentColor` | Colour follows state and theme |
| 24px icon drawn down to 16px with stroke 2 | `non-scaling-stroke`, 2px rendered | Stroke weight is set in pixels |
