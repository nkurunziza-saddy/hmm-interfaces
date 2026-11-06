# Feedback, toasts, undo, tooltips and loading

Load this when an action needs a response: saving, deleting, copying, loading, hovering for help.

## Contents
- Feedback near the trigger
- Optimistic updates and rollback
- Undo vs confirmation
- Toggles
- Toasts
- Tooltips
- Loading
- Pairs

## Feedback near the trigger

Put the response where the eye already is: on or beside the control that was used. A copy button swaps its icon for a check mark for 2s. A save button reads "Saved". A bad field shows its message under itself. *Why: a toast across the screen makes the user look away to learn what they already did.*

- Announce the change to assistive tech through a polite live region (`role="status"`), mounted empty and then filled. A toast mounted with its text may be missed.
- Use a second channel besides colour: icon, text or position.
- Confirm success mainly for important tasks (payment, publish). Routine saves say nothing or "Saved" in place. Failures always speak.
- When a command cannot run, say why next to it: "Add a payment method to publish".

## Optimistic updates and rollback

- Update the UI at once for actions that almost always succeed (toggle, rename, reorder, star). Send the request in the background.
- On failure, **roll back** to the previous state and say so near the control: "Couldn't save. Try again." Never leave a state on screen that the server rejected.
- Never go optimistic for payments, deletes of shared things, or anything that sends a message to another person.
- Serialize requests per object, so a fast second change cannot be overwritten by a slow first response.

## Undo vs confirmation

| The action | Do |
| --- | --- |
| Reversible and common (archive, delete a row, move) | Do it now. Show "Deleted. Undo" for **5s**, support Cmd/Ctrl+Z |
| Irreversible, one item | Confirmation naming the action and the object |
| Irreversible, many items or affects other people | Confirmation that states the count or the people; for an account or workspace, type the name to confirm |
| Expected loss (emptying a trash the user opened for that) | No confirmation |

- Undo returns the item to its old place, selects it and scrolls it into view. *Why: otherwise the user thinks nothing happened and repeats the action.*
- Name the target in the shortcut label ("Undo delete row"), not just "Undo".
- A pending delete is applied after the window closes or when the user leaves, never lost on navigation.
- Never confirm a common undoable action. *Why: the dialog is read once and then clicked through, so it protects nobody.*
- The confirm button names the action ("Delete project") and Cancel is the default focus. See `words`.

## Toggles

A toggle takes effect the moment it changes. No Save, no Apply, no confirmation. It updates optimistically and rolls back on failure. If the change is risky, it is not a toggle: use a button that leads to a confirmation. A toggle in a form that submits later is a checkbox.

## Toasts

- A toast reports a result that **needs no action** and is not already visible: "Link copied" to the clipboard (when no button can change), "Export started", a background job finishing. Anything that needs action (retry, review, upgrade) stays until dismissed and is not a toast.
- Duration 4s (Sonner's default). Pause on hover, on focus within, and while the tab is hidden; resume with the remaining time. *Why: a toast that vanishes while the user reads it, or while they are on another tab, is a lost message.*
- One line, 60 characters or fewer. Past that, the result belongs inline.
- At most 3 visible. Newer ones push older ones back; identical messages update instead of stacking (stable `id`).
- Bottom centre on mobile, bottom right on desktop. At the document root, above modals. Swipe to dismiss in the direction it entered.
- An Undo action in a toast is the only action allowed. It must be reachable by keyboard, so give the region a documented shortcut.
- Never a toast for a form error, a validation message, or a state change visible on screen.
- Use Base UI Toast when a library is wanted. Its good defaults: one provider and viewport at the root, a toast added from anywhere, pauses when hidden, timers survive stacking.

## Tooltips

- A tooltip describes the single control under the pointer. It starts with a verb, never repeats a visible label (on an icon-only control the tooltip is the visible name, so it names the action), and is 60 characters or fewer: "Restore default settings".
- It opens after **500ms** of hover or on keyboard focus. Once any tooltip has been open, neighbours open **instantly with no animation** for 300ms after the last one closes. *Why: the delay stops accidental pops, and the grace period makes a toolbar sweep feel fast.*
- Hover-only content never holds a link, button or anything interactive. Needs interaction? Use a popover.
- Escape closes it. Moving the pointer onto the tooltip keeps it open (it is hoverable). It never covers its trigger.
- **Never on a disabled button.** *Why: disabled buttons receive no focus or hover events, so keyboard and touch users never see it.* Explain beside the button instead, or leave it enabled and explain on press.
- Truncated text always has a way back to the full text; a tooltip is the cheapest.
- On touch, no tooltips. Put the information visible, or in the long press menu.
- Shortcut hints go in the tooltip as a `kbd` chip.

## Loading

- Show something at once when you can: cached data, a skeleton of the final layout. Keep the page interactive while it loads.
- A spinner or skeleton appears only after the delay in `product-ui/references/values.md` (States and feedback), then stays for its minimum hold. *Why: a fast load beats the delay, so nothing flashes; a shorter hold looks like flicker.*
- Skeletons match the final layout's size and rhythm so nothing jumps when data arrives. Reserve the space; use fixed heights or `aspect-ratio`.
- Do not switch from spinner to bar style midway. Determinate progress when the length is known; evenly paced; never a bar that sits at 90%.
- A button that starts a slow action keeps its label, shows a spinner beside it, and changes the label to the in-progress form only if `words` allows ("Saving"). No bare "Loading".
- Updates that arrive within 150ms of the last one skip animation and jump (`values.md`).
- Offer Cancel when interrupting is harmless. If cancelling loses progress, confirm first.
- If it stalls, say why and what to do next.
- Respect the network: errors from a request that failed show what to do (retry) and keep the old content visible if there is any.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| Toast "Copied!" far from the button | Check mark on the button for 2s | Feedback by the trigger |
| Toast "Task deleted" after the row vanished | Row removed, "Deleted. Undo" for 5s | One signal, with a way back |
| "Are you sure?" before every row delete | Delete now, undo window | Confirmation is skipped by habit |
| Optimistic toggle never reverts on error | Rolls back, message by the toggle | The UI must not lie |
| Toggle plus Save button | Toggle applies immediately | A toggle is a switch, not a form field |
| Toast timer keeps running on a hidden tab | Paused until visible | The message must be read |
| Tooltip on a disabled button | Text beside it, or enabled with an explanation on press | Disabled buttons give no events |
| Every tooltip waits 500ms | First waits, neighbours instant | The toolbar feels faster |
| Spinner at 0ms for a 120ms request | No spinner; delay and hold per values.md | Flicker reads as a glitch |
| `if (loading) return null` | A skeleton | Blank is the worst loading state |
