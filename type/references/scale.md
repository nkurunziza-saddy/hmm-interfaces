# Scale, tracking and tokens

## Contents
- The ladder
- Tokens
- Tracking table
- Heading levels
- Dark-mode compensation
- Adopting an existing scale

## The ladder

Base 13px, ratio 1.125, rounded to whole px. The role table in SKILL.md uses steps marked in bold; the others exist only so you can see what was skipped.

| Step | px | Role |
| --- | --- | --- |
| -2 | 10 | Never used (below the 12px floor) |
| **-1** | **12** | Caption |
| **0** | **13** | UI |
| **+1** | **15** | Body |
| **+2** | **16** | Heading |
| +3 | 19 | Skipped |
| **+4** | **21** | Title |
| +5 | 23 | Skipped |
| +6 | 26 | Skipped: product UI tops out at Title |

*Why skip:* a step is 1–2px at 13–16px. Two roles 2px apart look like a mistake unless weight or line-height separates them, so only Heading sits next to Body, and it does so with weight 600.

## Tokens

```css
:root {
  --font-sans: "InterVariable", "Inter Fallback", system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
}
html { font-family: var(--font-sans); font-optical-sizing: auto; -webkit-font-smoothing: antialiased; }

.t-caption { font-size: 0.75rem;   line-height: calc(16 / 12); font-weight: 400; letter-spacing: 0; }
.t-ui      { font-size: 0.8125rem; line-height: calc(18 / 13); font-weight: 400; letter-spacing: -0.003em; }
.t-label   { font-size: 0.8125rem; line-height: calc(18 / 13); font-weight: 500; letter-spacing: -0.003em; }
.t-meta    { font-weight: 450; color: var(--color-text-secondary); } /* with .t-ui or .t-caption */
.t-body    { font-size: 0.9375rem; line-height: calc(23 / 15); font-weight: 400; letter-spacing: -0.009em; max-width: 66ch; text-wrap: pretty; }
.t-heading { font-size: 1rem;      line-height: calc(21 / 16); font-weight: 600; letter-spacing: -0.011em; text-wrap: balance; }
.t-title   { font-size: 1.3125rem; line-height: calc(28 / 21); font-weight: 600; letter-spacing: -0.018em; text-wrap: balance; }
.t-overline { font-size: 0.75rem; line-height: calc(16 / 12); font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; font-feature-settings: "case"; }
```

Set `html { font-size: 100% }` and never `62.5%`. *Why: `rem` must follow the reader's browser setting.* In Tailwind v4, declare the same values under `@theme` as `--text-ui`, `--text-ui--line-height` and so on, so `text-ui` carries all of them.

Where `calc(18 / 13)` is not available, write `1.3846`. It is the same ratio.

## Tracking table

Inter formula `-0.0223 + 0.185 × e^(-0.1745 × px)` em, 3 decimals. It crosses zero at 12px, is -0.011em at 16px and flattens near -0.022em. The formula comes from Inter 3 metrics; Inter 4 is "nearly identical" at text sizes, so judge large sizes by eye.

| px | em | px | em | px | em |
| --- | --- | --- | --- | --- | --- |
| 11 | +0.005 | 18 | -0.014 | 26 | -0.020 |
| 12 | 0 | 20 | -0.017 | 28 | -0.021 |
| 13 | -0.003 | 21 | -0.018 | 32 | -0.022 |
| 14 | -0.006 | 22 | -0.018 | 33 | -0.022 |
| 15 | -0.009 | 23 | -0.019 | 36 | -0.022 |
| 16 | -0.011 | 24 | -0.020 | | |

For a size off the table, in CSS: `letter-spacing: calc(-0.0223em + 0.185em * exp(-0.1745 * var(--px)))` with `--px` the unitless pixel size. *Why: keep the formula in one place instead of guessing a number.*

Uppercase labels are outside the formula: `+0.05em` at 14px or smaller, with the `case` feature so brackets and `@` sit on cap height.

Other faces: Apple's SF Pro table runs the other way at display sizes (about +0.014em at 28px) because SF Display is drawn tight already. A tracking table belongs to its font; never move Inter's numbers to another face.

## Heading levels

Map levels to roles, descending: `h1` Title, `h2` Heading, `h3` UI label at 500 or 600. A heading is never smaller than the text under it. Deep levels may share a role if weight or colour keeps them apart. *Why: the semantic level and the visual level are different decisions; skipping a visual step is fine, skipping an `h` level is not.*

## Dark-mode compensation

Light text on a dark surface looks bolder and tighter because it glows into the surround. Compensate with space, not weight:

```css
/* Dark: +1px line-height, +0.01em tracking, same weight */
.t-caption { line-height: calc(17 / 12); letter-spacing: 0.01em; }
.t-ui, .t-label { line-height: calc(19 / 13); letter-spacing: 0.007em; }
.t-body { line-height: calc(24 / 15); letter-spacing: 0.001em; }
```

Scope these to the dark theme with the project's one theme mechanism (see `color`). Apply to Caption, UI and Body only. Title already has room. Weight stays the same. These two values are a starting point to be revisited in real use.

## Adopting an existing scale

If the project has its own scale (Tailwind `text-sm`, 14/20, and so on), keep it and only fix what is outside it: missing line-heights, tracking in px, ad-hoc sizes. Map its steps onto the roles and report any role the project lacks. *Why: a scale the team already uses beats a better one nobody follows.*
