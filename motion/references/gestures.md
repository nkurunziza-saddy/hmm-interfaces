# Gestures

Anything that follows a pointer: drag, swipe, flick, sheets, reorder, pull. The rule behind all of it: motion starts from the current on-screen value, inherits the hand's velocity, and can be grabbed and reversed at any instant.

## Contents
- The rules
- Drag lifecycle
- Velocity and projection
- Damping at boundaries
- Release with a spring
- Commit on release
- Every gesture has a button
- Reduced motion
- Pairs

## The rules

- The element follows the pointer 1:1 while it is held, with no transition on it. *Why: any easing during a drag reads as lag.*
- A threshold only decides what happens on release. It never turns the response on (0 to 1). *Why: a gesture with no response until a threshold gives no sign it works.*
- Release animates with a spring seeded with the release velocity, never a fixed curve. *Why: a curve cannot take an initial velocity, so it stops dead where the hand left off.*
- A flick is enough. Decide by distance or by speed.
- Write `transform` on the dragged element directly, not through state or an inherited CSS variable (see [performance.md](performance.md)).

## Drag lifecycle

```js
let id = null, start, base, samples = [];
el.addEventListener('pointerdown', e => {
  if (id !== null) return;                       // a second finger never takes over
  id = e.pointerId; el.setPointerCapture(id);    // keeps tracking outside the element
  stopSpring();                                  // grab it mid-flight
  base = currentY(); start = e.clientY; samples = [];
});
el.addEventListener('pointermove', e => {
  if (e.pointerId !== id) return;
  const raw = base + e.clientY - start;
  samples.push({ t: e.timeStamp, y: e.clientY }); samples = samples.filter(s => e.timeStamp - s.t < 100);
  setY(dampen(raw));                             // el.style.transform = ...
});
const end = e => { if (e.pointerId !== id) return; id = null; release(velocity(samples)); };
el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
```

- `touch-action: none` on the drag handle (or `pan-x` / `pan-y` for one axis). *Why: otherwise the browser takes the gesture for scrolling.*
- Start the drag on a handle or the sheet's header, not on scrollable content. Inside scrollable content, start dragging only once the scroll position is at the edge.
- `pointercancel` is a release too. Treat it as the same end, or the element stays stuck.
- Set `user-select: none` while dragging.

## Velocity and projection

Velocity from the samples of the last 100ms (older ones describe where the hand was, not where it is going):

```js
function velocity(s) {                   // px per second
  if (s.length < 2) return 0;
  const a = s[0], b = s[s.length - 1];
  return b.t === a.t ? 0 : (b.y - a.y) / (b.t - a.t) * 1000;
}
```

Never snap to the nearest point from the release position. Project where the motion was going, then snap to the point nearest that.

```js
const project = (v, d = 0.998) => (v / 1000) * d / (1 - d);   // 1000px/s projects about 499px
const target = nearest(snapPoints, y + project(v));
```

`0.998` is the scroll-deceleration rate of iOS. Use `0.99` for a snappier throw. *Why: without projection a short, fast flick lands back where it started and feels broken.*

Dismissal check for a swipe-away (toast, card):

```js
const speed = Math.abs(dx) / elapsedMs;           // px per ms
if (Math.abs(dx) >= threshold || speed > 0.11) dismiss();
```

`0.11px/ms` (110px/s) is the flick threshold. *Why: a distance-only rule ignores a clear intent to throw.*

## Damping at boundaries

Past a natural edge, the element moves less the further it is pulled, then springs back. A hard clamp reads as frozen; rising resistance reads as responsive, with nothing more to give.

```js
// over: px past the edge, limit: px the element may travel at most
const rubber = (over, limit, k = 0.55) => (1 - 1 / (over * k / limit + 1)) * limit;
```

Use `limit` of about 80–120px for a sheet. Apply it on both edges, and only to the part past the edge.

## Release with a spring

Seed the spring with the release velocity and the current position. Bounce comes from speed; a slow release gets none (tokens.md, `--spring-release`).

- Motion: `animate(y, target, { type: 'spring', duration: 0.4, bounce, velocity })`. Pass `velocity` in px/s.
- Without a library, integrate: mass 1, stiffness (2π/duration)², damping 4π(1 − bounce)/duration, in sub-steps of at most 4ms.
- Decompose 2D into two independent springs, one per axis. A single spring on the 2D distance desyncs when x and y velocities differ.
- If a gesture reverses the motion mid-flight, retarget from the current value and velocity. Never hard-cut to a new animation.
- Perceived duration is shorter than the settle. A drawer spring of 0.4s can take 500ms to rest. Don't wait on rest to enable input; input works the whole time.

## Commit on release

- A destructive gesture (swipe to delete, drag to trash) only previews while the pointer is down. The action commits on release, and the user can drag back to cancel. *Why: committing on touch-down is irreversible mid-gesture.*
- On release the item exits the way it went, and an undo window follows (values.md: destructive actions get undo or a named confirmation).
- A hold-to-confirm fills slow and linear while pressed (`2s linear`), and drains fast on release (`200ms --ease-out`). Slow where the user decides, fast where the system answers.

## Every gesture has a button

Each drag, swipe, pinch or reorder also works by click and by keyboard. A sheet has a close button; a reorderable list has Move up and Move down in its row menu. *Why: gestures are invisible, imprecise for some users and impossible for others.*

## Reduced motion

Keep the 1:1 tracking, since it is direct and the user's own. Bounce goes to `0`, projection stays, and the settle becomes a short fade or an instant snap. Nothing animates by itself after the release other than the settle.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| Release on `transition: transform 300ms ease-out` | Spring from the release velocity | Velocity is continuous |
| Snap to the nearest point of the release position | Snap to the nearest point of `y + project(v)` | A flick counts |
| `Math.min(y, top)` | `top - rubber(top - y, 100)` | Resistance beats a wall |
| Dismiss only past `threshold` | `|d| >= threshold || speed > 0.11` | A flick is intent |
| `mousemove` on `window` | `setPointerCapture` | Tracking survives leaving the element |
| `pointerdown` with no id check | `if (id !== null) return` | A second finger does not teleport it |
| Delete fires on touch-down | Delete commits on release, drag back cancels | Preview, then commit |
| `setY(y)` in `pointermove` | `el.style.transform = ...` | No re-render per frame |
