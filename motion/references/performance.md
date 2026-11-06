# Performance

The question here is never "does it look right" but "does every frame finish in time". The budget is 16.7ms at 60Hz and 8ms at 120Hz. Design for the smaller. A fast laptop is the least representative device the motion will run on.

## Contents
- Which properties
- Where it runs
- React and state
- Two traps that use transform and still drop frames
- Blur
- will-change
- Updates that arrive fast
- Diagnosing

## Which properties

| Tier | Properties | Cost |
| --- | --- | --- |
| Composite only | `transform`, `opacity` (and `filter`, `clip-path` in current Chrome and Firefox; test elsewhere) | Cheapest, off the main thread |
| Paint | `box-shadow`, `border-radius`, `color`, `background` | Redraws every frame |
| Layout | `width`, `height`, `padding`, `margin`, `top`, `left`, `border-width` | Re-measures the page every frame |

Swap down a tier:

| Instead of | Animate |
| --- | --- |
| `width` / `height` to grow | `scale()` |
| `top` / `left` / `margin` to move | `translate()` |
| `display` / `visibility` | `opacity` |
| `box-shadow` | `opacity` of a pseudo-element that holds the shadow, or `filter: drop-shadow()` |
| `margin-left` on a sidebar | `translateX` (a margin shoves the whole page's layout 60 times a second) |

Layout animation is accepted for accordions only, short (`--dur-layout`), because there is no transform equivalent.

## Where it runs

| Driver | Thread |
| --- | --- |
| CSS transition and keyframes | Compositor for `transform` and `opacity`; runs through a busy main thread |
| WAAPI, and Motion's `animate()` for `opacity`, `transform`, `filter`, `clip-path` | Same |
| `requestAnimationFrame` loops, Motion `layout` / `layoutId`, `useTransform`, inertia, drag values | Main thread, always |

- Motion `x`, `y`, `scale`, `rotate` shorthands are accelerated from Motion 14.2. On older versions use `animate={{ transform: "translateX(100px)" }}`.
- Anything that plays while the page is busy (route change, data fetch, hydration) belongs in CSS or WAAPI. A tab indicator on shared layout animation dropped frames for exactly this reason.
- Acceleration is a best effort the browser may decline (it historically declined percentage transforms). Keep the percentages; correctness beats a hint.
- Working split: CSS for simple and for busy-page motion; Motion for springs, exits, shared layout and gestures. JS animation is not banned; know what it costs.

## React and state

A hand-rolled animation that calls `setState` per frame re-renders per frame and blows the budget.

| Broken | Fixed |
| --- | --- |
| `setY(y)` in `pointermove`, `scroll` or `requestAnimationFrame` | `ref.current.style.transform = ...`, or `y.set(...)` on a motion value |

## Two traps that use transform and still drop frames

- **Inherited CSS variable.** A drag distance written to `--swipe: 40px` on a parent restyles every descendant on every frame, so the drag gets worse as content grows (a drawer lagged past about 20 items). Write `transform` on the element that moves. *Why: custom properties inherit.* Per-item variables like `--i` for a one-shot stagger are fine, since they never change per frame.
- **Too many animated nodes.** Dozens of simultaneous `filter` or large layers. Animate the container, not each child, or cap the stagger.

## Blur

- Animated `filter: blur()` stays under 20px, and in practice at 2px (`--blur-swap`). *Why: its cost grows fast with radius and area, worst in Safari.*
- Never blur a full-screen layer in a transition.
- A backdrop blur on a scrolling or animating panel recomputes every frame; drop it or make the surface opaque (see `surfaces`).
- Reduced motion removes animated blur.

## will-change

Last resort, never first. Browsers already promote elements animating `transform` or `opacity`.

- Add it only once you see a one-pixel shift when the animation starts or ends, or measured dropped frames on a large blurred or filtered layer.
- Name the property (`will-change: transform`), put it on the element that animates, and toggle it only for the animation. Never `*`, never `all`, never on a large container. *Why: each promoted layer costs GPU memory.*
- It makes the element the containing block for `position: fixed` descendants and creates a stacking context. A fixed tooltip inside it stops tracking the viewport.
- Never on `top`, `width`, `background` or `color`; they cannot be composited.

## Updates that arrive fast

When an update lands within 150ms of the last animated one, skip the animation and jump to the end state. *Why: three chunks in 100ms would stutter three times.*

```js
let last = 0;
function show(update) {
  const now = performance.now();
  if (now - last < 150) apply(update); else animate(update);
  last = now;
}
```

Also: animate meaningful changes (data arrival, user input), never the page load itself. Loops (spinners, shimmer) pause when off-screen or when `document.hidden`.

## Diagnosing

Name the cause before changing code. Work down; the order is by how often each is the cause.

1. Which properties animate? Expand `transition: all` first. Layout, then paint.
2. Does the jank line up with the page being busy? Move the motion to CSS or WAAPI.
3. Does React re-render per frame?
4. Does it worsen as content grows? Inherited variable, or too many nodes.
5. Is blur above 20px, or a shadow animating?
6. Still shifting by 1px? Now `will-change: transform` on the one element.

Confirm with the DevTools Performance panel (dropped frames, long tasks) and the Animations panel at 10% speed. Throttle the CPU 4× for a model of a slow CPU, but test a real mid-range phone for the GPU; throttling does not model that. Say which findings you saw in code and which need a device recording.
