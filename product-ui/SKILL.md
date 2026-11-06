---
name: product-ui
description: Product-UI design taste for web apps. It sets the order design decisions are made in, the restraint rules, and the exact values for motion, type, colour, spacing, surfaces and states. Use it whenever you build, change or polish any interface: a component, screen, dashboard, settings page, form, menu, dialog, table or empty state. Use it even when the user doesn't mention design, because every UI change is a design change. It reads the user's taste journal first. It does not cover marketing pages, posters or expressive and creative work.
---

# Product UI

This skill decides how product UI looks, moves and reads. It makes the same decisions in the same order every time, so results differ only where the context differs.

Product UI is a tool people use to get something done. **Earned familiarity beats expression.** The interface should disappear into the task. Strangeness without purpose is the failure mode: decorated buttons, invented controls, display fonts on labels, gratuitous motion.

## 1. Read the taste journal first

Before any design decision, read these files if they exist:

1. `~/.claude/taste.md`: the user's taste across all projects.
2. `.claude/taste.md` in the project root: this project's overrides.

Precedence runs **project journal > global journal > this skill**. A journal rule beats any value in this skill, because it is the user's stated taste and these are defaults. When the user corrects you, picks between options, or says "always" or "never", hand off to `taste-journal` so it gets recorded.

## 2. Check the surface

This skill covers *operate* surfaces: app screens, tools, dashboards, settings and admin. If the surface is a landing page, launch page, poster or anything meant to persuade or express, say this skill doesn't cover it and don't apply its restraint rules there. Decide from the surface, not the product. A dev tool's landing page is still expressive, and a fashion brand's settings page is still product UI.

## 3. Decide in this order

Work top to bottom. Each step constrains the next. Most weak UI starts at step 4 or later and never answers step 1.

1. **Job.** Name the single next thing the user does on this surface. That gets the one primary action, or there is no primary action. *Why: two primaries means no hierarchy.*
2. **Content.** Decide what earns a place. Remove before adding: borders, containers, separators, icons, eyebrows and repeated words. One strong figure beats six small ones. Hide sections that are empty, finished or not yet relevant; a setting that depends on another stays, dimmed (`layout`, settings rows). *Why: every element competes for the same attention.*
3. **Structure.** Group related things. There is more space around a group than within it, and a deliberate break is at least 2× the gap inside the group. Align to shared edges, and treat a 1–4px miss as a bug. *Why: proximity is how people read relationships, and a small miss reads as a mistake while a large offset reads as intent.*
4. **Type and colour.** Use few sizes and weights. The neutral carries structure; hue carries meaning (status or identity) and never ranks importance. One accent, used for the primary action, selection and focus. *Why: each extra size, weight or hue dilutes hierarchy.*
5. **Surfaces and states.** Shadows show elevation, and borders show structure. Design every state the element can reach before polishing the default one: hover, pressed, focus-visible, selected, disabled, loading, empty, error, and long or missing data. *Why: the default state is the one users see least in real data.*
6. **Motion.** Decide whether it should move at all, then why, then the values. The more often something is seen, the less it moves. *Why: motion costs time and attention every time it plays.*

Load [references/values.md](references/values.md) whenever a step needs an exact number. Its values are exact, not ranges to approximate.

## 4. Restraint

- Add nothing the user didn't ask for: no extra sections, badges, counts, captions, footers, icons inside buttons, decorative gradients, glows or sounds. *Why: an unrequested addition is a design decision made without the user.*
- When editing, change only what was asked. A request to change one property (a width, a colour, a label) changes that property and nothing else. Never change other values to unify, tidy or improve, least of all a value that comes from a skill or the journal. If the request seems to need a second change, ask first, or list it as a suggestion. Ask before touching the styling that defines the variant you're working in (its type size and weight, its inks, its column and its spacing), even to fix something else. After the edit, report every changed value as `old → new`. *Why: the user asked for a consistent width and got a bigger text size too. An unasked change is a design decision taken away from the user, and it's the hardest kind to spot.*
- Don't add a toast or dialog for an action whose result is already visible. *Why: the change on screen is the feedback, and a toast on top of it is noise.*
- Never nest a card inside a card. Put the heading outside and let one surface hold the content. *Why: nested borders double the visual weight and blur the hierarchy.*
- Siblings match. They share height, padding, radius, text size and ink, so an unmatched sibling is a bug. When you're building, make them match. When you're editing something else, report the mismatch and don't fix it unasked. *Why: the eye reads a difference as meaning.*
- Use native elements: `<button>` for actions, `<a href>` for navigation, `<label>` for fields. *Why: native elements bring keyboard, focus, middle-click and screen-reader behaviour for free.*
- Spend boldness nowhere in product UI by default. When a moment truly warrants it (first run, success, an empty state), spend it in exactly one place.

## 5. Ownership

This skill is the floor and holds the core values in `values.md`. Each sibling owns one aspect in depth and wins over this skill on it. Every sibling opens by applying §1 and this table, and links to `values.md` instead of restating a value.

| Skill | Owns |
| --- | --- |
| `layout` | Space, alignment, sizing, hit areas, shells, column widths, responsiveness, layout stability |
| `type` | Size, line-height, weight, tracking, features, fonts, wrapping, truncation, measure, numerals, punctuation and case |
| `color` | Palettes, tokens, contrast (including text), themes, gradients |
| `surfaces` | Fill, edge, shadow, radius, states as surface changes, focus ring, icons, materials, dividers |
| `motion` | Whether and how anything moves: curves, durations, recipes, gestures |
| `interaction` | Behaviour under input: keyboard, overlays, forms, where and when feedback appears, tooltips, pointer and touch, hover gating, URL state |
| `words` | What every string says, and its characters (quotes, ellipsis, non-breaking spaces) |
| `critique` | Reviewing existing UI |
| `break` | Stress-testing with worst-case data and every state |
| `variants` | Building alternatives behind a picker |
| `pick-library` | Choosing a dependency, or none |
| `design-vocabulary` | Naming things |
| `taste-journal` | Recording the user's taste |

Load only the siblings for the aspects a change touches. A colour change loads `color`, not `layout` and `type` as well. *Why: every loaded skill costs context and blurs the rules that apply.*

## 6. Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| Two filled buttons, "Save" and "Publish" | One filled primary; the other secondary | One next step per surface |
| A card inside a card with its own border | The heading outside, one surface | Nested borders double the weight |
| `transition: all 300ms` | `transition: opacity 150ms, transform 150ms` with the curve from values.md | Name the properties; keep UI motion short |
| A grey label on a blue banner | A tint of the banner's hue | Grey on colour looks dirty |
| "Submit", "OK", "Yes" | "Save changes", "Delete project" | The button says what happens |
| A spinner shown instantly for a 120ms load | Delay the spinner, then hold it, per values.md (States and feedback) | Flicker reads as a glitch |
| `outline: none` on focus | A `:focus-visible` ring in the accent | Keyboard users lose their place |

## 7. Before you finish

- Every state from step 5 exists. Render it, or say which ones weren't checked.
- No value was invented when values.md or a journal rule gives one.
- Nothing was added that the user didn't ask for.
- If the user can see the result, show it to them: a screenshot, or before and after screenshots for changes.
