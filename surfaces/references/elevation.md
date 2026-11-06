# Elevation, edges and radius

Load this for steps 2 to 4: choosing a level, writing the shadow, deciding shadow or border, and setting radii.

## Contents
- Tokens
- Dark mode
- Shadow or border
- Radius
- Image outlines

## Tokens

`a` below is `oklch(0 0 0 / alpha)`. Shadows are black at low alpha, never an opaque grey. If the project tints its neutral, draw light shadows in the neutral's darkest step so they share one hue.

```css
:root {
  color-scheme: light dark;

  /* Fills: surfaces rise by getting lighter in dark */
  --surface-page:     light-dark(oklch(0.97 0 0), oklch(0.16 0 0));
  --surface-raised:   light-dark(oklch(1 0 0),    oklch(0.20 0 0));
  --surface-floating: light-dark(oklch(1 0 0),    oklch(0.23 0 0));
  --surface-overlay:  light-dark(oklch(1 0 0),    oklch(0.25 0 0));

  /* Light: a 1px ring, a 1px drop, then at most one short tight drop */
  --elev-control:  0 0 0 1px oklch(0 0 0 / .08), 0 1px 2px 0 oklch(0 0 0 / .12);
  --elev-raised:   0 0 0 1px oklch(0 0 0 / .07), 0 1px 2px 0 oklch(0 0 0 / .12), 0 3px 4px -2px oklch(0 0 0 / .08);
  --elev-floating: 0 0 0 1px oklch(0 0 0 / .08), 0 1px 2px 0 oklch(0 0 0 / .12), 0 4px 8px -4px oklch(0 0 0 / .16);
  --elev-overlay:  0 0 0 1px oklch(0 0 0 / .07), 0 1px 2px 0 oklch(0 0 0 / .14), 0 6px 8px -4px oklch(0 0 0 / .14);
}
@media (prefers-color-scheme: dark) {
  :root {
    --elev-control:  0 0 0 1px oklch(1 0 0 / .10), 0 1px 2px 0 oklch(0 0 0 / .5);
    --elev-raised:   0 0 0 1px oklch(1 0 0 / .08), 0 1px 2px 0 oklch(0 0 0 / .5), 0 3px 4px -2px oklch(0 0 0 / .4);
    --elev-floating: 0 0 0 1px oklch(1 0 0 / .10), 0 1px 2px 0 oklch(0 0 0 / .5), 0 4px 8px -4px oklch(0 0 0 / .5);
    --elev-overlay:  0 0 0 1px oklch(1 0 0 / .12), 0 1px 2px 0 oklch(0 0 0 / .5), 0 6px 8px -4px oklch(0 0 0 / .5);
  }
}
```

Pick one mechanism, the one `color` sets: `color-scheme` plus `light-dark()`. Shadows can be written with `light-dark()` inside each layer, which replaces the media block above; the block is shown only for projects that already theme by media query. Non-colour values that differ in dark (type compensation, an extra ring) key off a `data-scheme="dark"` attribute that a script mirrors from the resolved scheme. Use the project's tokens when they exist and match these in structure.

In dark mode, a control at rest inside an overlay (chips, keycaps, segmented tracks) takes a 1px ring: the component rest fill (L 0.245) is within 0.01 of the overlay surface (L 0.25), so a fill alone disappears.

| Level | Token | Fill | Use |
| --- | --- | --- | --- |
| Page | none | `--surface-page` | App background, the ground between cards |
| Raised | `--elev-raised` (`--elev-control` for buttons, selects, pills) | `--surface-raised` | Cards, tables, controls, the chosen option of a toggle |
| Floating | `--elev-floating` | `--surface-floating` | Menus, popovers, tooltips, toasts, anything anchored to a trigger |
| Overlay | `--elev-overlay` + a scrim | `--surface-overlay` | Dialogs, sheets, command palette |

- Lift grows tooltip < menu < dialog. Never give a dialog a lighter shadow than the menu opened inside it.
- The scrim is black at 30% in light and 60% in dark. It dims; it does not blur (see [materials-and-edges.md](materials-and-edges.md#materials)).
- A small confirm shown in place, with no scrim, is a raised card (`--elev-control`), not an overlay.
- A ring is drawn from the box edge outward. The surface keeps its box size; the transparent border (below) is its edge in forced colours.
- Never animate `box-shadow`. For a clickable card, change the fill on hover (one step, see [states-and-icons.md](states-and-icons.md#states)). *Why: shadow animation repaints every frame and drops frames on phones.*
- A scroller that holds shadows pads them in: ≥ 8px around, or the shadow is cut by `overflow`.

## Dark mode

- **Dark mode is its own set of values.** Surfaces get lighter with height: 0.16, 0.20, 0.23, 0.25 in lightness. *Why: a drop shadow on near-black is invisible, so lightness carries the depth cue.*
- **The edge is a white ring at 8–12% alpha**, in place of the light ring. Never a coloured ring. On floating levels (menus, popovers) the ring may instead be a solid neutral about 0.12 L above the fill, with three tight drops (1, 5 and 8px blur). *Why: a solid ring stays the same over whatever scrolls behind, where an alpha ring changes with it.*
- **Keep the tight black drop.** It separates floating surfaces from the content behind.
- **No lit top edge**: no `inset 0 1px 0 rgb(255 255 255 / x)`. Beside the ring it reads as a gradient.
- **Never lighten by opacity.** Use a solid lighter fill. *Why: translucent fills pick up whatever scrolls behind.*
- Desaturate and lighten hues for dark (`color` owns this). A hue's light text colour is never used as a blurred shadow; it reads as a glow.
- Set `color-scheme` on `<html>` so scrollbars and native controls follow.

## Shadow or border

| Edge is for | Use | Why |
| --- | --- | --- |
| Lifting a surface off what's behind it (card, menu, popover, dialog, toast) | Shadow ring | The ring is part of the elevation recipe and costs no layout |
| Separating rows, sections or regions (dividers, table rules) | Border | A divider is structure; a shadow there reads as a gap |
| Showing where a field is (input, select, textarea) | Border, 3:1 against its surround | A field needs a firm edge in every theme |
| Table cells and grid lines | Border | Cells are structure |
| Selected state | Border or inset ring in the accent | The selection must be unambiguous |
| An image's edge | Inset outline (below) | A border would change its size |

```css
.card {
  background: var(--surface-raised);
  border: 1px solid transparent;   /* forced-colours mode removes shadows and paints this */
  box-shadow: var(--elev-raised);
  border-radius: var(--radius-md);
}
```

- **Never both on one edge.** A border inside a ring is a double edge.
- **Remove borders before adding them.** If a border and a background change both separate two areas, drop the border.
- A nested element with its own border inside a bordered parent is a double border. Drop one.
- A header strip meeting a body takes the parent's radius (outer − border), and the divider under the strip is the only line.
- The transparent border adds 1px to each side of the box. Add it to every surface of the same kind so siblings stay equal.
- In forced-colours mode, text, borders and outlines map to system colours. A card with only a ring and no border becomes invisible. Test it.

## Radius

A small scale. Pick by the element's role, not its size.

| Token | px | For |
| --- | --- | --- |
| `--radius-xs` | 4 | Checkbox, key chips, items inside a menu |
| `--radius-sm` | 6 | Buttons, inputs, selects, rows, tooltips |
| `--radius-md` | 8 | Cards, tables, menus, popovers, panels |
| `--radius-lg` | 12 | Dialogs, sheets, large feature cards |
| `--radius-full` | 9999px | Avatars, switch tracks, dots, counts, pills only when the design calls for pills |

Larger object, larger radius. Buttons and chips use the token; a pill is a choice, not a default.

**Concentric radius: outer = inner + padding (+ border).** An inner shape sitting in the corner of an outer one (an image in a card, a tray around buttons, the first menu item, a header strip) follows this, so the gap between the curves stays even.

```css
/* Menu: 4 (item) + 4 (padding) = 8 */
.menu { border-radius: var(--radius-md); padding: 4px; }
.menu-item { border-radius: var(--radius-xs); }

/* Derive it, so it stays true when padding changes */
.tray { --pad: 4px; --inner: var(--radius-sm); padding: var(--pad); border-radius: calc(var(--inner) + var(--pad)); }
.tray > .button { border-radius: var(--inner); }
```

| Broken | Fixed | Why |
| --- | --- | --- |
| Tray 8, button 8, padding 4 | Tray 10, button 6 | The gap is wider at the corner than at the sides |
| Header strip with its own 8 radius inside an 8 radius dialog | Strip takes the dialog's radius, minus the border | Two curves fight |

- Derived values (10, 14) are allowed off the scale. The scale is for standalone shapes.
- Past 24px of padding, treat the layers as separate surfaces, each with its own token.
- Never let a square-cornered child poke out of a rounded parent: `overflow: hidden` on the parent, or inherit the radius.

## Image outlines

```css
:root { --image-outline: light-dark(oklch(0 0 0 / .1), oklch(1 0 0 / .1)); }
.content-image { outline: 1px solid var(--image-outline); outline-offset: -1px; }
```

- Black at 10% in light, white at 10% in dark. A pale photo on a white card, or a dark screenshot on a dark page, would otherwise melt into the surface.
- Never a palette grey (`slate-200`, `#e5e7eb`) or a tinted colour. It shows as a fringe.
- `outline` and not `border`, because the image keeps its size. At offset −1px it sits just inside the edge and follows `border-radius`.
- Skip logos and transparent artwork. They have their own edge.
- Avatars and thumbnails get it too.
