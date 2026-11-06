# Values

These are exact values for product UI. Use them as written, because they were chosen by feel in side-by-side comparisons. A rule in the user's taste journal overrides any line here.

## Contents
- Motion
- Type
- Colour
- Space, alignment and size
- Surfaces and icons
- States and feedback
- Words

## Motion

**Should it move?** Ask how often the user sees it.

| Frequency | Motion |
| --- | --- |
| 100+ times a day (keyboard shortcuts, command palette open, close and resize, list navigation) | None. Ever. |
| Tens of times a day (hover, tab switches, row selection) | None, or an instant colour change |
| Occasional (menus, dialogs, drawers, toasts) | Standard values below |
| Rare (first run, success, empty-to-full) | May carry one expressive moment |

Never animate keyboard-initiated actions. *Why: they repeat hundreds of times, and motion makes them feel slower than the keystroke.*

**Every animation answers "why does this move?"** Valid reasons are spatial consistency, a state change, feedback, explaining how something works, and preventing a jarring jump. "It looks nice" on something seen often is not a reason.

**Easing**
```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);    /* anything entering or exiting */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* moving or morphing on screen */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* drawers and sheets */
```
- Entering or exiting: `--ease-out`. Moving on screen: `--ease-in-out`. Colour or opacity change: `ease`. Constant motion such as spinners and progress: `linear`.
- Never use `ease-in` on UI. *Why: it delays movement at the exact moment the user is watching, so it feels sluggish even at the same duration.*

**Durations**

| Element | Duration |
| --- | --- |
| Press feedback | 150ms |
| Tooltips, small popovers, menus | 150–200ms, never over 200ms |
| Dialogs | 200ms |
| Layout changes, tab indicator | 200ms |
| Toasts | 300ms in, 200ms out |
| Drawers, sheets | up to 400ms |

- Bigger elements, and elements that travel farther, take longer, because they feel heavier.
- An exit is about 75% of its entrance, snapped to 150, 200 or 300ms. *Why: the user has already decided to leave, so a close should get out of the way.*
- Travel distances are 4px (text or number swap), 8px (list item or row entrance) and 12px (lead chunk of a staged entrance). *Why: distance falls with frequency, and past about 12px a routine move reads as slow.*
- When motion feels slow, shorten it before touching the curve.

**Values**
- Press: `scale(0.98)` over 150ms with `--ease-out`, on `:not(:disabled):active`. A disabled control never scales.
- Entering: start from `scale(0.95)` plus `opacity: 0`, never `scale(0)`. *Why: real objects don't appear from nothing.*
- Popovers and menus scale from their trigger (`transform-origin: var(--transform-origin)`, or the trigger's corner). Modals stay centred.
- Exit: fade only by default, faster than the entrance. Elements with a direction (drawers, sheets, swiped toasts) leave the way they came.
- Frequently opened menus animate both open and close, within the durations above.
- Stagger: 40ms between list items; 100ms between semantic chunks of a staged entrance (title → text → actions). Never stagger routine interactions or repeat opens. Input works while a stagger plays.
- Bounce: `0`. Only a drag or flick release gets bounce, scaled with release velocity up to `0.25`. Reduced motion sets it back to `0`.
- Hover on frequently used lists and nav: instant, with no transition. Exception, set by the user: one shared row highlight may slide 150ms between rows; its colour still appears at once.

**Mechanics**
- Animate only `transform` and `opacity` (and `filter` sparingly). Never `transition: all`. Name each property.
- Use CSS transitions or springs for interactive state, because they retarget mid-flight. Keep `@keyframes` for sequences that run once.
- A crossfade that looks like two objects swapping can take `filter: blur(2px)` during the transition. Keep the blur small.
- When an update arrives within 150ms of the last one, skip animating it and jump to the end state.
- Theme switch: disable all transitions for the swap (`* { transition: none !important }`), force a restyle, then remove the style. *Why: otherwise every colour transition fires at once and the switch smears.*
- Reduced motion keeps opacity and colour changes but drops movement, scale and blur, including press scale, chevron rotation and switch-thumb slides (they jump to the end state). It replaces slides with fades. Motion is never the only cue for a state change.
- Hover styles go inside `@media (hover: hover)`. *Why: on touch screens, `:hover` sticks after a tap and looks like a selected state.*

## Type

- Use few sizes. The app UI scale ratio is `1.125`, in fixed rem, not fluid. Pair each size with its line-height and weight, so a role is one decision.
- Line-height by role, with unitless values snapped to whole pixels:
  - Interface text (labels, rows, controls, short copy): 1.3–1.4.
  - Long-form reading: 1.5–1.6.
  - Headings (16–21px): 1.25–1.36, about 1.33 by default, snapped to whole pixels.
  - Anything that wraps to 3+ lines: at least 1.4.
- Tracking follows the font's own table. For Inter it is `-0.0223 + 0.185 × e^(-0.1745 × px)` em: about 0 at 12px, -0.011em at 16px, -0.02em at 24px. Uppercase labels at 14px or smaller take `+0.05em`.
- Below 18px, use weight 400 or heavier. Weights under 400 belong at 28px and up.
- Font weight never changes on hover or selection. *Why: it shifts the layout.* Use colour or background instead.
- Use `font-variant-numeric: tabular-nums` on anything that changes or lines up: timers, counters, prices and table columns.
- Cap the measure of reading text at 60–75 characters.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on short paragraphs.
- Use `overflow-wrap: break-word` where IDs, URLs or emails can appear.
- Sentence case everywhere: buttons, headings, labels and menus.
- Store text in natural case and use `text-transform` for display.
- Use typographic punctuation: curly quotes, an en dash for ranges, the `…` character.
- Truncated text always has a way back to the full text (a tooltip or an expanded view).
- Truncate per field: names wrap at 2 lines; file names and emails truncate in the middle; numbers never truncate. *Why: truncation hides what tells two names apart, file names and emails differ at the end, and users compare numbers.*
- Light text on a dark background (soft default): slightly more line-height and +0.01em tracking, with the same weight.

## Colour

- The interface is about 90–95% neutral. The neutral carries structure, and hue means status or identity only.
- One accent, for the primary action, selection, focus and links. An accent heading or a row of accent icons is a bug.
- Every palette step has a named job: page background, raised surface, hover, border, solid fill, secondary text, primary text. Delete steps nothing uses.
- Components use semantic tokens (`--color-accent-solid`, `--color-text-secondary`), never primitives (`--blue-500`).
- Contrast is measured against the surface directly behind the element:
  - Text under 24px (or 18.66px bold): 4.5:1.
  - Larger text: 3:1.
  - A toggle track, a checkbox or radio edge, or a meaningful icon: 3:1.
  - A text field is a rest-fill well with a hairline and a visible label; the 3:1 edge belongs to High contrast.
- Never put grey text on a coloured background. Tint the secondary text from that hue instead.
- Dark mode is its own palette, not an inversion. Surfaces rise by getting lighter, because shadows barely show on dark.
- Set `color-scheme` on `<html>`. Choose one theme mechanism (a class or a media query), not both.
- Never use colour alone to show status. Add an icon, a label or a shape.

## Space, alignment and size

- Use one spacing scale, on a 4px base: 4, 8, 12, 16, 20, 24, 32, 48, 64. Don't use one-off values.
- There is more space around a group than within it, and a deliberate group break is at least 2× the in-group gap.
- A 1–4px misalignment is a bug.
- Align optically where geometry looks off:
  - A button with an icon gets 2px less padding on the icon side.
  - A play triangle shifts toward its point.
  - Circles and triangles need about 10% more size than squares to look equal.
- Use concentric radius: outer = inner + padding (+ border). Past 24px of padding, treat the layers as separate surfaces.
- Hit areas are at least 24×24px; aim for 40×40 with a mouse and 44×44 on touch. When the glyph is smaller, a pseudo-element carries the hit area. Lists have no dead gaps between items.
- A dropdown's width hugs its longest label plus 16px to the edge, with a min-width for short labels and a max-width with truncation beyond that.

## Surfaces and icons

- Shadows show elevation, and borders show structure. Replace a depth-only border with a layered shadow: a 1px translucent ring plus a tight drop, with no big soft blur. Keep borders on dividers, inputs, table cells and selected states.
- Keep `border: 1px solid transparent` under a shadow ring. *Why: forced-colours mode removes shadows, and the border still draws an edge.*
- Images get a 1px inset outline: black at 10% in light mode, white at 10% in dark mode. Never use a tinted colour, because it shows as a fringe.
- Icons use one set per surface and `currentColor`. Outline is the default, and filled marks the active state. Stroke tracks the neighbouring text weight: 1.5px at 400 up to 2px at 600.
- Scrollable overlays (dialogs, drawers, menus) get `overscroll-behavior: contain`.

## States and feedback

- Show feedback next to its trigger. A copy button shows a check mark in place, not a toast.
- Delay a spinner or skeleton by 150–300ms, then keep it up for at least 300–500ms once shown.
- Toasts are only for results that need no action and aren't visible, or to carry Undo for a visible destructive change. Anything that needs action stays until it is dismissed.
- Toast timers pause while the tab is hidden or the toast is hovered.
- An empty state says what belongs there and offers one action to start.
- Keep the submit button enabled until the request starts. Errors appear inline next to the field, and focus moves to the first error.
- Destructive actions get an undo window or a confirmation that names the action. Never act immediately without one.
- Toggles take effect immediately, with no confirm step.
- Tooltips appear after 500ms. Once one is open, neighbouring tooltips open instantly with no animation.

## Words

- A button says what happens: "Save changes", not "Submit". A confirm button names the action ("Delete project" next to "Cancel"), never "Yes".
- An action keeps the same label through the whole flow.
- Label a toggle by what happens when it's on: "Send read receipts", not "Disable read receipts".
- Errors say what happened and what to do next. They never apologise and are never vague.
- Address the reader as "you", never "the user".
- Use an ellipsis only in a search placeholder and on commands that need more input before acting ("Rename…", "Export…"). Never write "Loading…".
- Links describe where they go, never "click here".
