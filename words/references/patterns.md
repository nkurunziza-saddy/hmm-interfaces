# Copy patterns

Load this when writing a dialog, error, empty state, toast, tooltip, flow or glossary.

## Contents
- Buttons and flows
- Confirmation dialogs
- Errors
- Empty states
- In-progress and done
- Toasts and tooltips
- Links
- Toggles and settings
- Vague → Plain
- Glossary
- Pairs

## Buttons and flows

- A button is a verb + the object: “Save changes”, “Invite teammate”, “Delete project”. 1–3 words. *Why: people scan buttons, not the text around them.* A bare verb is fine when the object is the screen itself (“Save” in an editor, “Send” in a composer).
- Never “Submit”, “OK”, “Yes”, “No”, “Confirm”, “Click here”, “Learn more”, “Get started” with nothing after it, or “Continue” alone when something specific happens.
- One label per action through the whole flow. The menu item, button, dialog title, confirm button, toast and Undo all use the same verb and object. “Archive project” → dialog “Archive project?” → button “Archive project” → toast “Project archived”.
- Past tense of the verb for the result (“Archived”), never a synonym (“Moved to storage”).
- Multi-step flows: one forward word chosen once (“Continue” or “Next”), the final step names the outcome (“Create project”), “Done” only to close.
- The primary button answers the question the title asks, and Cancel answers “no”.
- Icon-only buttons carry an `aria-label` that names the action (“Delete project”), never the glyph (“Trash icon”).

## Confirmation dialogs

Shape: **title** names the action and the object as a question; **body** says what is lost, counts and people included (omit it when the title says it all); **buttons** are `Cancel` and the action.

| Situation | Title | Body | Buttons |
| --- | --- | --- | --- |
| Irreversible, one item | Delete “Q3 report”? | This permanently deletes the report and its 4 comments. | Cancel, Delete report |
| Many items | Delete 12 files? | You can’t undo this. | Cancel, Delete 12 files |
| Affects people | Remove Priya from Design? | She loses access to 14 projects. | Cancel, Remove Priya |
| Account or workspace | Delete the Acme workspace? | Type acme to confirm. All projects and members are removed. | Cancel, Delete workspace |

- Never “Are you sure?”. Never “Yes” / “No”. Never “OK” / “Cancel”.
- Cancel is always called “Cancel”. If there is one button and it is also the default, call it “Done”.
- A reversible action gets no dialog; it gets an undo toast (“Project archived. Undo”).

## Errors

Shape: **what happened** (specific), then **what to do** (the fix, or the next action). Two sentences at most, 140 characters or fewer. *Why: the reader is blocked, so every word must unblock.*

- No apology (“Sorry”), no “Oops”, no “Uh-oh”, no exclamation mark, no blame (“You entered…”). Avoid “we” (“We couldn’t…”): state the fact.
- Never vague (“Something went wrong”, “Error”, “Invalid input”, “Failed”). Name the object and the cause when known.
- Put it beside the problem. Use the field’s noun: “Email”, not “this field”.
- Offer the fix as the button when one exists: “Add payment method” beats “OK”.
- If the same error keeps coming back, change the interaction, not the text.
- Constraints shown before the error, as helper text (“At least 8 characters”), so the error is rarely needed.

| Broken | Fixed |
| --- | --- |
| Invalid email | Enter an email like name@example.com. |
| That password is too short. | Use at least 8 characters. |
| Oops! Something went wrong. | Couldn’t save changes. Check your connection and try again. |
| Error 403 | You don’t have access to this project. Ask an admin to add you. |
| Payment failed! | Your card was declined. Use a different card or contact your bank. |
| Upload failed | report.pdf is 28 MB. The limit is 25 MB. |
| Sorry, we couldn’t find that page | This page doesn’t exist. Go to your projects. |

## Empty states

Shape: **what belongs here** + **one action to start**. Optionally one sentence on how the place fills. *Why: an empty screen is a first step, not a dead end.*

- Heading: a noun phrase, 40 characters or fewer (“No projects yet”). Body: one sentence, 120 characters or fewer. One button.
- The button names the action (“Create project”), the same label as the “New” button elsewhere.
- A filtered empty state names the query and offers an exit: “No results for “quarterly”. Clear filters”.
- “No data”, “Nothing here” and “Empty” say nothing. A first-run empty state may be warm, once.
- Never park information that disappears once content arrives (it is gone when it matters).
- Hide an empty section instead of explaining its emptiness when it isn’t needed (`product-ui` step 2).

## In-progress and done

- In-progress on a button: the verb in `-ing`, no ellipsis: “Saving”, “Deleting project”. Keep the spinner beside it. Never a bare “Loading”. A skeleton needs no text.
- Done: the object + past participle, no “successfully”: “Changes saved”, “Invite sent to sam@example.com”.
- Failed: see Errors. Partial: both counts: “9 of 12 files uploaded. Retry 3 failed files”.
- Parallel pairs: “Saving” → “Saved”.

## Toasts and tooltips

- Toast: one line, 60 characters or fewer, the result only: “Link copied”, “Export started”. An Undo action may follow. It never carries a question or a decision.
- Tooltip: starts with a verb, no article if it can go, never repeats the control’s name, sentence case, 60 characters or fewer: “Restore default settings”, not “Click here to restore the default settings”. If it needs more, simplify the control.
- Shortcut hints go in a `kbd` chip, not in the sentence.

## Links

- Link text describes the destination and makes sense out of context: “Read the billing docs”, “See all invoices”. Screen-reader users navigate by the list of links.
- Never “here”, “this page” or a bare “Learn more”. If two appear on a page, add the topic: “Learn more about exports”.
- Link directly to a setting; don’t describe the path. “Notification settings”, not “Go to Settings > Notifications > Email”.
- A link navigates (`<a>`); a button acts. Words follow: links name places, buttons name actions.

## Toggles and settings

- Name a toggle for what happens when it is on: “Send read receipts”, “Show completed tasks”. Off is the inverse and needs no label.
- Never “Enable”, “Disable”, “Don’t” or “Hide” as the first word of a toggle. A toggle that reads “Don’t send read receipts” is a double negative when off.
- Settings labels are noun phrases or verb phrases, practical and short. Helper text under a setting: one line, 80 characters or fewer, what changes.
- Menu toggle items that change label with state name the action: “Hide sidebar” / “Show sidebar”.

## Vague → Plain

| Vague | Plain | Why |
| --- | --- | --- |
| Submit | Save changes | Says what happens |
| Get started | Create account / Create project | Names the outcome |
| Learn more | Read the setup guide | Names the destination |
| Oops! Something went wrong | Couldn’t save. Try again. | Names the failure and fix |
| Are you sure? | Delete 3 files? | Names the action |
| Yes / No | Delete file / Keep file | Verb + object |
| Click here | See pricing | The link is the action |
| Something happened | Invite sent | Names the result |
| Please wait | Importing 214 contacts | Names what is running |
| N/A | — (only in a table cell with no data) | A dash is quieter |
| Manage notifications | Notification settings | Say what it is |
| Utilize / leverage | Use | Plain words |
| An error occurred | Couldn’t load invoices | Names the object |
| Enable dark mode | Dark mode | A toggle is named by its on state |
| Your projects (heading) | Projects | Skip possessives that add nothing |

## Glossary

Keep a table of product terms and use it for every string. Put it in the report. If the project has a style doc or `.claude/taste.md`, the glossary lives there.

Example (replace with the project’s real terms):

| Concept | Use | Never | Notes |
| --- | --- | --- | --- |
| A top-level container | project | workspace, space, folder | Chosen from existing UI |
| Remove from the app for good | delete | remove, trash, destroy | “Remove” only for removing a member from a group |
| Hide without deleting | archive | hide, move to storage | |
| Add a new item | create | add, new, make | Button “Create project”; “New” only as a menu section |
| A person in your team | teammate | user, member, colleague | |

Rules for the glossary:
- One noun per object, one verb per action. If the code has two, pick the one the UI already shows the most.
- A word for a concept never doubles for another (“Remove” for both delete and detach is a bug).
- Use the glossary in aria-labels, toasts, errors, tooltips and empty states, not only buttons.
- Name things by what users understand, never by how the system is built: “Notifications”, not “webhook config”.
- Keep brand names, code tokens and identifiers untranslated (`translate="no"`).

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| “Create project” → toast “Project added” | “Create project” → “Project created” | One label per action |
| “Delete account?” with “Yes” and “No” | “Delete account?” with “Delete account” and “Cancel” | Buttons name the action |
| “Oops! We’re sorry, something went wrong!” | “Couldn’t send message. Try again.” | No apology, no vagueness |
| “Nothing to see here” | “No invoices yet. Create an invoice” | An empty state gives a first step |
| “Disable notifications” toggle | “Send notifications” toggle | Name the on state |
| “Click here to learn more” | “Read the export guide” | Link names the destination |
