# Formatting, numbers, dates and length budgets

Load this when a string contains a number, date, unit, shortcut or quote, or when you need a length limit.

## Contents
- Case
- Punctuation
- Numbers and units
- Dates and times
- Plurals and building strings
- Length budgets
- Front-loading
- Voice
- Pairs

## Case

- Sentence case for everything: buttons, menu items, headings, tabs, column headers, dialog titles, tooltips. Proper nouns and acronyms keep their capitals. *Why: one rule needs no per-element decisions, and it reads like speech.* This overrides house styles that use Title Case.
- Store text in natural case and use `text-transform` only for display (`type` owns that). Never `text-transform: capitalize` on labels.
- Never ALL CAPS in a sentence. Uppercase labels at 14px or smaller are a `type` decision with tracking.

## Punctuation

- Ellipsis `…` (U+2026, one character, never `...`): only in the search placeholder and on commands that need more input (see SKILL.md).
- Curly quotes `“ ”` and apostrophes `’`. En dash for ranges (`10–20`). No em dashes in labels; use a comma or a full stop.
- No exclamation marks in UI text, except a deliberate milestone moment, once.
- Short labels and buttons have no end period. A complete sentence in a body, helper text, error or toast ends with one. A mix of both in one list is a bug.
- `&` only where space is truly tight (a tab bar label); “and” otherwise.
- Don’t explain the button in the dialog body (“Click Delete to remove”). The button already says it.

## Numbers and units

- Numerals for counts: “8 deployments”, not “eight”. Under 10 may be words in long prose only, never in UI.
- A non-breaking space (`U+00A0`, `&nbsp;`) between a number and its unit: `10 MB`, `5 min`, `24 °C`, `3 of 12`, `⌘ K`, `Ctrl S`. And inside a currency or a name that must not split: `€ 20`, `Pro plan`. *Why: “10” alone on one line and “MB” on the next reads as two things.*
- Group digits by locale with `Intl.NumberFormat`, never by hand. Currency, percent and unit all go through it.
- Put a unit on every number whose unit isn’t obvious: “4.5 hours a week”, “12 MB”. A bare number in a column header carries its unit once, in the header.
- Align changing numbers with `tabular-nums` (`type` owns it).
- Use the real value. Never round a number into false precision, never invent one (“Over 10,000 teams”).
- Ranges: `10–20 MB` (unit once, after the range).

## Dates and times

- Format with `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`, using the user’s locale. Never hand-build “Jun 3” or “3/6”.
- Relative for the recent past (“2 minutes ago”, “yesterday”), absolute after about a week (“3 Jun”, “3 Jun 2026” when the year differs). Put the absolute date in a `title`/tooltip and a `<time datetime>` element.
- Show the year only when it isn’t the current year.
- Times: the user’s 12 or 24-hour preference by locale. Non-breaking space before AM/PM (`3 PM`). Show a time zone when users in different zones share the data (`14:00 UTC`).
- Future deadlines name the date (“Due 3 Jun”) and, when urgent, the relative remainder (“Due tomorrow”).
- Date range: `3–5 Jun`, not `3 Jun – 5 Jun`, when the month matches.
- Ambiguous numeric dates (`03/06`) never appear in UI.

## Plurals and building strings

- Write each sentence as one message with placeholders; never glue fragments around a variable (`"You have " + n + " messages"`). *Why: word order changes by language.*
- Use `Intl.PluralRules` or ICU `plural` for singular/plural. `n === 1 ? "" : "s"` is a bug (zero, few, many).
- Lists via `Intl.ListFormat` (“Ana, Ben, and Cy”).
- Zero is a state, not a plural: “No messages”, not “0 messages”.

## Length budgets

Counted in characters, spaces included. Longer text is a sign the job is wrong, not a reason to shrink the font.

| String | Budget |
| --- | --- |
| Button, tab, menu item | 1–3 words, 24 characters or fewer |
| Toggle or setting label | 40 characters or fewer |
| Tooltip | 60 characters or fewer |
| Toast | 60 characters or fewer, one line |
| Field label | 30 characters or fewer |
| Helper text under a field | 80 characters or fewer, one line |
| Error message | 140 characters or fewer, 2 sentences |
| Dialog title | 60 characters or fewer, one line |
| Dialog body | 2 sentences |
| Empty-state heading | 40 characters or fewer |
| Empty-state body | 120 characters or fewer |
| Section or page heading | 40 characters or fewer |
| Search placeholder | 40 characters or fewer |

- Leave room: strings in German or Finnish run about 30% longer. Layout must survive that (`layout` owns it).
- If a string won’t fit, cut a word before changing the container.
- Truncate with a way back to the full text (tooltip or expand). Truncate filenames in the middle: `quarterly-rep…-v3.pdf`.

## Front-loading

Put the word that matters first. People scan the start of each line, so the start decides whether they read the rest.

| Broken | Fixed | Why |
| --- | --- | --- |
| Click the button to delete the project | Delete project | Verb leads |
| Your changes could not be saved | Couldn’t save changes | Failure leads |
| To invite a teammate, enter an email | Invite a teammate by email | Action leads |
| Notifications settings page | Notification settings | Object leads |
| Are you sure you want to delete? | Delete project? | Action leads |

## Voice

- “You” for the reader, never “the user”. “Your” only when it separates yours from someone else’s (“Your projects” vs “Shared with you”); otherwise “Projects”.
- Avoid “we” in errors and states. First person is acceptable in a short onboarding sentence that the product, not a person, speaks.
- Active voice: “Delete the project”, not “The project will be deleted”.
- Plain words. No idioms, humour or metaphors that won’t translate. No gendered terms.
- Match the device: “tap” on touch, “click” with a mouse, “select” when both apply.
- Read it aloud. Repetition and awkwardness surface.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| `10MB` | `10 MB` (non-breaking) | The number and unit stay together |
| `Settings > Notifications` | “Notification settings” link | Link to it |
| “Saved 3 hours ago on 06/03/2026” | “Saved 3 hours ago” with the full date in a tooltip | One scan unit |
| `1 files` | `1 file` via `Intl.PluralRules` | Hand-built plurals break |
| `Save Changes` | `Save changes` | Sentence case |
| `Loading...` | Skeleton | No loading text |
| “Over 10,000 happy teams” | (removed) | Never invent proof |
