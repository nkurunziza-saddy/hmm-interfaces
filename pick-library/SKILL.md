---
name: pick-library
description: Picks the right library for a frontend task from a curated, status-checked list, instead of hand-rolling it or installing an abandoned package. Use it when the user asks "what should I use for…", "is there a library for…", or names a package, and when you are about to build a toast, command menu, drawer, date picker, table, virtual list, drag and drop, chart, OTP input, animated number, theme switch, form validation or rich text editor by hand. Run it before you run npm install. It tries the platform first.
---

# Pick a library

Before any decision, apply `product-ui` §1 (the taste journal and precedence) and §5 (which skill owns what). A journal rule that names a library wins.

When invoked with no task, ask for one in a single line and stop.

## Decision order

Walk these top to bottom. Stop at the first step that fully solves the task.

1. **What is already installed?** Read `package.json`. If a listed library or a competitor already does the job, use it. Flag a better pick in one line, and never swap a dependency unasked. *Why: a second library for the same job doubles the bundle and the conventions.*
2. **Does the platform fully solve it?** Check the table below. *Why: the platform has no bundle cost, no upgrade path and no abandonment risk.*
3. **Does the list have an entry?** Open [references/catalogue.md](references/catalogue.md), find the category, and take the entry marked **Default**. Recommend one library, not a menu.
4. **Is that entry maintained?** Check the status column. If it says **Unmaintained**, never recommend it; use the replacement named in the entry.
5. **Nothing fits?** Say "this task isn't on the list", then pick from your own knowledge and run the verification below on it. *Why: an unchecked package is the usual way abandoned code gets in.*

"Fully solves" means every requirement in the task is met, including keyboard, focus and screen-reader behaviour. If one requirement fails, go to step 3.

## Platform first

| Task | Platform answer | Move to a library when |
| --- | --- | --- |
| Modal | `<dialog>` with `showModal()` | You need stacked dialogs with animated exit across browsers you support, or non-modal focus management |
| Popover, dropdown panel, tooltip-like card | `popover` attribute, plus CSS anchor positioning where supported | You need collision flipping everywhere, or a roving-focus menu |
| Accordion, disclosure | `<details name>` | You need controlled state or animated height beyond `interpolate-size` |
| Dark mode with no toggle | `prefers-color-scheme`, `color-scheme`, `light-dark()` | The user picks the theme by hand and it must persist |
| Date, time, month entry | `<input type="date">` and its siblings | You need ranges, a custom calendar, or a consistent look |
| Number formatting, relative time, plurals, lists | `Intl.NumberFormat`, `RelativeTimeFormat`, `PluralRules`, `ListFormat` | Never. Always use `Intl` |
| One-time code, single field | `<input autocomplete="one-time-code" inputmode="numeric">` | You need one box per digit |
| Enter, exit and layout motion | CSS transitions, `@starting-style`, WAAPI, View Transitions | You need springs, gestures or interruptible layout animation |
| Form validation | Constraint validation (`required`, `pattern`, `setCustomValidity`) | You need cross-field or async rules, or a typed schema |
| Select with few options | `<select>` | You need search, multi-select or rich rows |
| Sticky headers, scroll snap, lazy lists | CSS `position: sticky`, `scroll-snap`, `content-visibility: auto` | The list holds 1,000+ rows |

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| A `<div>` modal with a hand-written focus trap | `<dialog>` and `showModal()` | Focus trap, Esc and inert background come free |
| `npm i react-beautiful-dnd` | `@dnd-kit/react` | The first is deprecated and unmaintained |
| `npm i vaul` for a drawer | Base UI Drawer, or `<dialog>` styled as a sheet | vaul's own README says it is unmaintained |
| A toast built from a modal library | Base UI Toast | Stacking, pause on hover and swipe are already solved |
| `setInterval` counting up a number | NumberFlow | Digits roll with correct layout and reduced motion |
| 5,000 `<tr>` rendered at once | TanStack Virtual under TanStack Table, or Virtuoso for lists | Rendering cost grows with rows, not with the viewport |
| `new Intl.NumberFormat` replaced by a currency package | `Intl.NumberFormat` | Locale rules ship in the browser |

## Verify before you recommend

Run this on any package, listed or not. A catalogue status can be older than your session.

```bash
npm view <pkg> time.modified license version
```

- **Maintained**: last publish within 12 months, or a repo push within 6 months with a published release.
- **Slow**: feature-complete, no publish for 12–24 months, repo still answering issues. Usable. Say it is slow.
- **Unmaintained**: archived, a README that says so, or no publish for 24+ months with open breakage. Never recommend it.
- Read the licence. Report anything that is not MIT, ISC, BSD or Apache-2.0 (MPL-2.0 and AGPL need a note).
- Check peer dependencies against the project's React version.

## Answer format

One block, no menu:

> **Base UI Toast** for toasts. It stacks, pauses on hover and swipes away. Not for anything needing action; that stays on screen. MIT, maintained. `npm i @base-ui/react`.

Always give: what it is for, when not to use it, licence, status with the date you saw.

## Before you finish

- `package.json` was read, and the pick does not duplicate an installed library.
- The platform answer was checked and, if skipped, the reason is one clause.
- `npm view` ran on the pick, and the status in the answer is today's, not the catalogue's.
- Nothing marked Unmaintained is recommended.
