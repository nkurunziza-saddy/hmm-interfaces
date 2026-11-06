---
name: taste-journal
description: Records the user's design taste so every design skill follows it next time. Use it when the user states a preference ("always", "never", "I prefer", "remember this", "make it a rule"), picks one design option over others, rejects or reverts a design change, or corrects the same visual detail twice. Also use it when asked what the user's taste is, or to show, tidy or summarise the taste journal.
---

# Taste journal

The journal is how taste grows. It records what the user keeps, what they kill and why, and the rules they state, so the next design decision starts from their taste instead of the defaults.

## Where it lives

| File | Holds |
| --- | --- |
| `~/.claude/taste.md` | The user's taste in general: how things should feel in any product |
| `.claude/taste.md` (project root) | This product only: brand, density, domain exceptions, overrides |

Precedence: **project > global > skill defaults**.

Choose the file by asking whether the preference is about this product or about how the user likes things to feel. A product's accent colour goes in the project file. "I hate bouncy motion" goes in the global file. If you can't tell, ask in one short question.

Create a missing file from [references/template.md](references/template.md).

## When to write

| Signal | Write |
| --- | --- |
| The user states a rule ("always…", "never…", "remember…") | A **Rule**, straight away |
| The user picks one option out of several | One **Kept** line, plus a **Killed** line for each option they rejected that came with a reason |
| The user reverts or rejects a design change | A **Killed** line with their reason. If no reason was given, ask once and briefly. |
| The same correction a second time | Propose a **Rule** in one sentence and write it once they confirm |
| A one-off reaction ("hmm, not sure") | Nothing |

Never turn a single offhand reaction into a rule. *Why: a rule binds every future decision, so it needs either an explicit statement or a repeated correction.*

## How to write

- **One rule is one line**: the rule with exact values, `·` the why, `·` the date. For example: `Hover on nav lists is instant, no transition · fades felt laggy when sweeping · 2026-11-06`.
- **Strict, not soft.** "Menus open in 150ms" is a rule; "keep menus snappy" is not. If the user was vague, ask for the value, or write down the value they picked in the comparison.
- **One home per rule.** Before writing, search the file for the same topic. If a new rule contradicts an old one, replace the old one and tell the user which one was replaced.
- **Kept and Killed name the thing, not just the verdict.** For example: `Killed: spring with 0.3 bounce on dialog open · "feels toy-like"`.
- After writing, tell the user in one line what was recorded and in which file.

## Keep it small

- Rules: 60 lines at most. Past that, merge rules that overlap.
- Kept and Killed: the latest 30 entries each. Fold older entries into the Summary, then delete them.
- **Summary**: rewrite it after every 5 new entries. It covers easing and speed, density, colour use, type, playfulness, and anything the user consistently rejects. Each line comes from the entries, never invented.

*Why: every design skill reads this file first, and a long file dilutes the rules that matter.*

## Don't narrow the taste

When a design skill generates options, one of every 3–5 sits deliberately outside the Summary. *Why: leaning only toward past picks collapses the taste into one style, and the wildcard shows whether the taste has moved.*

## Reading it back

When asked what the user's taste is, answer from the Summary and Rules, citing the file. Don't add your own opinions.
