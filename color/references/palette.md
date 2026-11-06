# Palette from one brand colour

## Contents
- Inputs
- Steps
- The accent ramp targets
- Status ramps
- Token file
- Checking the result

## Inputs

One brand colour in any notation, and which themes ship. Everything below is computed, never eyed. `scripts/contrast.mjs` converts, measures and finds the gamut edge, with no dependencies.

## Steps

1. **Convert the brand to OKLCH.** `node scripts/contrast.mjs --oklch '#3b82f6'` prints `oklch(0.623 0.188 259.8)`. Call the parts Lb, Cb and H. H is held for the whole accent ramp and the neutral ramp. *Why: a ramp whose hue wanders reads as two colours.*
2. **Choose the solid step's lightness.** The solid carries white text, so it needs 4.5:1 with white, which holds up to about L 0.55 at every hue. Solid L = **0.55** if Lb is above 0.55. If Lb is 0.45–0.55, use Lb. The brand is not lost: keep the exact value in `--brand` for the logo only, and never quietly darken it. If Lb is 0.70 or above (yellow, lime, amber), the solid carries dark text instead: Solid L = Lb capped at 0.85, on-colour text = `oklch(0.22 0.015 H)`.
3. **Choose the solid chroma.** Cs = **0.14**, the same for the accent and every status. The brand's own chroma (Cb) stays in `--brand` with its lightness, for the logo only. If a hue can't reach 0.14 at the solid L (`node scripts/contrast.mjs --max-chroma 0.55 <H>`), it takes its sRGB edge and reads quieter; for an accent, prefer a hue that can. Every other step's chroma is a fraction of Cs. *Why: OKLCH chroma is already perceptual colourfulness, so one number gives every hue the same strength; taking a share of each hue's maximum made violet loud and teal muddy. Fractions of that one number keep each ramp the same colour.*
4. **Fill the light ramp** with the targets below. If a colour is outside sRGB, lower C and keep L and H.
5. **Fill the dark ramp** with its own targets: same hue, same solid L, accent chroma × 0.85. *Why: a colour that is confident on white glares on near-black.*
6. **Build the neutral ramp** at the same H with the chroma in SKILL.md. For a purely neutral look, set chroma to 0 everywhere.
7. **Build status ramps** from the table below at the same L steps as the accent. Same step, same lightness, across every hue, so a red button is not heavier than a blue one.
8. **Check the gates** (below). Fix by changing L, which is the channel contrast responds to. Never change hue to fix contrast.
9. **Write semantic tokens** and point them at the ramps.

## The accent ramp targets

Chroma is a multiple of Cs. Example: brand `#3b82f6` (Cb 0.188) snaps to H 260, Cs 0.14, solid L 0.55; its own colour stays in `--brand`.

| Role | Light L | Light C | Dark L | Dark C | Job |
| --- | --- | --- | --- | --- | --- |
| subtle | 0.960 | ×0.125 | 0.270 | ×0.26 | Selected row, badge and banner fill |
| subtle hover | 0.935 | ×0.20 | 0.300 | ×0.32 | Hover on a subtle fill |
| border | 0.870 | ×0.36 | 0.400 | ×0.50 | Edge on a subtle fill (decorative) |
| solid | 0.550 | ×1.00 | 0.550 | ×0.85 | Primary button, checked control |
| solid hover | 0.510 | ×1.00 | 0.510 | ×0.85 | 0.04 darker in both themes, so white text only gains contrast |
| text | 0.480 | ×0.90 | 0.780 | ×0.70 | Links, accent text, accent icons |

Steps are finer at the light end: 0.960 → 0.935 → 0.870 (0.025 and 0.065 apart), then a gap to 0.55. No two adjacent roles closer than 0.025 L. Both ends stop short of black and white.

On-colour text over solid: white (`oklch(1 0 0)`) when it measures at least 4.5:1, otherwise `oklch(0.22 0.015 H)`. Decide by measurement.

## Status ramps

Roles are fixed; the hue and chroma are the same across themes.

| Status | H | Solid L (light / dark) | Cs | On-colour | Icon and text step |
| --- | --- | --- | --- | --- | --- |
| Danger | 25 | 0.55 / 0.55 | 0.14 | white | text |
| Success | 150 | 0.55 / 0.55 | 0.14 | white | text |
| Warning | 75 | 0.80 / 0.78 | 0.14 | `oklch(0.22 0.015 75)` | text |

Every status takes the accent's Cs, 0.14, so no hue looks louder than another. The subtle, border, solid and text roles use the same L and C fractions as the accent table; warning's solid and hover are the exceptions above, and its light text step sits at C 0.10, the sRGB edge at L 0.48 (step 4). Measured at 0.14: white on the danger and success solids 5.20:1 and 4.55:1 (dark 5.15 and 4.60), dark text on the warning solid 9.11:1, and every status text at least 5.52:1 on its own subtle fill. Info is `neutral` with an icon: a fourth hue beside the accent adds noise.

**Collision.** If the accent hue is within 15° of a status hue, move the status hue at least 15° away from the accent (up to 40° from its default). If convention leaves nowhere (a red brand), the destructive action gets an outlined treatment with a trash icon so it never reads as the primary action. Never let one hue mean both identity and status on a screen.

## Token file

```css
:root {
  color-scheme: light dark;
  /* primitives: values only, never used in components */
  --n1: light-dark(oklch(0.985 0.004 260), oklch(0.165 0.008 260));
  --n2: light-dark(oklch(1 0 0), oklch(0.205 0.009 260));
  /* ... n3-n9 from the table in SKILL.md ... */
  --accent-subtle: light-dark(oklch(0.96 0.0175 260), oklch(0.27 0.036 260));
  --accent-solid:  light-dark(oklch(0.55 0.14 260), oklch(0.55 0.119 260));
  --accent-text:   light-dark(oklch(0.48 0.126 260), oklch(0.78 0.098 260));

  /* semantics: the only tier components use */
  --color-bg-page: var(--n1);          --color-bg-raised: var(--n2);
  --color-bg-rest: var(--n3);          --color-bg-hover: var(--n4);       --color-bg-selected: var(--n5);
  --color-border: var(--n6);           --color-border-control: var(--n7);
  --color-text-secondary: var(--n8);   --color-text-primary: var(--n9);
  --color-accent-subtle: var(--accent-subtle);
  --color-accent-solid: var(--accent-solid);
  --color-accent-text: var(--accent-text);
  --color-text-on-accent: oklch(1 0 0);
}
```

Declare an sRGB-safe value before a wide-gamut one only if you exceed sRGB: `@media (color-gamut: p3) { ... }` overrides. Staying inside sRGB (the targets above do) needs no fallback. Add `@supports (color: oklch(0 0 0))` fallbacks only when the browser matrix predates 2023.

Alpha tints (`color-mix(in oklab, var(--color-text-primary) 6%, transparent)`) work for hover fills that must sit on any surface, but a colour with alpha cannot be contrast-checked statically. Never put text on one without compositing first.

Tailwind v4: put primitives and semantics in `@theme`; templates use the semantic utilities (`bg-accent-solid`). A raw `bg-blue-600` in a component is the thing to fix.

## Checking the result

| Pair | Gate |
| --- | --- |
| n9 on n1–n5 | at least 7:1 |
| n8 on n1–n5 | at least 4.5:1 |
| n7 on n1, n2 | at least 3:1 |
| n6 on n2 | at least 1.3:1 |
| accent text on page, raised, subtle | at least 4.5:1 |
| on-colour text on solid, and on solid hover | at least 4.5:1 |
| solid against the page, when it is the only edge | at least 3:1 |
| status text on page and on its subtle fill | at least 4.5:1 |

Run each in both themes. A pair that passes in light can fail in dark, because mirrored pairs do not mirror contrast.
