---
name: interaction
description: How product UI behaves under input on the web. Keyboard and focus, menus, popovers, command menus, dialogs vs popovers vs sheets, forms and validation, feedback, toasts, undo, tooltips, drag and drop, loading states, touch vs mouse, and URL state. Use it whenever you build or change anything a person clicks, types into, drags, opens or dismisses, such as a dropdown that closes when you move toward a submenu, a popover inside a modal, a cmdk-style palette, a form that validates, a delete with undo, a toast, a spinner that flashes, a filter that resets on refresh, or a button that feels dead on a phone. Also use it when the user says something "feels laggy", "fights the keyboard" or "closes by itself".
---

# Interaction

This skill decides how product UI responds to input. Look, motion and words belong to siblings. It walks one decision order so the same input always gets the same behaviour.

Before any decision, apply `product-ui` §1 (the taste journal and precedence) and §5 (which skill owns what).

## Decide in this order

Stop at the first step that answers the question.

1. **Keyboard first.** Every action works with keys alone, in reading order, before you add the mouse path. Load [references/keyboard.md](references/keyboard.md). *Why: a missing key path is invisible to the builder and total for the user who needs it.*
2. **Pick the surface.** Use the table below. Load [references/overlays.md](references/overlays.md) for menus, popovers, command menus and dismissal. *Why: the wrong surface causes most dismissal bugs.*
3. **Pick the input contract.** Forms, validation, submit and paste: load [references/forms.md](references/forms.md).
4. **Pick the feedback channel.** Nearest to the trigger wins; use the table below. Load [references/feedback.md](references/feedback.md) for toasts, undo, optimistic updates, tooltips and loading.
5. **Check pointer and touch.** Drag, hover, hit areas, 16px inputs, URL state: load [references/pointer-and-touch.md](references/pointer-and-touch.md).
6. **Check the worst case.** Hold Tab through it, mash it, throttle the network to slow 3G, paste into it, resize to 390px.

## Which surface

| The job | Use | Why |
| --- | --- | --- |
| Pick an action or a value from a short list | Menu (popover) | Anchored to the trigger; closes on pick |
| Small options or detail about one thing, no commitment | Popover | Stays beside what it explains; outside click is a safe exit |
| Search or run any command from anywhere | Command menu | One entry for everything; keyboard-only is the fast path |
| A decision that must be made before anything else (confirm, short task) | Dialog | Blocks the page on purpose; use it rarely |
| A multi-field task, or anything on a phone that would be a dialog | Sheet (drawer) | Holds longer content; the edge it slides from shows how to leave |
| A result the user can already see | No surface | The change on screen is the feedback |

Never open a dialog from a dialog. Put a menu or popover inside the first one, or replace its content. *Why: stacked modals trap focus twice and Escape becomes ambiguous.*

## Which feedback

| What happened | Feedback |
| --- | --- |
| Change is visible where the user is looking | None. Show the change |
| Action on a control (copy, save, add) | Change the control in place: a check mark, "Saved" for 2s |
| Field problem | Inline under the field; focus the first |
| Result off screen, no action needed | Toast |
| Result needs a decision or retry | Inline banner or dialog that stays until dismissed |
| Destructive and reversible | Do it, offer undo for 5s |
| Destructive and irreversible, or affects other people | Confirmation that names the action |

## Core rules

| Broken | Fixed | Why |
| --- | --- | --- |
| Arrow-key animation on menu selection or list focus | Instant change, no transition | Keyboard actions repeat hundreds of times a day |
| Escape closes the whole stack | Escape closes only the top layer | The user peels one layer at a time |
| `<div onClick>` row | `<button>` or `<a href>` | Focus, Enter, middle-click and screen readers for free |
| `onMouseEnter` selects in a list | `onPointerMove` selects | A list scrolling under a still pointer must not steal the selection |
| Submit `disabled={!valid}` | Enabled; validate on submit, focus first error | A dead button hides why it is dead |
| Toast for a delete the row already shows | Remove the row, offer undo | The visible change is the feedback |
| Spinner at 0ms | Spinner after the delay in values.md, held for its minimum | Flicker reads as a glitch |
| `onPaste={e => e.preventDefault()}` | Accept paste and clean it | Password managers and long codes need it |
| Filter in `useState` | `?status=open` in the URL | Refresh, share and Back keep working |
| `:hover` style on touch | Inside `@media (hover: hover)` | Touch leaves hover stuck after a tap |

## Exact values this skill sets

Values in `values.md` (hit areas, spinner and skeleton timing, toast pauses) apply unchanged. Values below are new here and sit in the reference that explains them.

- Toast: 4s, or 5s when it carries Undo (the undo window). Pause on hover, focus and hidden tab.
- Tooltip: 500ms delay, instant within 300ms of the last one closing.
- Drag starts after 3px (mouse, pen) or 8px (touch). Spring-load after 600ms.
- Menu opens on pointerdown for a mouse, click for everything else.

## Before you finish

Search for these and fix them. Then verify in the running app with the keyboard alone, at 390px, and with the network throttled.

| Search for | Fix |
| --- | --- |
| `onMouseEnter` selecting items, `mouseover` on a list | `onPointerMove` |
| `disabled={!` on a submit button | Enabled until the request starts |
| `onPaste`, `preventDefault` near inputs | Remove it |
| `tabindex="` with a positive number | Remove it; fix the DOM order |
| `autocomplete="off"` on a form field | Remove it, or give a real token |
| `<div onClick`, `<span onClick` | `<button>` or `<a>` |
| `toast(` right after a visible state change | Remove it |
| `Are you sure` | Undo window, or a confirm that names the action |
| `user-scalable=no`, `maximum-scale` | Remove it; use 16px inputs |
| `:hover` outside `@media (hover: hover)` | Wrap it |
| `useState` holding a filter, tab or page | Move to the URL |
| `setTimeout` closing a popover on leave | Safe triangle or a delay with pointer tracking |

Say what you could not check (a real phone, a screen reader) as "Not verified".
