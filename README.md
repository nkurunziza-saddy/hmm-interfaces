# hmm-interfaces

Agent skills for building product UI on the web: app screens, tools, dashboards, settings and admin. Each skill makes the same decisions in the same order, with exact values and a Broken → Fixed table, so results differ only where the context differs. They read your taste journal (`~/.claude/taste.md`, then the project's `.claude/taste.md`) before deciding anything, and the journal wins.

Not for marketing pages, posters or expressive work.

## The skills

| Skill | Owns |
| --- | --- |
| `product-ui` | The floor: decision order, restraint rules, the core values in `references/values.md`, and who owns what |
| `layout` | Space, alignment, sizing, hit areas, shells, widths, responsiveness, settings rows, Compact and Comfortable density |
| `type` | Roles on a 13px base (1.125 ratio), line-height, weight, tracking, fonts, wrapping, truncation, numbers |
| `color` | OKLCH neutral ramp, one accent, status colours, semantic tokens, contrast, dark mode, named themes and a user-picked accent |
| `surfaces` | Elevation levels, shadow or border, radius, states, focus ring, icons, materials |
| `motion` | Whether and how anything moves: curves, durations, recipes, gestures, reduced motion |
| `interaction` | Keyboard, overlays, forms, feedback, pointer and touch, URL state |
| `words` | Interface copy: buttons, errors, empty states, the ellipsis rule |
| `critique` | Reviews existing UI with evidence and ranked findings |
| `break` | Stress-tests a piece with worst-case data and every state |
| `variants` | Builds 3–5 real alternatives behind a picker |
| `pick-library` | Picks a dependency, or none, from a status-checked catalogue |
| `design-vocabulary` | Turns "it feels off" into the term and the change |
| `taste-journal` | Records what you keep, kill and state as rules |

`variants` and `break` run only when you call them (`/variants`, `/break`).

## Install

Link each skill into Claude Code's skills folder:

```sh
git clone git@github.com:nkurunziza-saddy/hmm-interfaces.git
cd hmm-interfaces
for s in */; do ln -sfn "$PWD/${s%/}" ~/.claude/skills/"${s%/}"; done
```

## See them in place

A Vite + React app renders every skill: one whole screen per skill, before and after, and every Broken → Fixed pair as two live tiles. It lives outside this repo, at `~/Documents/dev/projects/drafts/interface-skill` (`pnpm install && pnpm dev`).

## Editing

- A value lives in one file. Siblings link to `product-ui/references/values.md` instead of restating it.
- Every skill opens by applying `product-ui` §1 (taste journal and precedence) and §5 (ownership).
- A skill references only skills in this repo.
