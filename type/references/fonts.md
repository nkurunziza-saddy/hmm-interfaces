# Fonts: loading, features and choosing

## Contents
- Loading
- Variable fonts
- No faux bold or italic
- OpenType features
- Choosing a typeface

## Loading

```css
@font-face {
  font-family: "InterVariable";
  src: url("/fonts/InterVariable.woff2") format("woff2");
  font-weight: 100 900;           /* the range the file ships; without it the weight axis is clamped */
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Inter Fallback";  /* local face adjusted to Inter's metrics, so swap does not reflow */
  src: local("Arial");
  /* size-adjust, ascent-override, descent-override: generate them with Fontaine or Capsize, never by eye */
  line-gap-override: 0%;
}
```
```html
<link rel="preload" href="/fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
```

| Decision | Rule | Why |
| --- | --- | --- |
| Format | woff2 only. No ttf, otf or woff | Brotli; every current browser |
| Host | Self-host. Do not use Google Fonts' Inter | Its copy is outdated and has no italics; an extra origin costs a connection |
| Preload | Only faces on first paint (usually one: the regular/variable file). `crossorigin` is required even same-origin | Preloading everything competes with the CSS |
| `font-display` | `swap` for UI text; `optional` for a decorative face | `swap` never hides text; `optional` never shifts it |
| Fallback | Metric-matched local face. Generate with Fontaine, Capsize, or the font loader your framework ships (`next/font`) | Without it, swap moves every line when the font arrives |
| Subset | Latin plus the scripts you ship, with `unicode-range`; keep the OpenType features you use (`tnum`, `case`, `zero`, `ss02`) | Subsetters drop features by default and break tabular numbers silently |
| Count | Sans plus mono. Three families is the ceiling | Each family adds a request and blurs hierarchy |

Never block rendering on a font. If a test shows invisible text for any time, `font-display` is wrong or the file is on the critical path behind JS.

## Variable fonts

Use one variable file when the design uses 3 or more weights, or an optical-size axis; use static files for 1–2 weights. *Why: one variable file is usually smaller than three statics, and a static pair is smaller than a variable file.*

- Declare the full `font-weight` range in `@font-face`, then set weights with `font-weight: 500`, not `font-variation-settings: "wght" 500`. *Why: the property survives a non-variable fallback; the raw tag silently does nothing.*
- Leave `font-optical-sizing: auto`. Inter 4's `opsz` axis runs 14–32 and follows the font size in px: 14 is the text cut with a tall x-height, 32 the display cut with tighter spacing. Never force `opsz` 32 on a 13px caption.
- Inter's weights between the drawn masters (100, 400, 900) are interpolated, so 450 or 550 are legal and fine.
- Raw `font-variation-settings` is only for custom axes (`"GRAD"` in Roboto Flex).

## No faux bold or italic

When a weight or style is not loaded the browser smears or slants the nearest face. Before shipping:

1. List every `font-weight` and `font-style: italic` used in the CSS.
2. Confirm each has a face in `@font-face` (or sits in the variable range).
3. In development, set `font-synthesis: none` on `html` to make a gap visible; keep it in production only after checking the fallback stack.

If no italic is loaded, do not set `<em>` to italic; use weight 500 instead.

## OpenType features

Use the CSS property when one exists (it composes); `font-feature-settings` replaces the whole list on that element, so repeat `"calt" 1` when you override it. Leave `calt` and `ccmp` on. Keep `dlig` off in UI.

| Need | CSS | Inter | Why |
| --- | --- | --- | --- |
| Changing or aligned numbers | `font-variant-numeric: tabular-nums` | `tnum` | Equal-width digits |
| 0 vs O | `font-variant-numeric: slashed-zero` | `zero` | IDs and codes |
| Uppercase labels, `(9000)`, `A@B` | `font-feature-settings: "case"` | `case` | Brackets and symbols rise to cap height |
| Disambiguate `Il1O0` | `font-feature-settings: "ss02"` (keep zeros plain: `"ss04"`) | `ss02`/`ss04` | Hashes, keys, IBANs |
| Open digits in dense numerics | `"ss01"` | `ss01` | Easier at 12px |
| Serifed capital I | `"cv08"` | `cv08` | IDs and code |
| Single-storey a | `"cv11"` | `cv11` | Friendlier voice; a brand decision |
| Fractions | `font-variant-numeric: diagonal-fractions` | `frac` | Recipes and quantities |
| Superscript | `font-variant-position: super` | `sups` | Never shrink a digit by hand |

`ssNN` and `cvNN` slots are numbered, not named, and differ per font. Check the face's specimen before using one. Mono is better than alternates for long strings of IDs.

## Choosing a typeface

A product needs a sans for the interface and, when it shows code or machine values, a mono. That is it. Walk the questions in order and stop at the first yes.

1. **Must it feel native to the OS** (a desktop-class tool, extension popup, internal admin, anything that opens instantly)? → `font-family: system-ui, sans-serif`, mono `ui-monospace`. Cost: metrics, widths and tracking differ per OS, so layouts that clip by one pixel on Windows exist. Never hand-tune `letter-spacing` on it; Safari already applies SF's own table. Never embed or re-host SF.
2. **Is it a data-dense tool with tables, IDs, many languages or small sizes?** → **Inter**, variable, self-hosted. Reason: tall x-height, `opsz` axis, `tnum`/`case`/`ss02`/`zero`, Latin, Greek and Cyrillic, and the tracking formula above. Cost: it is the default of everything, so it carries no brand.
3. **Is it a developer tool with code beside the UI** and Latin-only copy? → **Geist** plus **Geist Mono**. Reason: the pair is drawn together, so code and UI share proportions. Cost: narrower script coverage than Inter; confirm `tnum`, `case` and `zero` exist in the build you load before relying on them.
4. **Does the brand require a face?** → Use it for Title only, with Inter or `system-ui` for everything under 18px. Reason: brand faces are usually tuned for display, and their small sizes fail first. Check it ships `tnum`, a real `…` and a medium weight; without `tnum`, set numeric columns in mono.
5. **Otherwise** → Inter.

Rules that hold for all of them:
- Never ship two near-identical sans-serifs; pair for contrast or use one.
- Do not pick by taste screenshots. Render 13px UI text, a table with numbers, a 21px title and a 36-character ID in each candidate, at 1x and 2x, and choose from that.
- Match apparent size across faces with `font-size-adjust: 0.546` (Inter's x-height ratio) rather than editing the scale. The x-height decides what looks "the same size".
- A "Display" cut is for large sizes and a "Text" cut for small. The name is not a guide; the size is.
