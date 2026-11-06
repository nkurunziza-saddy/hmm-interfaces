# Forms

Load this when building or changing any input, form, validation or submit flow.

## Contents
- Fields
- Types, keyboards and autocomplete
- Validation timing
- Errors
- Submit
- Paste and messy input
- Pairs

## Fields

- Every control has a visible `<label>` tied with `for`/`id` or by wrapping. A placeholder is never the label. *Why: it vanishes on the first keystroke and usually fails contrast.* Placeholders show an example in the accepted format (`name@example.com`), not an instruction.
- Label and control share one hit target: a checkbox and its text sit inside one `<label>`. No dead zone between them.
- Wrap inputs in a real `<form>` so Enter submits and password managers work.
- Field width signals the expected length (a postcode field is not full width). Stack fields vertically at one width.
- Mark required with `required` plus a visible mark explained once per form. Optional is the exception: say "(optional)" on the few that are.
- Prefer choosing over typing (select, date picker, segmented control) when the set is known. Radios for 2–5 options, a select above 5.
- Never autofocus on touch (the keyboard covers the screen). On desktop autofocus the first field of a dialog, never on a page that has other content.

## Types, keyboards and autocomplete

| Field | Markup |
| --- | --- |
| Email | `type="email" autocomplete="email" spellcheck="false"` |
| Phone | `type="tel" autocomplete="tel"` |
| URL | `type="url" autocomplete="url"` |
| Name | `autocomplete="name"` (or `given-name` / `family-name`) |
| One-time code | `type="text" inputmode="numeric" autocomplete="one-time-code"` |
| Card number | `type="text" inputmode="numeric" autocomplete="cc-number"` |
| Money, decimals | `type="text" inputmode="decimal"` |
| Quantity | `type="number"` (true quantities only; never codes or IDs) |
| New password | `autocomplete="new-password"` |
| Login | `autocomplete="username"` and `current-password` |
| Search | `type="search" enterkeyhint="search"` |

- Keep autocomplete on. Give every personal-data field a real token and a meaningful `name`. Never `autocomplete="off"` on a form field. *Why: it fights password managers and autofill, and fails WCAG 1.3.5.* The command menu input is the single exception (see overlays.md).
- `spellcheck="false"` and `autocapitalize="none"` on emails, usernames, codes and URLs.
- `enterkeyhint` says what the return key does: `send`, `search`, `done`, `next`.
- Input font size is at least 16px on touch. *Why: iOS Safari zooms the page on focus below 16px and does not zoom back.* Never fix it with `maximum-scale`.

## Validation timing

| When | What |
| --- | --- |
| On blur | Format checks: email, URL, phone, required. Never before the user has left the field once |
| As typed | Only what the user can act on mid-typing: password rules ticking off, a character counter near its limit, an unavailable username after a 400ms debounce |
| Immediately | Characters the field can never accept (digits-only field). Say so, but still accept the paste |
| On submit | Everything again. This is the final authority |

- Once a field has shown an error, re-validate it as typed so the error clears the moment it is fixed. *Why: an error that waits for blur after the fix feels stuck.*
- Smart correction beats an error where the intent is clear: trim spaces; accept `+1 (555) 010-2030` and store `+15550102030`.
- Never validate an untouched field. *Why: a form that is red on arrival is hostile.*

## Errors

- Inline, directly under the field, with `aria-invalid="true"` and `aria-describedby` pointing at the message. A red border alone is never enough (colour-only cue): add the text.
- On submit with errors, **focus the first invalid field** and scroll it clear of sticky chrome. The focus move is itself the announcement for screen readers.
- A form-level error that is not about one field (network failure, permission) goes in a banner above the submit button with `role="alert"`, and the button stays enabled for a retry.
- Keep what the user typed after an error. Never clear a field or reset the form. *Why: retyping is the cost of every error.*
- Copy rules (what happened, what to do, no apology) belong to `words`.

## Submit

- The submit button stays **enabled** until the request starts. *Why: a disabled button hides why the form cannot be sent. Enabled, it can answer with errors.* A wizard's Next may stay disabled until required fields are filled only when the requirement is stated beside it.
- When the request starts, keep the label, add a spinner beside it, set `aria-disabled="true"` and ignore repeat clicks in the handler. Native `disabled` on the focused button drops focus to `body`.
- Spinner timing follows `feedback.md`. A fast request shows no spinner.
- Success: if the result is visible, show it. If the form closes, return focus to the trigger. If it stays, the button reads "Saved" for 2s in place.
- A form people use to add several records in a row (a new issue, a product, a contact) offers a **Create more** switch beside its submit. On, each save clears the form, keeps it open and focuses the first field. *Why: batch entry without reopening the form each time.*
- Warn before leaving with unsaved changes (`beforeunload` and the router guard), or autosave drafts where the data is long-lived.
- A reload or hydration never resets typed values or moves focus out of a field.

## Paste and messy input

- Never block paste (`onPaste` with `preventDefault`), never block a typed character and never filter characters as they are typed. *Why: password managers, 2FA codes and long IDs arrive by paste.* Accept free text, trim it, validate after.
- A multi-box code field takes a paste of the whole code and splits it across the boxes. One input with `inputmode="numeric"` is simpler and better.
- Never prefill a password. Never clear a field on blur.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| `disabled={!isValid}` on Save | Enabled; errors on submit, first field focused | The button explains itself |
| Placeholder "Email" as the only label | `<label>Email</label>` plus `name@example.com` | The label must survive typing |
| `autocomplete="off"` on the address field | `autocomplete="street-address"` | Autofill is a feature |
| `type="text"` for an email | `type="email"` with `autocomplete` | Right keyboard, free validation |
| 14px mobile input | 16px | iOS zooms below 16px |
| Red border and nothing else | Border, icon and text under the field | Colour is never the only cue |
| Error banner at the top, focus stays on Submit | Inline error, focus on first invalid field | Errors live by the cause |
| `onPaste` blocks paste | Paste accepted and cleaned | Paste is the fast path |
| Spinner replaces the label | Label stays, spinner beside it | The label names the busy control |
| Error on first blur of an untouched field | Validate after typing, or on submit | No red on arrival |
