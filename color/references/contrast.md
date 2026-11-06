# Contrast

## Contents
- Thresholds
- Measuring the real surface
- The script
- Fixing a failing pair
- Text over images
- Increased contrast

## Thresholds

| Element | Ratio (WCAG 2) |
| --- | --- |
| Text under 24px (under 18.66px if bold) | 4.5:1 |
| Larger text | 3:1 |
| A toggle track, a checkbox or radio edge, a meaningful icon | 3:1 |
| A text field | a fill (n3) with a hairline and a visible label; a 3:1 edge (n7) at High contrast |
| Dividers, the ring on a floating surface, disabled controls, logos | exempt |

Placeholders and secondary text count as text. WCAG 2 is the number we report. When a pair is within 0.3 of the line, also look at it zoomed on a real screen.

## Measuring the real surface

Contrast is between the element and the colour **directly behind it**: the nearest ancestor that paints, composited with any alpha. Wrong: measuring a card's text against the page. Right: against the card.

- Walk up from the element to the first opaque background; composite every alpha layer between.
- `opacity: 0.6` on text composites the text over what is behind, so measure the result, not the token.
- `color-mix()`, relative colour syntax and alpha tokens resolve at render time. Measure the rendered colour.
- Translucent or blurred surfaces: measure over the lightest and the darkest content that can scroll beneath.
- Test every state the pair can reach: hover, selected, disabled-but-readable, error.

In a live page, read `getComputedStyle(el).color` and the first opaque ancestor's `backgroundColor`, then feed both to the script.

## The script

`scripts/contrast.mjs` takes hex or `oklch()`, no install needed.

```bash
node scripts/contrast.mjs '#999' '#fff'                        # 2.85:1  text 4.5 FAIL
node scripts/contrast.mjs 'oklch(0.5 0.015 265)' 'oklch(0.91 0.007 265)'
node scripts/contrast.mjs 'oklch(0 0 0 / 0.6)' '#fff'          # alpha composites over the background
node scripts/contrast.mjs 'oklch(0.55 0.19 265 / 0.5)' '#fff' --over '#fff'
node scripts/contrast.mjs --oklch '#3b82f6'                    # convert
node scripts/contrast.mjs --max-chroma 0.55 25                 # sRGB edge at L and H
```

It prints the ratio and pass/fail at 4.5, 3 and 7. Out-of-gamut `oklch()` loses chroma until it fits, as a browser's clipping would. Never report a contrast value you did not measure.

## Fixing a failing pair

1. Change **lightness**, which contrast responds to. Move the foreground away from the background, holding hue and chroma.
2. If the colour leaves sRGB, reduce chroma.
3. A mid-lightness background (L about 0.6–0.75) caps what any text can reach. Change the background, not the text.
4. Re-measure. Do not assume it landed.
5. White on a brand fill that misses 4.5: move the fill to L 0.55 (see palette.md), do not switch the text to a pale tint.

## Text over images

There is no single background. Put a scrim or solid plate under the text and measure at the lightest point of the image under it: `linear-gradient(to top, oklch(0 0 0 / 0.6), transparent)` for white text. Text on a video or canvas you cannot sample is `Not verified`.

## Increased contrast

Honour `prefers-contrast: more` with a separate value per theme. A single shared block that darkens the accent also darkens it on a dark background and lowers contrast there.

```css
@media (prefers-contrast: more) { :root { --accent-text: light-dark(oklch(0.38 0.17 260), oklch(0.88 0.1 260)); } }
```

Widen the gap to the surface by at least 0.15 of L over the default, then re-measure.
