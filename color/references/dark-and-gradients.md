# Dark mode, theme mechanism and gradients

## Contents
- Dark is its own palette
- color-scheme and one mechanism
- Switching without a smear
- Gradients
- Never colour alone

## Dark is its own palette

Reversing the light ramp is a starting point, never the output.

- **Surfaces rise by getting lighter.** Page 0.165, raised 0.205, hover and selected above that. A shadow barely shows on dark, so lightness is the elevation cue. A popover the same colour as the page is flat.
- **Desaturate the accent.** Same solid L, chroma × 0.85; text step lighter (L 0.78) and × 0.70 chroma. A light-theme `#2563eb` link on `#0a0a0a` measures about 3.8:1.
- **Separate the dark end.** Steps that are distinct as pale backgrounds collapse as dark ones. Space n1 to n6 about 0.03 L apart (the table in SKILL.md does).
- **Soft, not pure.** Page L 0.165, never 0; primary text 0.95, never 1. Pure black against pure white vibrates and exaggerates every edge.
- **Re-measure every pair.** Do not assume the mirror passes.
- **Text compensation** (line-height, tracking) belongs to `type`.

## color-scheme and one mechanism

Set `color-scheme` on `<html>` so scrollbars, form controls, selection and the canvas follow the theme. Drive tokens with `light-dark()`, which reads `color-scheme`.

```css
:root { color-scheme: light dark; }                   /* follows the system; no toggle */
:root[data-theme="light"] { color-scheme: light; }   /* only if the user can override */
:root[data-theme="dark"]  { color-scheme: dark; }
```

- No toggle: the first line is the whole mechanism. No `@media (prefers-color-scheme)` token blocks.
- With a toggle: the attribute sets `color-scheme`, and the media query is only used to set the attribute's first value before paint (an inline script in `<head>`), so there is no flash.
- Never set some tokens with a media query and others with a class. The user's override then leaves the interface half-themed.
- Add `<meta name="theme-color">` once per scheme, matching the top of the page.

`light-dark()` takes colours only, so a gradient needs `light-dark()` on its stops, not around the gradient.

## Switching without a smear

On a theme change, disable transitions for the swap, force a restyle, then restore them. Otherwise every colour fades at once.

```js
const s = document.createElement("style");
s.textContent = "*,*::before,*::after{transition:none!important}";
document.head.append(s);
root.dataset.theme = next;
getComputedStyle(root).opacity;      // force the restyle
requestAnimationFrame(() => s.remove());
```

## Gradients

A gradient in product UI is a tool, never decoration. Allowed: a scroll-edge fade, a scrim under text on an image, a data scale, a skeleton. A glow behind a card, a hero wash or a gradient button is out.

**The interpolation space is a look.** Default `in oklab`: even brightness through the transition.

| Space | Behaviour | Use |
| --- | --- | --- |
| sRGB (default) | Midpoint darkens and mutes; two opposite hues go grey | Avoid for colour-to-colour |
| `in oklab` | Straight line, even brightness; still passes near grey for opposite hues | Default |
| `in oklch` | Arcs around the hue wheel, stays vivid; can invent hues between | Two hues that go grey, or a data scale. Add `shorter hue` (default) or `longer hue` |

```css
.broken { background: linear-gradient(90deg, oklch(0.6 0.2 260), oklch(0.7 0.18 60)); }               /* grey middle */
.fixed  { background: linear-gradient(in oklch 90deg, oklch(0.6 0.2 260), oklch(0.7 0.18 60)); }
```

Banding appears on large low-contrast areas. Widen the stops' contrast or shrink the area. Never put text on a gradient without measuring the worst region; use a scrim.

## Never colour alone

Status always carries a second signal: an icon, a word, or a shape. Pair the icon with the status text colour (which clears 3:1), not the solid.

| Broken | Fixed | Why |
| --- | --- | --- |
| A red dot as the only sign of an error | Red `!` icon, "Payment failed", red text | About 8% of men cannot tell the red from the green |
| Green/red numbers for gain/loss | `+` / `−` signs and an arrow | Locale and vision both change what colour means |
| A selected tab marked by hue | Weight-neutral underline or fill plus `aria-selected` | State needs a shape |
| Toggle on = green track | Track fill plus a thumb position change | Colour is a bonus |

Where a colour means gain or loss, make it a per-locale token: some markets read red as gain.
