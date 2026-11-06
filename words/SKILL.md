---
name: words
description: Writes and rewrites interface copy for product UI: buttons, menu items, toggles, dialogs, errors, empty states, placeholders, tooltips, toasts, links, numbers and dates. Use it whenever you write or change any visible string, even a single label, and whenever the user says copy is "vague", "inconsistent", "wordy", "too chatty" or "sounds off", or asks to review, rewrite or tighten the text in a screen or flow. It sets verb + object buttons, one name per action, error and empty-state shapes, sentence case, the ellipsis rule and microcopy length budgets, and gives a rewrite procedure with a glossary. It does not cover marketing copy or long-form writing.
---

# Words

Interface words are design content. Each string does one job: say what will happen, what happened, or what to do next. This skill decides the words in the same order every time.

Before any decision, apply `product-ui` §1 (the taste journal and precedence) and §5 (which skill owns what).

Surface check: marketing pages, posters and long-form writing are not covered. A landing page needs a different voice.

## Decide in this order

For every string:

1. **Job.** Is it an action, a state, a result, a problem, an explanation, or an empty place? Name it. The job picks the shape in the table below. *Why: most bad copy is a string written without knowing its job.*
2. **Reader and moment.** Who reads it, where their eyes are, what they just did. Tone follows the moment (see Tone).
3. **Shape.** Use the pattern for the job. Load [references/patterns.md](references/patterns.md) for dialogs, errors, empty states, toasts, tooltips and the Vague → Plain table.
4. **Vocabulary.** Use the product's existing word for each object and action. Check the glossary. Never add a synonym.
5. **Cut.** Remove every word that does no work. Put the important word first. Check the length budget in [references/formatting.md](references/formatting.md).
6. **Format.** Sentence case, curly quotes, `…` only where the rule allows, non-breaking spaces in numbers, dates and units. Load [references/formatting.md](references/formatting.md).

## Shapes

| Job | Shape | Example |
| --- | --- | --- |
| Action | Verb + object | Save changes, Invite teammate |
| Confirm button | The same verb + object as the thing it confirms | Delete project (next to Cancel) |
| Toggle | Named for its on state | Send read receipts |
| State or result | Object + past participle | Changes saved, Invite sent |
| Error | What happened + what to do | Couldn’t save. Check your connection and try again. |
| Empty state | What belongs here + one action | No projects yet. Create a project |
| Link | Where it goes | Read the billing docs |
| Tooltip | Verb first, no control name | Restore default settings |
| Search placeholder | What is searchable, with `…` | Search projects… |

## Rules

| Broken | Fixed | Why |
| --- | --- | --- |
| Submit, OK, Yes, Continue (alone) | Save changes, Delete project, Send invite | The button tells what happens |
| Create project … then toast “Project added” | Create project … “Project created” | One label per action through the whole flow |
| Disable read receipts (toggle) | Send read receipts | People infer off from on; a negative toggle is a double negative |
| Oops! Something went wrong. | Couldn’t save. Check your connection and try again. | Say what happened and the next step |
| Sorry, we couldn’t load your data | Couldn’t load projects. Refresh to try again. | No apology; name the thing |
| Invalid input | Enter an email like name@example.com. | Say how to fix it |
| No data | No projects yet. Create a project. | Say what belongs here and offer one action |
| Save Changes | Save changes | Sentence case everywhere |
| Loading… | (a skeleton, or nothing) | Never write “Loading…” |
| Rename (opens a dialog) | Rename… | The ellipsis means “needs more input” |
| Search | Search projects… | A placeholder says what is searchable |
| Click here to see pricing | See pricing | The link says where it goes |
| The user can edit it | You can edit it | Address the reader as “you” |
| 5MB, 3 PM | 5 MB, 3 PM with a non-breaking space | Number and unit never split across lines |
| 4,000+ teams trust us | (cut it) | Never invent stats or placeholder metrics |

## Ellipsis rule

The ellipsis `…` (one character) appears in exactly two places:

1. The **search placeholder**: “Search projects…”.
2. A **command that needs more input before it runs**: “Rename…”, “Export…”, “Move to…”.

Never in “Loading…”, “Saving…”, other placeholders, truncated labels, or as drama (“Well…”). A command that runs at once has none: “Copy link”, “Archive”.

## Tone adapts to the moment

| Moment | Tone | Does |
| --- | --- | --- |
| Error | Calm, plain, no playfulness | States the fact and the fix; no exclamation marks, no “oops”, no “sorry” |
| Data loss, security | Serious, explicit | Names what is lost and what cannot be recovered |
| Success | Brief | “Changes saved.” Not “Successfully saved your changes!” |
| Routine action | Neutral, minimal | The shortest string that works |
| First run, milestone, empty state | May be warm | One light sentence, once |

## Never invent

Never write stats, counts, user numbers, testimonials, ratings, trend arrows or sample metrics that the data does not supply. A placeholder number reads as a real one. Use real data, or leave the element out, or show “—” only for a truly missing value in a table. Placeholder names in examples use `example.com` and plainly fake names.

## The rewrite procedure

For a screen, flow or diff:

1. **Find every string.** Search the code and locale files (`t(`, `i18n.`, `$t(`, JSX text, `aria-label`, `placeholder`, `title`, `alt`). Include strings from the server or a CMS you can see. Note any you can't see as “Not verified”.
2. **Classify.** Give each string a job from the Shapes table and a surface (button, error, toast…). Put them in a table: location, text, job.
3. **Build the glossary.** List the noun for each object and the verb for each action as the product uses them today: project vs workspace, delete vs remove. Pick one per concept. Write it down; load [references/patterns.md](references/patterns.md#glossary) for the format. Check `~/.claude/taste.md` for settled terms.
4. **Rewrite.** Each string in its shape, with the glossary term. Strings in one flow are rewritten together so labels stay identical.
5. **Check the flow.** Read the whole path aloud, trigger → dialog → confirm → result. Same verb and object at each step. Compare adjacent screens.
6. **Report** a before/after table with the reason (the rule broken) and the glossary decisions. Say which strings you could not see.

## Before you finish

| Search for | Fix |
| --- | --- |
| `Submit`, `>OK<`, `>Yes<`, `>No<`, `Continue` on its own | Verb + object |
| `Are you sure` | Name the action: “Delete project?” |
| `Oops`, `Sorry`, `Something went wrong`, `!` in error text | What happened + what to do |
| `Loading…`, `Loading...`, `Saving…` | Skeleton or no text |
| `...` (three dots) | `…`, and only where the ellipsis rule allows |
| Title Case in a label, heading or menu | Sentence case |
| `Click here`, a link that says `here` or `Learn more` alone | Name the destination |
| `the user`, `users can` | `you` |
| `Disable`, `Don't`, `Hide` at the start of a toggle label | Name the on state |
| `successfully` | Cut it |
| `5MB`, `10 AM`, `⌘K` with a normal space | `&nbsp;` or ` ` |
| Round invented numbers in copy or mock data | Real data or remove |
| Two names for one thing (`Delete` and `Remove`) | One term, in the glossary |

Verify by rendering the screen and reading each string in place.
