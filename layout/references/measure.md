# Measure by procedure

Load this for step 8, and any time the user says something is "off" by an amount they can't name. The rule: pixels decide. Reasoning from the CSS about where things should land is not a measurement.

## Contents
- The procedure
- Reading the script's output
- Fixing
- Report shape

## The procedure

1. **Render at 2×.** Open the page with `deviceScaleFactor: 2` at 390px wide and at the shell's widest supported width. Check light mode; check dark only if the change touches colour. Put the screen in each state you changed: default, open, empty, loading, long data. *Why: at 1× a half-pixel miss rounds away, and a 2× crop shows it.*
2. **Name what must line up.** Write the list before measuring: the shared left edge, the groups and their gaps, each control's centre line, each hit area. A measurement without an expectation proves nothing.
3. **Run the script.** [measure.js](measure.js) is a function expression. Set `window.__layoutScale` to the project's scale if it differs, then call it with a root selector through the browser's evaluate call: `(<contents of measure.js>)("main")`. It returns candidates: `off-scale-gap`, `uneven-gaps`, `near-miss-edge`, `off-centre`, `small-target`, `page-scrolls-sideways`, `clipped-text`.
4. **Confirm each candidate.** Crop the 2× screenshot at the candidate's rectangle and count pixels (2 device pixels = 1 CSS pixel). Drop any candidate the crop does not show. A script reports geometry; only the crop shows whether it looks wrong.
5. **Measure by hand what the script cannot.** Group breaks (≥ 2× the gap inside), hit areas carried by pseudo-elements (`document.elementsFromPoint` at the target's corners), dead zones (step the pointer across a list at 1px increments and watch for gaps where no item is hit), and cap-height centring (compare ink top and bottom margins in the crop).
6. **Fix at the source.** Change the token or primitive behind the finding, not the one instance. Then rerun the script and take the screenshot again. A fix is done when the numbers and the crop both agree.
7. **Break it.** Load the longest strings from [stability-and-text.md](stability-and-text.md), set text zoom to 200%, and resize to 320px. Run the script again.

## Reading the script's output

| Rule | Meaning | Usual fix |
| --- | --- | --- |
| `off-scale-gap` | A gap between siblings isn't a scale step | Move to the nearest step |
| `uneven-gaps` | Siblings differ by 1–4px | Make them one step |
| `near-miss-edge` | Two leading edges differ by 0.5–4px on different rows | Put both on one shared edge |
| `off-centre` | A child sits 1–4px off its control's centre line | Trim the line box (`text-box`), or fix the icon's box |
| `small-target` | Under 24px on a side | Grow it, or carry the hit area on a pseudo-element and confirm by hand |
| `page-scrolls-sideways` | Document wider than the viewport | Find the widest child: `min-width: 0`, `max-width: 100%` |
| `clipped-text` | Text cut by `overflow: hidden` with no ellipsis | Wrap, or truncate with a way back |

The script is noisy by design. A candidate is a question, not a finding.

## Fixing

- Fix the cause in this order: the token, the shared primitive, then the instance. *Why: a fix at the instance leaves the next screen with the same bug.*
- A fix that moves one thing 1px usually means two things were never tied to the same value. Tie them.
- Re-measure after every fix; fixing one gap often moves its neighbour.
- Never leave a nudge you did not measure. Name it in a token with the measured value.

## Report shape

Report the measured numbers, not impressions:

```
1. Settings panel: group gap 12px = row gap 12px. Groups read as one list. Row gap 8px, group gap 24px. [crop]
2. Toolbar icon buttons: 18×18px. Hit area 40×40px via ::before. [verified at the corners]
```

State which states and widths you rendered, and list what you couldn't render as not verified.
