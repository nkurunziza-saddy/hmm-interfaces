# App shells, widths and responsive structure

Load this for steps 1, 2 and 7: building or changing a screen's frame, setting widths, or making it adapt.

## Contents
- The shell
- Widths and measure
- Container queries
- Dropdown and popover sizing
- Sticky chrome and focus

## The shell

```
┌──────────┬────────────────────────┬───────────┐
│ sidebar  │ toolbar                │           │
│ 240px    ├────────────────────────┤ inspector │
│          │ content (scrolls)      │ 320px     │
└──────────┴────────────────────────┴───────────┘
```

| Region | Size | Holds | Scrolls |
| --- | --- | --- | --- |
| Sidebar | 240px (resizable 200–320) | Navigation between areas, two levels deep at most | Itself |
| Toolbar | 48px comfortable, 40px compact | Leading: sidebar toggle, title. Centre: common controls. Trailing: inspector toggle, search, the one primary action | No |
| Content | `minmax(0, 1fr)`, min 480px | The work | Itself |
| Inspector | 320px (resizable 280–400) | Details of the current selection; updates when selection changes | Itself |

```css
.shell { display: grid; grid-template-columns: 240px minmax(0, 1fr) 320px; height: 100dvh; overflow: hidden; }
.shell > * { min-height: 0; overflow: auto; overscroll-behavior: contain; }
```

- The shell fills the viewport and the page never scrolls. Each region owns its scroll. *Why: a scrolling page under a fixed shell gives two scrollbars and lost headers.*
- Show the sidebar by default and let the user hide it. *Why: a hidden sidebar hides the product.*
- Every toolbar command also exists elsewhere (menu, shortcut), because toolbars get hidden.
- At most three groups in a toolbar, split by function and frequency.
- Put a control next to what it affects. The inspector holds the selection's controls, not global settings.
- Hold column positions constant across pages. Swapping content then reads as stable.
- Large screens remove nesting and modals; they never justify more panels. Widen the content column only up to its max.

## Widths and measure

| Column | Max width | Use |
| --- | --- | --- |
| Form, flow, sign-in | 440px | One field per line |
| Reading (docs, descriptions, long copy) | 720px, prose capped at the `type` measure (66ch) | 60–75 characters per line |
| Data (tables, charts, plans) | 1200px | Tables need width |

- Centre reading and form columns in the content region. Left-align data at its max.
- Use only the width the content needs. A layout spread across a 2560px screen is a bug.
- Sidebar and inspector are fixed widths and the content flexes. *Why: a percentage sidebar is too wide on large screens and truncates on small ones.*
- Text containers set `max-width` in `ch` or px, never `width`.
- Size the sidebar to its widest label + 16px icon + 8px gap + 24px row padding, rounded up to 4. 240px holds about 28 characters.

## Container queries

Breakpoints come from where the content stops fitting, not from device presets. Components ask their container.

```css
.region { container-type: inline-size; container-name: region; }
@container region (width < 640px) { .toolbar-secondary { display: none; } }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: var(--space-lg); }
```

- A container query styles descendants only, never the container. Put `container-type` on the parent.
- `container-type: inline-size` applies size containment, so a shrink-to-fit box (flex item with no width, inline-block, absolute) collapses to zero. Give it a definite width.
- Shell rules (viewport-level, because the shell is the viewport): below a shell width of 768px the sidebar becomes an overlay; below 1024px the inspector becomes an overlay. Keep every function; only the amount visible changes.
- Test the smallest and largest widths first: 320, then 1440, then each breakpoint ±1px.
- Use `100dvh` for a full-height pane and `min-height: 100svh` for a first screen. `100vh` hides the bottom under mobile browser chrome. Use `100%`, not `100vw`, for widths, because `100vw` includes the scrollbar.
- Under `(hover: none)`, controls that appear only on hover are always visible.

## Dropdown and popover sizing

A dropdown hugs its longest label plus 16px to the edge, with a minimum for short labels and a maximum with truncation beyond it.

```css
.menu {
  width: max-content;
  min-width: 160px;        /* short labels still feel like a menu */
  max-width: 320px;        /* beyond this, labels truncate */
  max-height: min(var(--available-height, 100dvh), 400px);
  padding: 4px;            /* 4 + 12px item padding = 16px from label to edge */
  overflow-y: auto;
  overscroll-behavior: contain;
}
.menu-item { padding-inline: 12px; min-height: var(--control-h); }
.menu-item .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

- The widest row decides: icon, label, gap 8 and shortcut included. Measure it, do not guess it.
- A select's menu is at least as wide as its trigger (`min-width: max(160px, var(--trigger-width))`).
- Truncated labels carry a tooltip or full text on focus, never only on hover.
- Popovers keep 8px from the viewport edge (collision padding 8) and flip before they clip.
- A popover holding content the user edits keeps a fixed width while open. *Why: a popover that resizes under the cursor loses its target.*

## Sticky chrome and focus

- Content scrolls beneath sticky chrome; the chrome never takes layout space the content then lacks.
- Set `scroll-padding-block-start` on the scroller to the sticky header's height, and `scroll-padding-block-end` to a sticky footer's. Focus and anchor jumps then land clear. Anchors without their own scroller use `scroll-margin-block-start`.
- A sticky header's bottom line shows only once content scrolls under it. At rest it is invisible, so it never hides unscrolled content.
- A focus ring is never clipped: a scroller has padding ≥ 4px around focusable items, or the ring is drawn inset (`outline-offset: -2px`).
- Verify by Tabbing from the top to the last control with all chrome in place.
