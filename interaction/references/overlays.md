# Menus, popovers, command menus and dismissal

Load this when building a dropdown, context menu, popover, tooltip anchor, command menu, dialog or sheet.

## Contents
- Dialog, popover or sheet
- Opening and dismissing
- Menus and submenus: the safe triangle
- Outside click, portals and nesting
- The command menu
- Pairs

## Dialog, popover or sheet

The table in SKILL.md picks the surface. These rules apply once picked.

- **Dialog.** Use native `<dialog>` with `showModal()`: it makes the rest `inert`, closes on Escape and traps focus. Title it by the task. Focus the first field; for a destructive confirm, focus the **least destructive** button (Cancel). *Why: Enter is pressed without reading.* Never make the destructive button the default.
- **Popover.** Small, a few related controls, an arrow or edge pointing at its trigger and never covering it. One at a time. It saves what the user entered when it closes by itself and discards only on an explicit Cancel. Never use a popover for a warning: use a dialog or inline text.
- **Sheet.** Slides from the edge nearest the thumb on a phone (bottom) and the trailing edge on desktop. It must have a visible close button and drag-to-dismiss only as an extra. Cancel discards. Done saves. Back moves between steps and never dismisses.
- A dialog never hosts another dialog. See SKILL.md.
- `overscroll-behavior: contain` on every scrollable overlay. *Why: scroll chaining moves the page behind it.*

## Opening and dismissing

- A menu button opens on `pointerdown` when `pointerType === 'mouse'` and the primary button, and on `click` for touch, pen and keyboard. *Why: mouse users expect press-to-open; touch needs the click to cancel by dragging away.*
- Dismiss on: Escape, outside pointerdown, selecting an item (except multi-select), and Tab leaving the layer. Use `pointerdown` for outside detection, not `click`. *Why: a click that begins inside and ends outside (text selection) must not close it.*
- In a popover, Tab walks its controls, then closes it and continues after the trigger. In a menu, Tab closes it at once.
- On close, focus returns to the trigger, unless the user clicked another focusable thing outside.
- Menus and popovers scale from their trigger (`transform-origin` from the anchor). Frequently opened ones animate both open and close within the `values.md` budget; opened from the keyboard or at 100+ opens a day, no entrance motion.
- Never remove the exit by unmounting at once. Keep it mounted until the exit finishes (data attribute, `transitionend`, or `Presence`).
- A select's list opens over its trigger, with the checked option drawn where the trigger's value was, and falls back to below the trigger when there is no room. *Why: the eye stays on the value it is changing, and a small change is a short move.*

## Menus and submenus: the safe triangle

When the pointer moves from an item toward its open submenu, it crosses other items on the way. Without protection, the submenu closes or swaps to the wrong one.

**The rule:** while a submenu is open, build a triangle from the **last pointer position** to the submenu's two nearest corners (top and bottom of its near edge). While the pointer is inside that triangle, ignore `pointerenter` on the other parent items. Leaving the triangle (or stopping for 200ms inside it) resumes normal hover.

```js
function inTriangle(p, a, b, c) {
  const s = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  const d1 = s(p, a, b), d2 = s(p, b, c), d3 = s(p, c, a);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}
// on pointermove in the parent menu: tri = [last, subTopNear, subBottomNear]
// on pointerenter of a sibling item: if (inTriangle(pointer, ...tri) && !stopped) return;
```

*Why a cone and not a delay:* a fixed close delay makes every deliberate move to a sibling feel late; the triangle only waits when the pointer is clearly heading to the submenu.

Also:
- No dead gaps between menu items. Grow padding, not margin. *Why: hover flickers crossing a gap, and clicks land on nothing.*
- The submenu overlaps its parent by 4px horizontally. ArrowRight opens it and focuses its first item; ArrowLeft and Escape close it.
- Menu item order: most used first; separators between groups; at most 3 groups; split a long menu instead of scrolling. Disable unavailable items in a menu bar; hide them in a context menu.
- Toggle items change their label with state only when it names the action ("Hide sidebar" / "Show sidebar").
- A dropdown's width hugs its longest label plus 16px (`values.md`).

## Outside click, portals and nesting

Overlays render in a portal at the end of `<body>` so no `overflow` or `transform` ancestor clips them. A portal breaks the naive check `container.contains(event.target)`, because the popover's DOM lives outside its logical parent.

**The rule:** a layer closes on outside pointerdown only when the target is outside **its own content and every layer opened from it**, and each layer handles only itself.

- A popover inside a modal: pointerdown inside the modal but outside the popover closes the **popover only**. The modal stays. Pointerdown on the modal's backdrop closes the modal (and the popover with it, since it is a child).
- Implement it with a layer stack: on outside pointerdown, find the topmost layer, close it, and stop. Do not let the event reach layers below. Libraries (Base UI, Radix) do this when every layer uses the same primitive; mixing a hand-made popover with a library dialog breaks it.
- Scrims are controls, not decoration: `pointer-events` on, and dismissal on pointerdown.
- Dismissal ignores the trigger, so clicking the trigger toggles instead of closing then reopening.
- A toast region sits outside every portal's stacking context, at the document root, so a modal never hides it.

## The command menu

Use cmdk (or Base UI Combobox) rather than rebuilding it. The behaviours below are the ones that matter. Hand-built menus usually miss them.

- **Select on `pointermove`, not `mouseenter`.** *Why: when the list scrolls under a still pointer, `mouseenter` fires and steals the keyboard selection.*
- **Reset the selection to the first item after every search change**, after filtering and sorting. Skip disabled items. *Why: the selection would otherwise sit on a hidden or far-down row.*
- **No transition on selection.** The selected row changes background instantly. A 150ms transition is for the `:active` press only.
- **Group headings scroll into view with the first item.** When the selected item is first in its group, scroll the heading into view, not just the item (`scroll-padding-block: 8px` on the list). *Why: the label is otherwise cut off.*
- **Separators are hidden while searching.** *Why: grouping chrome is noise in a ranked list.* Group headings stay only if they have visible items.
- **`loop` off.** Down on the last item does nothing. *Why: wrapping loses the sense of where the list ends.*
- Focus stays in the input. Items are `role="option"`, the input is `role="combobox"` with `aria-activedescendant`.
- Enter runs the selected item. Cmd/Ctrl+Down or End: last item. Cmd/Ctrl+Up or Home: first. Alt+Down/Up: next or previous group.
- Ignore keys while an IME composes (`isComposing` or `keyCode === 229`).
- Each row shows its shortcut as a `kbd` chip. Synonyms go in `keywords` ("theme" finds "Dark mode").
- Empty state: "No results for “{query}”." centred, one line. No loading text; show a skeleton row after 200ms if results are async.
- Height: the list resizes instantly as results change (no transition), capped at 300px, with `overscroll-behavior: contain`. *Why: the command menu is keyboard-driven, and `values.md` gives keyboard surfaces no motion; even a 100ms resize trails the keystroke.*
- Nested pages in one menu: Escape goes back (it never clears text), as does Backspace on an empty input; Escape at the root closes. Reset to the root on close.
- The input has `autocomplete="off"`, `autocorrect="off"`, `spellcheck="false"`. This is the one place off is correct: a browser autofill list would cover the results.
- On mobile it becomes a bottom sheet, not a centred modal.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| Pointer cuts across items toward a submenu and it closes | Safe triangle from the last pointer position | Aim toward the submenu is intent |
| Popover in a modal: outside click closes both | Layer stack closes the top layer only | The user peels one layer |
| `onMouseEnter` selects command rows | `onPointerMove` | Scrolling must not steal selection |
| Selection stays on a hidden row after typing | Reset to the first item | The selection must be visible |
| 150ms background fade on the highlighted row | Instant | Keyboard navigation must feel instant |
| Heading clipped when arrowing into a group | Scroll the heading first | Context stays visible |
| Group separators in search results | Hidden while searching | Ranked results have no groups |
| `margin` gaps between menu items | `padding` on items | Gaps flicker hover and drop clicks |
| Native `contains()` check on a portalled popover | Layer stack | Portals leave the logical tree |
