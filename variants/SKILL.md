---
name: variants
description: Builds 3 to 5 genuinely different versions of one UI piece behind a small picker, with the pick saved in the URL as ?v=, so the user can flip between them and choose. Use it when the user types /variants, or asks for "options", "a few directions", "different takes", "explore this", "show me alternatives" or "I can't decide how this should look" for a card, form, menu, empty state or screen section. After the pick it records the choice in the taste journal, promotes the winner and deletes the rest.
disable-model-invocation: true
---

# Variants

Before any decision, apply `product-ui` §1 (the taste journal and precedence) and §5 (which skill owns what). Here the journal also decides which variant is the wildcard.

## Hard rules

1. **One piece per run.** If the brief spans a dashboard, pick the one highest-leverage piece, say which, and offer the rest as later runs. *Why: a picker over a whole page can't be judged.*
2. **Variants differ on a named axis.** Before building, state each variant's axis in a phrase: layout, density, interaction model, information hierarchy, motion story. *Why: the user learns nothing from flipping between near-identical options.*
3. **Every variant fully works** with real copy, real interactions and all its states. No lorem ipsum, no dead buttons. *Why: an unfinished variant loses on execution and says nothing about its direction.*
4. **Variants use the project's tokens.** They must look like they could ship tomorrow. The picker follows the page's theme too: the project's own tokens, in light and dark. See [references/picker.md](references/picker.md). *Why: a bar in fixed colours looks wrong on one of the two themes.*
5. **Nothing touches production code until the pick.** Build in a temporary route or file. *Why: exploration must be free to throw away.*
6. **Never choose for the user.** Present, say when each wins and what it costs, and stop.

## Divergence rules

| Test | If it fails |
| --- | --- |
| Two variants differ only in colour, copy, radius or spacing | They are one variant. Replace one with a different layout or interaction model |
| Two variants share the same axis position | Replace one |
| A variant is the existing design with one change | Cut it; the user already has that |
| You can't say what the variant is better at | Cut it |
| Two converge while you build (you copied code between them) | Cut one now and say so in the report. Two distinct beat four padded |

Default to 3 variants. Use 4–5 when the user asks or the design space is wide. Never more than 5. *Why: past 5 the comparison is a chore.*

Names describe the direction ("Grouped", "Presets", "Sentence"), never "A, B, C".

## The wildcard

Of every 3–5 variants, exactly one sits deliberately outside the journal's Summary. *Why: leaning only toward past picks collapses taste into one style, and the wildcard shows whether it has moved.*

1. Read the Summary in `~/.claude/taste.md` and `.claude/taste.md`.
2. Pick the axis the Summary leans on hardest (for example "dense, low motion, borders") and build the opposite end of it, still inside the `product-ui` restraint rules.
3. Mark it in the report table as the wildcard. Never mark it in the picker, so the user judges it blind.
4. With no journal, make the wildcard the variant furthest from the project's existing pattern.

The wildcard still passes the craft floor in `product-ui`. It breaks the user's habits, not the rules.

## Workflow

1. **Scope.** Restate the brief in one sentence: what the piece is, where it lives, what it must do. Name the user's next action on it (`product-ui` step 1).
2. **Recon.** Read the stack, styling system, tokens (colour, radius, space, type, easing), the neighbours the piece sits beside, and its background.
3. **Choose directions.** Write the list first: name, axis, and the wildcard. Apply the divergence table. Done when no two share an axis position.
4. **Build the harness.** In a project: a temporary route (`/__variants/<slug>`), one file per variant, one small harness. Without one: a single HTML file. Render one variant at a time at full size in realistic context (the page behind it, the siblings beside it). Never show thumbnails. Add the picker from [references/picker.md](references/picker.md); the pick lives in `?v=`.
5. **Verify.** Flip through every variant. Each one renders, each interaction responds, the console is clean. Screenshot each at 1280 and 390.
6. **Present** this table and stop:

| # | Variant | Axis | Wins when | Costs |
| --- | --- | --- | --- | --- |
| 1 | Grouped | Layout: by channel | Many settings | Longer to scan |
| 4 | Sentence | Interaction: wildcard | Few, rare changes | Unfamiliar |

Add the URL and the keys to flip. If asked which you would choose, answer from the product's personality and how often the piece is used, never from looks alone.

## When the user picks

1. **Journal.** Hand off to `taste-journal`:
   - One **Kept** line naming the variant and its axis, with the user's reason if they gave one.
   - One **Killed** line per rejected variant that came with a reason.
   - Ask once, in one line: "Any reason for dropping the others?" If they decline, write Kept only. *Why: a reason makes the entry a rule candidate; a guess pollutes the journal.*
   - If the wildcard won, say so in the Kept line; that is the strongest signal the taste has moved.
2. **Promote.** Move the winner into the codebase using the project's file layout, naming and tokens. Strip the harness props.
3. **Delete the rest.** Remove the other variants, the picker, the temporary route and every `?v=` read. Search for `variants`, `__variants` and `data-variant` to confirm. Keep the harness only if the user says so.
4. **Another round?** Keep the harness and diverge around the direction they leaned toward, with a fresh wildcard.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| Three cards with different border colours | Card with tabs, card with a list, card with a sentence | The axis changed, not the paint |
| Picker hard-coded to `#161616` and `#3a3a3a` | Picker on the page's surface, text and border tokens | It follows light and dark with the page |
| A fourth variant that is variant 2 with a bigger heading | Cut it, report three | Padding hides the real choice |
| The wildcard labelled "Wild" in the picker | Unlabelled; named only in the report | A label biases the pick |
| `?variant=2` lost on reload | `?v=` read at load and written on change | Every option stays a link |

## Before you finish

- Each variant has a stated axis, and no two share a position.
- One wildcard, outside the Summary, unlabelled in the picker.
- Search production code for `?v=`, `data-variant`, `__variants`: none left after the pick.
- Journal updated (Kept, and Killed where a reason was given).
