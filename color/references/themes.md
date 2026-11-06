# Themes, contrast and accents

Load this when an app offers a theme, contrast or accent setting, or when a person asks for "themes", "a softer look", "more contrast" or "pick my colour". Three settings, each one attribute on `<html>`:

- **Theme** picks a neutral ramp: Light, Dark or Midnight, or System.
- **Contrast** moves only the edges and the text: Soft, Standard or High, on any theme.
- **Accent** feeds one hue into the palette formula: Ink, Blue, Indigo, Violet or Plum.

Components never change. They are written against the nine jobs, so a theme swaps the ramp, contrast moves a few steps and an accent swaps two numbers.

## Contents
- When to offer them
- Themes
- Contrast
- Accents
- The mechanism
- The setting
- Measured

## When to offer them

- An app people keep open for hours offers these settings. A tool visited now and then follows the system and offers nothing. *Why: every option is something to design, measure and keep working.*
- **System is the default theme**, Standard the default contrast, Blue the default accent.
- Variety comes from the axes, not from more themes: three themes × three contrasts give nine distinct looks from three ramps. *Why: a White theme and a Dim theme are only Light and Dark at another contrast; as named themes they double the list without adding a character.*

## Themes

Each theme is the nine-step ramp from SKILL.md with its own lightness and **its own hue**. The greys never follow the accent: changing the accent changes accents only.

| Step | Light | Dark | Midnight |
| --- | --- | --- | --- |
| n1 page | 0.985 | 0.165 | 0.170 |
| n2 raised | 1.000 | 0.205 | 0.210 |
| n3 rest | 0.955 | 0.245 | 0.250 |
| n4 hover | 0.935 | 0.275 | 0.280 |
| n5 selected | 0.910 | 0.305 | 0.310 |
| n6 hairline | 0.880 | 0.335 | 0.340 |
| n7 control edge | 0.640 | 0.540 | 0.550 |
| n8 secondary text | 0.500 | 0.760 | 0.770 |
| n9 primary text | 0.220 | 0.950 | 0.950 |
| Hue | 265 | 265 | 270 |
| Chroma n1–n6 | 0.004–0.011 | 0.004–0.011 | 0.020–0.030 |
| `color-scheme` | light | dark | dark |

- **Light** and **Dark** are the default ramps.
- **Midnight** is the one themed dark: Dark with about ten times the chroma, at a fixed blue hue. It looks like a night mode with a colour, whichever accent is picked.
- *Why the greys keep their own hue:* when the greys follow a switchable accent, picking Teal turns the whole room green-grey and every theme × accent pair becomes a new palette to judge. Linear keeps one neutral hue on every surface; a person changing the accent expects buttons and focus to change, not the page. The `color` rule that the neutral takes the accent's hue holds for a product with one fixed brand colour, not for a picked one.

Never ship a theme that is a light ramp reversed, and never a pure black page (`dark-and-gradients.md`).

## Contrast

Soft and High change only the edges and the text steps; fills and the accent stay.

| Step | Soft | Standard | High |
| --- | --- | --- | --- |
| n6 hairline, light | 0.920 | 0.880 | 0.800 |
| n6 hairline, dark / Midnight | 0.285 / 0.290 | 0.335 / 0.340 | 0.430 |
| n7 control edge, light / dark | as Standard | 0.640 / 0.540 | 0.550 / 0.650 |
| n8 secondary text, light / dark | as Standard | 0.500 / 0.760 | 0.400 / 0.840 |
| n9 primary text, light / dark | as Standard | 0.220 / 0.950 | 0.150 / 0.980 |
| Card ring | alpha 0.04, no drop | the elevation tokens | alpha 0.16 plus the drop |

- **Soft** is for people who want fewer lines. Its hairline goes below the 1.3:1 gate on purpose (about 1.25:1): dividers are decorative, and this is the person's choice. Field edges, toggles and text keep their Standard gates.
- **High** lifts secondary text to 7:1 and control edges to 4.5:1 or more. For low vision, bright rooms and people who simply want it crisper.
- With no choice made, `prefers-contrast: more` starts the setting at High.

## Accents

Every accent sits at the **same lightness and the same chroma**: solid L 0.55, chroma 0.14. Only the hue changes, so the set reads as siblings.

| `data-accent` | Hue | Chroma | White on solid (light / dark) |
| --- | --- | --- | --- |
| `ink` | neutral | 0 | page colour on the text step, 16.6:1 |
| `blue` (default) | 260 | 0.14 | 4.92 / 4.90 |
| `indigo` | 275 | 0.14 | 5.02 / 4.98 |
| `violet` | 295 | 0.14 | 5.13 / 5.07 |
| `plum` | 320 | 0.14 | 5.21 / 5.15 |

- The roles follow palette.md's lightness steps and chroma multipliers; its Cs is the same 0.14. Check any new hue with `node scripts/contrast.mjs --max-chroma <L> <H>` at every role.
- **Why one chroma, not a share of each hue's maximum:** OKLCH chroma is already a perceptual measure of colourfulness. Taking 85% of each hue's limit gave Violet 0.24 and Teal 0.08, which read as two different strengths. One chroma looked like one family when compared side by side. (The oklch.fyi skill recommends the percentage method; it was compared live and rejected.)
- **Not offered:** red, amber and green mean danger, warning and success. Teal and cyan can't reach 0.14 at L 0.55 and turn muddy. Pink and rose sit too close to danger.
- **Ink** draws the primary action, selection and focus in the primary text step with the page colour on it, for people who want no hue at all.

## The mechanism

Three attributes on `<html>`, set before first paint, and nothing else. It is the one mechanism of SKILL.md with more values, not a second one.

```css
:root {
  color-scheme: light dark;                       /* System */
  --nh: 265;                                      /* the greys' hue, set by the theme */
  --accent-h: 260; --accent-c: 0.14;              /* Blue */
  --n1: light-dark(oklch(0.985 0.004 var(--nh)), oklch(0.165 0.004 var(--nh)));
  /* … n2 to n9 the same way … */
  --color-accent-solid: light-dark(oklch(0.55 var(--accent-c) var(--accent-h)),
                                   oklch(0.55 calc(var(--accent-c) * 0.85) var(--accent-h)));
}
[data-theme="light"]    { color-scheme: light; --n1: oklch(0.985 0.004 var(--nh)); /* … its column … */ }
[data-theme="midnight"] { color-scheme: dark;  --nh: 270; --n1: oklch(0.17 0.02 var(--nh)); /* … */ }
[data-contrast="high"]  { --n8: light-dark(oklch(0.4 0.015 var(--nh)), oklch(0.84 0.015 var(--nh))); /* … */ }
[data-accent="violet"]  { --accent-h: 295; }
[data-accent="ink"]     { --color-accent-solid: var(--n9); --color-text-on-accent: var(--n1); --color-accent-text: var(--n9); }
```

```html
<script>
  // In <head>, before the stylesheet paints.
  try {
    for (const key of ["theme", "contrast", "accent"]) {
      const value = localStorage.getItem(key);
      if (value) document.documentElement.dataset[key] = value;
    }
  } catch {}
</script>
```

- The selectors are not tied to `<html>`: any element can carry them, so a swatch in the setting paints its own theme. Declare the semantic roles (`--color-bg-*`, `--color-accent-*`) on the same selectors, so they resolve wherever a theme is set.
- A signed-in person's choice is stored with their account and written to the browser on load, so it follows them between devices. The browser copy exists only to paint the first frame.
- Switching follows "Switching without a smear" in `dark-and-gradients.md`: transitions off for the frame of the swap.

## The setting

In Settings → Appearance, one card of settings rows (`layout`, settings rows):

- **Theme**: each option is a swatch, the theme's page with a card and "Aa" in its text colour, so people choose by looking. System shows half light, half dark.
- **Contrast**, **Density** and **Corners**: segmented controls (Soft, Standard, High; Compact, Comfortable). Corners is a grid of six named swatches, each drawing a button, a field and a tag in its shape: Square, Subtle, Rounded, Soft, Pill and Hybrid. Corners is set in `surfaces` (radius).
- At High contrast, fields also take the 3:1 edge (`n7`) in place of the hairline.
- **Accent**: a row of round swatches as radio buttons, the checked one ringed. Each has an accessible name ("Violet").
- Each change applies at once, with no Save. *Why: a theme is judged on the real screen.*

## Measured

Every combination was measured with `scripts/contrast.mjs` against the gates in SKILL.md (minimum over n1–n5 for text):

| Gate | Light Soft / Std / High | Dark Soft / Std / High | Midnight Soft / Std / High |
| --- | --- | --- | --- |
| n9 primary (≥ 7) | 13.25 / 13.25 / 15.06 | 11.58 / 11.58 / 12.65 | 11.39 / 11.39 / 12.45 |
| n8 secondary (≥ 4.5) | 4.59 / 4.59 / 7.05 | 6.24 / 6.24 / 8.20 | 6.35 / 6.35 / 8.06 |
| n7 control (≥ 3) | 3.22 / 3.22 / 4.65 | 3.54 / 3.54 / 5.54 | 3.65 / 3.65 / 5.47 |
| n6 hairline (≥ 1.3, Soft exempt) | 1.27 / 1.44 / 1.87 | 1.25 / 1.49 / 2.21 | 1.25 / 1.50 / 2.18 |

Accent text passes on every page and on its own subtle fill: at least 6.35:1 in light and 9.26:1 in dark on the page, and 5.90:1 / 7.34:1 on the subtle fill. Because the greys keep their own hue, these numbers hold whichever accent is picked. A new theme, contrast or accent is measured the same way before it ships.
