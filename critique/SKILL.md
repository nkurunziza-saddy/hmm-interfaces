---
name: critique
description: Reviews existing product UI (a screen, component, flow or diff) against the user's taste and the `product-ui` skill's values, and returns numbered findings backed by evidence, ranked by severity, with a before/after fix for each. Use it when the user asks to review, critique, audit or polish an interface, says something "feels off", "looks cheap" or "isn't right", or wants a design check before shipping. It reviews only; it fixes nothing until the user picks which findings to fix.
---

# Critique

A review that changes the user's mind needs evidence, not opinion. Every finding here points at something visible or measurable, says why it matters, and gives the exact fix. Default to flagging: approval is earned.

## 1. Set up

1. **Scope.** Name what is under review: a file, component, route or diff. If it's a diff, review only what the diff introduced or regressed.
2. **Taste.** Read `~/.claude/taste.md` and the project's `.claude/taste.md`, then the `product-ui` skill's `references/values.md`. A journal rule outranks a default. A deliberate, consistent project convention (no shadows, say) is a preference, not a finding. The same thing done two ways is a finding.
3. **Evidence.** Run the app if you can and capture screenshots at 2× in light and dark mode, plus every state you can reach: hover, focus, pressed, empty, loading, error, and long or missing data. Use whatever browser tool the session provides. Read the code for values: durations, curves, colours, spacing and radii. Anything you couldn't see or run goes in **Not verified**. Never pass it off as checked.

## 2. Walk the lenses in order

Go in this order, because the earlier lenses decide whether the later ones matter. Polishing a shadow on a screen with no clear primary action is wasted work.

1. **Job and hierarchy.** Is there one obvious next step? Does the right thing read first? Are two things competing?
2. **Structure.** Grouping (more space around groups than within), alignment (a 1–4px miss is a bug), siblings that don't match, nested cards.
3. **Type.** Too many sizes or weights, line-height wrong for the role, missing `tabular-nums` on changing numbers, weight changing on hover, broken wrapping or truncation with no way back.
4. **Colour.** More than one accent, hue used to rank importance, contrast against the real surface, grey on colour, colour as the only signal.
5. **Surfaces and states.** Depth-only borders, heavy blurry shadows, missing states, focus removed with no replacement, radii that aren't concentric.
6. **Interaction and feedback.** Hit areas under 24px, dead zones, feedback far from its trigger, toasts for visible results, a disabled submit before the request, destructive actions with no undo or confirm.
7. **Motion.** Motion on frequent or keyboard actions, `ease-in`, durations over the budget, scaling from `scale(0)` or from the centre, `transition: all`, keyframes on interactive state, no reduced-motion path.
8. **Words.** Vague buttons, inconsistent labels, apologetic or vague errors, "the user", a stray ellipsis.
9. **Tells.** Check the patterns in [references/tells.md](references/tells.md). When a symptom is vague ("busy", "cheap"), use its diagnosis table to find the cause.

## 3. Evidence rules

- A finding needs evidence: a `file:line`, a crop of the screenshot, or a measured value. Taste alone is not evidence.
- Measure before claiming. "The gap is 12px inside and 12px between groups" beats "the spacing feels off".
- Drop any visual finding the pixels don't show. If the code says one thing and the render shows another, trust the render and report the mismatch.
- Merge findings that share a root cause into one entry listing every location. *Why: the user fixes causes, not symptoms.*

## 4. Report

Severity:
- **HIGH**: breaks the job, an interaction, or accessibility. Examples: no clear primary action, focus invisible, motion that ignores reduced motion, a state that can't be reached or escaped.
- **MEDIUM**: a visible inconsistency or a broken value. Examples: siblings don't match, wrong curve or duration, contrast just below the threshold.
- **LOW**: isolated polish.

One table, ordered by severity, numbered so the user can reply "fix 1, 3 and 5":

| # | Sev | Where | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | `Settings.tsx:42` | Two filled buttons, "Save" and "Publish" | "Publish" filled, "Save" secondary | One next step per surface |
| 2 | MEDIUM | `menu.css:18` | `transition: all 300ms ease-in` | `opacity, transform 150ms cubic-bezier(0.23,1,0.32,1)` | Name the properties; ease-in feels sluggish; menus ≤200ms |

After the table:
- **Not verified**: what you couldn't run or see.
- **Verdict**: **Block** if any HIGH remains, otherwise **Approve**, leaving the rest as work to do. Never approve something you didn't inspect. If there's nothing to report, say "No findings", then list what was verified.

Keep the report terse. Skip explanations that the Why column already covers, and skip any preamble.

## 5. After the report

- **Wait for the pick.** Fix only the numbered findings the user chose.
- After fixing, show before and after screenshots of each fixed spot.
- If the user rejects a finding as not their taste, hand it to `taste-journal` as a Killed entry with their reason, so it isn't flagged again.
