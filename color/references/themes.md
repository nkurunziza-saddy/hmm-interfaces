# Themes and accents

Load this when an app offers a theme or accent setting, or when a person asks for "themes", "a dim mode", "a white mode" or "pick my colour". A theme is a whole neutral ramp with the same nine jobs; an accent is one hue fed through the palette formula. Components never change: they are written against jobs, so a theme swaps the ramp and an accent swaps two numbers.

## Contents
- When to offer them
- The themes
- The accents
- The mechanism
- The setting
- Measured

## When to offer them

- An app people keep open for hours offers a theme setting. A tool visited now and then follows the system and offers nothing. *Why: every option is something to design, measure and keep working.*
- **System is the default** and the first option. It follows `prefers-color-scheme` through `color-scheme: light dark`.
- At most five named themes beside System. A sixth is a custom builder, not another preset. *Why: past five, the list is a palette to browse, not a choice.*

## The themes

Each theme is the nine-step ramp from SKILL.md with its own lightness. The jobs and gates never move. Chroma is low and the hue follows the accent (`--accent-h`), so neutrals lean toward the brand without being nameable.

| Step | Light | White | Dark | Dim | Midnight |
| --- | --- | --- | --- | --- | --- |
| n1 page | 0.985 | 1.000 | 0.165 | 0.235 | 0.170 |
| n2 raised | 1.000 | 1.000 | 0.205 | 0.270 | 0.210 |
| n3 rest | 0.955 | 0.965 | 0.245 | 0.305 | 0.250 |
| n4 hover | 0.935 | 0.945 | 0.275 | 0.330 | 0.280 |
| n5 selected | 0.910 | 0.920 | 0.305 | 0.355 | 0.310 |
| n6 hairline | 0.880 | 0.890 | 0.335 | 0.385 | 0.340 |
| n7 control edge | 0.640 | 0.640 | 0.540 | 0.600 | 0.550 |
| n8 secondary text | 0.500 | 0.500 | 0.760 | 0.800 | 0.770 |
| n9 primary text | 0.220 | 0.200 | 0.950 | 0.940 | 0.950 |
| Chroma n1–n6 | 0.004–0.011 | 0–0.010 | 0.004–0.011 | 0.006–0.011 | 0.020–0.030 |
| `color-scheme` | light | light | dark | dark | dark |

- **Light** is the default light ramp: a soft page with white cards.
- **White** puts cards on a white page, so surfaces separate by their ring alone. For people who want the brightest screen.
- **Dark** is the default dark ramp.
- **Dim** lifts the page to 0.235 and lowers the text to 0.94: less contrast for long evenings. It still passes every gate.
- **Midnight** is Dark with ten times the chroma at the accent's hue: a coloured dark, like a brand night mode.

Never ship a theme that is a light ramp reversed, and never a pure black page (`dark-and-gradients.md`).

## The accents

One rule sets two numbers; every accent role is computed from them with the palette formula (palette.md), so all options sit at the same lightness and pass the same gates.

| `data-accent` | Hue | Cs | White on solid (light / dark) |
| --- | --- | --- | --- |
| `blue` (default) | 260 | 0.19 | 5.00 / 4.95 |
| `indigo` | 275 | 0.21 | 5.20 / 5.11 |
| `violet` | 295 | 0.24 | 5.47 / 5.33 |
| `pink` | 350 | 0.195 | 5.41 / 5.32 |
| `teal` | 195 | 0.079 | 4.67 / 4.70 |
| `ink` | neutral | 0 | primary action in the text colour |

- Cs is 85% of the largest in-gamut chroma at L 0.55 for that hue: `node scripts/contrast.mjs --max-chroma 0.55 <H>`.
- **Never red, amber or green.** They mean danger, warning and success; an accent within 15° of one takes its meaning away.
- **Ink** draws the primary action, selection and focus in the primary text step (`n9`) with the page colour on it. For people who want no hue at all.
- The neutral hue follows the accent, so changing the accent also tints the greys a little. That is intended: a blue grey beside a pink accent reads as two systems.

## The mechanism

Two attributes on `<html>`, set before first paint, and nothing else. It is the one mechanism of SKILL.md with more values, not a second one.

```css
:root {
  color-scheme: light dark;                 /* System */
  --accent-h: 260; --accent-c: 0.19;
  --n1: light-dark(oklch(0.985 0.004 var(--accent-h)), oklch(0.165 0.004 var(--accent-h)));
  /* … n2 to n9 the same way … */
  --color-accent-solid: light-dark(oklch(0.55 var(--accent-c) var(--accent-h)),
                                   oklch(0.55 calc(var(--accent-c) * 0.85) var(--accent-h)));
}
[data-theme="light"] { color-scheme: light; --n1: oklch(0.985 0.004 var(--accent-h)); /* … its column … */ }
[data-theme="dark"]  { color-scheme: dark;  --n1: oklch(0.165 0.004 var(--accent-h)); /* … */ }
[data-theme="white"] { color-scheme: light; --n1: oklch(1 0 0); /* … */ }
[data-theme="dim"]   { color-scheme: dark;  --n1: oklch(0.235 0.006 var(--accent-h)); /* … */ }
[data-accent="violet"] { --accent-h: 295; --accent-c: 0.24; }
[data-accent="ink"] { --color-accent-solid: var(--n9); --color-text-on-accent: var(--n1); --color-accent-text: var(--n9); }
```

```html
<script>
  // In <head>, before the stylesheet paints.
  try {
    const t = localStorage.getItem("theme"), a = localStorage.getItem("accent");
    if (t) document.documentElement.dataset.theme = t;
    if (a) document.documentElement.dataset.accent = a;
  } catch {}
</script>
```

- The theme selectors are not tied to `<html>`: any element can carry `data-theme`, so a swatch in the setting paints its own theme, and a sample that must stay light can say so.
- A signed-in person's choice is stored with their account and written to the browser on load, so it follows them between devices. The browser copy exists only to paint the first frame.
- Switching follows "Switching without a smear" in `dark-and-gradients.md`: transitions off for the frame of the swap.

## The setting

In Settings → Appearance, one card of settings rows (`layout`, settings rows):

- **Theme**: each option is a swatch, the theme's page with a card and "Aa" in its text colour, so people choose by looking. A grid of radio swatches where there is room; a select whose options carry the swatch where there is not. System shows half light, half dark.
- **Accent**: a row of round swatches as radio buttons, the checked one ringed. Each has an accessible name ("Violet").
- **Density**: a segmented control, Compact and Comfortable (`layout`, density modes).
- Each change applies at once, with no Save. *Why: a theme is judged on the real screen.*

## Measured

Every theme above was measured with `scripts/contrast.mjs` against the gates in SKILL.md, at hue 265:

| Gate | Light | White | Dark | Dim | Midnight |
| --- | --- | --- | --- | --- | --- |
| n9 on n1–n5 (≥ 7) | 13.25 | 14.29 | 11.58 | 9.30 | 11.39 |
| n8 on n1–n5 (≥ 4.5) | 4.59 | 4.74 | 6.24 | 5.93 | 6.35 |
| n7 on n1, n2 (≥ 3) | 3.22 | 3.36 | 3.54 | 3.82 | 3.65 |
| n6 on n2 (≥ 1.3) | 1.44 | 1.39 | 1.49 | 1.54 | 1.51 |

Because the neutral hue follows the accent, the ramps were measured again at every accent hue (195, 260, 275, 295, 350). The worst case still passes every gate: n8 at 4.57:1 (Light, hue 195), n7 at 3.20:1, n6 at 1.39:1, n9 at 9.29:1. A new theme or accent is measured the same way before it ships.
