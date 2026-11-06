---
name: motion
description: Builds motion for product UI on the web. It decides whether something should move at all, then why, which tool (CSS transition, WAAPI, Motion, spring), which properties, curve, duration, interruption, exit and reduced-motion path, and it writes the code. Also covers stagger and choreography, gestures (drag, flick, sheets), motion tokens and animation performance. Use it whenever the user asks to animate, add a transition, make something "feel smoother", "snappier", "springy" or "less janky", or when you build a menu, popover, dialog, drawer, toast, tab indicator, list entrance or icon swap. Use it for drag and swipe too. Don't use it to review existing motion (that is `critique`).
---

# Motion

This skill builds motion. It extends the motion section of `product-ui/references/values.md`, which holds the settled numbers (easing curves, press scale, bounce, stagger, the duration table, toast and layout durations, travel distances, the exit-to-entrance ratio). Those numbers are not repeated here; this skill adds the order of decisions, the tokens, the recipes and the failure modes.

Before any decision, apply `product-ui` §1 (the taste journal and precedence) and §5 (which skill owns what).

## The decision order

Walk these top to bottom. Each step can end the job. Zero lines of animation is a valid result, and you say so.

### 1. Should it move? The frequency gate

Ask how many times a day one user sees this. Tiers are in values.md. In practice:

- Initiated by keyboard, or seen 100+ times a day: no motion. *Why: repeated motion turns into delay.*
- Seen tens of times a day (hover, tab switch, row select): none, or an instant colour change.
- Data the user is reading or acting on (a number in a table, a chart in a live dashboard) never moves for style. *Why: motion pulls the eye off the thing being read.*
- If the gate says no, write no animation. Say which tier it hit, and offer the static alternative (an instant state change).

### 2. Name the purpose

Pick one word: **spatial** (where it came from or went), **state** (this changed), **feedback** (I heard you), **continuity** (prevents a jump), **explanation** (rare moments only). Cannot name one: stop. *Why: "it looks nice" on a frequent element is the main source of slow-feeling UI.*

### 3. Pick the tool: the cheapest that works

| Need | Tool |
| --- | --- |
| A state toggled by class, attribute, hover or press | CSS transition |
| Entering from `display: none`, popover or dialog | `@starting-style` + `transition-behavior: allow-discrete` |
| A one-shot sequence, stagger, or motion that must run while the page is busy | CSS `@keyframes` |
| JS decides when; you need cancel, reverse, `finished`, or FLIP | WAAPI `el.animate()` |
| Springs, velocity handoff, exit of an unmounting React node, shared layout | Motion (`motion/react`) |

If the thing is a whole component (menu, toast, drawer), use a library that ships focus handling, and ask `pick-library`. Never install Motion for a fade. *Why: CSS runs off the main thread and costs no bundle.*

### 4. Properties

- Animate `transform` and `opacity`; `filter` only for a ≤ 2px swap blur. Name every property; never `transition: all`.
- Height and layout changes: see `references/recipes.md` (grid rows, FLIP). Never animate `width`, `top`, `left` or `margin` to move something. *Why: each forces layout on every frame.*
- Never animate `box-shadow`. Fade a pseudo-element's `opacity` instead.
- `translate` percentages are relative to the element's own size, so `translateY(100%)` fits drawers and toasts of any height.

### 5. Curve and duration, matched on usage

Never pick the number nearest to your guess. State the usage ("menu close", "icon swap"), then take that row from `references/tokens.md`. If no row matches the usage, add a new token named for the usage; don't bend an existing one. *Why: a token is a statement about what the motion is for, so a near number with the wrong usage is the wrong token.*

- Entering or exiting: `--ease-out`. Moving on screen: `--ease-in-out`. Drawers: `--ease-drawer`. Colour: `ease`. Spinners: `linear`. Never `ease-in`.
- Anything draggable or interruptible mid-flight uses a spring, not a curve. *Why: a curve cannot accept the velocity the user's hand had.*
- Slow feeling: cut duration first, then the distance, and only then touch the curve.

### 6. Interruption

- Anything the user can trigger twice in a second is a transition or a spring, never `@keyframes`. *Why: a transition retargets from the current value; keyframes restart and jump.*
- WAAPI: cancel the old animation after reading the current value, and start the new one from it (`references/recipes.md`).
- A toggle spammed 10 times must end in the right state with no jump. Test it.

### 7. Exit

- Default exit is a fade, shorter than the entrance (the tokens file has each pair).
- Anything with a direction (drawer, sheet, swiped toast) leaves the way it came.
- The exiting element stops taking up space at once, so siblings close the gap while it fades.
- Exits are simultaneous and never staggered. *Why: the user already decided to leave.*

### 8. Reduced motion, shipped with the animation

Opacity and colour stay. Slides, scale, blur and bounce go; slides become fades, bounce becomes `0`. Never use motion as the only cue. Pattern in `references/recipes.md`.

## Choreography

Cast every moving element before timing it:

| Role | Treatment |
| --- | --- |
| Lead (the one thing to notice) | Moves first, travels most |
| Support | Follows, travels less |
| Decoration | Fades in place, or nothing |
| Static (containers, chrome) | Never moves |

- One entrance per container. If the panel slides in, its content is already there. *Why: two layered entrances make the user wait twice.*
- Order by importance, not DOM order. Delay stays at the values.md steps (40ms between items, 100ms between title, text and actions). Vary distance and duration by role rather than the delay.
- Cap a list stagger at index 6 (a 240ms last delay); items past it share that delay. Input works while it plays.
- Never stagger a menu, command palette, tab content or any repeat open.
- Stay still: anything the user is about to click, anything already on screen when the page loads again, and an update that lands within 150ms of the last one (jump to the end state).
- Direction follows meaning: next enters from the right, back from the left; things the user triggered grow outward from the trigger.

## Load when needed

- [references/tokens.md](references/tokens.md): load for any exact duration, distance, scale, blur, easing or spring value, and for tokenising an existing codebase.
- [references/recipes.md](references/recipes.md): load when building a menu, popover, dialog, drawer, toast, list entrance, icon swap, height change, tab indicator or number change.
- [references/gestures.md](references/gestures.md): load for drag, swipe, flick, sheets, or anything that follows a pointer.
- [references/performance.md](references/performance.md): load when motion drops frames, before reaching for `will-change`, and when updates arrive fast.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| `.menu { transition: all 300ms ease-in }` | `transition: opacity 200ms, transform 200ms var(--ease-out)` | Named properties; ease-in is sluggish; menus ≤ 200ms |
| `scale(0)` to `scale(1)` | `scale(0.95)` and `opacity: 0` to `1` | Nothing appears from nothing |
| Popover scales from its centre | `transform-origin: var(--transform-origin)` | It should grow out of its trigger |
| `.open { animation: slide-in 300ms }` | `transition: transform` on the toggled state | Keyframes snap when interrupted |
| Every row `animation-delay: i * 120ms` | `min(i, 6) * 40ms` | The last row arrives under 300ms |
| Drawer fades out after sliding in | It slides back out the way it came | Direction is the explanation |
| Drag release on a fixed `ease-out` | A spring seeded with the release velocity | The hand's momentum carries on |
| `setY(y)` in `pointermove` | `el.style.transform = ...` | No re-render per frame |

## Before you finish

Search the diff, then verify.

| Search for | Fix |
| --- | --- |
| `transition: all`, `will-change` on `*`, `ease-in` | Named properties, remove, `--ease-out` |
| `scale(0)`, `transform-origin: center` on a popover | `0.95`, the trigger origin (dialogs stay centred) |
| `@keyframes` on a class that toggles | A transition |
| A duration over its row in tokens.md, or a number not in tokens.md | The usage's token |
| Motion on `keydown` handlers or a palette | Remove it |
| `width`, `height`, `top`, `left`, `box-shadow` in a transition | `transform`, `opacity`, or the recipe |
| No `prefers-reduced-motion` path | Add it |

Verify in the running app: play it at 4× (DevTools Animations panel, or multiply durations), spam any toggle, test with reduced motion on, and throttle the CPU 4×. Say which of these you could not run.
