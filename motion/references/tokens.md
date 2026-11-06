# Motion tokens

Every value is chosen by usage. Aligned to `product-ui/references/values.md`; where this file adds a value the core lacks, it is marked **new**.

## Contents
- Match on usage
- Easing
- Durations
- Distances
- Scales
- Blur
- Springs
- The block to paste
- Adopting tokens in an existing codebase

## Match on usage

The question is never "which token is closest to 300ms". It is "what does this motion do". A 300ms menu close becomes `--dur-menu-exit` (150ms) because both are "menu close". A value whose usage matches no row stays as it is, and gets its own named token if it repeats.

| Broken | Fixed | Why |
| --- | --- | --- |
| Menu close `260ms` → nearest token `--dur-menu` (200ms) | Menu close → `--dur-menu-exit` (150ms) | The usage is a close, and closes are faster than opens |
| Toast `350ms` → nearest `--dur-drawer` (400ms) | Toast → `--dur-toast` (300ms) | A toast is not a drawer, even if the number is near |
| Spinner `1s ease` snapped to `--ease-out` | Spinner keeps `linear` | Constant motion has no easing |
| Tooltip `100ms` → `--dur-menu` | Tooltip → `--dur-tooltip` (150ms) | Tooltips have their own row |

## Easing

| Token | Value | Usage |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entering and exiting: menu, popover, dialog, toast, tooltip, list item, press release |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Moving or morphing on screen: tab indicator, height change, layout shift, reorder |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Drawers and sheets, both ways |
| `ease` | built-in | Colour and opacity-only change on a control |
| `linear` | built-in | Spinners, progress, marquee, a hold-to-confirm fill |

Never `ease-in`, and never the built-in `ease-out` keyword for entrances. *Why: the keyword is too weak to read as responsive.*

## Durations

Enter and exit are separate tokens. Exit is about 75% of enter, snapped to 150, 200 or 300ms; the rule and its why are in `product-ui/references/values.md` (Motion).

| Token | Value | Usage |
| --- | --- | --- |
| `--dur-instant` | `0ms` | Hover on frequent lists and nav, keyboard-initiated changes, theme-switch frame |
| `--dur-press` | `150ms` | Press feedback and its release |
| `--dur-color` | `150ms` | Colour or opacity-only change on a control that is not in a frequent list |
| `--dur-tooltip` | `150ms` | Tooltip in and out. Neighbours of an open tooltip use `0ms` |
| `--dur-swap` | `150ms` | Icon swap, text swap, number change, crossfade of two states |
| `--dur-menu` / `--dur-menu-exit` | `200ms` / `150ms` | Menu, select, popover, dropdown (never over 200ms) |
| `--dur-dialog` / `--dur-dialog-exit` | `200ms` / `150ms` | Dialog and its backdrop |
| `--dur-layout` | `200ms` | Tab indicator, height change, reorder, anything moving on screen that is not a drawer. Value set in the core |
| `--dur-toast` / `--dur-toast-exit` | `300ms` / `200ms` | Toast in and out. Values set in the core |
| `--dur-drawer` / `--dur-drawer-exit` | `400ms` / `300ms` | Drawer, sheet. The longest UI motion |
| `--dur-stagger-item` | `40ms` | Between list items |
| `--dur-stagger-chunk` | `100ms` | Between title, text and actions of a staged entrance |

- Bigger elements and longer travel take longer, up to the row's cap. Never exceed the cap to compensate for a slow feel.
- A spring's duration below is its perceived duration. The tail settles later, so measure the settle, not the nominal number.

## Distances

Distance falls with frequency and rises with size. Percentages beat pixels when the size is unknown. The 4 / 8 / 12px values are set in the core (`product-ui/references/values.md`, Motion).

| Token | Value | Usage |
| --- | --- | --- |
| `--dist-swap` | `4px` | Text or number swap, vertical |
| `--dist-item` | `8px` | List item or row entrance, support elements |
| `--dist-chunk` | `12px` | The lead chunk of a staged entrance (title) |
| `100%` | own size | Drawer, sheet, toast: `translate: 0 100%` or `100% 0` |

Popovers, menus, tooltips and dialogs scale; they don't translate. Past about 40px of travel for anything that is not a drawer, it reads as slow.

## Scales

| Token | Value | Usage |
| --- | --- | --- |
| `--scale-press` | `0.98` | Pressed control, `:not(:disabled):active`. Never when disabled |
| `--scale-enter` | `0.95` | Start of menu, popover, dialog, tooltip and toast-card entrances, with `opacity: 0`. Never `0` |
| `--scale-swap` | `0.5` | **New.** Start of an in-place icon swap, with `--blur-swap`. Core has no icon-swap scale |

`scale` also scales the children of a pressed control, which is why a press reads as physical.

## Blur

| Token | Value | Usage |
| --- | --- | --- |
| `--blur-swap` | `2px` | Crossfade of two states that read as two objects: icon, label, number |

- Never animate blur past 20px; it is expensive, especially in Safari. 2px is already enough.
- Reduced motion drops blur entirely, because blur in or out is movement for some users.
- Never blur text that is being read, or a list scrolling.

## Springs

Define by duration and bounce, not stiffness and damping. Duration sets pace; bounce sets character.

| Token | Value | Usage |
| --- | --- | --- |
| `--spring-default` | `duration 0.35, bounce 0` | Anything draggable or interruptible that is not released with speed: drag follow-up, snap to a point, sheet toggled by a button |
| `--spring-release` | `duration 0.4, bounce = min(0.25, speed / 8000)` | **New mapping.** Drag or flick release. `speed` is the pointer speed in px/s, so a 2000px/s flick reaches the 0.25 cap |

- Bounce `0` unless the gesture carried momentum. Overshoot on a menu that faded in feels wrong; on a flicked card it feels right.
- One character across the app. Never give one screen a different bounce.
- Reduced motion sets bounce to `0`.
- Porting duration and bounce to a stiffness and damping library: mass = 1, stiffness = (2π / duration)², damping = 4π × (1 − bounce) / duration (valid for bounce ≥ 0).

## The block to paste

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

  --dur-press: 150ms;   --dur-color: 150ms;   --dur-tooltip: 150ms;  --dur-swap: 150ms;
  --dur-menu: 200ms;    --dur-menu-exit: 150ms;
  --dur-dialog: 200ms;  --dur-dialog-exit: 150ms;
  --dur-layout: 200ms;
  --dur-toast: 300ms;   --dur-toast-exit: 200ms;
  --dur-drawer: 400ms;  --dur-drawer-exit: 300ms;
  --dur-stagger-item: 40ms;  --dur-stagger-chunk: 100ms;

  --dist-swap: 4px;  --dist-item: 8px;  --dist-chunk: 12px;
  --scale-press: 0.98;  --scale-enter: 0.95;  --scale-swap: 0.5;
  --blur-swap: 2px;
}
@media (prefers-reduced-motion: reduce) {
  :root { --dist-swap: 0px; --dist-item: 0px; --dist-chunk: 0px; --scale-enter: 1; --scale-swap: 1; --blur-swap: 0px; }
}
```

Tokens that hold a unit (`px`) or a unitless scale stay in the `:root` block. Never put a token on a large container just to override it for one child. *Why: inherited custom properties restyle every descendant when they change.*

## Adopting tokens in an existing codebase

1. If the project already has duration or easing tokens, extend those. Adding a parallel set is a defect.
2. List every literal duration, curve, translate, scale and blur. For each, write the usage in words.
3. Map by usage to a row above. No match: leave the value, and name it by its usage if it repeats.
4. Replace with `var(--…)`. Keep the file's formatting; change only motion values.
