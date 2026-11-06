# Keyboard

Load this when building any control, list, overlay or shortcut.

## Contents
- Order and reach
- Composites and roving focus
- Shortcuts and how they are shown
- Never animate keyboard actions
- Escape layering
- Focus survives removal
- Pairs

## Order and reach

- Tab order follows reading order, which is DOM order. Never use a positive `tabindex`. *Why: it takes over the order for the whole page.* Fix the DOM instead.
- Use `tabindex="0"` only on custom widgets that are not natively focusable, and `tabindex="-1"` for things you focus from script (a heading after route change, a dialog container).
- Every stop shows a `:focus-visible` ring (values in `product-ui`). Mouse clicks on buttons never show it. Text inputs always do.
- Sticky chrome never covers the focused element: set `scroll-padding-block-start` to the sticky header's height. Anchor targets get `scroll-margin-block-start` of the same value.
- The first stop is a skip link to `<main id="main">` when more than 5 stops come before the content.
- Closed drawers, collapsed panels and off-screen menus are `inert` or `hidden`. *Why: Tab landing on invisible links is the commonest keyboard bug.*
- On a client-side route change, update `document.title` and move focus to the new `<h1>` (`tabindex="-1"`). *Why: the browser does nothing, so focus stays on a link that is gone.*
- A single-line input inside a `<form>` submits on Enter. A `<textarea>` inserts a newline, and Cmd/Ctrl+Enter submits only if you build it and show it.
- A custom gesture never ships alone. Every drag, swipe or pinch has a click or key path. *Why: single-pointer and keyboard users cannot do the gesture.*

## Composites and roving focus

Tabs, menus, toolbars, radio groups and listboxes take **one** Tab stop. Arrow keys move inside.

- Roving tabindex: the active item has `tabindex="0"`, the rest `-1`, and arrows move both focus and the `0`. Tab leaves the group.
- A combobox or command menu keeps DOM focus in the input and moves `aria-activedescendant`. *Why: the user keeps typing while the highlight moves.*
- Home and End jump to the first and last item. Typing a letter jumps to the next item starting with it, in menus and listboxes.
- Arrow keys do not wrap in lists by default (`loop` off). *Why: wrapping hides where the list ends, and on a long list it sends you to the opposite end by accident.* Tabs and radio groups wrap, because they are short and cyclic.
- A destructive key (Cmd+Backspace on a focused row) acts on the focused row only.

| Widget | Keys |
| --- | --- |
| Menu button | Enter, Space, ArrowDown open and focus the first item. ArrowUp opens and focuses the last. Escape closes and refocuses the trigger |
| Menu | ArrowUp/Down move, ArrowRight opens a submenu, ArrowLeft closes it, Enter/Space activate |
| Tabs | ArrowLeft/Right move; Tab goes to the panel. Activate on focus when panels render instantly, on Enter/Space when they don't |
| Dialog | Tab cycles inside; Escape closes; focus returns to the trigger |
| Disclosure | A `<button aria-expanded>`; Enter and Space toggle |
| Listbox, radios | Arrows move selection, one Tab stop |

## Shortcuts and how they are shown

- Add shortcuts only for frequent, app-specific actions. *Why: every extra one costs learnability.*
- Primary modifier is Cmd on Mac and Ctrl elsewhere. Read it from `navigator.userAgentData?.platform ?? navigator.platform`. Written order is Control, Option, Shift, Command.
- Never rebind the standard set: undo, redo, cut, copy, paste, select all, find, save, new, print, reload.
- Single-key shortcuts and `g`-then-letter chords never fire while focus is in `input`, `textarea`, `select` or `[contenteditable]`. *Why: typing "g" must type "g".*
- Never fire a shortcut while an IME composes: skip when `event.isComposing` or `keyCode === 229`.
- Show the shortcut where the action lives: a `<kbd>` chip at the right end of a menu row, in the tooltip, and in the command menu. Context menus skip it. Menu rows teach the shortcut. *Why: an undiscoverable shortcut is dead code.*
- Render `kbd` as a chip: 20×20px minimum, 12px, `--surface-raised` fill, 4px radius, 4px gap between chips, `⌘` and `K` separated by a non-breaking space when written inline.
- Every shortcut action also exists in a menu or the command menu. *Why: users who cannot press chords still need the action.*
- Register the open shortcut yourself: `(e.key === 'k' && (e.metaKey || e.ctrlKey))` then `preventDefault` and toggle.

## Never animate keyboard actions

Opening the command menu, moving a highlight, switching tabs with arrows, a shortcut-triggered panel: no transition on the selection or highlight, ever. The open and close have no motion either, and the highlight moving between rows is instant. *Why: these repeat hundreds of times a day, and any motion makes them slower than the keystroke.* Highlight a keyboard-activated menu item with a ring or fill that appears immediately.

## Escape layering

Escape closes the **topmost** layer and nothing else. The order, top first: tooltip, popover or menu, dialog or sheet, then a selection or search. One press, one layer.

- A popover inside a dialog: Escape closes the popover and stops there (`stopPropagation` on the popover's handler, or let the library own layering).
- A menu with a submenu: Escape closes the submenu and returns focus to its parent item. ArrowLeft does the same.
- In a plain search field (not a command menu), Escape clears the text first, and blurs second.
- Escape always returns focus to the element that opened the layer.
- In a command menu, Escape never clears text: it goes back one page when nested, and closes at the root. Backspace on an empty input also goes back one page. *Why: one key with one meaning per surface; clearing is one select-all away.*

## Focus survives removal

When the focused element disappears (a deleted row, a dismissed toast, a collapsed section, a closed popover), move focus on purpose: to the next row, else the previous, else the list container. Never leave it on `body`. *Why: a keyboard user would have to Tab from the top of the page again.* After undo, focus the restored row.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| Eight Tab stops through a menu | One stop, arrows inside | Composite widgets are one stop |
| `tabindex="3"` on search | Move it in the DOM | Positive tabindex breaks order |
| Escape closes dialog and popover together | Popover closes, dialog stays | One layer per press |
| `J` moves selection while typing in search | Hotkeys skip inputs | Typing must type |
| Arrow key slides the highlight over 150ms | Highlight snaps | No motion on keyboard actions |
| Focus on `body` after deleting a row | Focus on the next row | Keep the user's place |
| Shortcut exists, nowhere shown | `kbd` chip in the menu row | Menus teach shortcuts |
| Tab lands on links in a closed drawer | `inert` on the drawer | Hidden things get no stops |
