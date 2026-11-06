# Drag and drop, pointer, touch and URL state

Load this when building a drag interaction, a hover effect, anything used on a phone, or any state a user might want to share or restore.

## Contents
- Drag and drop
- Hover and press
- Touch vs mouse
- Hit areas
- URL state
- Pairs

## Drag and drop

- Use pointer events, not mouse events or the HTML5 drag API, for anything the app styles itself. Call `setPointerCapture` on `pointerdown`. *Why: the drag keeps receiving events when the pointer leaves the element, crosses an iframe or leaves the window.*
- **Hysteresis:** do not start a drag until the pointer has moved **3px** (mouse, pen) or **8px** (touch) from `pointerdown`. Below that it is a click. *Why: hands jitter, and every click would otherwise nudge the item.* Cancel text selection during the drag (`user-select: none` on the body) and restore it on release.
- Apply the pointer delta to the element immediately, 1:1. Use thresholds to trigger completion, never to start movement. *Why: a drag that does nothing until a threshold gives no sign it can be dragged.*
- Set `touch-action: none` on the drag surface only, and `touch-action: pan-y` on horizontal-only surfaces. *Why: otherwise the browser claims the gesture for scrolling.*
- Keep the drag image translucent from the first pixel. Show an insertion line or highlight only on a valid target, and only while hovering it. An invalid drop shows no feedback or `cursor: not-allowed`.
- A failed drop returns the item to its source with a short transition. Dropping in the same container moves; into another copies; Alt/Option forces a copy. Dropped content stays selected.
- Auto-scroll the container when the pointer is within 40px of its edge. A multi-item drag shows a count badge.
- **Spring-loading:** hovering a dragged item over a folder, tab or button for **600ms** opens or activates it without dropping. Cancel when the pointer leaves.
- Snap-to-position from a flick: project the end point from release velocity, `projected = translation + (v / 1000) * 0.998 / (1 - 0.998)`, then snap to the nearest target. *Why: snapping from the release point makes short flicks unusable.* Bounce rules are in `values.md`.
- Destructive drags (dismiss, delete) commit on release regardless of distance. Reversible peeks fire during the move so the user can back out.
- Every drag has a non-drag path: Move up/Move down buttons or a menu, and keyboard arrows on a focused item. *Why: WCAG 2.5.7 and keyboard users.*
- Cursors carry meaning: `grab` on hover, `grabbing` while dragging, `copy` with Alt, `not-allowed` for invalid, `col-resize` and `row-resize` for dividers.

## Hover and press

- Hover styles live inside `@media (hover: hover) and (pointer: fine)`. *Why: touch leaves `:hover` stuck after a tap.* Pair with `:active` for press feedback, which works for every input.
- Never hide content behind hover alone. Under `@media (hover: none)` show hover-revealed controls permanently.
- Press feedback starts on `pointerdown`/`:active`, not on release. Scale values are in `values.md`.
- Frequent list rows have instant hover (no transition). Hover on a list never moves it.
- Cancel a press by dragging away before release; fire the action on `click`, not `pointerdown`, except opening a menu with a mouse.

## Touch vs mouse

- Inputs are 16px or larger on touch (`@media (pointer: coarse)` at minimum).
- `-webkit-tap-highlight-color: transparent` on the root, and every tappable thing gets an `:active` state to replace it. *Why: the grey flash fights your press feedback.*
- `touch-action: manipulation` on buttons and links removes the double-tap delay.
- Never disable zoom. `user-scalable=no` and `maximum-scale=1` are accessibility failures.
- Fixed bars use `100dvh`/`env(safe-area-inset-bottom)` with `viewport-fit=cover`.
- `overscroll-behavior: contain` on drawers and sheets. `user-select: none` on tabs and buttons so a long press does not select a label; never on body text.
- Do not autofocus on touch. Do not show tooltips on touch.
- Gate by capability (`hover`, `pointer`), never by user agent or width. A laptop can have a touch screen and a phone can have a mouse.
- Test on a real phone before calling it done. Emulation cannot show sticky hover, tap delay, rubber-banding or the keyboard.

## Hit areas

Sizes are in `values.md` (24px minimum, 40px mouse, 44px touch). Mechanics:

- Extend a small glyph's hit area with a `::before` on the `<button>` (not on `<input>`): `inset: -12px` makes a 16px icon a 40px target.
- Lists have no dead gaps: use padding, not margin, between rows.
- Where an extended area would overlap another control, shrink it to the largest size that does not.
- Decorative layers over interactive content get `pointer-events: none`. A scrim that dismisses on click is a control, so it keeps pointer events.
- Never nest a `<button>` in a `<button>` or an `<a>`. Make siblings in a container.

## URL state

State the user might want back after refresh, or want to send, lives in the URL: filters, sort, search query, the selected tab, page number, an open detail panel, a date range. *Why: refresh, Back, share and bookmark all work for free.*

- Use query parameters for filters, sort and page (`?status=open&sort=due&page=3`). Use the path for the selected item (`/projects/42`) and tabs that are real views.
- Omit defaults from the URL. `?status=all` is noise; absence means the default.
- A new view pushes a history entry. A refinement the user types (search query, slider) replaces the current entry. *Why: Back should leave the page, not step through every keystroke.*
- Debounce the URL write on typed input by 300ms.
- Read the URL on load and set the UI from it. Never initialise from state and then overwrite the URL.
- Navigation uses `<a href>`, so Cmd/Ctrl-click and middle-click open a new tab. Pagination and tabs are links.
- Transient things are not URL state: hover, a dismissed tooltip, an open menu, a half-typed form. A modal that shows a specific record is (`?record=42`).
- Restore scroll position on Back. Keep focus sensible after navigation.
- Selecting rows, expanding a tree and drafts go to `sessionStorage`/`localStorage` or the server, not the URL. Wrap storage in try/catch.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| Drag starts on any 0px move | Starts after 3px (8px on touch) | A click must stay a click |
| Mouse listeners on `window` for a drag | `setPointerCapture` | Capture survives leaving the element |
| Dragging only | Drag plus Move up/Move down | Keyboard and single-pointer users |
| `.card:hover { transform }` everywhere | Inside `@media (hover: hover)` | Touch sticks the hover |
| Tooltip-only information on touch | Visible text | Touch has no hover |
| Page zooms on input focus | `font-size: 16px` | iOS zoom threshold |
| Filter lost on refresh | `?status=open` | State the user wants back is URL state |
| Every keystroke pushes history | `replace` while typing | Back should leave the page |
| `<div onClick={navigate}>` for a tab | `<a href>` | Middle-click and new tabs |
