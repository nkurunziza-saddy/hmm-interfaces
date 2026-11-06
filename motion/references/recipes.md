# Recipes

Start from the recipe, then adapt. Tokens are from [tokens.md](tokens.md) and are assumed to be defined. Order of tools: CSS first, WAAPI when JS decides, Motion when you need springs or unmount exits.

## Contents
- Press
- Menu, select, popover
- Tooltip group
- Dialog
- Drawer and sheet
- Toast
- List entrance and stagger
- Icon swap
- Number change
- Height change and layout change
- Tab indicator
- Interrupting with WAAPI
- Reduced motion pattern
- Theme switch

## Press

```css
.btn { transition: transform var(--dur-press) var(--ease-out); }
.btn:not(:disabled):active { transform: scale(var(--scale-press)); }
@media (hover: hover) { .btn:hover { background: var(--hover); } }
```

*Why:* `:active` is a real press on touch, so it needs no hover gate; `:hover` sticks after a tap, so it does. A hover colour on a button may take `--dur-color`; on a frequent list row it takes `0ms`.

## Menu, select, popover

Frequently opened menus animate open and close. Scale from the trigger, never translate.

```css
.menu {
  transform-origin: var(--transform-origin, top left); /* Base UI sets the variable */
  transition: opacity var(--dur-menu-exit) var(--ease-out), transform var(--dur-menu-exit) var(--ease-out);
}
.menu[data-starting-style], .menu[data-ending-style] { opacity: 0; transform: scale(var(--scale-enter)); }
.menu[data-open] { transition-duration: var(--dur-menu); }
```

Native `popover` (no library):

```css
[popover] {
  opacity: 0; transform: scale(var(--scale-enter)); transform-origin: top left;
  transition: opacity var(--dur-menu-exit) var(--ease-out), transform var(--dur-menu-exit) var(--ease-out),
              display var(--dur-menu-exit) allow-discrete, overlay var(--dur-menu-exit) allow-discrete;
}
[popover]:popover-open { opacity: 1; transform: none; transition-duration: var(--dur-menu); }
@starting-style { [popover]:popover-open { opacity: 0; transform: scale(var(--scale-enter)); } }
```

- Items inside never stagger. *Why: a menu is opened many times a day.*
- Opened from the keyboard or a shortcut: no animation at all (`transition: none` on `[data-open-method="keyboard"]`, or skip the class). A right-click context menu may fade out only.

## Tooltip group

The first tooltip waits 500ms (the delay `interaction` sets), then plays `--dur-tooltip`. While one is open, its neighbours open at once with `transition-duration: 0ms`. *Why: the delay prevents accidents; after it, instant makes the toolbar feel fast.*

```css
.tip { transition: opacity var(--dur-tooltip) var(--ease-out), transform var(--dur-tooltip) var(--ease-out); }
.tip[data-instant] { transition-duration: 0ms; }
```

## Dialog

Centred, never origin-aware. The backdrop shares the dialog's timing so they read as one surface.

```css
.dialog   { transform-origin: center; transition: opacity var(--dur-dialog-exit) var(--ease-out), transform var(--dur-dialog-exit) var(--ease-out); }
.dialog[data-starting-style], .dialog[data-ending-style] { opacity: 0; transform: scale(var(--scale-enter)); }
.dialog[data-open] { transition-duration: var(--dur-dialog); }
.backdrop { transition: opacity var(--dur-dialog-exit) var(--ease-out); }
```

Keep the dialog mounted and toggle `open`. A dialog behind `{open && <Dialog/>}` loses its exit. In Motion that means a stable `key` inside `AnimatePresence`.

## Drawer and sheet

Directional, so the exit mirrors the entrance.

```css
.drawer { transform: translateX(100%); transition: transform var(--dur-drawer-exit) var(--ease-drawer); }
.drawer[data-open] { transform: none; transition-duration: var(--dur-drawer); }
.scrim { opacity: 0; transition: opacity var(--dur-drawer-exit) var(--ease-out); }
.drawer[data-open] ~ .scrim { opacity: 1; transition-duration: var(--dur-drawer); }
@media (prefers-reduced-motion: reduce) {
  .drawer { transform: none; opacity: 0; transition-property: opacity; }
  .drawer[data-open] { opacity: 1; }
}
```

With drag, hand over to [gestures.md](gestures.md).

## Toast

Enters from its edge; a swiped toast leaves in the swipe direction. Use a transition, because toasts arrive in bursts.

```css
.toast {
  transition: transform var(--dur-toast) var(--ease-out), opacity var(--dur-toast) var(--ease-out);
  @starting-style { opacity: 0; transform: translateY(100%); }
}
.toast[data-removed] { opacity: 0; transition-duration: var(--dur-toast-exit); }
.toast[data-swiped] { transform: translateX(var(--swipe-dir, 100%)); }
```

- Remove the leaving toast from layout at once so the stack closes while it fades (`position: absolute` at its current offset, or `AnimatePresence mode="popLayout"`).
- Pause the timer on hover and while the tab is hidden.
- Use Base UI Toast for a real toast stack (the library default; see `pick-library`).

## List entrance and stagger

For a list that appears occasionally (first load, empty to full). Never on repeat opens or lists scrolled all day. The index is capped so the group ends within 300ms.

```css
.row {
  animation: row-in var(--dur-menu) var(--ease-out) both;
  animation-delay: calc(min(var(--i), 6) * var(--dur-stagger-item));
}
@keyframes row-in { from { opacity: 0; transform: translateY(var(--dist-item)); } }
```

```html
<li class="row" style="--i: 0">…</li>  <li class="row" style="--i: 1">…</li>
```

- `both` is required: without the backwards fill, delayed rows show their end state before animating.
- Omit `to`; it animates to the element's own styles.
- Staged entrance: title `--i: 0`, text `--i: 1`, actions `--i: 2` with `--dur-stagger-chunk` as the step and `--dist-chunk` on the title only.
- Delete from a list: the row fades at `--dur-menu-exit`, is removed from flow immediately, and siblings reflow (FLIP below).

Motion version, one entrance per container:

```tsx
<motion.ul initial="hide" animate="show" variants={{ show: { transition: { delayChildren: stagger(0.04, { startDelay: 0 }) } } }}>
  <motion.li variants={{ hide: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } } }} />
</motion.ul>
```

## Icon swap

Both icons stay mounted in one grid cell, so enter and exit both play and the larger icon sets the size.

```css
.swap { display: grid; place-items: center; }
.swap > * {
  grid-area: 1 / 1;
  transition: opacity var(--dur-swap) var(--ease-out), transform var(--dur-swap) var(--ease-out), filter var(--dur-swap) var(--ease-out);
}
.swap > [data-hidden] { opacity: 0; transform: scale(var(--scale-swap)); filter: blur(var(--blur-swap)); }
```

Animate only icons that swap rarely (copy to copied, play to pause, loading to done). Not icons in hover-revealed row actions, tabs or nav. Motion version: `AnimatePresence mode="popLayout" initial={false}` keyed by state, with `transition={{ type: "spring", duration: 0.3, bounce: 0 }}`.

## Number change

```css
.num { font-variant-numeric: tabular-nums; }
```

```js
function swapNumber(el, text) {
  if (performance.now() - (el._t ?? 0) < 150) { el.textContent = text; el._t = performance.now(); return; } // within 150ms: jump
  el._t = performance.now();
  const opts = { duration: 150, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' };
  el.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-4px)', filter: 'blur(2px)' }], opts).finished.then(() => {
    el.textContent = text;
    el.animate([{ opacity: 0, transform: 'translateY(4px)', filter: 'blur(2px)' }, { opacity: 1 }], opts);
  });
}
```

Skip it entirely for counters that tick faster than once a second; set the text. *Why: continuous animation of a value being read is noise.*

## Height change and layout change

Accordion or disclosure, short, the one case where layout animation is accepted:

```css
.panel { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows var(--dur-layout) var(--ease-in-out), opacity var(--dur-layout) var(--ease-out); }
.panel[data-open] { grid-template-rows: 1fr; opacity: 1; }
.panel > div { overflow: hidden; min-height: 0; }
```

Content swap in a container that resizes: measure an inner element with `ResizeObserver` and animate the outer element's height. Measuring and animating the same node loops. The content crossfades at `--dur-swap` while the height uses `--dur-layout`, in the same easing family. While a panel collapses, its content keeps its open width so nothing reflows mid-animation.

Reorder or removal, FLIP, which animates only `transform`:

```js
const first = items.map(el => el.getBoundingClientRect());
mutate();                                           // remove, insert, reorder
items.forEach((el, i) => {
  const last = el.getBoundingClientRect(), dy = first[i].top - last.top;
  if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }],
    { duration: 200, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' });
});
```

## Tab indicator

Avoid timing colours across tabs. Duplicate the tab row, style the copy as active, and clip it so only the active tab shows. Text and background change together.

```css
.tabs-active { clip-path: inset(0 var(--r) 0 var(--l)); transition: clip-path var(--dur-layout) var(--ease-in-out); }
```

```js
const { offsetLeft: l, offsetWidth: w } = activeTab;
copy.style.setProperty('--l', l + 'px');
copy.style.setProperty('--r', (row.offsetWidth - l - w) + 'px');
```

Set the variables on the copy only (they are inherited by its subtree, so keep that subtree small). Motion `layoutId` also works, but it runs on the main thread, so a route change during it drops frames; prefer the CSS version when navigation is involved. Switching tabs by keyboard: instant, no indicator motion.

## Interrupting with WAAPI

Read where the element is now, cancel, and start from there. Never restart from the end state.

```js
let anim;
function moveTo(el, target) {
  const from = getComputedStyle(el).transform;      // current, mid-flight value
  anim?.cancel();
  anim = el.animate([{ transform: from }, { transform: target }],
    { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
  anim.finished.then(() => { el.style.transform = target; anim.cancel(); }).catch(() => {});
}
```

`finished` rejects on cancel, hence the `catch`. For a pure reverse, `anim.reverse()` is enough. Do not chain UI state off a spring's "settled" event; its tail is longer than its duration.

## Reduced motion pattern

Opacity and colour for everyone; movement, scale and blur only without the preference.

```css
.panel { transition: opacity var(--dur-menu) var(--ease-out); }
@media (prefers-reduced-motion: no-preference) {
  .panel { transition-property: opacity, transform, filter; }
}
```

Motion: `<MotionConfig reducedMotion="user">` turns off transform and layout animation and keeps opacity, but blur still runs, so branch on `useReducedMotion()` where `filter` animates. Hover motion goes in `@media (hover: hover)`.

## Theme switch

Disable all transitions for the swap, force a restyle, then remove the override after two frames. *Why: otherwise every colour transition fires at once and the switch smears.*

```js
const s = document.createElement('style');
s.textContent = '*,*::before,*::after{transition:none!important}';
document.head.append(s);
setTheme(next); void document.body.offsetHeight;
requestAnimationFrame(() => requestAnimationFrame(() => s.remove()));
```

`next-themes` ships this as `disableTransitionOnChange`.
