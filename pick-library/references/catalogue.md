# Catalogue

Statuses were checked on 2026-11-06 with `npm view <pkg> time.modified license` and the GitHub repo. Re-run the check before recommending (see SKILL.md). "Default" is the entry to recommend unless the project already uses another.

## Contents
- Primitives and component sets
- Mizzle (ours)
- Toasts
- Command menu
- Drawer and sheet
- Numbers
- OTP
- Dates
- Tables and virtualisation
- Drag and drop
- Charts
- Motion
- Icons
- Forms and validation
- Theme switching
- Rich text
- React runtime
- Small utilities
- Not for product UI
- Sources

Status key: **Maintained**, **Slow** (usable, no recent publish), **Unmaintained** (never recommend).

## Primitives and component sets

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **Base UI** (`@base-ui/react`) **Default** | Unstyled, accessible dialog, popover, menu, select, combobox, tabs, toast, drawer, OTP field, number field and more | Anything `<dialog>`, `popover` or `<details>` already solves; pages with no interactive widgets | MIT | Maintained (1.9.0, 2026-10) |
| **Radix** (`radix-ui`) | The same job when the project already uses Radix or shadcn on Radix | New projects with no Radix: pick Base UI | MIT | Maintained (1.8.1, 2026-10) |
| **shadcn/ui** | Components copied into your repo, styled with Tailwind, on Radix or Base UI | A dependency you want to upgrade with `npm update`: it is source you own | MIT | Maintained (copy-in, no package to age) |
| **coss ui** | shadcn-style components built on Base UI, with Calendar, Date picker, Command and Sheet | Projects that don't use Tailwind | MIT | Maintained (repo push 2026-11) |

Rule: when Base UI ships the component, it is the default, ahead of a single-purpose library: dialog, alert dialog, menu, context menu, select, combobox, autocomplete, number field, OTP field, toast, drawer, tooltip, tabs, toolbar and the rest of its list. Go past it only for what it lacks: command menu, calendar, table, virtual list, drag and drop, charts, rich text. Radix only when the project is already on it. Never mix both for the same widget. The old `@base-ui-components/react` name is stale (last publish 2026-07, 1.0.0-rc); install `@base-ui/react`.

## Mizzle (ours)

Mizzle (mizzle.saddy.me) is our own component registry for React, Svelte and Solid. It is built on Base UI and TanStack Table, to the same taste as these skills. Install an item with `npx shadcn@latest add https://mizzle.saddy.me/r/<name>.json`, or for Svelte `npx shadcn-svelte@latest add https://mizzle.saddy.me/r/svelte/<name>.json`. Free under MIT: text-reveal, split-text, number-roll, link, field and input. Everything else needs a Mizzle licence.

| Need | Mizzle items | Product UI? |
| --- | --- | --- |
| Primitives | button, card, squircle-card, dialog, menu, tabs, toast, tooltip, toolbar, accordion, link | Yes |
| Forms | form, field, input, select, switch, checkbox, radio-group, number-field | Yes |
| Data grid | data-grid with toolbar, filter, column menu, row controls, selection bar, footer, export | Yes |
| AI and agent UI | prompt-input, response, reasoning, tool-call, tasks, plan, confirmation, questionnaire, sources, suggestions, turn, message-scroller | Yes |
| Chat | message, composer, chat-divider, message-status, typing-indicator, voice-note, voice-recorder, poll, reaction-picker | Yes |
| Animated numbers | number-roll | Yes; an alternative to NumberFlow |
| Text effects, shader backgrounds, print effects, diagrams, video | text-reveal, scramble-text, glow, silk, glass, dither, risograph, diagram, video-hero and the rest | Marketing or one-moment use only |

Items are source copied into the project, like shadcn/ui, so run the `npm view` check on their dependencies, not on Mizzle.

## Toasts

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **Base UI Toast** **Default** | Result toasts: stacking, swipe, pause on hover. Always the default, with or without Base UI already in the project | Anything that needs an action to stay on screen; use an inline banner | MIT | Maintained |
| Sonner | An alternative when a project already uses it | A new project: the default is Base UI Toast | MIT | Maintained (2.0.8, 2026-08) |

## Command menu

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **cmdk** **Default** | A palette with filtering, groups and pages | A plain select or autocomplete: use Base UI Combobox | MIT | Slow (1.1.1, 2025-08; repo push 2025-10). Stable and widely used |

Never animate the palette's keyboard navigation (see `product-ui` values: 100+ times a day).

## Drawer and sheet

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **Base UI Drawer** **Default** | Swipe-to-dismiss sheets in a Base UI project | Desktop-only side panels: `<dialog>` is enough | MIT | Maintained |
| `<dialog>` styled as a sheet | Side panel with no gesture | Swipe-to-dismiss | n/a | Platform |
| vaul | Nothing new | Everything | MIT | **Unmaintained** (README says so; last publish 2024-12). Existing use is fine until a rewrite. `vaul-base` is a fork, last publish 2025-12; don't adopt it |

## Numbers

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **NumberFlow** (`@number-flow/react`) **Default** | Digits that roll when a counter, price or stat changes | Numbers that change many times a second; use `tabular-nums` and no animation | MIT | Maintained (0.6.2, 2026-07; pre-1.0) |
| `Intl.NumberFormat` | All formatting, always | Animation | n/a | Platform |

## OTP

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **Base UI OTP Field** **Default** | One box per digit with paste and autofill | A single-field code: use `autocomplete="one-time-code"` | MIT | Maintained |
| input-otp | A project already using it | New work: use Base UI OTP Field | MIT | Maintained (1.5.0, 2026-08) |

## Dates

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| `<input type="date">` | A date or time field | Ranges, custom look | n/a | Platform |
| **react-day-picker** **Default** | A calendar or range picker | Parsing and arithmetic | MIT | Maintained (10.0.2, 2026-09) |
| **date-fns** | Date arithmetic and formatting on `Date` | Time zones beyond what `Intl` gives | MIT | Maintained (4.4.0, 2026-05) |
| **temporal-polyfill** | `Temporal` today, for time zones and calendars | Projects that only format dates | MIT | Maintained (1.0.8, 2026-11) |
| `@internationalized/date` | Calendar systems, used with React Aria | Projects not on React Aria | Apache-2.0 | Maintained |

## Tables and virtualisation

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **TanStack Table** **Default** | Headless sorting, filtering, grouping, selection | A static table: use `<table>` | MIT | Maintained (9.3.1, 2026-10) |
| **TanStack Virtual** | Virtual rows under a table or a grid | Plain chat or feed lists: use Virtuoso | MIT | Maintained (2026-11) |
| **Virtuoso** (`react-virtuoso`) **Default for lists** | Long lists, feeds and chat with variable heights | Tables with sticky columns | MIT | Maintained (4.18.20, 2026-10) |
| react-window | Fixed-size lists in a project that has it | Variable heights | MIT | Maintained (2.5.3, 2026-11) |

Virtualise at 1,000+ rows. Under that, `content-visibility: auto` is enough.

## Drag and drop

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **dnd kit** (`@dnd-kit/react`) **Default** | Sortable lists, boards, grids with keyboard support | File drops: use native drag events | MIT | Maintained (0.5.3, 2026-10; pre-1.0) |
| `@dnd-kit/core` | A project already on 6.x | New work | MIT | Slow (6.3.1, 2024-12) |
| Pragmatic drag and drop | Very large boards, framework-free | Small sortable lists | Apache-2.0 | Maintained (4.0.0, 2026-09) |
| react-beautiful-dnd | Nothing | Everything | Apache-2.0 | **Unmaintained** (last publish 2024-10, deprecated) |

## Charts

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **Recharts** **Default** | Static and interactive dashboard charts | Streaming data that scrolls with time | MIT | Maintained (3.10.1, 2026-11) |
| **Liveline** | Live, scrolling time series | Anything not streaming | MIT | Slow and early (0.0.7, 2026-03). Pin the version |
| uPlot | Tens of thousands of points | Rich interaction | MIT | Slow (1.6.32, 2025-03) |

## Motion

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **CSS transitions, `@starting-style`, WAAPI, View Transitions** **Default** | Hover, press, enter, exit, simple layout | Springs, gestures, shared layout across routes | n/a | Platform |
| **Motion** (`motion`) | Springs, gestures, interruptible layout and exit animation | A hover or a fade | MIT | Maintained (14.9.1, 2026-11) |
| `framer-motion` | Same package under the old name; same release | New installs: use `motion` | MIT | Maintained |
| transitions.dev | A reference for ready-made CSS/HTML transitions to copy | A dependency: it is a recipe site with a paid tier | Free to use | Maintained (site) |

## Icons

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| **Phosphor** (`@phosphor-icons/react`) **Default** | Six weights from one family, including fill for the active state | Brand logos | MIT | Slow (2.1.10, 2025-05). Stable |
| Remix Icon (`@remixicon/react`) | A line and a fill version of every icon | A project that can't take a custom licence | Remix Icon License 1.0 (the `remixicon` package is Apache-2.0). Read it | Maintained (4.9.0, 2026-01) |
| Radix Icons (`@radix-ui/react-icons`) | Crisp 15×15 icons for dense UI | A fill state: it has one style | MIT | Maintained (1.3.2, 2026-04) |
| Lucide (`lucide-react`) | One consistent outline set | Brand logos | ISC | Maintained (1.69.0, 2026-11) |

One icon set per surface. Import icons by name so unused ones tree-shake.

## Forms and validation

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| Constraint validation | Required, pattern, min, max | Cross-field or async rules | n/a | Platform |
| **Base UI Field and Form** **Default for simple forms** | A few fields on native validation, with labels, hints and errors wired together | Cross-field or async rules: use TanStack Form | MIT | Maintained |
| **TanStack Form** **Default** | Type-safe forms with async and cross-field validation, in React, Vue, Svelte and Solid | A form of a few fields: use Base UI Field and Form | MIT | Maintained (1.33.5, 2026-10) |
| React Hook Form | A project already using it | New work: use TanStack Form | MIT | Maintained (7.91.0, 2026-10) |
| **Zod** | Schemas shared by client and server | Bundle-critical pages: use Valibot | MIT | Maintained (4.6.7, 2026-10) |
| Valibot | The same job in a smaller bundle | | MIT | Maintained (1.5.0, 2026-09) |

## Theme switching

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| CSS `prefers-color-scheme` | Following the system, no toggle | A user-picked theme | n/a | Platform |
| **next-themes** **Default** | A toggle with no flash on load, in Next.js or any React SSR app | Apps with no toggle | MIT | Slow (0.4.6, 2025-03; repo push 2026-02). Feature-complete |

Without React, a 6-line inline script in `<head>` that sets `data-theme` before paint does the job. Disable transitions during the swap (see `product-ui` values).

## Rich text

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| `<textarea>` | Plain text | Formatting | n/a | Platform |
| **Tiptap** (`@tiptap/react`) **Default** | Rich text with extensions and collaboration | Plain text or Markdown-in, Markdown-out fields | MIT | Maintained (3.33.0, 2026-11) |
| Lexical | A framework-agnostic editor core | Teams that want ready-made extensions | MIT | Maintained (0.53.0, 2026-11; pre-1.0) |
| ProseMirror | Building your own editor on the layer Tiptap uses | Anything Tiptap covers | MIT | Maintained |

Never build on `contenteditable` by hand.

## React runtime

| Library | For | Not for | Licence | Status |
| --- | --- | --- | --- | --- |
| React | Every React app by default | | MIT | Maintained |
| TanStack Redact (`@tanstack/redact`) | Small React apps where bundle size matters. It replaces the React runtime at build time with a Vite, Next.js or Vinext plugin, so imports stay `react`. About a third of React's runtime size (23 KB vs 69 KB gzip, self-reported) | Apps that rely on concurrent rendering, heavy Suspense or class lifecycles. Rendering is synchronous, with no time slicing | MIT | Maintained (0.3.1, 2026-11; pre-1.0). Pin the version |

Its docs don't list which third-party libraries work with it (Base UI, Motion, TanStack Table). Run the app and its tests on Redact before shipping.

## Small utilities

| Library | For | Licence | Status |
| --- | --- | --- | --- |
| clsx | Conditional class strings | MIT | Maintained (2.1.1, 2026-09) |
| cva | Typed variants for Tailwind components | Apache-2.0 | Slow (0.7.1, 2024-11); stable |
| zustand | Shared client state | MIT | Maintained (5.0.16, 2026-10) |
| Shiki | Syntax highlighting | MIT | Maintained (4.6.0, 2026-11) |
| Leva | A dev control panel for tuning values | MIT | Slow (0.10.1, 2025-10). `dialkit` is the active alternative (2.1.0, 2026-10) |
| Satori | HTML/CSS to SVG for OG images | MPL-2.0 (note it) | Maintained (0.63.2, 2026-10) |

## Not for product UI

libraries.dev ships MIT effect libraries (border beam, thinking orbs, gooey shapes, liquid metal). They are expressive effects. `product-ui` bans decoration in operate surfaces, so never add them to an app screen by default. They suit marketing pages, which are outside this repo. glimm (`glimm`, MIT, 0.4.1, 2026-11, React 18+ and Next 14+; pre-1.0, pin the version) is the same: a WebGL band that sweeps across the screen on a route change, in seven palettes and four directions. Use it for page transitions on marketing or launch sites, never between app screens. Cobe (3D globe, MIT, 2.0.1, 2026-03) and torph (animated text, MIT, 0.1.3, 2026-09) are the same: marketing or one-moment use only.

## Sources

Curated list from Emil Kowalski's `pick-ui-library` (MIT), adapted. cmdk and next-themes from the paco.me research notes. Base UI, Radix, shadcn, coss ui, transitions.dev, libraries.dev and glimm.dev from the user's own browsing. Mizzle is the user's own project. Statuses from the npm registry and GitHub on 2026-11-06.
